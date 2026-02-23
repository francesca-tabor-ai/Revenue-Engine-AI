import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Header.css'

export default function Header() {
  const { user, logout, isAdmin } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <header className="header">
      <Link to="/" className="logo">
        <span className="logo-icon">◆</span>
        Revenue Engine AI
      </Link>
      <nav className={`nav ${menuOpen ? 'nav-open' : ''}`}>
        <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
        <Link to="/pricing" onClick={() => setMenuOpen(false)}>Pricing</Link>
        <Link to="/case-studies" onClick={() => setMenuOpen(false)}>Case Studies</Link>
        <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
        {user ? (
          <>
            {isAdmin ? <Link to="/admin" onClick={() => setMenuOpen(false)}>Admin</Link> : <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>}
            <button onClick={() => { logout(); setMenuOpen(false); }} className="btn btn-outline">Log out</button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={() => setMenuOpen(false)}>Log in</Link>
            <Link to="/signup" className="btn btn-primary" onClick={() => setMenuOpen(false)}>Sign up</Link>
          </>
        )}
        <Link to="/#demo" className="btn btn-outline" onClick={() => setMenuOpen(false)}>Request Demo</Link>
      </nav>
      <button className="menu-toggle" aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => setMenuOpen((o) => !o)} aria-expanded={menuOpen}>
        <span></span><span></span><span></span>
      </button>
    </header>
  )
}
