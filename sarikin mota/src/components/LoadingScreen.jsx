import { useState, useEffect } from 'react'
import styles from './LoadingScreen.module.css'
import TextLogo from './TextLogo'

export default function LoadingScreen({ onComplete }) {
  const [fade, setFade] = useState(false)

  useEffect(() => {
    // Reveal logo, then fade out
    const timer = setTimeout(() => {
      setFade(true)
      setTimeout(onComplete, 800) // Complete after fade transition
    }, 2200)

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div className={`${styles.overlay} ${fade ? styles.fadeOut : ''}`}>
      <div className={styles.content}>
        <div className={styles.logoWrap}>
          <TextLogo scale={2.5} />
          <div className={styles.shimmer} />
        </div>
        <div className={styles.progressContainer}>
          <div className={styles.progressBar} />
        </div>
        <p className={styles.text}>DRIVEN BY EXCELLENCE</p>
      </div>
    </div>
  )
}
