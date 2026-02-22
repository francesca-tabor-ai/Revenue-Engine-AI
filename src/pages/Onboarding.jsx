import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Onboarding.css'

const ONBOARDING_KEY = 'revenue-engine-onboarding'

export function getOnboardingComplete(userId) {
  try {
    const data = JSON.parse(localStorage.getItem(ONBOARDING_KEY) || '{}')
    return !!data[userId]
  } catch {
    return false
  }
}

export function setOnboardingComplete(userId, data = {}) {
  try {
    const existing = JSON.parse(localStorage.getItem(ONBOARDING_KEY) || '{}')
    existing[userId] = { ...data, completedAt: new Date().toISOString() }
    localStorage.setItem(ONBOARDING_KEY, JSON.stringify(existing))
  } catch (e) {
    console.warn('Failed to save onboarding', e)
  }
}

export default function Onboarding() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    productName: '',
    productDescription: '',
    marketHypothesis: '',
    targetAudience: '',
  })

  if (!user) {
    navigate('/login', { replace: true })
    return null
  }

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const handleComplete = () => {
    setOnboardingComplete(user.id, form)
    navigate('/dashboard', { replace: true })
  }

  return (
    <div className="onboarding-page">
      <div className="onboarding-card">
        <h1 className="onboarding-title">Welcome to Revenue Engine AI</h1>
        <p className="onboarding-subtitle">
          Let&apos;s set up your revenue sprint in a few steps.
        </p>

        <div className="onboarding-progress">
          <div className="onboarding-progress-bar" style={{ width: `${(step / 3) * 100}%` }} />
        </div>
        <p className="onboarding-step-label">Step {step} of 3</p>

        {step === 1 && (
          <div className="onboarding-step">
            <label>Product name</label>
            <input
              type="text"
              placeholder="e.g. Acme SaaS"
              value={form.productName}
              onChange={(e) => update('productName', e.target.value)}
            />
            <label>Brief product description</label>
            <textarea
              placeholder="What does your product do? Who is it for?"
              rows={3}
              value={form.productDescription}
              onChange={(e) => update('productDescription', e.target.value)}
            />
            <button onClick={() => setStep(2)} disabled={!form.productName}>
              Next
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="onboarding-step">
            <label>Market hypothesis</label>
            <textarea
              placeholder="Who has the problem? What market are you targeting?"
              rows={3}
              value={form.marketHypothesis}
              onChange={(e) => update('marketHypothesis', e.target.value)}
            />
            <label>Initial target audience (ICP)</label>
            <input
              type="text"
              placeholder="e.g. AI/SaaS founders, pre-seed, B2B"
              value={form.targetAudience}
              onChange={(e) => update('targetAudience', e.target.value)}
            />
            <div className="onboarding-actions">
              <button type="button" onClick={() => setStep(1)}>
                Back
              </button>
              <button onClick={() => setStep(3)}>Next</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="onboarding-step">
            <p className="onboarding-summary">
              You&apos;re all set. The ICP Architect will help refine your positioning based on this.
            </p>
            <div className="onboarding-summary-box">
              <p><strong>Product:</strong> {form.productName || '—'}</p>
              <p><strong>Target:</strong> {form.targetAudience || '—'}</p>
            </div>
            <div className="onboarding-actions">
              <button type="button" onClick={() => setStep(2)}>
                Back
              </button>
              <button onClick={handleComplete} className="onboarding-primary">
                Go to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
