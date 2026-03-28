import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiX, FiShoppingCart, FiTrash2, FiChevronRight, FiCheck } from 'react-icons/fi'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/helpers'
import styles from './CartDrawer.module.css'

const STEPS = ['Cart', 'Details', 'Confirm']

export default function CartDrawer() {
  const { cartItems, cartOpen, setCartOpen, removeFromCart, clearCart, getCartTotal, getCartCount } = useCart()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({ name: '', phone: '', city: '', notes: '' })
  const [submitted, setSubmitted] = useState(false)

  if (!cartOpen) return null

  const total = getCartTotal()

  const handleSubmit = (e) => {
    e.preventDefault()
    // Build WhatsApp message
    const itemList = cartItems.map(c => `• ${c.brand?.name || ''} ${c.title} — ${formatPrice(c.price)}`).join('\n')
    const msg = encodeURIComponent(
      `*SARKIN MOTA ORDER REQUEST*\n\n`+
      `*Name:* ${form.name}\n`+
      `*Phone:* ${form.phone}\n`+
      `*City:* ${form.city}\n\n`+
      `*Vehicles Interested In:*\n${itemList}\n\n`+
      `*Total:* ${formatPrice(total)}\n\n`+
      `*Notes:* ${form.notes || 'None'}`
    )
    window.open(`https://wa.me/2348000000000?text=${msg}`, '_blank')
    setSubmitted(true)
    clearCart()
    setTimeout(() => { setSubmitted(false); setStep(0); setCartOpen(false) }, 4000)
  }

  return (
    <>
      {/* Backdrop */}
      <div className={styles.backdrop} onClick={() => setCartOpen(false)} />

      {/* Drawer */}
      <div className={styles.drawer}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.title}>
            <FiShoppingCart size={20} />
            <span>My Cart <em>({getCartCount()})</em></span>
          </div>
          <button className={styles.closeBtn} onClick={() => setCartOpen(false)}>
            <FiX size={22} />
          </button>
        </div>

        {/* Steps */}
        <div className={styles.steps}>
          {STEPS.map((s, i) => (
            <div key={s} className={`${styles.step} ${i <= step ? styles.stepActive : ''}`}>
              <div className={styles.stepDot}>{i < step ? <FiCheck size={10} /> : i + 1}</div>
              <span>{s}</span>
              {i < STEPS.length - 1 && <div className={styles.stepLine} />}
            </div>
          ))}
        </div>

        {/* Step 0: Cart Items */}
        {step === 0 && (
          <div className={styles.content}>
            {submitted ? (
              <div className={styles.success}>
                <div className={styles.successIcon}>🎉</div>
                <h3>Request Sent!</h3>
                <p>Our team will contact you on WhatsApp shortly. My Bratha, we dey for you!</p>
              </div>
            ) : cartItems.length === 0 ? (
              <div className={styles.empty}>
                <FiShoppingCart size={48} />
                <p>Your cart is empty</p>
                <Link to="/cars" onClick={() => setCartOpen(false)} className="btn btn-gold">Browse Inventory</Link>
              </div>
            ) : (
              <>
                <div className={styles.items}>
                  {cartItems.map(car => (
                    <div key={car.id} className={styles.item}>
                      <div className={styles.itemImg}>
                        {car.primary_image ? (
                          <img src={car.primary_image} alt={car.title} />
                        ) : (
                          <div className={styles.imgPlaceholder}>🚗</div>
                        )}
                      </div>
                      <div className={styles.itemInfo}>
                        <p className={styles.itemBrand}>{car.brand?.name || car.brand_name}</p>
                        <p className={styles.itemTitle}>{car.title}</p>
                        <p className={styles.itemPrice}>{formatPrice(car.price)}</p>
                      </div>
                      <button className={styles.removeBtn} onClick={() => removeFromCart(car.id)}>
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className={styles.total}>
                  <span>Total Estimate</span>
                  <strong>{formatPrice(total)}</strong>
                </div>

                <button className="btn btn-gold" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setStep(1)}>
                  Continue <FiChevronRight size={16} />
                </button>
              </>
            )}
          </div>
        )}

        {/* Step 1: Contact Details */}
        {step === 1 && (
          <div className={styles.content}>
            <h3 className={styles.formTitle}>Your Details</h3>
            <p className={styles.formSubtitle}>We'll reach out to confirm your order.</p>
            <form className={styles.form} onSubmit={e => { e.preventDefault(); setStep(2) }}>
              <input required placeholder="Full Name" value={form.name}
                onChange={e => setForm(p => ({...p, name: e.target.value}))}
                className="form-input" />
              <input required placeholder="WhatsApp Number" type="tel" value={form.phone}
                onChange={e => setForm(p => ({...p, phone: e.target.value}))}
                className="form-input" />
              <input required placeholder="City" value={form.city}
                onChange={e => setForm(p => ({...p, city: e.target.value}))}
                className="form-input" />
              <textarea placeholder="Any special notes? (optional)" value={form.notes}
                onChange={e => setForm(p => ({...p, notes: e.target.value}))}
                className="form-input" rows={3} style={{ resize: 'vertical' }} />
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button type="button" className="btn btn-outline" onClick={() => setStep(0)} style={{ flex: 1, justifyContent: 'center' }}>
                  Back
                </button>
                <button type="submit" className="btn btn-gold" style={{ flex: 2, justifyContent: 'center' }}>
                  Review Order <FiChevronRight size={16} />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 2: Confirm */}
        {step === 2 && (
          <div className={styles.content}>
            <h3 className={styles.formTitle}>Confirm Order</h3>
            <div className={styles.confirmBox}>
              <p><strong>Name:</strong> {form.name}</p>
              <p><strong>Phone:</strong> {form.phone}</p>
              <p><strong>City:</strong> {form.city}</p>
              {form.notes && <p><strong>Notes:</strong> {form.notes}</p>}
              <div className={styles.divider} />
              {cartItems.map(c => (
                <p key={c.id} className={styles.confirmItem}>• {c.brand?.name} {c.title} — <strong>{formatPrice(c.price)}</strong></p>
              ))}
              <div className={styles.divider} />
              <p className={styles.confirmTotal}>Total: <strong>{formatPrice(total)}</strong></p>
            </div>
            <p className={styles.waNote}>📱 Clicking below will open WhatsApp with your order details pre-filled.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-outline" onClick={() => setStep(1)} style={{ flex: 1, justifyContent: 'center' }}>Back</button>
              <button className="btn btn-gold" onClick={handleSubmit} style={{ flex: 2, justifyContent: 'center' }}>
                Send via WhatsApp
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
