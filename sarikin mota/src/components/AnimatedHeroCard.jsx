import { useState, useRef } from 'react'
import styles from './AnimatedHeroCard.module.css'

export default function AnimatedHeroCard({ imageSrc, title, subtitle }) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 })
  const cardRef = useRef(null)

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    // Max 12 degrees of tilt
    const rotateX = ((y - centerY) / centerY) * -12
    const rotateY = ((x - centerX) / centerX) * 12
    setRotate({ x: rotateX, y: rotateY })
  }

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 })
  }

  return (
    <div className={styles.perspectiveWrap}>
      <div 
        ref={cardRef}
        className={styles.card}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)` }}
      >
        <div className={styles.inner}>
          {/* Image */}
          <div className={styles.imageWrap}>
            <img 
              src={imageSrc} 
              alt={title} 
              className={styles.realPhoto}
              onError={(e) => {
                e.target.style.display = 'none'
                e.target.nextElementSibling.style.display = 'flex'
              }}
            />
            <div className={styles.fallback}>
              <span className={styles.fallbackLetter}>📸</span>
              <span className={styles.fallbackText}>Add your picture at<br/>public/SARKIN-MOTA-PROFILE.JPG</span>
            </div>
          </div>

          {/* Overlay Content */}
          <div className={styles.contentWrap}>
            <div className={styles.badgeWrap}>
              <span className={styles.badge}>👑 Nigeria's #1 Auto Dealer</span>
            </div>
            <div className={styles.textContent}>
              <h3 className={styles.title}>{title}</h3>
              <p className={styles.subtitle}>{subtitle}</p>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className={styles.borderGlow} />
      </div>
    </div>
  )
}
