import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production'

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization' })
  }
  const token = authHeader.slice(7)
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    prisma.user.findUnique({ where: { id: payload.userId } }).then((user) => {
      if (!user) return res.status(401).json({ error: 'User not found' })
      req.user = user
      next()
    }).catch(() => res.status(401).json({ error: 'Invalid token' }))
  } catch {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

export function adminOnly(req, res, next) {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' })
  }
  next()
}

export { JWT_SECRET }
