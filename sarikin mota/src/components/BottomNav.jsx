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
      <NavLink to="/cars?view=saved" className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}>
        <div style={{ position: 'relative', display: 'inline-flex' }}>
          <FiHeart size={22} className={styles.icon} />
          {savedCount > 0 && <span className={styles.badge}>{savedCount}</span>}
        </div>
        <span>Saved</span>
      </NavLink>
      <NavLink to="/contact" className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}>
        <FiMessageSquare size={22} className={styles.icon} />
        <span>Contact</span>
      </NavLink>
    </nav>
  )
}
