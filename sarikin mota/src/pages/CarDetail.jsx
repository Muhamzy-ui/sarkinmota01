import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { FiMessageCircle, FiArrowLeft, FiCheck, FiX, FiMaximize } from 'react-icons/fi'
import { HiOutlineSparkles } from 'react-icons/hi'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay, Keyboard } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import { getCarDetail, submitBid, getCars } from '../services/api'
import { formatPrice, formatMileage, resolveImageUrl } from '../utils/helpers'
import CarCard from '../components/CarCard'

export function CarDetail() {
  const { slug } = useParams()
  const navigate  = useNavigate()
  const [car, setCar]           = useState(null)
  const [related, setRelated]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [showBidModal, setShowBidModal] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(null)

  useEffect(() => {
    setLoading(true)
    getCarDetail(slug)
      .then(res => {
        setCar(res.data)
        return getCars({ brand: res.data.brand?.name })
      })
      .then(res => {
        const all = res.data?.results || res.data || []
        setRelated(all.filter(c => c.slug !== slug).slice(0, 3))
      })
      .catch(() => navigate('/cars', { replace: true }))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return (
    <div style={{minHeight:'100vh',paddingTop:160,textAlign:'center',color:'var(--muted)'}}>
      <div style={{fontSize:48,marginBottom:16}}>🚗</div>
      <p>Loading vehicle details...</p>
    </div>
  )

  if (!car) return null

  const images = car.images?.length
    ? car.images.map(i => resolveImageUrl(i.image))
    : [null]

  const waLink = car.whatsapp_link || `https://wa.me/2348000000000?text=${encodeURIComponent(`Hello! I am interested in the ${car.title}. Please share more details.`)}`

  const SPECS = [
    { label: 'Brand',        value: car.brand?.name },
    { label: 'Year',         value: car.year },
    { label: 'Category',     value: car.category },
    { label: 'Transmission', value: car.transmission },
    { label: 'Engine',       value: car.engine_size || '—' },
    { label: 'Mileage',      value: formatMileage(car.mileage) },
    { label: 'Status',       value: car.status },
    { label: 'Colour',       value: car.color || 'As Shown' },
  ]

  return (
    <div style={{minHeight:'100vh', paddingTop: 80}}>
      <div className="container" style={{padding:'40px clamp(20px,4vw,60px)'}}>
        <Link to="/cars" style={{display:'inline-flex',alignItems:'center',gap:8,
          color:'var(--muted)',textDecoration:'none',fontSize:14,marginBottom:32,
          fontFamily:'var(--font-body)',fontWeight:500,transition:'color .2s'}}
          onMouseEnter={e=>e.target.style.color='var(--gold-300)'}
          onMouseLeave={e=>e.target.style.color='var(--muted)'}>
          <FiArrowLeft /> Back to Inventory
        </Link>

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))',gap:60,alignItems:'start'}}>

          {/* Left — Gallery using Swiper */}
          <div style={{maxWidth: '100%', overflow: 'hidden'}}>
            <div style={{background:'var(--navy-800)',border:'1px solid var(--border)',
              borderRadius:'var(--radius-xl)',overflow:'hidden',marginBottom:16,
              height:400, position:'relative'}}>
              {images[0] ? (
                <Swiper
                  modules={[Navigation, Pagination, Autoplay]}
                  navigation
                  pagination={{ clickable: true }}
                  autoplay={{ delay: 3500, disableOnInteraction: false }}
                  loop={images.length > 1}
                  style={{ width: '100%', height: '100%', '--swiper-theme-color': '#D4A017' }}
                >
                  {images.map((img, i) => (
                    <SwiperSlide key={i} onClick={() => setLightboxIndex(i)} style={{ cursor: 'zoom-in' }}>
                      <img src={img} alt={`${car.title} - view ${i + 1}`} style={{width:'100%',height:'100%',objectFit:'contain', background: 'var(--navy-900)'}} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <div style={{width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center'}}>
                   <svg viewBox="0 0 480 240" style={{width:'80%',maxWidth:380}}>
                    <path d="M60 155 L97 97 Q135 72 170 70 L310 70 Q345 72 383 97 L420 155 L432 168 L432 186 L48 186 L48 168 Z"
                      fill="rgba(212,160,23,0.12)" stroke="rgba(212,160,23,0.5)" strokeWidth="2"/>
                    <circle cx="148" cy="186" r="34" fill="rgba(7,15,31,0.9)" stroke="rgba(212,160,23,0.6)" strokeWidth="2.5"/>
                    <circle cx="148" cy="186" r="20" fill="rgba(212,160,23,0.15)" stroke="rgba(212,160,23,0.5)" strokeWidth="2"/>
                    <circle cx="332" cy="186" r="34" fill="rgba(7,15,31,0.9)" stroke="rgba(212,160,23,0.6)" strokeWidth="2.5"/>
                    <circle cx="332" cy="186" r="20" fill="rgba(212,160,23,0.15)" stroke="rgba(212,160,23,0.5)" strokeWidth="2"/>
                    <path d="M160 102 L188 75 L292 75 L320 102 Z" fill="rgba(21,45,96,0.8)" stroke="rgba(212,160,23,0.3)" strokeWidth="1"/>
                  </svg>
                </div>
              )}
              {car.badge && (
                <div style={{position:'absolute',top:20,left:20, zIndex:10}}>
                  <span className="badge badge-gold"><HiOutlineSparkles size={10}/> {car.badge}</span>
                </div>
              )}
              <div style={{position:'absolute',top:20,right:20, zIndex:10, pointerEvents:'none'}}>
                 <div style={{background: 'rgba(7, 15, 31, 0.7)', borderRadius: '50%', padding: '8px', color: 'var(--white)'}}>
                    <FiMaximize size={18} />
                 </div>
              </div>
            </div>
          </div>

          {/* Right — Info */}
          <div style={{position:'sticky',top:100}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',color:'var(--gold-500)',fontFamily:'var(--font-body)'}}>{car.brand?.name}</span>
              <span style={{fontSize:12,color:'var(--muted)',fontWeight:300}}>{car.year}</span>
            </div>
            <h1 style={{fontFamily:'var(--font-display)',fontSize:'clamp(28px,3vw,40px)',fontWeight:900,color:'var(--white)',lineHeight:1.1,marginBottom:20}}>
              {car.title}
            </h1>
            <span className={`badge ${car.status==='Available'?'badge-blue':'badge-sold'}`} style={{marginBottom:24,display:'inline-flex'}}>
              {car.status}
            </span>

            <div style={{background:'var(--navy-800)',border:'1px solid var(--border-strong)',borderRadius:'var(--radius-lg)',padding:24,marginBottom:24}}>
              <p style={{fontSize:11,fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',color:'var(--muted-dark)',marginBottom:6}}>Asking Price</p>
              <p style={{fontFamily:'var(--font-heading)',fontSize:40,fontWeight:600,color:'var(--gold-300)',lineHeight:1}}>
                {formatPrice(car.price)}
              </p>
            </div>

            {car.status === 'Available' && (
              <div style={{display:'flex',flexDirection:'column',gap:12,marginBottom:28}}>
                <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn btn-gold" style={{justifyContent:'center'}}>
                  <FiMessageCircle size={16}/> Inquire on WhatsApp
                </a>
                <button onClick={()=>setShowBidModal(true)} className="btn btn-outline" style={{justifyContent:'center'}}>
                  Place a Bid
                </button>
              </div>
            )}

            {/* Key Specs */}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:1,border:'1px solid var(--border)',borderRadius:'var(--radius-md)',overflow:'hidden',marginBottom:24}}>
              {SPECS.map(({label,value}) => (
                <div key={label} style={{background:'var(--navy-800)',padding:'14px 16px',borderBottom:'1px solid var(--border)'}}>
                  <p style={{fontSize:10,fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',color:'var(--muted-dark)',marginBottom:4}}>{label}</p>
                  <p style={{fontSize:14,color:'var(--off-white)',fontWeight:400}}>{value}</p>
                </div>
              ))}
            </div>

            {/* Features */}
            {car.features?.length > 0 && (
              <div style={{background:'var(--navy-800)',border:'1px solid var(--border)',borderRadius:'var(--radius-md)',padding:20}}>
                <p style={{fontSize:11,fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',color:'var(--gold-400)',marginBottom:14}}>Features</p>
                <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
                  {car.features.map(f => (
                    <span key={f} style={{display:'flex',alignItems:'center',gap:6,fontSize:12,color:'var(--muted)',background:'rgba(212,160,23,0.06)',border:'1px solid var(--border)',borderRadius:2,padding:'4px 10px'}}>
                      <FiCheck size={11} color="var(--gold-400)"/> {f}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {car.description && (
          <div style={{marginTop:60,background:'var(--navy-800)',border:'1px solid var(--border)',borderRadius:'var(--radius-xl)',padding:'clamp(28px,4vw,48px)'}}>
            <h2 style={{fontFamily:'var(--font-display)',fontSize:28,color:'var(--white)',marginBottom:16}}>About This Vehicle</h2>
            <p style={{fontSize:16,color:'var(--muted)',fontWeight:300,lineHeight:1.8}}>{car.description}</p>
          </div>
        )}

        {/* Related Cars */}
        {related.length > 0 && (
          <div style={{marginTop:80}}>
            <p className="section-eyebrow">More from this Brand</p>
            <h2 className="section-title" style={{marginBottom:36}}>You May Also Like</h2>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:24}}>
              {related.map(c => <CarCard key={c.id} car={c} />)}
            </div>
          </div>
        )}
      </div>

      {/* Bid Modal */}
      {showBidModal && <BidModal car={car} onClose={()=>setShowBidModal(false)} />}
      
      {/* Lightbox Modal */}
      {lightboxIndex !== null && images[0] && (
        <div 
          style={{
            position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0, 0, 0, 0.95)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >
          <button 
            onClick={() => setLightboxIndex(null)}
            style={{ position: 'absolute', top: 30, right: 30, zIndex: 10000, background: 'rgba(255, 255, 255, 0.1)', border: 'none', color: '#fff', borderRadius: '50%', width: 50, height: 50, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <FiX size={28}/>
          </button>
          <Swiper
            modules={[Navigation, Keyboard]}
            navigation
            keyboard={{ enabled: true }}
            initialSlide={lightboxIndex}
            style={{ width: '100%', height: '100%', '--swiper-theme-color': '#D4A017', '--swiper-navigation-size': '32px' }}
          >
            {images.map((img, i) => (
              <SwiperSlide key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 40px' }}>
                <img src={img} alt={`${car.title} - zoom ${i + 1}`} style={{maxWidth:'100%',maxHeight:'90vh',objectFit:'contain'}} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  )
}

function BidModal({car, onClose}) {
  const [form, setForm]         = useState({name:'',phone:'',email:'',amount:'',message:''})
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const set = (k,v) => setForm(p=>({...p,[k]:v}))

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      await submitBid({
        car: car.id,
        bidder_name:  form.name,
        bidder_phone: form.phone,
        bidder_email: form.email,
        amount:       form.amount,
        message:      form.message,
      })
      setSubmitted(true)
    } catch (err) {
      setError('Failed to submit bid. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="overlay-dark" style={{display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
      <div style={{background:'var(--navy-800)',border:'1px solid var(--border-strong)',borderRadius:'var(--radius-xl)',
        width:'100%',maxWidth:520,padding:'clamp(28px,4vw,48px)',position:'relative',maxHeight:'90vh',overflowY:'auto'}}>
        <button onClick={onClose} style={{position:'absolute',top:20,right:20,background:'none',border:'none',color:'var(--muted)',cursor:'pointer'}}>
          <FiX size={22}/>
        </button>
        {submitted ? (
          <div style={{textAlign:'center',padding:'40px 0'}}>
            <div style={{fontSize:56,marginBottom:16}}>✅</div>
            <h3 style={{fontFamily:'var(--font-display)',fontSize:28,color:'var(--white)',marginBottom:12}}>Bid Submitted!</h3>
            <p style={{color:'var(--muted)',fontWeight:300}}>We will review your bid and contact you within 24 hours.</p>
            <button onClick={onClose} className="btn btn-gold" style={{marginTop:24}}>Close</button>
          </div>
        ) : (
          <>
            <h3 style={{fontFamily:'var(--font-display)',fontSize:26,color:'var(--white)',marginBottom:6}}>Place a Bid</h3>
            <p style={{fontSize:14,color:'var(--muted)',fontWeight:300,marginBottom:28}}>{car.title}</p>
            {error && <p style={{color:'#f87171',fontSize:13,marginBottom:16}}>{error}</p>}
            <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:16}}>
              <div className="form-group" style={{marginBottom:0}}>
                <label className="form-label">Full Name</label>
                <input className="form-input" value={form.name} onChange={e=>set('name',e.target.value)} placeholder="Your full name" required/>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
                <div>
                  <label className="form-label">Phone</label>
                  <input className="form-input" value={form.phone} onChange={e=>set('phone',e.target.value)} placeholder="+234..." required/>
                </div>
                <div>
                  <label className="form-label">Email</label>
                  <input className="form-input" type="email" value={form.email} onChange={e=>set('email',e.target.value)} placeholder="you@email.com" required/>
                </div>
              </div>
              <div>
                <label className="form-label">Your Bid Amount (₦)</label>
                <input className="form-input" type="number" value={form.amount} onChange={e=>set('amount',e.target.value)} placeholder={`Listed at ${formatPrice(car.price)}`} required/>
              </div>
              <div>
                <label className="form-label">Message (Optional)</label>
                <textarea className="form-textarea" value={form.message} onChange={e=>set('message',e.target.value)} placeholder="Any additional notes..." style={{minHeight:80}}/>
              </div>
              <button type="submit" disabled={loading} className="btn btn-gold" style={{justifyContent:'center',marginTop:8,opacity:loading?0.7:1}}>
                {loading ? 'Submitting...' : 'Submit Bid'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default CarDetail