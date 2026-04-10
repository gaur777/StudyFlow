import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import authRoutes from './routes/authRoutes.js'
import { connectDatabase } from './config/db.js'
import settingsRoutes from './routes/settingsRoutes.js'
import taskRoutes from './routes/taskRoutes.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 5001

app.use(cors())
app.use(express.json())

app.get('/api/health', (_request, response) => {
  response.json({ message: 'Student Task Manager API is running.' })
})

app.use('/api/auth', authRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/settings', settingsRoutes)

app.use((error, _request, response, _next) => {
  console.error(error)
  response.status(500).json({ message: 'Server error. Please try again later.' })
})

async function startServer() {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not configured in the environment.')
    }

    await connectDatabase()
    app.listen(port, () => {
      console.log(`Server running on port ${port}`)
    })
  } catch (error) {
    console.error('Failed to start server:', error.message)
    process.exit(1)
  }
}

startServer()
