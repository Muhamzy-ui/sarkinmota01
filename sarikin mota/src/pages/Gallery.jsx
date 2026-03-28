import { useState, useEffect } from 'react'
import { FiX, FiChevronLeft, FiChevronRight, FiMaximize2 } from 'react-icons/fi'
import api from '../services/api'
import { resolveImageUrl } from '../utils/helpers'
import styles from './Gallery.module.css'

// Initial static items as fallback/default
const STATIC_GALLERY = [
  { id: 's1', category: 'cars', image: '/assets/gallery/car1.jpg', caption: 'Mercedes GLE 450 AMG — Freshly Delivered' },
  { id: 's2', category: 'showroom', image: '/assets/gallery/showroom1.jpg', caption: 'Our Kano Showroom' },
  { id: 's3', category: 'dr-aliyu', image: '/assets/tiktok/vid1.jpg', caption: 'Dr. Aliyu during a client consultation' },
  { id: 's4', category: 'cars', image: '/assets/tiktok/vid3.jpg', caption: 'New Tokunbo Arrivals — All inspected' },
  { id: 's5', category: 'dr-aliyu', image: '/assets/tiktok/vid2.jpg', caption: 'SARKINMOTA AUTOS 2.0 — Grand Launch' },
  { id: 's6', category: 'dr-aliyu', image: '/assets/tiktok/vid4.jpg', caption: 'Professional consultation at the Sarkinmota office' },
]

const TABS = [
  { key: 'all', label: 'All Photos' },
  { key: 'dr-aliyu', label: 'Dr. Aliyu' },
  { key: 'cars', label: 'Cars' },
  { key: 'showroom', label: 'Showroom' },
]

export default function Gallery() {
  const [activeTab, setActiveTab] = useState('all')
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const [items, setItems] = useState(STATIC_GALLERY)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await api.get('/gallery/')
        const data = res.data?.results || res.data || []
        if (data.length > 0) {
          // Merge API data with static ones (optional, or just replace)
          setItems([...data, ...STATIC_GALLERY])
        }
      } catch (e) {
        console.error("Gallery fetch failed, using static data", e)
      } finally {
        setLoading(false)
      }
    }
    fetchItems()
  }, [])

  const filtered = activeTab === 'all'
    ? items
    : items.filter(item => item.category === activeTab || item.cat === activeTab)


  const openLightbox = (index) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)
  const prevImage = () => setLightboxIndex(i => (i - 1 + filtered.length) % filtered.length)
  const nextImage = () => setLightboxIndex(i => (i + 1) % filtered.length)

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') prevImage()
    if (e.key === 'ArrowRight') nextImage()
    if (e.key === 'Escape') closeLightbox()
  }

  return (
    <div className={styles.page} onKeyDown={handleKeyDown} tabIndex={-1}>
      {/* Header */}
      <div className="page-hero">
        <div className="container">
          <p className="section-eyebrow">Visual Experience</p>
          <h1 className="section-title">Gallery</h1>
          <p className="section-subtitle">
            A premium visual showcase of Dr. Aliyu, his cars, and the Sarkinmota experience.
          </p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 40, paddingBottom: 120 }}>
        {/* Filter Tabs */}
        <div className={styles.tabs}>
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        {loading && items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--muted)' }}>
            <div className="loader" style={{ margin: '0 auto 20px' }} />
            <p>Loading the experience...</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {filtered.map((item, index) => {
              const imgUrl = resolveImageUrl(item.image || item.url || item.src)
              return (
                <div
                  key={item.id}
                  className={styles.item}
                  onClick={() => openLightbox(index)}
                >
                  <img
                    src={imgUrl}
                    alt={item.caption || 'Gallery Image'}
                    className={styles.image}
                    onError={e => {
                      e.target.style.opacity = '0'
                      e.target.parentElement.style.background = 'linear-gradient(135deg, var(--navy-800), var(--navy-900))'
                    }}
                  />
                  <div className={styles.overlay}>
                    <FiMaximize2 size={22} className={styles.expandIcon} />
                    <p className={styles.caption}>{item.caption}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div className={styles.lightbox} onClick={closeLightbox}>
          <button className={styles.lbClose} onClick={closeLightbox}><FiX size={24} /></button>
          <button className={`${styles.lbNav} ${styles.lbPrev}`} onClick={e => { e.stopPropagation(); prevImage() }}>
            <FiChevronLeft size={28} />
          </button>
          <div className={styles.lbContent} onClick={e => e.stopPropagation()}>
            <img
              src={resolveImageUrl(filtered[lightboxIndex]?.image || filtered[lightboxIndex]?.url || filtered[lightboxIndex]?.src)}
              alt={filtered[lightboxIndex]?.caption}
              className={styles.lbImage}
            />
            <p className={styles.lbCaption}>{filtered[lightboxIndex]?.caption}</p>
            <p className={styles.lbCounter}>{lightboxIndex + 1} / {filtered.length}</p>
          </div>
          <button className={`${styles.lbNav} ${styles.lbNext}`} onClick={e => { e.stopPropagation(); nextImage() }}>
            <FiChevronRight size={28} />
          </button>
        </div>
      )}

    </div>
  )
}
