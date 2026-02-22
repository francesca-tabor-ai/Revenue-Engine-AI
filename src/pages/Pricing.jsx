import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Pricing.css'

const TIERS = [
  {
    id: 'individual',
    name: 'Individual',
    description: 'For solo revenue professionals and small teams getting started',
    priceMonthly: 49,
    priceYearly: 39,
    period: '/user/month',
    cta: 'Start Free Trial',
    features: [
      '1 CRM connection',
      'Pipeline visibility & basic forecasting',
      'Lead scoring (up to 500 leads/month)',
      'Email integration',
      'Basic reports & dashboards',
      'Email support',
    ],
    limits: { crm: 1, leads: 500, users: 5 },
    highlighted: false,
  },
  {
    id: 'team',
    name: 'Team',
    description: 'For growing teams that need collaboration and automation',
    priceMonthly: 99,
    priceYearly: 79,
    period: '/user/month',
    cta: 'Start Free Trial',
    features: [
      'Up to 3 CRM connections',
      'Advanced forecasting & risk signals',
      'Lead scoring (up to 5,000 leads/month)',
      'Next-best-action recommendations',
      'Marketing & sales attribution',
      'Custom playbooks',
      'Slack & Teams integration',
      'Priority support',
    ],
    limits: { crm: 3, leads: 5000, users: 50 },
    highlighted: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large orgs with custom needs and compliance requirements',
    priceMonthly: null,
    priceYearly: null,
    period: 'Custom',
    cta: 'Contact Sales',
    features: [
      'Unlimited CRM & tool connections',
      'Custom ML models & data pipelines',
      'Unlimited lead scoring',
      'SSO, SCIM, audit logs',
      'Dedicated success manager',
      'Custom integrations',
      'SLA & uptime guarantees',
      'On-premise deployment options',
    ],
    limits: { crm: null, leads: null, users: null },
    highlighted: false,
  },
]

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState('yearly') // yearly | monthly
  const [teamSeats, setTeamSeats] = useState(10)
  const [individualSeats, setIndividualSeats] = useState(2)

  const toggleBilling = () => {
    setBillingCycle((c) => (c === 'yearly' ? 'monthly' : 'yearly'))
  }

  const getPrice = (tier) => {
    if (tier.id === 'enterprise') return 'Custom'
    const price = billingCycle === 'yearly' ? tier.priceYearly : tier.priceMonthly
    return `$${price}`
  }

  const getTotalTeam = () => {
    const tier = TIERS.find((t) => t.id === 'team')
    const price = billingCycle === 'yearly' ? tier.priceYearly : tier.priceMonthly
    return price * teamSeats
  }

  const getTotalIndividual = () => {
    const tier = TIERS.find((t) => t.id === 'individual')
    const price = billingCycle === 'yearly' ? tier.priceYearly : tier.priceMonthly
    return price * individualSeats
  }

  return (
    <div className="pricing-page">
      <section className="pricing-header">
        <h1>Simple, scalable pricing</h1>
        <p>Choose the plan that fits your team. Scale up or down anytime.</p>
        <div className="billing-toggle">
          <span className={billingCycle === 'monthly' ? 'active' : ''}>Monthly</span>
          <button
            className="toggle-switch"
            onClick={toggleBilling}
            role="switch"
            aria-checked={billingCycle === 'yearly'}
          >
            <span className="toggle-dot"></span>
          </button>
          <span className={billingCycle === 'yearly' ? 'active' : ''}>
            Yearly <small>(save 20%)</small>
          </span>
        </div>
      </section>

      <section className="pricing-grid">
        {TIERS.map((tier) => (
          <div
            key={tier.id}
            className={`pricing-card ${tier.highlighted ? 'highlighted' : ''}`}
          >
            {tier.highlighted && <div className="card-badge">Most Popular</div>}
            <h2>{tier.name}</h2>
            <p className="tier-description">{tier.description}</p>
            <div className="price-block">
              {tier.priceMonthly ? (
                <>
                  <span className="price">{getPrice(tier)}</span>
                  <span className="period">{tier.period}</span>
                  {tier.id === 'individual' && (
                    <div className="seat-selector">
                      <label>Users</label>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={individualSeats}
                        onChange={(e) => setIndividualSeats(+e.target.value)}
                      />
                      <span>{individualSeats} users</span>
                      <p className="seat-total">
                        ${(billingCycle === 'yearly' ? tier.priceYearly : tier.priceMonthly) * individualSeats}/mo
                      </p>
                    </div>
                  )}
                  {tier.id === 'team' && (
                    <div className="seat-selector">
                      <label>Users</label>
                      <input
                        type="range"
                        min="5"
                        max="50"
                        value={teamSeats}
                        onChange={(e) => setTeamSeats(+e.target.value)}
                      />
                      <span>{teamSeats} users</span>
                      <p className="seat-total">
                        ${getTotalTeam()}/mo
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <span className="price">Custom</span>
              )}
            </div>
            <ul className="feature-list">
              {tier.features.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
            <Link
              to={tier.id === 'enterprise' ? '/#demo' : '/pricing'}
              className={`btn ${tier.highlighted ? 'btn-primary' : 'btn-outline'}`}
            >
              {tier.cta}
            </Link>
          </div>
        ))}
      </section>

      <section className="pricing-faq">
        <h2>Frequently asked questions</h2>
        <div className="faq-grid">
          <div className="faq-item">
            <h3>Can I change plans later?</h3>
            <p>Yes. You can upgrade, downgrade, or switch billing cycles anytime. We prorate the difference.</p>
          </div>
          <div className="faq-item">
            <h3>What counts as a user?</h3>
            <p>Anyone who logs in and uses the platform—sellers, managers, rev ops, and leadership. View-only seats are available for Enterprise.</p>
          </div>
          <div className="faq-item">
            <h3>Is there a free trial?</h3>
            <p>Individual and Team plans include a 14-day free trial. No credit card required to start.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
