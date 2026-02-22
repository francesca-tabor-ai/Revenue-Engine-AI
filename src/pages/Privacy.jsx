import { Link } from 'react-router-dom'
import './Legal.css'

export default function Privacy() {
  return (
    <div className="legal-page">
      <div className="legal-content">
        <Link to="/" className="back-link">← Back to Home</Link>
        <h1>Privacy Policy</h1>
        <p className="legal-updated">Last updated: {new Date().toLocaleDateString('en-US')}</p>
        <section>
          <h2>1. Information We Collect</h2>
          <p>
            Revenue Engine AI collects information you provide when you register, use our services,
            or contact us. This may include name, email address, company information, and usage data.
          </p>
        </section>
        <section>
          <h2>2. How We Use Your Information</h2>
          <p>
            We use your information to provide, maintain, and improve our services; to communicate with you;
            and to comply with legal obligations.
          </p>
        </section>
        <section>
          <h2>3. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal data
            against unauthorized access, alteration, or destruction.
          </p>
        </section>
        <section>
          <h2>4. Contact</h2>
          <p>
            For questions about this privacy policy, contact us at{' '}
            <a href="mailto:privacy@revenueengine.ai">privacy@revenueengine.ai</a>.
          </p>
        </section>
      </div>
    </div>
  )
}
