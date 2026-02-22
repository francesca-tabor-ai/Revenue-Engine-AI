import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { ENTITIES, getApiPath } from './AdminLayout'
import './Admin.css'

const API_MAP = {
  'pipeline-stages': 'pipelineStage',
  'crm-connections': 'crmConnection',
  'audit-logs': 'auditLog',
  users: 'user',
  organizations: 'organization',
  accounts: 'account',
  contacts: 'contact',
  leads: 'lead',
  deals: 'deal',
  integrations: 'integration',
  playbooks: 'playbook',
  forecasts: 'forecast',
  activities: 'activity',
  settings: 'setting',
}

function getApiEntity(path) {
  return API_MAP[path] || path
}

export default function AdminEntity() {
  const { entity: entityPath } = useParams()
  const { token } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modal, setModal] = useState(null)
  const [formData, setFormData] = useState({})

  const apiEntity = getApiEntity(entityPath)
  const entityLabel = ENTITIES.find((e) => e.path === entityPath)?.label || entityPath

  const fetchItems = () => {
    setLoading(true)
    fetch(`/api/admin/${apiEntity}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('Unauthorized'))))
      .then(setItems)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchItems()
  }, [apiEntity, token])

  const handleCreate = () => {
    setFormData({})
    setModal('create')
  }

  const handleEdit = (item) => {
    const data = { ...item }
    if (apiEntity === 'user') delete data.passwordHash
    if (data.value) data.value = Number(data.value)
    if (data.revenue) data.revenue = Number(data.revenue)
    setFormData(data)
    setModal('edit')
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this item?')) return
    const res = await fetch(`/api/admin/${apiEntity}/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    if (res.ok) fetchItems()
    else setError('Delete failed')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = { ...formData }
    delete payload.id
    delete payload.createdAt
    delete payload.updatedAt
    if (apiEntity === 'user' && !payload.password && modal === 'edit') delete payload.password

    const url = modal === 'create'
      ? `/api/admin/${apiEntity}`
      : `/api/admin/${apiEntity}/${formData.id}`
    const method = modal === 'create' ? 'POST' : 'PUT'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      setModal(null)
      fetchItems()
    } else {
      const err = await res.json()
      setError(err.error || 'Request failed')
    }
  }

  const cols = items[0] ? Object.keys(items[0]).filter((k) => !['passwordHash'].includes(k)) : []

  if (loading) return <div className="admin-loading">Loading...</div>
  if (error) return <div className="admin-error">{error} <button onClick={() => setError('')}>Dismiss</button></div>

  return (
    <div className="admin-entity">
      <div className="admin-entity-header">
        <h1>{entityLabel}</h1>
        <button className="btn-create" onClick={handleCreate}>+ Add</button>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              {cols.map((c) => (
                <th key={c}>{c.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                {cols.map((col) => (
                  <td key={col}>
                    {typeof item[col] === 'object' ? JSON.stringify(item[col]) : String(item[col] ?? '')}
                  </td>
                ))}
                <td>
                  <button className="btn-edit" onClick={() => handleEdit(item)}>Edit</button>
                  <button className="btn-delete" onClick={() => handleDelete(item.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="admin-modal-overlay" onClick={() => setModal(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{modal === 'create' ? 'Create' : 'Edit'} {entityLabel.slice(0, -1)}</h3>
            <form onSubmit={handleSubmit}>
              {[...cols.filter((c) => !['id', 'createdAt', 'updatedAt'].includes(c)), ...(apiEntity === 'user' && modal === 'create' ? ['password'] : [])].map((col) => (
                <div key={col} className="form-field">
                  <label>{col.replace(/([A-Z])/g, ' $1')}</label>
                  {col === 'password' && modal === 'edit' ? (
                    <input
                      type="password"
                      placeholder="Leave blank to keep"
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  ) : col === 'password' ? (
                    <input
                      type="password"
                      value={formData[col] ?? ''}
                      onChange={(e) => setFormData({ ...formData, [col]: e.target.value })}
                    />
                  ) : (
                    <input
                      type={col.includes('password') ? 'password' : ['value', 'revenue', 'order', 'score', 'probability', 'riskScore', 'conversionRate', 'confidence'].includes(col) ? 'number' : col === 'email' ? 'email' : 'text'}
                      value={formData[col] ?? ''}
                      onChange={(e) => setFormData({ ...formData, [col]: e.target.value })}
                    />
                  )}
                </div>
              ))}
              <div className="form-actions">
                <button type="button" onClick={() => setModal(null)}>Cancel</button>
                <button type="submit">{modal === 'create' ? 'Create' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
