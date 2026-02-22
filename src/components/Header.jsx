import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Header.css'

export default function Header() {
  const { user, logout, isAdmin } = useAuth()
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
        {user ? (
          <>
            {isAdmin && <Link to="/admin">Admin</Link>}
            <button onClick={logout} className="btn btn-outline">Log out</button>
          </>
        ) : (
          <>
            <Link to="/login">Log in</Link>
            <Link to="/signup" className="btn btn-primary">Sign up</Link>
          </>
        )}
        <Link to="/#demo" className="btn btn-outline">Request Demo</Link>
        <Link to="/pricing" className="btn btn-primary">Start Free Trial</Link>
      </nav>
      <button className="menu-toggle" aria-label="Open menu">
        <span></span><span></span><span></span>
      </button>
    </header>
  )
}
