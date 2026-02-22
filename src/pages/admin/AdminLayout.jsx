import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Admin.css'

const ENTITIES = [
  { path: 'users', label: 'Users' },
  { path: 'organizations', label: 'Organizations' },
  { path: 'accounts', label: 'Accounts' },
  { path: 'contacts', label: 'Contacts' },
  { path: 'leads', label: 'Leads' },
  { path: 'deals', label: 'Deals' },
  { path: 'pipeline-stages', label: 'Pipeline Stages' },
  { path: 'crm-connections', label: 'CRM Connections' },
  { path: 'integrations', label: 'Integrations' },
  { path: 'playbooks', label: 'Playbooks' },
  { path: 'forecasts', label: 'Forecasts' },
  { path: 'activities', label: 'Activities' },
  { path: 'audit-logs', label: 'Audit Logs' },
  { path: 'settings', label: 'Settings' },
]

const API_ENTITY_MAP = {
  'pipeline-stages': 'pipelineStage',
  'crm-connections': 'crmConnection',
  'audit-logs': 'auditLog',
}

function getApiPath(path) {
  return API_ENTITY_MAP[path] || path.replace('-', '').replace(/s$/, '') // users->user for API
}

export default function AdminLayout() {
  const { user, logout, isAdmin, loading } = useAuth()
  const navigate = useNavigate()

  if (loading) {
    return (
      <div className="admin-forbidden">
        <div className="admin-loading">Loading...</div>
      </div>
    )
  }
  if (!user) {
    navigate('/login', { replace: true })
    return null
  }
  if (!isAdmin) {
    return (
      <div className="admin-forbidden">
        <h2>Access denied</h2>
        <p>Admin privileges required.</p>
        <button onClick={() => navigate('/')}>Go home</button>
      </div>
    )
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2 className="admin-brand">Revenue Engine</h2>
        <p className="admin-user">{user?.email}</p>
        <nav className="admin-nav">
          {ENTITIES.map(({ path, label }) => (
            <NavLink
              key={path}
              to={`/admin/${path}`}
              className={({ isActive }) => (isActive ? 'admin-nav-link active' : 'admin-nav-link')}
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <NavLink to="/">Back to site</NavLink>
          <button onClick={() => { logout(); navigate('/login'); }}>Log out</button>
        </div>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}

export { ENTITIES, getApiPath }
