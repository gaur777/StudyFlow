const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

async function request(path, options = {}) {
  const { token, headers, ...restOptions } = options
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...restOptions,
  })

  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(payload.message || 'Something went wrong while talking to the server.')
  }

  return payload
}

export function signup(credentials) {
  return request('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
}

export function login(credentials) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
}

export function fetchCurrentUser(token) {
  return request('/auth/me', { token })
}

export function updateProfile(token, updates) {
  return request('/auth/me', {
    method: 'PUT',
    token,
    body: JSON.stringify(updates),
  })
}

export function fetchTasks(token) {
  return request('/tasks', { token })
}

export function createTask(token, task) {
  return request('/tasks', {
    method: 'POST',
    token,
    body: JSON.stringify(task),
  })
}

export function updateTask(token, taskId, updates) {
  return request(`/tasks/${taskId}`, {
    method: 'PUT',
    token,
    body: JSON.stringify(updates),
  })
}

export function deleteTask(token, taskId) {
  return request(`/tasks/${taskId}`, {
    method: 'DELETE',
    token,
  })
}

export function fetchSettings(token) {
  return request('/settings', { token })
}

export function updateSettings(token, settings) {
  return request('/settings', {
    method: 'PUT',
    token,
    body: JSON.stringify(settings),
  })
}
