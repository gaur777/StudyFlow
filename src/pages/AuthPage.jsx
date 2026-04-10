import { useState } from 'react'
import { GraduationCap, LockKeyhole, Mail, User } from 'lucide-react'

const initialForm = {
  name: '',
  email: '',
  password: '',
}

function AuthPage({ mode, onAuthenticate, onModeChange }) {
  const [form, setForm] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await onAuthenticate(mode, form)
      setForm(initialForm)
    } catch (authError) {
      setError(authError.message || 'Unable to continue right now.')
    } finally {
      setSubmitting(false)
    }
  }

  function updateField(key, value) {
    setForm((currentForm) => ({ ...currentForm, [key]: value }))
  }

  return (
    <div className="auth-shell">
      <section className="auth-card auth-hero">
        <span className="hero-badge">Student Task Manager</span>
        <h1>Organize your study routine, reminders, and daily progress in one place.</h1>
        <p>
          Create an account to track your tasks, manage reminders, keep your streak alive,
          and see useful analytics for each student separately.
        </p>
        <div className="hero-points">
          <div>Multi-user login and signup</div>
          <div>Task reminders and due dates</div>
          <div>Study hours, streaks, and priorities</div>
        </div>
      </section>

      <section className="auth-card auth-form-card">
        <div className="auth-title">
          <span className="brand-mark large">
            <GraduationCap size={26} />
          </span>
          <div>
            <h2>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
            <p>{mode === 'login' ? 'Log in to continue your study plan.' : 'Sign up to start using StudyFlow.'}</p>
          </div>
        </div>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >
          {mode === 'signup' ? (
            <label className="field">
              <span>Name</span>
              <div className="field-input">
                <User size={18} />
                <input
                  onChange={(event) => updateField('name', event.target.value)}
                  placeholder="Enter your full name"
                  value={form.name}
                />
              </div>
            </label>
          ) : null}

          <label className="field">
            <span>Email</span>
            <div className="field-input">
              <Mail size={18} />
              <input
                onChange={(event) => updateField('email', event.target.value)}
                placeholder="Enter your email"
                type="email"
                value={form.email}
              />
            </div>
          </label>

          <label className="field">
            <span>Password</span>
            <div className="field-input">
              <LockKeyhole size={18} />
              <input
                onChange={(event) => updateField('password', event.target.value)}
                placeholder="Enter your password"
                type="password"
                value={form.password}
              />
            </div>
          </label>

          {error ? <div className="banner error-banner">{error}</div> : null}

          <button
            className="primary-button full-width"
            disabled={submitting}
            type="submit"
          >
            {mode === 'login' ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <button
          className="text-button"
          onClick={() => onModeChange(mode === 'login' ? 'signup' : 'login')}
          type="button"
        >
          {mode === 'login' ? 'Need an account? Sign up' : 'Already have an account? Log in'}
        </button>
      </section>
    </div>
  )
}

export default AuthPage
