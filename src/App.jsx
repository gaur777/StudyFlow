import { useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import {
  createTask,
  deleteTask,
  fetchCurrentUser,
  fetchSettings,
  fetchTasks,
  login,
  signup,
  updateProfile,
  updateSettings,
  updateTask,
} from './lib/api.js'
import AnalyticsPage from './pages/AnalyticsPage.jsx'
import AuthPage from './pages/AuthPage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import TasksPage from './pages/TasksPage.jsx'
import './styles/app.css'

const initialSettings = {
  darkMode: false,
  taskReminders: true,
}

const initialUser = {
  _id: '',
  name: '',
  email: '',
  loginStreak: 0,
  lastLoginDate: '',
  dailyGoalHours: 2,
}

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('studyflow_token') || '')
  const [user, setUser] = useState(initialUser)
  const [tasks, setTasks] = useState([])
  const [settings, setSettings] = useState(initialSettings)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [authMode, setAuthMode] = useState('login')

  useEffect(() => {
    document.documentElement.dataset.theme = settings.darkMode ? 'dark' : 'light'
  }, [settings.darkMode])

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }

    async function loadAppData() {
      try {
        setLoading(true)
        const [{ user: currentUser }, taskList, savedSettings] = await Promise.all([
          fetchCurrentUser(token),
          fetchTasks(token),
          fetchSettings(token),
        ])
        setUser(currentUser)
        setTasks(taskList)
        setSettings(savedSettings)
        setError('')
      } catch (loadError) {
        localStorage.removeItem('studyflow_token')
        setToken('')
        setUser(initialUser)
        setTasks([])
        setSettings(initialSettings)
        setError(loadError.message || 'Unable to load your study dashboard right now.')
      } finally {
        setLoading(false)
      }
    }

    loadAppData()
  }, [token])

  useEffect(() => {
    if (!token || !settings.taskReminders) {
      return undefined
    }

    const timers = tasks
      .filter((task) => task.reminderAt && !task.completed && !task.reminderSent)
      .map((task) => {
        const dueTime = new Date(task.reminderAt).getTime()
        const now = Date.now()
        const timeout = Math.max(0, dueTime - now)

        return window.setTimeout(async () => {
          window.alert(`Reminder: ${task.title}`)
          try {
            const updatedTask = await updateTask(token, task._id, { reminderSent: true })
            setTasks((currentTasks) =>
              currentTasks.map((currentTask) => (currentTask._id === task._id ? updatedTask : currentTask)),
            )
          } catch {
            // Ignore reminder sync failures to avoid blocking the reminder itself.
          }
        }, timeout)
      })

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer))
    }
  }, [settings.taskReminders, tasks, token])

  const analytics = useMemo(() => {
    const totalTasks = tasks.length
    const completedTasks = tasks.filter((task) => task.completed)
    const completedCount = completedTasks.length
    const completionRate = totalTasks ? Math.round((completedCount / totalTasks) * 100) : 0
    const studyHoursCompleted = completedTasks.reduce((total, task) => total + Number(task.studyHours || 0), 0)
    const subjectMap = new Map()
    const now = Date.now()
    let overdueTasks = 0
    let upcomingReminders = 0

    tasks.forEach((task) => {
      const subject = task.subject || 'General'
      const existingSubject = subjectMap.get(subject) || { name: subject, count: 0, hours: 0 }
      existingSubject.count += 1
      existingSubject.hours += Number(task.studyHours || 0)
      subjectMap.set(subject, existingSubject)

      if (!task.completed && task.dueDate && new Date(task.dueDate).getTime() < now) {
        overdueTasks += 1
      }

      if (
        task.reminderAt &&
        !task.completed &&
        new Date(task.reminderAt).getTime() >= now &&
        new Date(task.reminderAt).getTime() - now <= 24 * 60 * 60 * 1000
      ) {
        upcomingReminders += 1
      }
    })

    return {
      streak: user.loginStreak || 0,
      completionRate,
      studyHoursCompleted: studyHoursCompleted.toFixed(1),
      totalTasks,
      completedTasks: completedCount,
      pendingTasks: totalTasks - completedCount,
      overdueTasks,
      upcomingReminders,
      goalProgress: user.dailyGoalHours
        ? Math.round((studyHoursCompleted / user.dailyGoalHours) * 100)
        : 0,
      subjectBreakdown: Array.from(subjectMap.values()).sort((a, b) => b.count - a.count),
    }
  }, [tasks, user.dailyGoalHours, user.loginStreak])

  async function handleAuthenticate(mode, form) {
    const response = mode === 'login' ? await login(form) : await signup(form)
    localStorage.setItem('studyflow_token', response.token)
    setToken(response.token)
    setUser(response.user)
    setError('')
  }

  async function handleAddTask(taskData) {
    const newTask = await createTask(token, taskData)
    setTasks((currentTasks) => [newTask, ...currentTasks])
  }

  async function handleUpdateTask(taskId, changes) {
    const updatedTask = await updateTask(token, taskId, changes)
    setTasks((currentTasks) =>
      currentTasks.map((task) => (task._id === taskId ? updatedTask : task)),
    )
  }

  async function handleDeleteTask(taskId) {
    await deleteTask(token, taskId)
    setTasks((currentTasks) => currentTasks.filter((task) => task._id !== taskId))
  }

  async function handleSettingsChange(key, value) {
    const updatedSettings = await updateSettings(token, { [key]: value })
    setSettings(updatedSettings)
  }

  async function handleProfileSave(profileDraft) {
    const updatedUser = await updateProfile(token, profileDraft)
    setUser(updatedUser.user)
  }

  function handleLogout() {
    localStorage.removeItem('studyflow_token')
    setToken('')
    setUser(initialUser)
    setTasks([])
    setSettings(initialSettings)
  }

  if (!token) {
    return (
      <BrowserRouter>
        <AuthPage
          mode={authMode}
          onAuthenticate={handleAuthenticate}
          onModeChange={setAuthMode}
        />
      </BrowserRouter>
    )
  }

  return (
    <BrowserRouter>
      <Layout
        onLogout={handleLogout}
        user={user}
      >
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/tasks" replace />}
          />
          <Route
            path="/tasks"
            element={
              <TasksPage
                error={error}
                loading={loading}
                onAddTask={handleAddTask}
                onDeleteTask={handleDeleteTask}
                onUpdateTask={handleUpdateTask}
                tasks={tasks}
              />
            }
          />
          <Route
            path="/analytics"
            element={
              <AnalyticsPage
                analytics={analytics}
                loading={loading}
                user={user}
              />
            }
          />
          <Route
            path="/settings"
            element={
              <SettingsPage
                key={`${user._id}-${user.name}-${user.dailyGoalHours}`}
                onProfileSave={handleProfileSave}
                onSettingsChange={handleSettingsChange}
                settings={settings}
                user={user}
              />
            }
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
