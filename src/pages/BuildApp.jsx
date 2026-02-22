import { useState } from 'react'
import { Link } from 'react-router-dom'
import './BuildApp.css'

const APP_CATEGORIES = [
  { value: 'crm', label: 'CRM & Data Sync' },
  { value: 'marketing', label: 'Marketing Automation' },
  { value: 'sales-engagement', label: 'Sales Engagement' },
  { value: 'analytics', label: 'Analytics & Reporting' },
  { value: 'communication', label: 'Communication' },
  { value: 'automation', label: 'Workflow Automation' },
  { value: 'other', label: 'Other' },
]

const INTEGRATION_TYPES = [
  { value: 'api', label: 'REST API', desc: 'Direct API calls to read/write data' },
  { value: 'oauth', label: 'OAuth 2.0', desc: 'User-authorized access via OAuth' },
  { value: 'webhooks', label: 'Webhooks', desc: 'Receive real-time event notifications' },
  { value: 'api-oauth', label: 'API + OAuth', desc: 'Both API and OAuth required' },
]

const BUSINESS_MODELS = [
  { value: 'free', label: 'Free' },
  { value: 'freemium', label: 'Freemium' },
  { value: 'paid', label: 'Paid / Subscription' },
  { value: 'enterprise', label: 'Enterprise / Custom' },
]

const PARTNER_EMAIL = 'partners@revenueengine.ai'

function buildApplicationEmail(form) {
  const category = APP_CATEGORIES.find((c) => c.value === form.category)?.label || form.category
  const integration = INTEGRATION_TYPES.find((t) => t.value === form.integrationType)?.label || form.integrationType
  const businessModel = BUSINESS_MODELS.find((b) => b.value === form.businessModel)?.label || form.businessModel

  const body = [
    '=== BUILD AN APP APPLICATION ===',
    '',
    'COMPANY / DEVELOPER',
    `Company/Developer Name: ${form.companyName}`,
    `Website: ${form.website}`,
    `Contact Email: ${form.contactEmail}`,
    '',
    'APP DETAILS',
    `App Name: ${form.appName}`,
    `Tagline: ${form.tagline}`,
    `Category: ${category}`,
    `Description:`,
    form.description,
    '',
    'TECHNICAL',
    `Integration Type: ${integration}`,
    `Redirect URIs: ${form.redirectUris || '(none)'}`,
    `API Scopes/Needs: ${form.apiScopes || '(none)'}`,
    '',
    'COMPLIANCE',
    `Privacy Policy URL: ${form.privacyPolicyUrl}`,
    `Terms of Service URL: ${form.termsUrl || '(none)'}`,
    `Data Handling: ${form.dataHandling || '(none)'}`,
    '',
    'BUSINESS',
    `Business Model: ${businessModel}`,
    `Target Audience: ${form.targetAudience || '(none)'}`,
    '',
    '---',
    '',
    'Additional Notes:',
    form.additionalNotes || '(none)',
  ].join('\n')

  return `mailto:${PARTNER_EMAIL}?subject=${encodeURIComponent(`App Application: ${form.appName}`)}&body=${encodeURIComponent(body)}`
}

