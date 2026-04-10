import bcrypt from 'bcryptjs'
import express from 'express'
import jwt from 'jsonwebtoken'
import { requireAuth } from '../middleware/auth.js'
import Setting from '../models/Setting.js'
import User from '../models/User.js'

const router = express.Router()

function buildToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

function getDayString(date = new Date()) {
  return date.toISOString().slice(0, 10)
}

function getPreviousDay(dayString) {
  const date = new Date(`${dayString}T00:00:00.000Z`)
  date.setUTCDate(date.getUTCDate() - 1)
  return date.toISOString().slice(0, 10)
}

function sanitizeUser(user) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    loginStreak: user.loginStreak,
    lastLoginDate: user.lastLoginDate,
    dailyGoalHours: user.dailyGoalHours,
  }
}

async function updateLoginStreak(user) {
  const today = getDayString()

  if (user.lastLoginDate === today) {
    return user
  }

  if (user.lastLoginDate === getPreviousDay(today)) {
    user.loginStreak += 1
  } else {
    user.loginStreak = 1
  }

  user.lastLoginDate = today
  await user.save()
  return user
}

router.post('/signup', async (request, response) => {
  const { name, email, password } = request.body

  if (!name?.trim() || !email?.trim() || !password?.trim()) {
    return response.status(400).json({ message: 'Name, email, and password are required.' })
  }

  const normalizedEmail = email.trim().toLowerCase()
  const existingUser = await User.findOne({ email: normalizedEmail })

  if (existingUser) {
    return response.status(400).json({ message: 'An account already exists with this email.' })
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    lastLoginDate: getDayString(),
    loginStreak: 1,
  })

  await Setting.create({ user: user._id })

  return response.status(201).json({
    token: buildToken(user._id),
    user: sanitizeUser(user),
  })
})

router.post('/login', async (request, response) => {
  const { email, password } = request.body

  if (!email?.trim() || !password?.trim()) {
    return response.status(400).json({ message: 'Email and password are required.' })
  }

  const normalizedEmail = email.trim().toLowerCase()
  const user = await User.findOne({ email: normalizedEmail })

  if (!user) {
    return response.status(401).json({ message: 'Invalid email or password.' })
  }

  const isValidPassword = await bcrypt.compare(password, user.passwordHash)

  if (!isValidPassword) {
    return response.status(401).json({ message: 'Invalid email or password.' })
  }

  await updateLoginStreak(user)

  return response.json({
    token: buildToken(user._id),
    user: sanitizeUser(user),
  })
})

router.get('/me', requireAuth, async (request, response) => {
  response.json({ user: sanitizeUser(request.user) })
})

router.put('/me', requireAuth, async (request, response) => {
  const user = await User.findById(request.user._id)

  if (typeof request.body.name === 'string' && request.body.name.trim()) {
    user.name = request.body.name.trim()
  }

  if (typeof request.body.dailyGoalHours === 'number' && request.body.dailyGoalHours > 0) {
    user.dailyGoalHours = request.body.dailyGoalHours
  }

  await user.save()
  response.json({ user: sanitizeUser(user) })
})

export default router
