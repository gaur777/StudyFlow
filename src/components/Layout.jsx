import { BarChart3, ClipboardList, GraduationCap, LogOut, Settings } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const navItems = [
  { label: 'Tasks', to: '/tasks', icon: ClipboardList },
  { label: 'Analytics', to: '/analytics', icon: BarChart3 },
  { label: 'Settings', to: '/settings', icon: Settings },
]

function Layout({ children, user, onLogout }) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">
            <GraduationCap size={22} />
          </span>
          <span>StudyFlow</span>
        </div>

        <div className="topbar-actions">
          <nav className="topbar-nav">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                to={item.to}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="user-pill">
            <div>
              <strong>{user.name}</strong>
              <span>{user.email}</span>
            </div>
            <button
              className="ghost-button"
              onClick={onLogout}
              type="button"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      <main className="page-shell">{children}</main>
    </div>
  )
}

export default Layout
