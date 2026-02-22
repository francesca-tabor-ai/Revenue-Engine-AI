import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import dotenv from 'dotenv'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, '../../.env.local') })
dotenv.config({ path: join(__dirname, '../../.env') })
dotenv.config({ path: join(__dirname, '../.env') })

import express from 'express'
import cors from 'cors'
import { authRoutes } from './routes/auth.js'
import { adminRoutes } from './routes/admin.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({ origin: true, credentials: true }))
app.use(express.json())

app.get('/health', (_, res) => res.json({ status: 'ok' }))

app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
