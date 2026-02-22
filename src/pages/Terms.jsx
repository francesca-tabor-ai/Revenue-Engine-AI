import { Link } from 'react-router-dom'
import './Legal.css'

export default function Terms() {
  return (
    <div className="legal-page">
      <div className="legal-content">
        <Link to="/" className="back-link">← Back to Home</Link>
        <h1>Terms of Service</h1>
        <p className="legal-updated">Last updated: {new Date().toLocaleDateString('en-US')}</p>
        <section>
          <h2>1. Agreement</h2>
          <p>
            By accessing or using Revenue Engine AI, you agree to be bound by these Terms of Service.
            If you do not agree, do not use our services.
          </p>
        </section>
        <section>
          <h2>2. Use of Service</h2>
          <p>
            You agree to use the service lawfully and in accordance with these terms. You are responsible
            for maintaining the confidentiality of your account credentials.
          </p>
        </section>
        <section>
          <h2>3. Intellectual Property</h2>
          <p>
            Revenue Engine AI and its content, features, and functionality are owned by us and are
            protected by applicable intellectual property laws.
          </p>
        </section>
        <section>
          <h2>4. Contact</h2>
          <p>
            For questions about these terms, contact us at{' '}
            <a href="mailto:legal@revenueengine.ai">legal@revenueengine.ai</a>.
          </p>
        </section>
      </div>
    </div>
  )
}
