import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './DashboardLayout.css'

const DASHBOARD_NAV = [
  { path: '', label: 'Overview', icon: '📊' },
  { path: 'icp', label: 'ICP & Offer Architect', icon: '🎯' },
  { path: 'outreach', label: 'Outreach Generator', icon: '✉️' },
  { path: 'replies', label: 'Reply Intelligence', icon: '💬' },
  { path: 'revenue', label: 'Revenue Dashboard', icon: '💰' },
  { path: 'sprint', label: 'Revenue Sprint', icon: '🏃' },
  { path: 'authority', label: 'Authority Builder', icon: '📝' },
  { path: 'templates', label: 'Templates', icon: '📋' },
  { path: 'behaviour', label: 'Behaviour Monitor', icon: '👁️' },
]

export default function DashboardLayout() {
  const { user, logout, loading } = useAuth()
  const navigate = useNavigate()

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner" />
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) {
    navigate('/login', { replace: true })
    return null
  }

  const displayName = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email?.split('@')[0] || 'Founder'

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <div className="dashboard-brand">
          <span className="dashboard-brand-icon">◆</span>
          Revenue Engine AI
        </div>
        <p className="dashboard-user">{displayName}</p>
        <nav className="dashboard-nav">
          {DASHBOARD_NAV.map(({ path, label, icon }) => (
            <NavLink
              key={path || 'overview'}
              to={path ? `/dashboard/${path}` : '/dashboard'}
              end={!path}
              className={({ isActive }) =>
                `dashboard-nav-link ${isActive ? 'active' : ''}`
              }
            >
              <span className="dashboard-nav-icon">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="dashboard-sidebar-footer">
          <NavLink to="/">Back to site</NavLink>
          <button
            onClick={() => {
              logout()
              navigate('/')
            }}
            className="dashboard-logout"
          >
            Log out
          </button>
        </div>
      </aside>
      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  )
}
