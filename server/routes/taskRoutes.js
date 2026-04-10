import express from 'express'
import { requireAuth } from '../middleware/auth.js'
import Task from '../models/Task.js'

const router = express.Router()

router.use(requireAuth)

router.get('/', async (request, response) => {
  const tasks = await Task.find({ user: request.user._id }).sort({ createdAt: -1 })
  response.json(tasks)
})

router.post('/', async (request, response) => {
  const { title, subject, priority, studyHours, dueDate, reminderAt, notes } = request.body

  if (!title?.trim()) {
    return response.status(400).json({ message: 'Task title is required.' })
  }

  const task = await Task.create({
    user: request.user._id,
    title: title.trim(),
    subject: subject?.trim() || 'General',
    priority: ['Low', 'Medium', 'High'].includes(priority) ? priority : 'Medium',
    studyHours: Number.isFinite(studyHours) ? studyHours : 0,
    dueDate: dueDate || null,
    reminderAt: reminderAt || null,
    notes: notes?.trim() || '',
  })

  return response.status(201).json(task)
})

router.put('/:id', async (request, response) => {
  const updates = {}

  if (typeof request.body.title === 'string') {
    updates.title = request.body.title.trim()
  }

  if (typeof request.body.completed === 'boolean') {
    updates.completed = request.body.completed
    updates.completedAt = request.body.completed ? new Date() : null
  }

  if (typeof request.body.studyHours === 'number') {
    updates.studyHours = request.body.studyHours
  }

  if (typeof request.body.subject === 'string') {
    updates.subject = request.body.subject.trim() || 'General'
  }

  if (typeof request.body.priority === 'string' && ['Low', 'Medium', 'High'].includes(request.body.priority)) {
    updates.priority = request.body.priority
  }

  if (typeof request.body.notes === 'string') {
    updates.notes = request.body.notes.trim()
  }

  if ('dueDate' in request.body) {
    updates.dueDate = request.body.dueDate || null
  }

  if ('reminderAt' in request.body) {
    updates.reminderAt = request.body.reminderAt || null
  }

  if (typeof request.body.reminderSent === 'boolean') {
    updates.reminderSent = request.body.reminderSent
  }

  const task = await Task.findOneAndUpdate(
    { _id: request.params.id, user: request.user._id },
    updates,
    { new: true },
  )

  if (!task) {
    return response.status(404).json({ message: 'Task not found.' })
  }

  return response.json(task)
})

router.delete('/:id', async (request, response) => {
  const deletedTask = await Task.findOneAndDelete({ _id: request.params.id, user: request.user._id })

  if (!deletedTask) {
    return response.status(404).json({ message: 'Task not found.' })
  }

  return response.json({ message: 'Task deleted successfully.' })
})

export default router
