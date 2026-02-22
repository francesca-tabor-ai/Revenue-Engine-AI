import { Link } from 'react-router-dom'
import './Landing.css'

export default function Landing() {
  return (
    <div className="landing">
      {/* Hero */}
      <section className="hero">
        <div className="hero-badge">Built for revenue teams who demand predictability</div>
        <h1 className="hero-title">
          Stop guessing.<br />
          <span className="gradient-text">Start knowing.</span>
        </h1>
        <p className="hero-subtitle">
          Revenue Engine AI turns your CRM, marketing, and sales data into a single source of truth—so your team can forecast accurately, prioritize the right deals, and close faster.
        </p>
        <div className="hero-cta">
          <Link to="/pricing" className="btn btn-primary btn-lg">Start Free Trial</Link>
          <Link to="/#how-it-works" className="btn btn-ghost btn-lg">See How It Works</Link>
        </div>
        <div className="hero-stats">
          <span><strong>40%</strong> better forecast accuracy</span>
          <span><strong>25%</strong> lift in conversion</span>
          <span><strong>10–20x</strong> ROI in year one</span>
        </div>
      </section>

      {/* Trusted By - Logos preview */}
      <section className="trusted-by">
        <p className="trusted-label">Trusted by revenue teams at</p>
        <div className="logo-marquee">
          <div className="logo-track">
            <span>TechFlow</span><span>Nexus Inc</span><span>ScaleUp</span><span>DataDrive</span><span>CloudNine</span>
            <span>TechFlow</span><span>Nexus Inc</span><span>ScaleUp</span><span>DataDrive</span><span>CloudNine</span>
          </div>
        </div>
      </section>

      {/* Who It's For - Customer */}
      <section className="customer-section" id="customer">
        <h2 className="section-title">Built for the people who own revenue</h2>
        <p className="section-subtitle">You’re the ones making the calls, coaching the team, and answering to the board. You deserve better tools.</p>
        <div className="customer-cards">
          <div className="customer-card">
            <div className="card-icon">📊</div>
            <h3>Revenue Ops Leaders</h3>
            <p>You manage pipeline health, attribution, and data quality across marketing, sales, and CS. You need one system that connects it all and surfaces what matters.</p>
          </div>
          <div className="customer-card">
            <div className="card-icon">🎯</div>
            <h3>VP Sales & CROs</h3>
            <p>You’re measured on forecast accuracy and quota attainment. You want AI that augments your team—not replaces them—so every rep can sell like your top performers.</p>
          </div>
          <div className="customer-card">
            <div className="card-icon">🚀</div>
            <h3>B2B SaaS & Tech Companies</h3>
            <p>You’re scaling fast (Series A to enterprise) with 5–200+ sellers. You already have CRM and tools, but they’re not giving you the intelligence you need to win.</p>
          </div>
        </div>
      </section>

      {/* Pain Points */}
      <section className="pain-section">
        <h2 className="section-title">Sound familiar?</h2>
        <p className="section-subtitle">These pain points cost you deals, time, and margin. We built Revenue Engine AI to fix them.</p>
        <div className="pain-grid">
          <div className="pain-card">
            <span className="pain-label">Pipeline blindness</span>
            <p>You can’t tell which deals will close, slip, or stall until it’s too late. Forecasts feel like roulette. Board meetings are stressful.</p>
          </div>
          <div className="pain-card">
            <span className="pain-label">Siloed data</span>
            <p>Marketing, sales, and CS live in different systems. Attribution is fuzzy, handoffs leak, and nobody owns the full customer journey.</p>
          </div>
          <div className="pain-card">
            <span className="pain-label">Manual busywork</span>
            <p>SDRs and AEs spend hours on data entry and research instead of selling. Top reps do things their own way—others can’t keep up.</p>
          </div>
          <div className="pain-card">
            <span className="pain-label">Reactive, not proactive</span>
            <p>You find out deals are at risk when they churn or stall. By then, it’s too late to intervene. You’re always playing catch-up.</p>
          </div>
        </div>
      </section>

      {/* How We Solve It / Features */}
      <section className="solution-section" id="how-it-works">
        <h2 className="section-title">How we solve it</h2>
        <p className="section-subtitle">Purpose-built for revenue. One platform. Actionable insights. No rip-and-replace.</p>
        <div className="solution-grid">
          <div className="solution-card">
            <div className="solution-number">01</div>
            <h3>Unified revenue intelligence</h3>
            <p>Connect your CRM, marketing, and engagement tools once. We unify and clean your data so you see pipeline, conversion, and risk in one place.</p>
          </div>
          <div className="solution-card">
            <div className="solution-number">02</div>
            <h3>AI that augments, not replaces</h3>
            <p>ML-powered lead scoring, opportunity risk, and next-best-action recommendations. Your team stays in control—the engine handles the heavy lifting.</p>
          </div>
          <div className="solution-card">
            <div className="solution-number">03</div>
            <h3>Answers + next steps</h3>
            <p>Every insight comes with a suggested action: which deal to prioritize, which email to send, which customer to call. Not just charts—answers.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section" id="demo">
        <div className="cta-card">
          <h2>Ready to turn data into revenue?</h2>
          <p>Join revenue teams who’ve improved forecast accuracy by 40% and conversion by 25%. Start your free trial—no credit card required.</p>
          <div className="cta-buttons">
            <Link to="/pricing" className="btn btn-primary btn-lg">Start Free Trial</Link>
            <Link to="/case-studies" className="btn btn-outline btn-lg">Read Case Studies</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
