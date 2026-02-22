import { Link } from 'react-router-dom'
import './Marketplace.css'

const APPS = [
  {
    id: 'salesforce-sync',
    name: 'Salesforce Sync Pro',
    description: 'Bidirectional sync between Revenue Engine AI and Salesforce. Real-time deal updates, lead scoring, and pipeline alignment.',
    category: 'CRM',
    rating: 4.9,
    installs: '2.4k',
    icon: '☁️',
  },
  {
    id: 'hubspot-connector',
    name: 'HubSpot Connector',
    description: 'Connect marketing attribution to deals. Sync contacts, activities, and custom properties for full-funnel visibility.',
    category: 'Marketing',
    rating: 4.8,
    installs: '1.8k',
    icon: '🟠',
  },
  {
    id: 'slack-alerts',
    name: 'Slack Revenue Alerts',
    description: 'Get AI-powered deal risk alerts, forecast updates, and next-best-action recommendations directly in Slack.',
    category: 'Communication',
    rating: 4.9,
    installs: '3.1k',
    icon: '💬',
  },
  {
    id: 'zapier-integration',
    name: 'Zapier Integration',
    description: 'Connect Revenue Engine AI to 5,000+ apps. Trigger workflows on deal stage changes, lead scores, and forecast events.',
    category: 'Automation',
    rating: 4.7,
    installs: '4.2k',
    icon: '⚡',
  },
  {
    id: 'gong-analytics',
    name: 'Gong Conversation AI',
    description: 'Enrich deals with conversation intelligence. Correlate call sentiment and talk tracks with win probability.',
    category: 'Sales Intelligence',
    rating: 4.8,
    installs: '890',
    icon: '🎙️',
  },
  {
    id: 'outreach-sequences',
    name: 'Outreach Sequences',
    description: 'Sync sequences and engagement data. Apply lead scores to prioritize outreach and personalize at scale.',
    category: 'Sales Engagement',
    rating: 4.6,
    installs: '1.2k',
    icon: '✉️',
  },
]

export default function Marketplace() {
  return (
    <div className="marketplace-page">
      <section className="marketplace-hero">
        <h1>App Marketplace</h1>
        <p>
          Extend Revenue Engine AI with integrations and custom apps. Connect your stack, automate workflows,
          and unlock advanced revenue intelligence.
        </p>
        <Link to="/marketplace/build" className="btn btn-primary btn-lg">
          Build an App
        </Link>
      </section>

      <section className="marketplace-featured">
        <h2>Featured Integrations</h2>
        <div className="apps-grid">
          {APPS.map((app) => (
            <article key={app.id} className="app-card">
              <div className="app-card-header">
                <span className="app-icon">{app.icon}</span>
                <span className="app-category">{app.category}</span>
              </div>
              <h3>{app.name}</h3>
              <p>{app.description}</p>
              <div className="app-meta">
                <span className="app-rating">★ {app.rating}</span>
                <span className="app-installs">{app.installs} installs</span>
              </div>
              <Link to={`/marketplace/${app.id}`} className="app-card-link">
                Install App →
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="marketplace-cta">
        <div className="cta-card">
          <h2>Have an app idea?</h2>
          <p>
            Join our partner program and build apps that integrate with Revenue Engine AI. Get API access,
            documentation, and support for your integration.
          </p>
          <div className="cta-actions">
            <Link to="/marketplace/build" className="btn btn-primary">
              Apply to Build an App
            </Link>
            <Link to="/api-docs" className="btn btn-outline">
              View API Docs
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
