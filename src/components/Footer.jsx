import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <Link to="/" className="logo">◆ Revenue Engine AI</Link>
          <p>Turn your data into a revenue advantage.</p>
        </div>
        <div className="footer-links">
          <div>
            <h4>Product</h4>
            <Link to="/pricing">Pricing</Link>
            <Link to="/case-studies">Case Studies</Link>
            <Link to="/api-docs">API Docs</Link>
            <a href="/#features">Features</a>
          </div>
          <div>
            <h4>Developers</h4>
            <Link to="/marketplace">App Marketplace</Link>
            <Link to="/marketplace/build">Build an App</Link>
          </div>
          <div>
            <h4>Company</h4>
            <Link to="/contact">Contact</Link>
            <a href="#">About</a>
            <a href="#">Blog</a>
            <a href="#">Careers</a>
          </div>
          <div>
            <h4>Legal</h4>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Revenue Engine AI. All rights reserved.</p>
      </div>
    </footer>
  )
}
