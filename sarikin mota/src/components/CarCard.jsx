import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiMessageCircle, FiShoppingCart, FiHeart, FiEye, FiZap } from 'react-icons/fi'
import { HiOutlineSparkles } from 'react-icons/hi'
import { formatPrice, formatMileage, buildWhatsApp, resolveImageUrl } from '../utils/helpers'
import { useSavedCars } from '../context/SavedCarsContext'
import { useCart } from '../context/CartContext'
import styles from './CarCard.module.css'

const BADGE_MAP = {
  'New':      { cls: 'badgeBlue',  label: 'New Arrival' },
  'Hot Bid':  { cls: 'badgeRed',   label: 'Hot Bid' },
  'Premium':  { cls: 'badgeGold',  label: 'Premium' },
  'Featured': { cls: 'badgeGold',  label: 'Featured' },
}

function getInstallment(price) {
  const p = Number(price)
  const deposit  = Math.round(p * 0.6)
  const remaining = Math.round(p * 0.4)
  const monthly  = Math.round(remaining / 6)
  return { deposit, remaining, monthly }
}

export default function CarCard({ car, variant = 'grid' }) {
  const { isSaved, toggleSavedCar } = useSavedCars()
  const { addToCart, isInCart }     = useCart()
  const [showPlan, setShowPlan]     = useState(false)

  const isLiked    = isSaved(car.id)
  const inCart     = isInCart(car.id)

  const { title, slug, brand, category, price, mileage, year,
          transmission, engine_size, status, badge, whatsapp_link, images } = car

  const isSold    = status === 'Sold'
  const badgeMeta = BADGE_MAP[badge]
  const primaryImg = resolveImageUrl(car.primary_image || images?.find(i => i.is_primary)?.image || images?.find(i => i.is_primary)?.url || images?.[0]?.image || images?.[0]?.url)
  const plan      = getInstallment(price)
  const waLink    = buildWhatsApp(
    whatsapp_link?.replace('https://wa.me/', '') || '2348000000000', title
  )

  // Cart button → triggers full CartDrawer checkout flow
  const handleCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(car)
  }

  return (
    <div className={`${styles.card} ${isSold ? styles.sold : ''} ${variant === 'home' ? styles.home : ''}`}>

      {/* Image */}
      <div className={styles.imageWrap}>
        {primaryImg ? (
          <img src={primaryImg} alt={title} className={styles.image}/>
        ) : (
          <div className={styles.placeholder}>
            <svg viewBox="0 0 280 140" className={styles.carSvg}>
              <defs>
                <linearGradient id={`bg${car.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#9e6b00" stopOpacity="0.45"/>
                  <stop offset="100%" stopColor="#c28500" stopOpacity="0.15"/>
                </linearGradient>
                <linearGradient id={`win${car.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#2a5298" stopOpacity="0.9"/>
                  <stop offset="100%" stopColor="#070f1f" stopOpacity="0.6"/>
                </linearGradient>
                <filter id={`glow${car.id}`}>
                  <feGaussianBlur stdDeviation="3" result="blur"/>
                  <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
              </defs>
              {/* Body */}
              <path d="M30 95 L54 57 Q80 40 106 39 L174 39 Q200 40 226 57 L250 95 L258 104 L258 116 L22 116 L22 104Z"
                fill={`url(#bg${car.id})`} stroke="rgba(212,160,23,0.65)" strokeWidth="1.5"/>
              {/* Roof */}
              <path d="M95 62 L116 42 L164 42 L185 62Z"
                fill={`url(#win${car.id})`} stroke="rgba(212,160,23,0.3)" strokeWidth="1"/>
              {/* Window panes */}
              <path d="M101 62 L118 45 L148 45 L148 62Z" fill="rgba(26,56,120,0.65)" stroke="rgba(212,160,23,0.2)" strokeWidth="0.7"/>
              <path d="M153 62 L153 45 L180 45 L192 62Z" fill="rgba(26,56,120,0.65)" stroke="rgba(212,160,23,0.2)" strokeWidth="0.7"/>
              {/* Wheels */}
              <circle cx="80"  cy="116" r="22" fill="#070f1f" stroke="rgba(212,160,23,0.75)" strokeWidth="2.5"/>
              <circle cx="80"  cy="116" r="13" fill="rgba(212,160,23,0.12)" stroke="rgba(212,160,23,0.55)" strokeWidth="2"/>
              <circle cx="80"  cy="116" r="5"  fill="rgba(212,160,23,0.85)" filter={`url(#glow${car.id})`}/>
              <circle cx="200" cy="116" r="22" fill="#070f1f" stroke="rgba(212,160,23,0.75)" strokeWidth="2.5"/>
              <circle cx="200" cy="116" r="13" fill="rgba(212,160,23,0.12)" stroke="rgba(212,160,23,0.55)" strokeWidth="2"/>
              <circle cx="200" cy="116" r="5"  fill="rgba(212,160,23,0.85)" filter={`url(#glow${car.id})`}/>
              {/* Front headlight */}
              <path d="M244 78 L257 84 L257 97 L244 97Z" fill="rgba(212,160,23,0.65)" stroke="rgba(212,160,23,0.9)" strokeWidth="1"/>
              {/* Rear light */}
              <path d="M36 78 L23 84 L23 97 L36 97Z" fill="rgba(220,60,60,0.45)" stroke="rgba(220,80,80,0.6)" strokeWidth="1"/>
              {/* Door line */}
              <line x1="140" y1="62" x2="140" y2="107" stroke="rgba(212,160,23,0.2)" strokeWidth="0.8"/>
              {/* Ground shadow */}
              <ellipse cx="140" cy="130" rx="110" ry="7" fill="rgba(0,0,0,0.4)"/>
            </svg>
            <p className={styles.placeholderLabel}>{brand?.name}</p>
          </div>
        )}

        {/* Badges */}
        <div className={styles.topBadges}>
          {badgeMeta && !isSold && (
            <span className={`${styles.badge} ${styles[badgeMeta.cls]}`}>
              <HiOutlineSparkles size={9}/> {badgeMeta.label}
            </span>
          )}
          {isSold && <span className={`${styles.badge} ${styles.badgeSold}`}>Sold Out</span>}
        </div>

        <span className={styles.catPill}>{category}</span>

        <button className={`${styles.wishBtn} ${isLiked ? styles.liked : ''}`}
          onClick={e => { e.preventDefault(); toggleSavedCar(car) }}>
          <FiHeart size={14} fill={isLiked ? 'currentColor' : 'none'}/>
        </button>

        {!isSold && (
          <div className={styles.hoverOverlay}>
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = `/cars/${slug}`;
              }} 
              className={styles.quickBtn}
              style={{ cursor: 'pointer' }}
            >
              <FiEye size={14}/> Quick View
            </button>
            <a href={waLink} target="_blank" rel="noopener noreferrer" className={styles.quickBtn}>
              <FiMessageCircle size={14}/> WhatsApp
            </a>
          </div>
        )}
      </div>

      {/* Body */}
      <div className={styles.body}>
        <div className={styles.metaRow}>
          <span className={styles.brandTag}>{brand?.name}</span>
          <span className={styles.yearTag}>{year}</span>
        </div>

        <h3 className={styles.title}>
          <button 
            onClick={() => window.location.href = `/cars/${slug}`}
            className={styles.titleBtn}
            style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer', display: 'block', width: '100%', font: 'inherit', color: 'inherit' }}
          >
            {title}
          </button>
        </h3>

        <div className={styles.specs}>
          <span>{engine_size}</span><span className={styles.dot}/>
          <span>{transmission}</span><span className={styles.dot}/>
          <span>{formatMileage(mileage)}</span>
        </div>

        {/* Installment teaser */}
        {!isSold && (
          <button className={styles.installBtn}
            onClick={e => { e.preventDefault(); setShowPlan(p => !p) }}>
            <FiZap size={11}/>
            <span>Pay 60% now · {formatPrice(plan.monthly)}/mo × 6</span>
            <span className={styles.arrow}>{showPlan ? '▲' : '▼'}</span>
          </button>
        )}

        {showPlan && !isSold && (
          <div className={styles.planBox}>
            <div className={styles.planRow}>
              <span>Deposit (60%)</span>
              <strong>{formatPrice(plan.deposit)}</strong>
            </div>
            <div className={styles.planRow}>
              <span>Balance (40%)</span>
              <strong>{formatPrice(plan.remaining)}</strong>
            </div>
            <div className={`${styles.planRow} ${styles.planHL}`}>
              <span>Monthly × 6</span>
              <strong>{formatPrice(plan.monthly)}</strong>
            </div>
            <p className={styles.planNote}>* Subject to approval. T&Cs apply.</p>
          </div>
        )}

        {/* Footer */}
        <div className={styles.footer}>
          <div>
            <p className={styles.priceLabel}>Asking Price</p>
            <p className={styles.price}>{formatPrice(price)}</p>
          </div>
          {!isSold ? (
            <div className={styles.actions}>
              <button
                className={`${styles.cartBtn} ${inCart ? styles.cartDone : ''}`}
                onClick={handleCart} title={inCart ? 'Already in cart' : 'Add to cart'}>
                {inCart ? '✓' : <FiShoppingCart size={15}/>}
              </button>
              <a href={waLink} target="_blank" rel="noopener noreferrer"
                className={styles.inquireBtn}>
                <FiMessageCircle size={13}/> Inquire
              </a>
            </div>
          ) : (
            <span className={styles.soldTag}>Sold</span>
          )}
        </div>
      </div>
    </div>
  )
}