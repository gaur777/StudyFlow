import { useMemo, useState } from 'react'
import { AlarmClock, Check, Pencil, Plus, Search, Trash2 } from 'lucide-react'

const emptyForm = {
  title: '',
  subject: '',
  priority: 'Medium',
  studyHours: '1',
  dueDate: '',
  reminderAt: '',
  notes: '',
}

function formatDateLabel(value) {
  if (!value) {
    return 'No due date'
  }

  return new Date(value).toLocaleString()
}

function TasksPage({ error, loading, tasks, onAddTask, onDeleteTask, onUpdateTask }) {
  const [form, setForm] = useState(emptyForm)
  const [editingTaskId, setEditingTaskId] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.subject.toLowerCase().includes(search.toLowerCase())

      const matchesStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Completed' && task.completed) ||
        (statusFilter === 'Pending' && !task.completed) ||
        (statusFilter === 'High Priority' && task.priority === 'High')

      return matchesSearch && matchesStatus
    })
  }, [search, statusFilter, tasks])

  async function handleSubmit(event) {
    event.preventDefault()

    if (!form.title.trim()) {
      return
    }

    const payload = {
      title: form.title.trim(),
      subject: form.subject.trim() || 'General',
      priority: form.priority,
      studyHours: Number(form.studyHours) || 0,
      dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
      reminderAt: form.reminderAt ? new Date(form.reminderAt).toISOString() : null,
      notes: form.notes.trim(),
      reminderSent: false,
    }

    try {
      setSubmitting(true)

      if (editingTaskId) {
        await onUpdateTask(editingTaskId, payload)
        setEditingTaskId('')
      } else {
        await onAddTask(payload)
      }

      setForm(emptyForm)
    } finally {
      setSubmitting(false)
    }
  }

  function handleEdit(task) {
    setEditingTaskId(task._id)
    setForm({
      title: task.title,
      subject: task.subject || '',
      priority: task.priority || 'Medium',
      studyHours: String(task.studyHours ?? 0),
      dueDate: task.dueDate ? task.dueDate.slice(0, 16) : '',
      reminderAt: task.reminderAt ? task.reminderAt.slice(0, 16) : '',
      notes: task.notes || '',
    })
  }

  async function handleToggleComplete(task) {
    await onUpdateTask(task._id, { completed: !task.completed })
  }

  return (
    <section className="page-content">
      <div className="page-heading">
        <h1>My Tasks</h1>
        <p>Add study tasks, set reminders, track hours, and stay organized.</p>
      </div>

      <form
        className="planner-card task-planner"
        onSubmit={handleSubmit}
      >
        <div className="field-grid">
          <label className="field">
            <span>Task</span>
            <input
              className="task-input"
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              placeholder="What do you need to study today?"
              value={form.title}
            />
          </label>

          <label className="field">
            <span>Subject</span>
            <input
              className="task-input"
              onChange={(event) => setForm((current) => ({ ...current, subject: event.target.value }))}
              placeholder="Math, Physics, History..."
              value={form.subject}
            />
          </label>

          <label className="field">
            <span>Priority</span>
            <select
              className="task-input"
              onChange={(event) => setForm((current) => ({ ...current, priority: event.target.value }))}
              value={form.priority}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </label>

          <label className="field">
            <span>Study Hours</span>
            <input
              className="task-input"
              min="0"
              onChange={(event) => setForm((current) => ({ ...current, studyHours: event.target.value }))}
              step="0.5"
              type="number"
              value={form.studyHours}
            />
          </label>

          <label className="field">
            <span>Due Date</span>
            <input
              className="task-input"
              onChange={(event) => setForm((current) => ({ ...current, dueDate: event.target.value }))}
              type="datetime-local"
              value={form.dueDate}
            />
          </label>

          <label className="field">
            <span>Reminder</span>
            <input
              className="task-input"
              onChange={(event) => setForm((current) => ({ ...current, reminderAt: event.target.value }))}
              type="datetime-local"
              value={form.reminderAt}
            />
          </label>
        </div>

        <label className="field">
          <span>Notes</span>
          <textarea
            className="task-input notes-input"
            onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
            placeholder="Optional notes for this task"
            rows="3"
            value={form.notes}
          />
        </label>

        <button
          className="primary-button"
          disabled={submitting}
          type="submit"
        >
          {editingTaskId ? <Pencil size={18} /> : <Plus size={18} />}
          <span>{editingTaskId ? 'Update Task' : 'Add Task'}</span>
        </button>
      </form>

      <div className="planner-card filters-row">
        <div className="search-box">
          <Search size={18} />
          <input
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by task or subject"
            value={search}
          />
        </div>

        <select
          className="task-input compact-input"
          onChange={(event) => setStatusFilter(event.target.value)}
          value={statusFilter}
        >
          <option>All</option>
          <option>Pending</option>
          <option>Completed</option>
          <option>High Priority</option>
        </select>
      </div>

      {error ? <div className="banner error-banner">{error}</div> : null}

      {loading ? (
        <div className="empty-state compact">
          <p>Loading tasks...</p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🗒️</div>
          <h2>No matching tasks</h2>
          <p>Add a task or change the filters to see your study plan.</p>
        </div>
      ) : (
        <div className="task-list">
          {filteredTasks.map((task) => (
            <article
              key={task._id}
              className={`task-card${task.completed ? ' completed' : ''}`}
            >
              <div className="task-copy">
                <div className="task-meta">
                  <span className={`pill priority-${task.priority.toLowerCase()}`}>{task.priority}</span>
                  <span className="pill">{task.subject || 'General'}</span>
                  <span className="pill">{task.studyHours}h</span>
                </div>
                <h3>{task.title}</h3>
                <p>{task.notes || 'No extra notes added.'}</p>
                <div className="task-timeline">
                  <span>Due: {formatDateLabel(task.dueDate)}</span>
                  <span className={task.reminderAt ? 'has-reminder' : ''}>
                    <AlarmClock size={14} />
                    {task.reminderAt ? `Reminder: ${formatDateLabel(task.reminderAt)}` : 'No reminder'}
                  </span>
                </div>
              </div>

              <div className="task-actions">
                <button
                  aria-label="Complete task"
                  className="icon-button success"
                  onClick={() => handleToggleComplete(task)}
                  type="button"
                >
                  <Check size={18} />
                </button>
                <button
                  aria-label="Edit task"
                  className="icon-button"
                  onClick={() => handleEdit(task)}
                  type="button"
                >
                  <Pencil size={18} />
                </button>
                <button
                  aria-label="Delete task"
                  className="icon-button danger"
                  onClick={() => onDeleteTask(task._id)}
                  type="button"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default TasksPage
