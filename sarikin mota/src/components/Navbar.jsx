import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useSidebar } from '../context/SidebarContext'
import { useTheme } from '../context/ThemeContext'
import { HiMenu, HiX } from 'react-icons/hi'
import { FiSun, FiMoon, FiHeart, FiShoppingCart, FiArrowRight, FiShield } from 'react-icons/fi'
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
  const { isOpen, toggleSidebar, closeSidebar } = useSidebar()
  const { theme, toggleTheme } = useTheme()
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { closeSidebar() }, [pathname])

  return (
    <>
      <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.inner}>
          {/* Logo */}
          <Link to="/" className={styles.logo} onClick={closeSidebar}>
            <TextLogo scale={0.7} />
          </Link>

          {/* Desktop Links */}
          <ul className={styles.links}>
            {NAV_LINKS.map(({ to, label }) => (
              <li key={to}>
                <NavLink to={to} className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}>
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className={styles.actions}>
            <button onClick={toggleTheme} className="theme-toggle-btn" 
              style={{
                background: 'rgba(212,160,23,0.08)', border: '1px solid var(--border)',
                borderRadius: '50%', width: 38, height: 38,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--gold-400)', cursor: 'pointer'
              }}
            >
              {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>
            <Link to="/request-car" className={`btn btn-outline btn-sm ${styles.btnOutline}`}>Request a Car</Link>
            <Link to="/cars" className="btn btn-gold btn-sm">Browse Cars</Link>
          </div>

          {/* Mobile Actions Container */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: 'auto' }} className="mobile-only-actions">
            <Link to="/cars?view=saved" className={styles.cartIcon}>
              <FiHeart size={20} />
              {savedCount > 0 && <span className={styles.cartBadge}>{savedCount}</span>}
            </Link>
            <button onClick={() => setCartOpen(true)} className={styles.cartIcon} style={{ background:'none', border:'none' }}>
              <FiShoppingCart size={20} />
              {cartCount > 0 && <span className={styles.cartBadge} style={{ background: '#22c55e' }}>{cartCount}</span>}
            </button>
            <button className={styles.menuBtn} onClick={toggleSidebar}>
              {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Premium Mobile Sidebar (Reactbits) */}
      <aside className={`${styles.mobileSidebar} ${isOpen ? styles.mobileOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.avatar}>M</div>
          <div className={styles.profileInfo}>
            <p>Dr. Aliyu Mohammad</p>
            <p>Principal Dealer</p>
          </div>
        </div>

        <ul className={styles.mobileLinks}>
          {NAV_LINKS.map(({ to, label }) => (
            <li key={to}>
              <NavLink to={to} className={styles.mobileLink} onClick={closeSidebar}>
                <span className={styles.linkLabel}>{label}</span>
                <FiArrowRight className={styles.linkIcon} size={20} />
              </NavLink>
            </li>
          ))}
          <li>
            <Link to="/admin" className={styles.mobileLink} onClick={closeSidebar}>
              <span className={styles.linkLabel}>Admin</span>
              <FiShield className={styles.linkIcon} size={20} />
            </Link>
          </li>
        </ul>

        <div className={styles.mobileFooter}>
          <div className={styles.sidebarThemeToggle} onClick={toggleTheme}>
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
          </div>
          <Link to="/request-car" className="btn btn-gold" onClick={closeSidebar} style={{ width: '100%', justifyContent: 'center' }}>
            Request a Car
          </Link>
        </div>
      </aside>

      {isOpen && <div className={styles.backdrop} onClick={closeSidebar} />}
    </>
  )
}