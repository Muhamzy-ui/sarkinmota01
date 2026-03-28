import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { FiHome, FiGrid, FiInfo, FiMessageSquare, FiUser, FiMoon, FiSun, FiX, FiShield } from 'react-icons/fi'
import styles from './BottomNav.module.css'
import { useTheme } from '../context/ThemeContext'

export default function BottomNav() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen)

  return (
    <>
      {/* Drawer Overlay */}
      {isDrawerOpen && <div className={styles.drawerOverlay} onClick={toggleDrawer} />}

      {/* Profile/Settings Drawer */}
      <div className={`${styles.profileDrawer} ${isDrawerOpen ? styles.drawerOpen : ''}`}>
        <div className={styles.drawerHandle} />
        
        <div className={styles.profileHeader}>
          <div className={styles.avatar}>M</div>
          <div>
            <h4 className={styles.profileName}>Dr. Aliyu Mohammad</h4>
            <p className={styles.profileRole}>PRINCIPAL DEALER</p>
          </div>
        </div>

        <div className={styles.themeToggle} onClick={toggleTheme}>
          <span>{theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
          <div className={styles.toggleIcon}>
            {theme === 'dark' ? <FiMoon size={20} /> : <FiSun size={20} />}
          </div>
        </div>

        <Link to="/admin" className={styles.adminLink} onClick={toggleDrawer}>
          <FiShield size={18} />
          <span>Access Admin Portal</span>
        </Link>
      </div>

      <nav className={styles.bottomNav}>
        <NavLink to="/" end className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}>
          <FiHome size={22} className={styles.icon} />
          <span>Home</span>
        </NavLink>
        <NavLink to="/cars" className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}>
          <FiGrid size={22} className={styles.icon} />
          <span>Cars</span>
        </NavLink>
        <NavLink to="/about" className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}>
          <FiInfo size={22} className={styles.icon} />
          <span>About</span>
        </NavLink>
        <NavLink to="/contact" className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}>
          <FiMessageSquare size={22} className={styles.icon} />
          <span>Contact</span>
        </NavLink>
        <button className={`${styles.navItem} ${isDrawerOpen ? styles.active : ''}`} onClick={toggleDrawer}>
          <FiUser size={22} className={styles.icon} />
          <span>Profile</span>
        </button>
      </nav>
    </>
  )
}
