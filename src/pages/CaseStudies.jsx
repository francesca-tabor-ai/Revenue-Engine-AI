import { Link } from 'react-router-dom'
import './CaseStudies.css'

const LOGOS = [
  'TechFlow', 'Nexus Inc', 'ScaleUp', 'DataDrive', 'CloudNine',
  'VentureLabs', 'GrowthIQ', 'RevOps Pro', 'PipelineAI', 'SalesSync',
  'TechFlow', 'Nexus Inc', 'ScaleUp', 'DataDrive', 'CloudNine',
]

const CASE_STUDIES = [
  {
    company: 'TechFlow',
    industry: 'B2B SaaS',
    logo: 'TechFlow',
    metric: '42%',
    metricLabel: 'forecast accuracy improvement',
    quote: 'We used to miss our number more often than we hit it. Revenue Engine AI gave us a single source of truth—now we know which deals will close, which will slip, and why.',
    author: 'Sarah Chen',
    role: 'VP Sales, TechFlow',
    results: ['40% better forecast accuracy', '22% lift in pipeline conversion', '18% faster deal cycle'],
  },
  {
    company: 'ScaleUp',
    industry: 'Fintech',
    logo: 'ScaleUp',
    metric: '25%',
    metricLabel: 'reduction in seller admin time',
    quote: 'Our AEs were drowning in data entry and manual research. Revenue Engine AI automated the busywork so they could focus on what they do best—selling.',
    author: 'Marcus Johnson',
    role: 'CRO, ScaleUp',
    results: ['25% less time on admin', '15% more qualified meetings', '12x ROI in first year'],
  },
  {
    company: 'DataDrive',
    industry: 'Data & Analytics',
    logo: 'DataDrive',
    metric: '31%',
    metricLabel: 'fewer preventable churns',
    quote: 'We were reactive—finding out about at-risk accounts when it was too late. Now we get early signals and can intervene before they churn. Game changer.',
    author: 'Elena Rodriguez',
    role: 'Head of Customer Success, DataDrive',
    results: ['31% churn reduction', '20% improvement in NRR', 'Dedicated success manager support'],
  },
  {
    company: 'CloudNine',
    industry: 'Cloud Infrastructure',
    logo: 'CloudNine',
    metric: '19%',
    metricLabel: 'faster time-to-close',
    quote: 'Marketing, sales, and CS finally speak the same language. Attribution is clear, handoffs are seamless, and we close deals faster.',
    author: 'David Park',
    role: 'Revenue Operations Director, CloudNine',
    results: ['19% faster deal cycle', 'Unified attribution across tools', 'Custom playbooks rolled out in 2 weeks'],
  },
]

export default function CaseStudies() {
  return (
    <div className="case-studies-page">
      {/* Hero */}
      <section className="case-hero">
        <h1>Trusted by revenue teams that ship</h1>
        <p>See how companies like yours are turning data into predictable growth with Revenue Engine AI.</p>
      </section>

      {/* Scrolling logos */}
      <section className="logos-section">
        <p className="logos-label">Companies powered by Revenue Engine AI</p>
        <div className="logo-marquee-wrapper">
          <div className="logo-marquee-track">
            {[...LOGOS, ...LOGOS].map((name, i) => (
              <div key={i} className="logo-item">{name}</div>
            ))}
          </div>
          <div className="logo-marquee-track logo-marquee-track-2" aria-hidden>
            {[...LOGOS, ...LOGOS].map((name, i) => (
              <div key={`2-${i}`} className="logo-item">{name}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Case study cards */}
      <section className="case-grid">
        {CASE_STUDIES.map((study, index) => (
          <article key={study.company} className="case-card">
            <div className="case-header">
              <div className="case-logo">{study.logo}</div>
              <span className="case-industry">{study.industry}</span>
            </div>
            <div className="case-metric">
              <span className="metric-value">{study.metric}</span>
              <span className="metric-label">{study.metricLabel}</span>
            </div>
            <blockquote className="case-quote">"{study.quote}"</blockquote>
            <div className="case-author">
              <strong>{study.author}</strong>
              <span>{study.role}</span>
            </div>
            <ul className="case-results">
              {study.results.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      {/* CTA */}
      <section className="case-cta">
        <h2>Ready to join them?</h2>
        <p>Start your free trial and see what Revenue Engine AI can do for your team.</p>
        <Link to="/#demo" className="btn btn-primary btn-lg">Request a Demo</Link>
      </section>
    </div>
  )
}
