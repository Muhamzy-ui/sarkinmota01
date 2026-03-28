import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { HiMenu, HiX } from 'react-icons/hi'
import { FiSun, FiMoon, FiHeart, FiShoppingCart } from 'react-icons/fi'
import styles from './Navbar.module.css'
import TextLogo from './TextLogo'
import { useSavedCars } from '../context/SavedCarsContext'
import { useCart } from '../context/CartContext'

const NAV_LINKS = [
  { to: '/cars', label: 'Inventory' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/about', label: 'About' },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const { getSavedCount } = useSavedCars()
  const { getCartCount, setCartOpen } = useCart()
  const savedCount = getSavedCount()
  const cartCount  = getCartCount()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [theme, setTheme] = useState(
    () => localStorage.getItem('sm_theme') || 'dark'
  )
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setOpen(false) }, [pathname])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('sm_theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light')

  return (
    <>
      <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.inner}>

          {/* Logo */}
          <Link to="/" className={styles.logo} style={{ textDecoration: 'none' }}>
            <TextLogo scale={0.7} />
          </Link>

          {/* Desktop Links */}
          <ul className={styles.links}>
            {NAV_LINKS.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `${styles.link} ${isActive ? styles.active : ''}`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className={styles.actions}>
            <Link to="/cars?view=saved" className={styles.cartIcon} title="Saved Cars">
              <FiHeart size={20} />
              {savedCount > 0 && <span className={styles.cartBadge}>{savedCount}</span>}
            </Link>
            <button onClick={() => setCartOpen(true)} className={styles.cartIcon} title="Cart" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <FiShoppingCart size={20} />
              {cartCount > 0 && <span className={styles.cartBadge} style={{ background: '#22c55e' }}>{cartCount}</span>}
            </button>
            <Link to="/request-car" className={`btn btn-outline btn-sm ${styles.btnOutline}`}>
              Request a Car
            </Link>
            <Link to="/cars" className={`btn btn-gold btn-sm`}>
              Browse Cars
            </Link>
          </div>

          {/* Mobile Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginLeft: 'auto' }}>
            <Link to="/cars?view=saved" className={styles.cartIcon} title="Saved Cars">
              <FiHeart size={20} />
              {savedCount > 0 && <span className={styles.cartBadge}>{savedCount}</span>}
            </Link>
            <button onClick={() => setCartOpen(true)} className={styles.cartIcon} title="Cart" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <FiShoppingCart size={20} />
              {cartCount > 0 && <span className={styles.cartBadge} style={{ background: '#22c55e' }}>{cartCount}</span>}
            </button>
            <button 
              onClick={toggleTheme}
              style={{
                background: 'rgba(212,160,23,0.08)', border: '1px solid var(--border)',
                borderRadius: '50%', width: 38, height: 38,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--gold-400)', cursor: 'pointer', transition: 'all 0.3s'
              }}
              aria-label="Toggle Light/Dark Theme"
            >
              {theme === 'light' ? <FiMoon size={18} /> : <FiSun size={18} />}
            </button>
            <button className={styles.menuBtn} onClick={() => setOpen(!open)} aria-label="Toggle menu">
              {open ? <HiX size={24} /> : <HiMenu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`${styles.mobileMenu} ${open ? styles.mobileOpen : ''}`}>
        <ul className={styles.mobileLinks}>
          {NAV_LINKS.map(({ to, label }) => (
            <li key={to}>
              <NavLink to={to} className={styles.mobileLink}>{label}</NavLink>
            </li>
          ))}
        </ul>
        <div className={styles.mobileCtas}>
          <Link to="/request-car" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
            Request a Car
          </Link>
          <Link to="/cars" className="btn btn-gold" style={{ width: '100%', justifyContent: 'center' }}>
            Browse Inventory
          </Link>
        </div>
      </div>
      {open && <div className={styles.backdrop} onClick={() => setOpen(false)} />}
    </>
  )
}