import express from 'express'
import { requireAuth } from '../middleware/auth.js'
import Setting from '../models/Setting.js'

const router = express.Router()

router.use(requireAuth)

async function getSettingsDocument(userId) {
  const existingSettings = await Setting.findOne({ user: userId })

  if (existingSettings) {
    return existingSettings
  }

  return Setting.create({ user: userId })
}

router.get('/', async (request, response) => {
  const settings = await getSettingsDocument(request.user._id)
  response.json(settings)
})

router.put('/', async (request, response) => {
  const settings = await getSettingsDocument(request.user._id)

  if (typeof request.body.darkMode === 'boolean') {
    settings.darkMode = request.body.darkMode
  }

  if (typeof request.body.taskReminders === 'boolean') {
    settings.taskReminders = request.body.taskReminders
  }

  if (typeof request.body.dailySummary === 'boolean') {
    settings.dailySummary = request.body.dailySummary
  }

  await settings.save()
  response.json(settings)
})

export default router
