import './ApiDocs.css'

const ENTITIES = [
  { name: 'User', path: 'user', base: '/api/admin', desc: 'Users with roles (ADMIN, USER) and organization association' },
  { name: 'Organization', path: 'organization', base: '/api/admin', desc: 'Organizations with plan tiers (INDIVIDUAL, TEAM, ENTERPRISE)' },
  { name: 'Account', path: 'account', base: '/api/admin', desc: 'CRM accounts with domain, industry, revenue' },
  { name: 'Contact', path: 'contact', base: '/api/admin', desc: 'Contacts linked to accounts' },
  { name: 'Lead', path: 'lead', base: '/api/admin', desc: 'Leads with status (NEW, QUALIFIED, DISQUALIFIED, CONVERTED)' },
  { name: 'Deal', path: 'deal', base: '/api/admin', desc: 'Deals with stage, value, probability, risk score' },
  { name: 'PipelineStage', path: 'pipelineStage', base: '/api/admin', desc: 'Pipeline stages with order and conversion rate' },
  { name: 'CrmConnection', path: 'crmConnection', base: '/api/admin', desc: 'CRM integrations (Salesforce, HubSpot, etc.)' },
  { name: 'Integration', path: 'integration', base: '/api/admin', desc: 'Marketing, sales, and CS integrations' },
  { name: 'Playbook', path: 'playbook', base: '/api/admin', desc: 'Automation playbooks with steps' },
  { name: 'Forecast', path: 'forecast', base: '/api/admin', desc: 'Pipeline and revenue forecasts' },
  { name: 'Activity', path: 'activity', base: '/api/admin', desc: 'Activities (email, call, meeting, task)' },
  { name: 'AuditLog', path: 'auditLog', base: '/api/admin', desc: 'Audit trail for compliance' },
  { name: 'Setting', path: 'setting', base: '/api/admin', desc: 'Organization-specific key-value settings' },
]

const METHODS = [
  { method: 'GET', color: 'var(--accent-emerald)' },
  { method: 'POST', color: 'var(--accent-cyan)' },
  { method: 'PUT', color: 'var(--accent-amber)' },
  { method: 'DELETE', color: 'var(--accent-violet)' },
]

function EndpointRow({ method, path, desc }) {
  const m = METHODS.find((x) => x.method === method)
  return (
    <div className="endpoint-row">
      <span className="method-badge" style={{ background: m?.color }}>{method}</span>
      <code className="endpoint-path">{path}</code>
      <span className="endpoint-desc">{desc}</span>
    </div>
  )
}

export default function ApiDocs() {
  return (
    <div className="api-docs-page">
      <section className="api-docs-header">
        <h1>API Documentation</h1>
        <p>
          Use the Revenue Engine AI API to integrate your apps, automate workflows, and build advanced revenue intelligence.
          All admin endpoints require authentication and admin role.
        </p>
      </section>

      <section className="api-docs-content">
        <nav className="api-docs-nav">
          <h3>Contents</h3>
          <a href="#auth">Authentication</a>
          <a href="#entities">Entities & CRUD</a>
          {ENTITIES.map((e) => (
            <a key={e.path} href={`#entity-${e.path}`}>{e.name}</a>
          ))}
        </nav>

        <div className="api-docs-main">
          {/* Auth section */}
          <section id="auth" className="docs-section">
            <h2>Authentication</h2>
            <p className="section-desc">Base URL: <code>/api/auth</code></p>
            <div className="endpoints-block">
              <EndpointRow method="POST" path="/api/auth/signup" desc="Create a new user account" />
              <EndpointRow method="POST" path="/api/auth/login" desc="Login and receive session/token" />
              <EndpointRow method="GET" path="/api/auth/me" desc="Get current user (requires auth)" />
            </div>
          </section>

          {/* Admin entities */}
          <section id="entities" className="docs-section">
            <h2>Entities & CRUD Operations</h2>
            <p className="section-desc">
              All entity endpoints live under <code>/api/admin</code>. Each entity supports full CRUD.
            </p>
          </section>

          {ENTITIES.map((entity) => (
            <section key={entity.path} id={`entity-${entity.path}`} className="docs-section">
              <h3>{entity.name}</h3>
              <p className="entity-desc">{entity.desc}</p>
              <div className="endpoints-block">
                <EndpointRow method="GET" path={`${entity.base}/${entity.path}`} desc="List all (with pagination/order)" />
                <EndpointRow method="GET" path={`${entity.base}/${entity.path}/:id`} desc="Get by ID" />
                <EndpointRow method="POST" path={`${entity.base}/${entity.path}`} desc="Create" />
                <EndpointRow method="PUT" path={`${entity.base}/${entity.path}/:id`} desc="Update" />
                <EndpointRow method="DELETE" path={`${entity.base}/${entity.path}/:id`} desc="Delete" />
              </div>
            </section>
          ))}

          <section className="docs-section">
            <h2>Response Format</h2>
            <p className="section-desc">
              Successful responses return JSON. Lists return arrays. Errors use <code>{'{ error: string }'}</code>.
            </p>
          </section>
        </div>
      </section>
    </div>
  )
}
