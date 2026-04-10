import { Activity, AlarmClock, Clock3, Flame, Target, TrendingUp } from 'lucide-react'

const statCards = [
  { key: 'streak', label: 'Login Streak', suffix: ' days', icon: Flame, tone: 'amber' },
  { key: 'completionRate', label: 'Completion Rate', suffix: '%', icon: Target, tone: 'violet' },
  { key: 'studyHoursCompleted', label: 'Study Hours', suffix: 'h', icon: Clock3, tone: 'mint' },
  { key: 'totalTasks', label: 'Total Tasks', suffix: '', icon: Activity, tone: 'ink' },
]

function AnalyticsPage({ loading, analytics, user }) {
  return (
    <section className="page-content">
      <div className="page-heading">
        <h1>Analytics</h1>
        <p>Track your productivity, streak, reminders, and subject progress.</p>
      </div>

      <div className="stats-grid">
        {statCards.map((card) => (
          <article
            key={card.key}
            className="stat-card"
          >
            <div className="stat-topline">
              <p>{card.label}</p>
              <span className={`stat-icon ${card.tone}`}>
                <card.icon size={20} />
              </span>
            </div>
            <h2>
              {loading ? '--' : analytics[card.key]}
              {loading ? '' : card.suffix}
            </h2>
          </article>
        ))}
      </div>

      <div className="summary-grid">
        <article className="insight-card">
          <div className="section-title small">
            <TrendingUp size={18} />
            <h3>Progress to Daily Goal</h3>
          </div>
          <p>
            {loading
              ? 'Loading your progress...'
              : `${analytics.studyHoursCompleted}h completed out of ${user.dailyGoalHours}h target.`}
          </p>
          <div className="progress-bar">
            <span style={{ width: `${Math.min(100, analytics.goalProgress)}%` }} />
          </div>
        </article>

        <article className="insight-card">
          <div className="section-title small">
            <AlarmClock size={18} />
            <h3>Task Health</h3>
          </div>
          <p>{loading ? 'Loading task health...' : `${analytics.overdueTasks} overdue and ${analytics.upcomingReminders} upcoming reminders.`}</p>
        </article>
      </div>

      <article className="insight-card">
        <h3>Subject Summary</h3>
        {loading ? (
          <p>Loading subjects...</p>
        ) : analytics.subjectBreakdown.length === 0 ? (
          <p>No subject data available yet. Add tasks with subject names to see this section.</p>
        ) : (
          <div className="subject-list">
            {analytics.subjectBreakdown.map((subject) => (
              <div
                key={subject.name}
                className="subject-row"
              >
                <strong>{subject.name}</strong>
                <span>{subject.count} tasks</span>
                <span>{subject.hours.toFixed(1)}h</span>
              </div>
            ))}
          </div>
        )}
      </article>
    </section>
  )
}

export default AnalyticsPage
