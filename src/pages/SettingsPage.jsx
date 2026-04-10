import { useState } from 'react'
import { Bell, Moon, Shield, User } from 'lucide-react'

function ToggleRow({ label, checked, onChange }) {
  return (
    <div className="toggle-row">
      <span>{label}</span>
      <button
        aria-pressed={checked}
        className={`toggle-switch${checked ? ' enabled' : ''}`}
        onClick={onChange}
        type="button"
      >
        <span />
      </button>
    </div>
  )
}

function SettingsPage({ settings, user, onProfileSave, onSettingsChange }) {
  const [profileDraft, setProfileDraft] = useState({
    name: user.name,
    dailyGoalHours: user.dailyGoalHours,
  })

  return (
    <section className="page-content">
      <div className="page-heading">
        <h1>Settings</h1>
        <p>Customize your experience and your daily study targets.</p>
      </div>

      <div className="settings-stack">
        <article className="settings-card">
          <div className="section-title">
            <Moon size={22} />
            <h2>Appearance</h2>
          </div>
          <ToggleRow
            checked={settings.darkMode}
            label="Dark Mode"
            onChange={() => onSettingsChange('darkMode', !settings.darkMode)}
          />
        </article>

        <article className="settings-card">
          <div className="section-title">
            <Bell size={22} />
            <h2>Notifications</h2>
          </div>
          <ToggleRow
            checked={settings.taskReminders}
            label="Task Reminders"
            onChange={() => onSettingsChange('taskReminders', !settings.taskReminders)}
          />
          <div className="divider" />
          <ToggleRow
            checked={settings.dailySummary}
            label="Daily Summary"
            onChange={() => onSettingsChange('dailySummary', !settings.dailySummary)}
          />
        </article>

        <article className="settings-card">
          <div className="section-title">
            <User size={22} />
            <h2>Account</h2>
          </div>

          <label className="field">
            <span>Name</span>
            <input
              className="task-input"
              onChange={(event) =>
                setProfileDraft((current) => ({ ...current, name: event.target.value }))
              }
              value={profileDraft.name}
            />
          </label>

          <label className="field">
            <span>Email</span>
            <input
              className="task-input"
              disabled
              value={user.email}
            />
          </label>

          <label className="field">
            <span>Daily Study Goal (hours)</span>
            <input
              className="task-input"
              min="1"
              onChange={(event) =>
                setProfileDraft((current) => ({
                  ...current,
                  dailyGoalHours: Number(event.target.value),
                }))
              }
              type="number"
              value={profileDraft.dailyGoalHours}
            />
          </label>

          <button
            className="primary-button"
            onClick={() => onProfileSave(profileDraft)}
            type="button"
          >
            Save Profile
          </button>

          <div className="divider" />

          <div className="info-row">
            <div>
              <div className="section-title small">
                <Shield size={20} />
                <h3>Privacy</h3>
              </div>
              <p>Each user sees only their own tasks, reminders, settings, and analytics.</p>
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}

export default SettingsPage
