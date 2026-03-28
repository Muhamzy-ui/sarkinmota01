import { NavLink } from 'react-router-dom'
import { FiHome, FiGrid, FiMessageSquare, FiInfo, FiHeart } from 'react-icons/fi'
import styles from './BottomNav.module.css'
import { useSavedCars } from '../context/SavedCarsContext'

export default function BottomNav() {
  const { getSavedCount } = useSavedCars()
  const savedCount = getSavedCount()

  return (
    <nav className={styles.bottomNav}>
      <NavLink to="/" end className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}>
        <FiHome size={22} className={styles.icon} />
        <span>Home</span>
      </NavLink>
      <NavLink to="/cars" className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}>
        <FiGrid size={22} className={styles.icon} />
        <span>Inventory</span>
      </NavLink>
      <NavLink to="/about" className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}>
        <FiInfo size={22} className={styles.icon} />
        <span>About</span>
      </NavLink>
      <NavLink to="/contact" className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}>
        <FiMessageSquare size={22} className={styles.icon} />
        <span>Contact</span>
      </NavLink>
    </nav>
  )
}
