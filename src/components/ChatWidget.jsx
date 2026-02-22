import { useState, useRef, useEffect } from 'react'
import './ChatWidget.css'

const PROMPT_PROBES = [
  "What is Revenue Engine AI?",
  "Who is this platform for?",
  "What pain points do you solve?",
  "How does pricing work?",
  "What results can I expect?",
  "How do I get started?",
]

const PLATFORM_KNOWLEDGE = [
  {
    keywords: ['what is', 'revenue engine', 'platform', 'product', 'overview'],
    response: "Revenue Engine AI is an AI-powered platform built for revenue teams who want predictable, scalable growth. We turn your CRM, marketing, and sales data into a single source of truth—so your team can forecast accurately, prioritize the right deals, and close faster. Unlike generic AI assistants, we're purpose-built for the revenue cycle.",
  },
  {
    keywords: ['who', 'for whom', 'icp', 'ideal customer', 'built for', 'target'],
    response: "Revenue Engine AI is designed for B2B SaaS and technology companies (Series A through enterprise, $2M–$200M ARR). Our ideal users are Revenue Ops leaders, VP Sales, and CROs who own the end-to-end revenue funnel. Teams with 5–200+ sellers who need alignment across marketing, sales, and customer success—and want data-driven decisions instead of gut feeling.",
  },
  {
    keywords: ['pain', 'problem', 'solve', 'blindness', 'silo', 'manual', 'reactive'],
    response: "We address four major pain points: **Pipeline blindness**—you can't tell which deals will close or stall until it's too late. **Silos**—marketing, sales, and CS operate in separate systems with fuzzy attribution. **Manual work**—SDRs and AEs spend hours on data entry instead of selling. **Reactive mode**—you find out deals are at risk when they churn. We turn this around with unified intelligence and proactive signals.",
  },
  {
    keywords: ['price', 'pricing', 'plan', 'cost', 'trial', 'free'],
    response: "We offer three tiers: **Individual** ($49/mo or $39/mo yearly) for solo pros and small teams—1 CRM, basic forecasting, up to 500 leads/month. **Team** ($99/mo or $79/mo yearly) is our most popular—up to 3 CRMs, advanced forecasting, 5,000 leads, next-best-action recommendations. **Enterprise** is custom—unlimited connections, SSO, dedicated success manager. All paid plans include a 14-day free trial with no credit card required.",
  },
  {
    keywords: ['result', 'roi', 'improvement', 'forecast', 'conversion', 'churn'],
    response: "Typical outcomes: **20–40%** better forecast accuracy (60–90 days), **10–25%** lift in conversion (90–120 days), **15–30%** reduction in admin tasks (30–60 days), **10–20%** faster time-to-close (90–120 days), **5–15%** fewer preventable churns (90–180 days). For a $10M ARR company, this can translate to $1.5M–$2.5M+ incremental revenue annually—often 10–20x the platform cost in year one.",
  },
  {
    keywords: ['start', 'get started', 'sign up', 'demo', 'trial'],
    response: "Getting started is easy! Head to our Pricing page to start your free trial—no credit card required. Individual and Team plans include a 14-day trial. You can also request a demo or explore our Case Studies to see how companies like TechFlow and ScaleUp achieved 40%+ forecast improvement. I can help you find the right plan for your team.",
  },
  {
    keywords: ['integrat', 'crm', 'hubspot', 'salesforce', 'tools'],
    response: "We integrate with the tools you already use—Salesforce, HubSpot, Outreach, and most major CRMs and marketing automation platforms. Connect once and Revenue Engine AI unifies and cleans your data. No rip-and-replace required. Enterprise plans support unlimited connections and custom integrations.",
  },
  {
    keywords: ['how it works', 'solution', 'feature'],
    response: "Three core pillars: **1) Unified revenue intelligence**—connect CRM and marketing tools once; we unify and clean data so you see pipeline, conversion, and risk in one place. **2) AI that augments**—ML-powered lead scoring, opportunity risk, and next-best-action recommendations. **3) Actionable answers**—every insight comes with a suggested action, not just charts.",
  },
]

const GREETING = "Hi! I'm here to answer questions about Revenue Engine AI and guide you around the platform. What would you like to know?"

function formatMessage(text) {
  return text.split('**').map((part, i) => 
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
  )
}

function getResponse(userMessage) {
  const lower = userMessage.toLowerCase().trim()
  
  const helloPatterns = ['hi', 'hello', 'hey', 'help', 'support']
  if (helloPatterns.some(p => lower.startsWith(p) && lower.length < 20)) {
    return GREETING
  }

  for (const { keywords, response } of PLATFORM_KNOWLEDGE) {
    if (keywords.some(kw => lower.includes(kw))) {
      return response
    }
  }

  return "That's a great question! Revenue Engine AI helps revenue teams turn fragmented data into predictable growth. Could you tell me more—for example, are you curious about pricing, who it's for, or the results teams typically see? I'm here to guide you."
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
    }
  }, [isOpen])

  const sendMessage = (text) => {
    const trimmed = text.trim()
    if (!trimmed) return

    const userMsg = { role: 'user', content: trimmed }
    setMessages(prev => [...prev, userMsg])
    setInputValue('')

    setTimeout(() => {
      const reply = getResponse(trimmed)
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    }, 400)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    sendMessage(inputValue)
  }

  const handleProbeClick = (probe) => {
    sendMessage(probe)
  }

  const showProbes = messages.length === 0

  return (
    <>
      <button
        className="chat-widget-trigger"
        onClick={() => setIsOpen(o => !o)}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>

      <div className={`chat-widget-panel ${isOpen ? 'open' : ''}`}>
        <div className="chat-widget-header">
          <h3>Revenue Engine AI Assistant</h3>
          <p className="chat-widget-subtitle">Ask me anything about the platform</p>
        </div>

        <div className="chat-widget-messages">
          {showProbes && (
            <div className="chat-widget-probes">
              <p className="probes-label">Quick questions to get started:</p>
              <div className="probes-grid">
                {PROMPT_PROBES.map((probe, i) => (
                  <button
                    key={i}
                    className="probe-chip"
                    onClick={() => handleProbeClick(probe)}
                  >
                    {probe}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`chat-message ${msg.role}`}>
              <div className="message-bubble">
                {msg.role === 'assistant' ? formatMessage(msg.content) : msg.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form className="chat-widget-input" onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about the platform..."
            disabled={!isOpen}
            aria-label="Chat message"
          />
          <button type="submit" disabled={!inputValue.trim()} aria-label="Send message">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </form>
      </div>
    </>
  )
}
