import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiInstagram, FiTwitter, FiFacebook, FiYoutube } from 'react-icons/fi'
import { SiTiktok } from 'react-icons/si'
import styles from './Footer.module.css'

const INVENTORY = [
  { to: '/cars?category=Tokunbo', label: 'Tokunbo Cars' },
  { to: '/cars?category=Nigerian+Used', label: 'Nigerian Used' },
  { to: '/cars?category=Brand+New', label: 'Brand New' },
  { to: '/cars?badge=Hot+Bid', label: 'Hot Bids' },
  { to: '/cars?badge=Premium', label: 'Premium Selection' },
]
const COMPANY = [
  { to: '/about', label: 'About Sarkin Mota' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/blog', label: 'Blog & Insights' },
  { to: '/request-car', label: 'Request a Car' },
  { to: '/contact', label: 'Contact Us' },
]

const SOCIALS = [
  { href: 'https://instagram.com/sarkinmota_cars', Icon: FiInstagram, label: 'Instagram' },
  { href: 'https://tiktok.com/@alamin_sarkinmota', Icon: SiTiktok, label: 'TikTok' },
  { href: 'https://facebook.com/sarkinmota', Icon: FiFacebook, label: 'Facebook' },
  { href: 'https://twitter.com/sarkinmota', Icon: FiTwitter, label: 'Twitter' },
]

export default function Footer() {
  const footerRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    if (footerRef.current) observer.observe(footerRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <footer ref={footerRef} className={`${styles.footer} ${isVisible ? styles.visible : ''}`}>
      <div className={styles.topBand} />

      <div className="container">
        <div className={styles.grid}>

          {/* Brand */}
          <div className={styles.brand}>
            <Link to="/" className={styles.logoWrap}>
              <div className={styles.logoMark}><span>SM</span></div>
              <div>
                <div className={styles.logoMain}>SARKIN MOTA</div>
                <div className={styles.logoSub}>Autos</div>
              </div>
            </Link>
            <p className={styles.desc}>
              Nigeria's most trusted premium car dealership. Quality vehicles, transparent pricing,
              and nationwide delivery. <em>My Bratha, we dey for you!</em>
            </p>
            <div className={styles.socials}>
              {SOCIALS.map(({ href, Icon, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  className={styles.socialBtn} aria-label={label}>
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Inventory */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Inventory</h4>
            <ul className={styles.colLinks}>
              {INVENTORY.map(({ to, label }) => (
                <li key={to}><Link to={to} className={styles.colLink}>{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Company</h4>
            <ul className={styles.colLinks}>
              {COMPANY.map(({ to, label }) => (
                <li key={to}><Link to={to} className={styles.colLink}>{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Get In Touch</h4>
            <div className={styles.contactItems}>
              <a href="tel:+2348000000000" className={styles.contactItem}>
                <span className={styles.contactLabel}>Phone</span>
                <span className={styles.contactValue}>+234 800 000 0000</span>
              </a>
              <a href="mailto:info@sarkinmota.com" className={styles.contactItem}>
                <span className={styles.contactLabel}>Email</span>
                <span className={styles.contactValue}>info@sarkinmota.com</span>
              </a>
              <div className={styles.contactItem}>
                <span className={styles.contactLabel}>Location</span>
                <span className={styles.contactValue}>Kano & Abuja, Nigeria</span>
              </div>
              <a href="https://wa.me/2348000000000" target="_blank" rel="noopener noreferrer"
                className="btn btn-gold btn-sm" style={{ marginTop: 8 }}>
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className="container">
          <div className={styles.bottomInner}>
            <p className={styles.copy}>
              © {new Date().getFullYear()} Sarkin Mota Autos. All rights reserved.
            </p>
            <p className={styles.credit}>
              Designed & Built by{' '}
              <a href="https://github.com/Muhamzy-ui" target="_blank" rel="noopener noreferrer">
                M.B.O WebDev
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}