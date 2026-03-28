import { NavLink } from 'react-router-dom'
import { FiHome, FiGrid, FiInfo, FiMessageSquare, FiUser } from 'react-icons/fi'
import styles from './BottomNav.module.css'
import { useSidebar } from '../context/SidebarContext'

export default function BottomNav() {
  const { toggleSidebar, isOpen } = useSidebar()

  return (
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
      <button className={`${styles.navItem} ${isOpen ? styles.active : ''}`} onClick={toggleSidebar}>
        <FiUser size={22} className={styles.icon} />
        <span>Profile</span>
      </button>
    </nav>
  )
}
