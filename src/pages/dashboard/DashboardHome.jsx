import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function DashboardHome() {
  const { user } = useAuth()
  const firstName = user?.firstName || user?.email?.split('@')[0] || 'Founder'

  return (
    <div className="p-4 max-w-4xl">
      <h1 className="text-2xl font-semibold mb-2 text-white" style={{ fontFamily: 'var(--font-display)' }}>
        Welcome back, {firstName}
      </h1>
      <p className="text-slate-400 mb-8">
        Your autonomous revenue partner. Get from product to first revenue in 30 days.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          to="/dashboard/icp"
          className="block p-5 rounded-xl border border-slate-700 bg-slate-800/50 hover:bg-slate-800 transition-colors"
        >
          <span className="text-2xl mb-2 block">🎯</span>
          <h3 className="font-semibold text-white mb-1">ICP & Offer Architect</h3>
          <p className="text-sm text-slate-400">
            Define your ideal customer, pain mapping, and beta offer.
          </p>
        </Link>
        <Link
          to="/dashboard/outreach"
          className="block p-5 rounded-xl border border-slate-700 bg-slate-800/50 hover:bg-slate-800 transition-colors"
        >
          <span className="text-2xl mb-2 block">✉️</span>
          <h3 className="font-semibold text-white mb-1">Outreach Generator</h3>
          <p className="text-sm text-slate-400">
            Generate LinkedIn & email messages at scale.
          </p>
        </Link>
        <Link
          to="/dashboard/revenue"
          className="block p-5 rounded-xl border border-slate-700 bg-slate-800/50 hover:bg-slate-800 transition-colors"
        >
          <span className="text-2xl mb-2 block">💰</span>
          <h3 className="font-semibold text-white mb-1">Revenue Dashboard</h3>
          <p className="text-sm text-slate-400">
            Track outreach, reply rate, calls, and revenue.
          </p>
        </Link>
      </div>
    </div>
  )
}
