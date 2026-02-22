import { Link } from 'react-router-dom'
import './Header.css'

export default function Header() {
  return (
    <header className="header">
      <Link to="/" className="logo">
        <span className="logo-icon">◆</span>
        Revenue Engine AI
      </Link>
      <nav className="nav">
        <Link to="/">Home</Link>
        <Link to="/pricing">Pricing</Link>
        <Link to="/case-studies">Case Studies</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/#demo" className="btn btn-outline">Request Demo</Link>
        <Link to="/pricing" className="btn btn-primary">Start Free Trial</Link>
      </nav>
      <button className="menu-toggle" aria-label="Open menu">
        <span></span><span></span><span></span>
      </button>
    </header>
  )
}
