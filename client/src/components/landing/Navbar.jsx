import { Link } from 'react-router-dom'
import { brand } from '../../config/brand'
import { IconGlobe, IconArrowRightCircle } from '../icons/Icon'
import Logo from '../icons/Logo'
import './landing.css'

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="container">
        <nav className="navbar__pill glass-border">
          <Link to="/" className="navbar__brand">
            <span className="navbar__logo">
              <Logo size={20} />
            </span>
            {brand.name}
          </Link>
          <div className="navbar__actions">
            <button className="pill-btn pill-btn--ghost">
              <IconGlobe size={15} />
              EN
            </button>
            <Link to="/login" className="pill-btn pill-btn--primary">
              <IconArrowRightCircle size={15} />
              Sign in
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}
