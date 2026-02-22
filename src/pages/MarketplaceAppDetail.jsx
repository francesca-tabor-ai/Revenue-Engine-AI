import { useParams, Link, Navigate } from 'react-router-dom'
import './Marketplace.css'

const APPS = [
  { id: 'salesforce-sync', name: 'Salesforce Sync Pro', description: 'Bidirectional sync between Revenue Engine AI and Salesforce. Real-time deal updates, lead scoring, and pipeline alignment.', category: 'CRM', rating: 4.9, installs: '2.4k', icon: '☁️' },
  { id: 'hubspot-connector', name: 'HubSpot Connector', description: 'Connect marketing attribution to deals. Sync contacts, activities, and custom properties for full-funnel visibility.', category: 'Marketing', rating: 4.8, installs: '1.8k', icon: '🟠' },
  { id: 'slack-alerts', name: 'Slack Revenue Alerts', description: 'Get AI-powered deal risk alerts, forecast updates, and next-best-action recommendations directly in Slack.', category: 'Communication', rating: 4.9, installs: '3.1k', icon: '💬' },
  { id: 'zapier-integration', name: 'Zapier Integration', description: 'Connect Revenue Engine AI to 5,000+ apps. Trigger workflows on deal stage changes, lead scores, and forecast events.', category: 'Automation', rating: 4.7, installs: '4.2k', icon: '⚡' },
  { id: 'gong-analytics', name: 'Gong Conversation AI', description: 'Enrich deals with conversation intelligence. Correlate call sentiment and talk tracks with win probability.', category: 'Sales Intelligence', rating: 4.8, installs: '890', icon: '🎙️' },
  { id: 'outreach-sequences', name: 'Outreach Sequences', description: 'Sync sequences and engagement data. Apply lead scores to prioritize outreach and personalize at scale.', category: 'Sales Engagement', rating: 4.6, installs: '1.2k', icon: '✉️' },
]

export default function MarketplaceAppDetail() {
  const { id } = useParams()
  const app = APPS.find((a) => a.id === id)
  if (!app) return <Navigate to="/marketplace" replace />

  return (
    <div className="marketplace-page marketplace-detail-page">
      <section className="marketplace-detail">
        <Link to="/marketplace" className="back-link">← Back to Marketplace</Link>
        <div className="app-detail-card">
          <div className="app-detail-header">
            <span className="app-detail-icon">{app.icon}</span>
            <div>
              <span className="app-detail-category">{app.category}</span>
              <h1>{app.name}</h1>
            </div>
          </div>
          <p className="app-detail-description">{app.description}</p>
          <div className="app-detail-meta">
            <span className="app-rating">★ {app.rating}</span>
            <span className="app-installs">{app.installs} installs</span>
          </div>
          <div className="app-detail-actions">
            <Link to="/pricing" className="btn btn-primary btn-lg">Install App</Link>
            <Link to="/marketplace" className="btn btn-outline btn-lg">Browse More Apps</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