export default function BuildApp() {
  const [form, setForm] = useState({
    companyName: '',
    website: '',
    contactEmail: '',
    appName: '',
    tagline: '',
    category: '',
    description: '',
    integrationType: '',
    redirectUris: '',
    apiScopes: '',
    privacyPolicyUrl: '',
    termsUrl: '',
    dataHandling: '',
    businessModel: '',
    targetAudience: '',
    additionalNotes: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    window.location.href = buildApplicationEmail(form)
  }

  const isValid = form.companyName && form.contactEmail && form.appName && form.tagline && form.category && form.description && form.integrationType && form.privacyPolicyUrl

  return (
    <div className="build-app-page">
      <section className="build-app-header">
        <Link to="/marketplace" className="back-link">← Back to Marketplace</Link>
        <h1>Build an App</h1>
        <p>
          Apply to build an app that integrates with Revenue Engine AI. We review applications within 5 business days.
          Inspired by partner programs from Stripe and Shopify—we want to make it easy for developers to extend the platform.
        </p>
      </section>

      <section className="build-app-form-section">
        <form className="build-app-form" onSubmit={handleSubmit}>
          {/* Company / Developer */}
          <fieldset className="form-section">
            <legend>Company / Developer Information</legend>
            <div className="form-row">
              <label htmlFor="companyName">Company or Developer Name *</label>
              <input
                id="companyName"
                name="companyName"
                type="text"
                value={form.companyName}
                onChange={handleChange}
                placeholder="Acme Inc."
                required
              />
            </div>
            <div className="form-row">
              <label htmlFor="website">Website</label>
              <input
                id="website"
                name="website"
                type="url"
                value={form.website}
                onChange={handleChange}
                placeholder="https://acme.com"
              />
            </div>
            <div className="form-row">
              <label htmlFor="contactEmail">Contact Email *</label>
              <input
                id="contactEmail"
                name="contactEmail"
                type="email"
                value={form.contactEmail}
                onChange={handleChange}
                placeholder="developer@acme.com"
                required
              />
            </div>
          </fieldset>

          {/* App Details */}
          <fieldset className="form-section">
            <legend>App Details</legend>
            <div className="form-row">
              <label htmlFor="appName">App Name *</label>
              <input
                id="appName"
                name="appName"
                type="text"
                value={form.appName}
                onChange={handleChange}
                placeholder="My Revenue App"
                required
              />
            </div>
            <div className="form-row">
              <label htmlFor="tagline">Short Tagline (one line) *</label>
              <input
                id="tagline"
                name="tagline"
                type="text"
                value={form.tagline}
                onChange={handleChange}
                placeholder="Sync your CRM data in real time"
                required
              />
            </div>
            <div className="form-row">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                {APP_CATEGORIES.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <label htmlFor="description">Full Description *</label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe what your app does, how it integrates with Revenue Engine AI, and the value it provides to users..."
                rows={5}
                required
              />
            </div>
          </fieldset>

          {/* Technical */}
          <fieldset className="form-section">
            <legend>Technical Integration</legend>
            <div className="form-row">
              <label>Integration Type *</label>
              <div className="radio-group">
                {INTEGRATION_TYPES.map(({ value, label, desc }) => (
                  <label key={value} className="radio-option">
                    <input
                      type="radio"
                      name="integrationType"
                      value={value}
                      checked={form.integrationType === value}
                      onChange={handleChange}
                      required
                    />
                    <span className="radio-label">{label}</span>
                    <span className="radio-desc">{desc}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="form-row">
              <label htmlFor="redirectUris">OAuth Redirect URIs (if applicable)</label>
              <input
                id="redirectUris"
                name="redirectUris"
                type="text"
                value={form.redirectUris}
                onChange={handleChange}
                placeholder="https://app.acme.com/callback"
              />
            </div>
            <div className="form-row">
              <label htmlFor="apiScopes">API Scopes or Data Access Needed</label>
              <textarea
                id="apiScopes"
                name="apiScopes"
                value={form.apiScopes}
                onChange={handleChange}
                placeholder="e.g. deals:read, leads:write, forecast:read"
                rows={2}
              />
            </div>
          </fieldset>

          {/* Compliance */}
          <fieldset className="form-section">
            <legend>Compliance & Legal</legend>
            <div className="form-row">
              <label htmlFor="privacyPolicyUrl">Privacy Policy URL *</label>
              <input
                id="privacyPolicyUrl"
                name="privacyPolicyUrl"
                type="url"
                value={form.privacyPolicyUrl}
                onChange={handleChange}
                placeholder="https://acme.com/privacy"
                required
              />
            </div>
            <div className="form-row">
              <label htmlFor="termsUrl">Terms of Service URL</label>
              <input
                id="termsUrl"
                name="termsUrl"
                type="url"
                value={form.termsUrl}
                onChange={handleChange}
                placeholder="https://acme.com/terms"
              />
            </div>
            <div className="form-row">
              <label htmlFor="dataHandling">Data Handling Description</label>
              <textarea
                id="dataHandling"
                name="dataHandling"
                value={form.dataHandling}
                onChange={handleChange}
                placeholder="Describe how your app collects, stores, and processes user data..."
                rows={3}
              />
            </div>
          </fieldset>

          {/* Business */}
          <fieldset className="form-section">
            <legend>Business Model</legend>
            <div className="form-row">
              <label htmlFor="businessModel">Business Model</label>
              <select
                id="businessModel"
                name="businessModel"
                value={form.businessModel}
                onChange={handleChange}
              >
                <option value="">Select</option>
                {BUSINESS_MODELS.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <label htmlFor="targetAudience">Target Audience</label>
              <input
                id="targetAudience"
                name="targetAudience"
                type="text"
                value={form.targetAudience}
                onChange={handleChange}
                placeholder="e.g. SMB sales teams, Enterprise RevOps"
              />
            </div>
          </fieldset>

          {/* Additional */}
          <fieldset className="form-section">
            <legend>Additional Information</legend>
            <div className="form-row">
              <label htmlFor="additionalNotes">Anything else we should know?</label>
              <textarea
                id="additionalNotes"
                name="additionalNotes"
                value={form.additionalNotes}
                onChange={handleChange}
                placeholder="Timeline, special requirements, demo link..."
                rows={4}
              />
            </div>
          </fieldset>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary btn-lg" disabled={!isValid}>
              Submit Application
            </button>
            <p className="form-note">
              Your application will be sent to <strong>{PARTNER_EMAIL}</strong>. We'll review and get back to you within 5 business days.
            </p>
          </div>
        </form>
      </section>
    </div>
  )
}
