import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { authMiddleware, adminOnly } from '../middleware/auth.js'

const router = Router()
const prisma = new PrismaClient()

router.use(authMiddleware)
router.use(adminOnly)

const excludePassword = (user) => {
  const { passwordHash, ...rest } = user
  return rest
}

// Generic CRUD helper
function crud(model, options = {}) {
  const { include, select, excludeFields = [] } = options
  return {
    list: async (req, res) => {
      try {
        const items = await prisma[model].findMany({
          include: include || undefined,
          select: select || undefined,
          orderBy: { createdAt: 'desc' },
        })
        res.json(items)
      } catch (err) {
        console.error(err)
        res.status(500).json({ error: `Failed to list ${model}` })
      }
    },
    get: async (req, res) => {
      try {
        const item = await prisma[model].findUnique({
          where: { id: req.params.id },
          include: include || undefined,
        })
        if (!item) return res.status(404).json({ error: 'Not found' })
        if (model === 'user') res.json(excludePassword(item))
        else res.json(item)
      } catch (err) {
        console.error(err)
        res.status(500).json({ error: `Failed to get ${model}` })
      }
    },
    create: async (req, res) => {
      try {
        const data = req.body
        excludeFields.forEach((f) => delete data[f])
        const item = await prisma[model].create({ data })
        if (model === 'user') res.status(201).json(excludePassword(item))
        else res.status(201).json(item)
      } catch (err) {
        console.error(err)
        res.status(500).json({ error: `Failed to create ${model}` })
      }
    },
    update: async (req, res) => {
      try {
        const data = { ...req.body }
        excludeFields.forEach((f) => delete data[f])
        const item = await prisma[model].update({
          where: { id: req.params.id },
          data,
        })
        if (model === 'user') res.json(excludePassword(item))
        else res.json(item)
      } catch (err) {
        if (err.code === 'P2025') return res.status(404).json({ error: 'Not found' })
        console.error(err)
        res.status(500).json({ error: `Failed to update ${model}` })
      }
    },
    delete: async (req, res) => {
      try {
        await prisma[model].delete({ where: { id: req.params.id } })
        res.status(204).send()
      } catch (err) {
        if (err.code === 'P2025') return res.status(404).json({ error: 'Not found' })
        console.error(err)
        res.status(500).json({ error: `Failed to delete ${model}` })
      }
    },
  }
}

// Users - special handling for password
const userCrud = {
  list: async (req, res) => {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, firstName: true, lastName: true, role: true, organizationId: true, createdAt: true, updatedAt: true },
      orderBy: { createdAt: 'desc' },
    })
    res.json(users)
  },
  get: async (req, res) => {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: { id: true, email: true, firstName: true, lastName: true, role: true, organizationId: true, createdAt: true, updatedAt: true },
    })
    if (!user) return res.status(404).json({ error: 'Not found' })
    res.json(user)
  },
  create: async (req, res) => {
    const bcrypt = (await import('bcryptjs')).default
    const { password, ...rest } = req.body
    if (!password) return res.status(400).json({ error: 'Password required' })
    const passwordHash = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { ...rest, passwordHash },
      select: { id: true, email: true, firstName: true, lastName: true, role: true, organizationId: true, createdAt: true, updatedAt: true },
    })
    res.status(201).json(user)
  },
  update: async (req, res) => {
    const bcrypt = (await import('bcryptjs')).default
    const { password, ...rest } = req.body
    const data = { ...rest }
    if (password) data.passwordHash = await bcrypt.hash(password, 10)
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data,
      select: { id: true, email: true, firstName: true, lastName: true, role: true, organizationId: true, createdAt: true, updatedAt: true },
    })
    res.json(user)
  },
  delete: async (req, res) => {
    await prisma.user.delete({ where: { id: req.params.id } })
    res.status(204).send()
  },
}

// Define routes for each entity
const entities = [
  'organization',
  'account',
  'contact',
  'lead',
  'deal',
  'pipelineStage',
  'crmConnection',
  'integration',
  'playbook',
  'forecast',
  'activity',
  'auditLog',
  'setting',
]

entities.forEach((model) => {
  const handler = crud(model)
  router.get(`/${model}`, handler.list)
  router.get(`/${model}/:id`, handler.get)
  router.post(`/${model}`, handler.create)
  router.put(`/${model}/:id`, handler.update)
  router.delete(`/${model}/:id`, handler.delete)
})

// Users routes (separate)
router.get('/user', userCrud.list)
router.get('/user/:id', userCrud.get)
router.post('/user', userCrud.create)
router.put('/user/:id', userCrud.update)
router.delete('/user/:id', userCrud.delete)

export const adminRoutes = router
