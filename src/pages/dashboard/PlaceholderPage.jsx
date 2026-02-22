export default function PlaceholderPage({ title, description }) {
  return (
    <div className="p-4 max-w-2xl">
      <h1 className="text-xl font-semibold mb-2 text-white" style={{ fontFamily: 'var(--font-display)' }}>
        {title || 'Coming Soon'}
      </h1>
      <p className="text-slate-400">
        {description || 'This feature is in development.'}
      </p>
    </div>
  )
}
