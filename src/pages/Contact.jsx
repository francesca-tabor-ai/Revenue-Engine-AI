import { useState } from 'react'
import './Contact.css'

const REQUEST_TYPES = [
  { value: 'customer-support', label: 'Customer Support Request' },
  { value: 'bug-report', label: 'Bug Report' },
  { value: 'general', label: 'General Inquiry' },
]

const CONTACT_EMAIL = 'info@francescatabor.com'

function buildMailtoUrl({ requestType, name, email, subject, message }) {
  const typeLabel = REQUEST_TYPES.find(t => t.value === requestType)?.label || requestType
  const encodedSubject = encodeURIComponent(`[${typeLabel}] ${subject || 'Contact Form Submission'}`)
  const body = [
    `Request Type: ${typeLabel}`,
    `From: ${name} <${email}>`,
    '',
    '---',
    '',
    message || '(No message provided)',
  ].join('\n')
  const encodedBody = encodeURIComponent(body)
  return `mailto:${CONTACT_EMAIL}?subject=${encodedSubject}&body=${encodedBody}`
}

export default function Contact() {
  const [form, setForm] = useState({
    requestType: 'customer-support',
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const url = buildMailtoUrl(form)
    window.location.href = url
  }

  return (
    <div className="contact-page">
      <section className="contact-header">
        <h1>Contact Us</h1>
        <p>
          Have a question, need support, or found a bug? Reach out and we'll get back to you.
          All submissions are sent to <strong>{CONTACT_EMAIL}</strong>.
        </p>
      </section>

      <section className="contact-form-section">
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label htmlFor="requestType">Request Type</label>
            <select
              id="requestType"
              name="requestType"
              value={form.requestType}
              onChange={handleChange}
              required
            >
              {REQUEST_TYPES.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <label htmlFor="name">Your Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Jane Smith"
              required
            />
          </div>

          <div className="form-row">
            <label htmlFor="email">Your Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="jane@company.com"
              required
            />
          </div>

          <div className="form-row">
            <label htmlFor="subject">Subject</label>
            <input
              id="subject"
              name="subject"
              type="text"
              value={form.subject}
              onChange={handleChange}
              placeholder="Brief summary of your request"
            />
          </div>

          <div className="form-row">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Describe your request in detail..."
              rows={6}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-lg">
            Send via Email
          </button>
        </form>
      </section>
    </div>
  )
}
