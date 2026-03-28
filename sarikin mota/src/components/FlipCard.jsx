import styles from './FlipCard.module.css'
import TextLogo from './TextLogo'

export default function FlipCard({ frontImage, backText, title }) {
  return (
    <div className={styles.flipContainer}>
      <div className={styles.flipper}>
        {/* Front */}
        <div className={styles.front}>
          <div className={styles.cardContent}>
            <TextLogo scale={1.0} />
            <div className={styles.glow} />
          </div>
        </div>
        
        {/* Back */}
        <div className={styles.back}>
          <div className={styles.backContent}>
            <h3 className={styles.backTitle}>{title}</h3>
            <div className={styles.divider} />
            <p className={styles.backDescription}>{backText}</p>
            <div className={styles.quoteMark}>"My Bratha!"</div>
          </div>
        </div>
      </div>
    </div>
  )
}
