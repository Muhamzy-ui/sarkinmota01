import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { formatPrice, resolveImageUrl } from '../../utils/helpers'
import api, { getCars, getCarStats, getCarBrands, createCar, updateCar, deleteCar } from '../../services/api'
import {
  FiLogOut, FiPlus, FiEdit2, FiTrash2, FiUpload, FiX, FiCheck, FiRefreshCw
} from 'react-icons/fi'

/* ─────────────── ADMIN LAYOUT ─────────────── */
function AdminLayout({ children, title }) {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const NAV = [
    { to:'/admin',         label:'Dashboard',   icon:'📊' },
    { to:'/admin/cars',    label:'Manage Cars', icon:'🚗' },
    { to:'/admin/bids',    label:'Bids',        icon:'💬' },
    { to:'/admin/posts',   label:'Blog Posts',  icon:'📝' },
    { to:'/admin/gallery', label:'Gallery',     icon:'🖼️' },
  ]
  return (
    <div style={{display:'flex',minHeight:'100vh',background:'var(--navy-950)'}}>
      <aside style={{
        width:240,flexShrink:0,background:'var(--navy-900)',
        borderRight:'1px solid var(--border)',
        display:'flex',flexDirection:'column',
        position:'sticky',top:0,height:'100vh',
      }}>
        <div style={{padding:'24px 20px',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',gap:12}}>
          <div style={{width:38,height:38,borderRadius:6,flexShrink:0,
            background:'linear-gradient(135deg,var(--gold-600),var(--gold-400))',
            display:'flex',alignItems:'center',justifyContent:'center',
            fontFamily:'var(--font-display)',fontSize:14,fontWeight:900,color:'var(--navy-950)'}}>SM</div>
          <div>
            <p style={{fontSize:11,fontWeight:700,letterSpacing:'2px',color:'var(--white)'}}>SARKIN MOTA</p>
            <p style={{fontSize:10,color:'var(--gold-400)',letterSpacing:'1px'}}>Admin Panel</p>
          </div>
        </div>
        <nav style={{flex:1,padding:'16px 12px'}}>
          {NAV.map(({to,label,icon})=>(
            <Link key={to} to={to} style={{
              display:'flex',alignItems:'center',gap:12,padding:'11px 14px',
              borderRadius:8,marginBottom:4,textDecoration:'none',fontSize:14,
              color:'var(--muted)',fontFamily:'var(--font-body)',transition:'all .2s',
            }}
            onMouseEnter={e=>{e.currentTarget.style.background='var(--navy-800)';e.currentTarget.style.color='var(--off-white)'}}
            onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color='var(--muted)'}}>
              <span style={{fontSize:16}}>{icon}</span> {label}
            </Link>
          ))}
        </nav>
        <div style={{padding:'16px 12px',borderTop:'1px solid var(--border)'}}>
          <button onClick={()=>{logout();navigate('/login')}} style={{
            display:'flex',alignItems:'center',gap:10,background:'none',border:'none',
            color:'var(--muted)',cursor:'pointer',fontSize:14,fontFamily:'var(--font-body)',
            padding:'10px 14px',width:'100%',borderRadius:8,transition:'color .2s',
          }}
          onMouseEnter={e=>e.currentTarget.style.color='var(--off-white)'}
          onMouseLeave={e=>e.currentTarget.style.color='var(--muted)'}>
            <FiLogOut size={17}/> Sign Out
          </button>
        </div>
      </aside>
      <main style={{flex:1,padding:'36px',overflowY:'auto'}}>
        <h1 style={{fontFamily:'var(--font-display)',fontSize:30,color:'var(--white)',
          marginBottom:32,paddingBottom:24,borderBottom:'1px solid var(--border)'}}>{title}</h1>
        {children}
      </main>
    </div>
  )
}

/* ─────────────── STATUS BADGE ─────────────── */
function StatusBadge({ status }) {
  const colors = {
    Available: { bg:'rgba(59,130,246,0.15)', color:'#93c5fd', border:'rgba(59,130,246,0.3)' },
    Sold:      { bg:'rgba(100,100,100,0.15)', color:'#9ca3af', border:'rgba(100,100,100,0.3)' },
    Reserved:  { bg:'rgba(251,191,36,0.15)', color:'#fbbf24', border:'rgba(251,191,36,0.3)' },
    Auction:   { bg:'rgba(236,72,153,0.15)', color:'#f472b6', border:'rgba(236,72,153,0.3)' },
  }
  const s = colors[status] || colors.Sold
  return (
    <span style={{fontSize:11,padding:'4px 10px',borderRadius:3,fontWeight:600,
      background:s.bg,color:s.color,border:`1px solid ${s.border}`}}>
      {status}
    </span>
  )
}

/* ─────────────── DASHBOARD ─────────────── */
export function Dashboard() {
  const [stats, setStats] = useState({ total_listings:0, available:0, sold_count:0, brands_count:0 })
  const [recentCars, setRecentCars] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/cars/stats/'),
      getCars({ status: '' }) // Fetch all, not just Available
    ]).then(([statsRes, carsRes]) => {
      setStats(statsRes.data)
      setRecentCars(carsRes.data?.results?.slice(0, 6) || carsRes.data?.slice(0, 6) || [])
    }).catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const STAT_CARDS = [
    { label:'Total Listings', value: stats.total_listings, icon:'🚗' },
    { label:'Available',      value: stats.available,      icon:'✅' },
    { label:'Sold',           value: stats.sold_count,     icon:'🏆' },
    { label:'Brands',         value: stats.brands_count,   icon:'🏷️' },
  ]

  return (
    <AdminLayout title="Dashboard">
      {loading ? (
        <div style={{textAlign:'center',padding:'60px 0',color:'var(--muted)'}}>Loading dashboard...</div>
      ) : (
        <>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:20,marginBottom:40}}>
            {STAT_CARDS.map(s=>(
              <div key={s.label} style={{
                background:'var(--navy-800)',border:'1px solid var(--border)',
                borderRadius:16,padding:24,transition:'all .3s',
              }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--border-strong)';e.currentTarget.style.transform='translateY(-3px)'}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.transform='translateY(0)'}}>
                <div style={{fontSize:32,marginBottom:12}}>{s.icon}</div>
                <p style={{fontFamily:'var(--font-display)',fontSize:40,fontWeight:900,
                  background:'linear-gradient(135deg,var(--gold-300),var(--gold-500))',
                  WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',lineHeight:1}}>{s.value}</p>
                <p style={{fontSize:11,color:'var(--muted)',fontWeight:600,
                  letterSpacing:'2px',textTransform:'uppercase',marginTop:8}}>{s.label}</p>
              </div>
            ))}
          </div>

          <div style={{background:'var(--navy-800)',border:'1px solid var(--border)',borderRadius:16,overflow:'hidden'}}>
            <div style={{padding:'20px 24px',borderBottom:'1px solid var(--border)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <h2 style={{fontFamily:'var(--font-display)',fontSize:22,color:'var(--white)'}}>Recent Listings</h2>
              <Link to="/admin/cars" style={{fontSize:13,color:'var(--gold-400)',textDecoration:'none',fontWeight:500}}>Manage All →</Link>
            </div>
            <table style={{width:'100%',borderCollapse:'collapse'}}>
              <thead>
                <tr style={{background:'var(--navy-900)'}}>
                  {['Car','Category','Price','Status'].map(h=>(
                    <th key={h} style={{padding:'12px 20px',textAlign:'left',fontSize:11,fontWeight:700,
                      letterSpacing:'2px',textTransform:'uppercase',color:'var(--muted)',
                      borderBottom:'1px solid var(--border)'}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentCars.length === 0 ? (
                  <tr><td colSpan={4} style={{padding:'32px 20px',textAlign:'center',color:'var(--muted)'}}>
                    No listings yet. <Link to="/admin/cars" style={{color:'var(--gold-400)'}}>Add your first car →</Link>
                  </td></tr>
                ) : recentCars.map(car=>(
                  <tr key={car.id} style={{borderBottom:'1px solid var(--border)',transition:'background .2s'}}
                    onMouseEnter={e=>e.currentTarget.style.background='rgba(212,160,23,0.02)'}
                    onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                    <td style={{padding:'14px 20px'}}>
                      <p style={{fontSize:14,fontWeight:500,color:'var(--off-white)'}}>{car.title}</p>
                      <p style={{fontSize:11,color:'var(--muted)',fontWeight:300}}>{car.brand?.name}</p>
                    </td>
                    <td style={{padding:'14px 20px',fontSize:13,color:'var(--muted)',fontWeight:300}}>{car.category}</td>
                    <td style={{padding:'14px 20px',fontFamily:'var(--font-heading)',fontSize:16,color:'var(--gold-300)'}}>{formatPrice(car.price)}</td>
                    <td style={{padding:'14px 20px'}}>
                      {car.primary_image
                        ? <img src={resolveImageUrl(car.primary_image)} alt="" style={{width:50,height:38,objectFit:'cover',borderRadius:4}}/>
                        : <div style={{width:50,height:38,background:'var(--navy-900)',borderRadius:4,display:'flex',alignItems:'center',justifyContent:'center'}}>🚗</div>
                      }
                    </td>
                    <td style={{padding:'14px 20px'}}><StatusBadge status={car.status}/></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </AdminLayout>
  )
}

/* ─────────────── IMAGE UPLOADER ─────────────── */
function ImageUploader({ images, onChange }) {
  const inputRef = useRef()
  const handleFiles = (e) => {
    const files = Array.from(e.target.files)
    const previews = files.map((f, i) => ({ file: f, url: URL.createObjectURL(f), is_primary: images.length === 0 && i === 0 }))
    onChange([...images, ...previews])
  }
  const remove = (idx) => onChange(images.filter((_, i) => i !== idx))
  const setPrimary = (idx) => onChange(images.map((img, i) => ({ ...img, is_primary: i === idx })))

  return (
    <div>
      <label style={{fontSize:11,fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',color:'var(--gold-400)',display:'block',marginBottom:10}}>
        Car Photos
      </label>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(120px,1fr))',gap:12,marginBottom:12}}>
        {images.map((img, idx) => (
          <div key={idx} style={{
            position:'relative',height:100,borderRadius:10,overflow:'hidden',
            border:`2px solid ${img.is_primary?'var(--gold-500)':'var(--border)'}`,
            transition:'border-color .2s',
          }}>
            <img src={resolveImageUrl(img.url)} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
            {img.is_primary && (
              <div style={{position:'absolute',bottom:4,left:4,background:'var(--gold-500)',
                color:'var(--navy-950)',fontSize:9,fontWeight:800,letterSpacing:'1px',
                padding:'2px 6px',borderRadius:3}}>MAIN</div>
            )}
            <div style={{position:'absolute',top:4,right:4,display:'flex',gap:4}}>
              {!img.is_primary && (
                <button onClick={()=>setPrimary(idx)} title="Set as main photo"
                  style={{width:22,height:22,borderRadius:'50%',background:'rgba(212,160,23,0.9)',
                    border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11}}>
                  ★
                </button>
              )}
              <button onClick={()=>remove(idx)}
                style={{width:22,height:22,borderRadius:'50%',background:'rgba(239,68,68,0.9)',
                  border:'none',cursor:'pointer',color:'white',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <FiX size={12}/>
              </button>
            </div>
          </div>
        ))}
        {/* Upload area */}
        <div onClick={()=>inputRef.current.click()}
          style={{
            height:100,borderRadius:10,border:'2px dashed var(--border)',
            background:'var(--navy-900)',display:'flex',flexDirection:'column',
            alignItems:'center',justifyContent:'center',gap:6,
            cursor:'pointer',transition:'all .25s',
          }}
          onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--gold-500)';e.currentTarget.style.background='rgba(212,160,23,0.05)'}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.background='var(--navy-900)'}}>
          <FiUpload size={20} color="var(--muted)"/>
          <span style={{fontSize:10,color:'var(--muted)',textAlign:'center'}}>Add Photo</span>
        </div>
      </div>
      <input ref={inputRef} type="file" multiple accept="image/*"
        style={{display:'none'}} onChange={handleFiles}/>
      <p style={{fontSize:11,color:'var(--muted-dark)'}}>Click ★ on a photo to set it as the main listing image.</p>
    </div>
  )
}

/* ─────────────── CAR FORM MODAL ─────────────── */
function CarFormModal({ car, brands, onClose, onSave }) {
  const isEdit = !!car
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState('')
  const [form, setForm] = useState({
    title:        car?.title        || '',
    brand_id:     car?.brand?.id    || '',
    category:     car?.category     || 'Tokunbo',
    price:        car?.price        || '',
    year:         car?.year         || new Date().getFullYear(),
    mileage:      car?.mileage      || 0,
    transmission: car?.transmission || 'Automatic',
    engine_size:  car?.engine_size  || '',
    color:        car?.color        || '',
    description:  car?.description  || '',
    status:       car?.status       || 'Available',
    badge:        car?.badge        || '',
    is_featured:  car?.is_featured  || false,
  })
  const [images, setImages] = useState(
    car?.images?.filter(i => i.image || i.url).map(i => ({ id:i.id, url: i.image || i.url, is_primary: i.is_primary })) || []
  )
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSave = async () => {
    if (!form.title || !form.price) { setError('Title and price are required.'); return }
    setSaving(true); setError('')
    try {
      let saved
      if (isEdit) {
        const res = await updateCar(car.slug, { ...form })
        saved = res.data
      } else {
        const res = await createCar({ ...form })
        saved = res.data
      }
      // Upload any new images (ones with a File object)
      const newImages = images.filter(i => i.file)
      for (const img of newImages) {
        const fd = new FormData()
        fd.append('image', img.file)
        fd.append('is_primary', img.is_primary ? 'true' : 'false')
        await api.post(`/cars/${saved.id}/images/upload/`, fd)
      }
      onSave(saved)
      onClose()
    } catch (e) {
      setError(e.response?.data?.detail || 'Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const F = ({ label, children }) => (
    <div style={{marginBottom:0}}>
      <label style={{fontSize:11,fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',
        color:'var(--gold-400)',display:'block',marginBottom:8}}>{label}</label>
      {children}
    </div>
  )

  return (
    <div style={{
      position:'fixed',inset:0,background:'rgba(4,8,18,0.88)',
      backdropFilter:'blur(6px)',zIndex:300,
      display:'flex',alignItems:'center',justifyContent:'center',padding:20,
    }}>
      <div style={{
        background:'var(--navy-800)',border:'1px solid var(--border-strong)',
        borderRadius:20,width:'100%',maxWidth:780,
        maxHeight:'92vh',overflowY:'auto',
        animation:'fadeInUp .3s ease',
      }}>
        {/* Header */}
        <div style={{
          display:'flex',alignItems:'center',justifyContent:'space-between',
          padding:'24px 32px',borderBottom:'1px solid var(--border)',
          position:'sticky',top:0,background:'var(--navy-800)',zIndex:1,
        }}>
          <h2 style={{fontFamily:'var(--font-display)',fontSize:26,color:'var(--white)'}}>
            {isEdit ? 'Edit Car Listing' : 'Add New Car'}
          </h2>
          <button onClick={onClose}
            style={{background:'none',border:'1px solid var(--border)',color:'var(--muted)',
              width:36,height:36,borderRadius:'50%',cursor:'pointer',
              display:'flex',alignItems:'center',justifyContent:'center'}}>
            <FiX size={18}/>
          </button>
        </div>

        <div style={{padding:'28px 32px',display:'flex',flexDirection:'column',gap:24}}>
          {error && (
            <div style={{background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.3)',
              borderRadius:8,padding:'12px 16px',color:'#f87171',fontSize:13}}>
              {error}
            </div>
          )}

          <ImageUploader images={images} onChange={setImages}/>
          <div style={{height:1,background:'var(--border)'}}/>

          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
            <div style={{gridColumn:'1/-1'}}>
              <F label="Car Title *">
                <input className="form-input" value={form.title}
                  onChange={e=>set('title',e.target.value)}
                  placeholder="e.g. Mercedes-Benz GLE 350 AMG 2022"/>
              </F>
            </div>
            <F label="Brand *">
              <select className="form-select" value={form.brand_id} onChange={e=>set('brand_id',e.target.value)}>
                <option value="">Select brand</option>
                {brands.map(b=><option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </F>
            <F label="Year">
              <input className="form-input" type="number" value={form.year}
                onChange={e=>set('year',e.target.value)} min="2000" max="2025"/>
            </F>
            <F label="Category">
              <select className="form-select" value={form.category} onChange={e=>set('category',e.target.value)}>
                <option>Tokunbo</option>
                <option>Nigerian Used</option>
                <option>Brand New</option>
              </select>
            </F>
            <F label="Transmission">
              <select className="form-select" value={form.transmission} onChange={e=>set('transmission',e.target.value)}>
                <option>Automatic</option>
                <option>Manual</option>
              </select>
            </F>
            <F label="Price (₦) *">
              <input className="form-input" type="number" value={form.price}
                onChange={e=>set('price',e.target.value)} placeholder="e.g. 25000000"/>
            </F>
            <F label="Mileage (KM)">
              <input className="form-input" type="number" value={form.mileage}
                onChange={e=>set('mileage',e.target.value)} placeholder="0 for Brand New"/>
            </F>
            <F label="Engine Size">
              <input className="form-input" value={form.engine_size}
                onChange={e=>set('engine_size',e.target.value)} placeholder="e.g. 2.0L Turbo"/>
            </F>
            <F label="Colour">
              <input className="form-input" value={form.color}
                onChange={e=>set('color',e.target.value)} placeholder="e.g. Pearl White"/>
            </F>
          </div>

          <F label="Description">
            <textarea className="form-textarea" value={form.description}
              onChange={e=>set('description',e.target.value)}
              placeholder="Describe the vehicle condition, history, features..."
              style={{minHeight:100}}/>
          </F>

          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:20}}>
            <F label="Status">
              <select className="form-select" value={form.status} onChange={e=>set('status',e.target.value)}>
                <option>Available</option><option>Reserved</option>
                <option>Sold</option><option>Auction</option>
              </select>
            </F>
            <F label="Badge">
              <select className="form-select" value={form.badge} onChange={e=>set('badge',e.target.value)}>
                <option value="">None</option><option>New</option>
                <option>Hot Bid</option><option>Premium</option><option>Featured</option>
              </select>
            </F>
            <F label="Featured on Home?">
              <div style={{display:'flex',alignItems:'center',gap:12,marginTop:4}}>
                <button onClick={()=>set('is_featured',!form.is_featured)}
                  style={{
                    width:48,height:26,borderRadius:13,border:'none',cursor:'pointer',
                    background:form.is_featured?'var(--gold-500)':'var(--navy-700)',
                    position:'relative',transition:'background .25s',
                  }}>
                  <div style={{
                    position:'absolute',top:3,
                    left:form.is_featured?'calc(100% - 23px)':3,
                    width:20,height:20,borderRadius:'50%',
                    background:'white',transition:'left .25s',
                  }}/>
                </button>
                <span style={{fontSize:13,color:form.is_featured?'var(--gold-400)':'var(--muted)'}}>
                  {form.is_featured?'Yes':'No'}
                </span>
              </div>
            </F>
          </div>

          {form.price && (
            <div style={{background:'rgba(212,160,23,0.06)',border:'1px solid rgba(212,160,23,0.2)',borderRadius:10,padding:16}}>
              <p style={{fontSize:11,fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',color:'var(--gold-400)',marginBottom:10}}>Installment Plan Preview</p>
              <div style={{display:'flex',gap:24,flexWrap:'wrap'}}>
                {[
                  {label:'Full Price',value:formatPrice(form.price)},
                  {label:'60% Deposit',value:formatPrice(Math.round(Number(form.price)*0.6))},
                  {label:'40% Balance',value:formatPrice(Math.round(Number(form.price)*0.4))},
                  {label:'Monthly × 6',value:formatPrice(Math.round(Number(form.price)*0.4/6))},
                ].map(({label,value})=>(
                  <div key={label}>
                    <p style={{fontSize:10,color:'var(--muted-dark)',letterSpacing:'1px',textTransform:'uppercase',marginBottom:3}}>{label}</p>
                    <p style={{fontFamily:'var(--font-heading)',fontSize:17,color:'var(--gold-300)'}}>{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding:'20px 32px',borderTop:'1px solid var(--border)',
          display:'flex',gap:12,justifyContent:'flex-end',
          position:'sticky',bottom:0,background:'var(--navy-800)',
        }}>
          <button onClick={onClose}
            style={{padding:'12px 28px',borderRadius:8,border:'1px solid var(--border)',
              background:'transparent',color:'var(--muted)',cursor:'pointer',
              fontFamily:'var(--font-body)',fontSize:14}}>
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving}
            className="btn btn-gold"
            style={{gap:8,display:'flex',alignItems:'center',opacity:saving?0.7:1}}>
            {saving ? <FiRefreshCw size={16} style={{animation:'spin 1s linear infinite'}}/> : <FiCheck size={16}/>}
            {saving ? 'Saving...' : (isEdit ? 'Save Changes' : 'Add Listing')}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─────────────── MANAGE CARS ─────────────── */
export function ManageCars() {
  const [cars, setCars]       = useState([])
  const [brands, setBrands]   = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editCar, setEditCar]   = useState(null)

  const fetchCars = async () => {
    setLoading(true)
    try {
      const [carsRes, brandsRes] = await Promise.all([
        api.get('/cars/?status='),  // fetch all statuses
        getCarBrands(),
      ])
      const results = carsRes.data?.results || carsRes.data
      setCars(Array.isArray(results) ? results : [])
      setBrands(brandsRes.data?.results || brandsRes.data || [])
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchCars() }, [])

  const openAdd  = () => { setEditCar(null); setShowForm(true) }
  const openEdit = (car) => { setEditCar(car); setShowForm(true) }

  const handleDelete = async (slug) => {
    if (!window.confirm('Delete this listing permanently?')) return
    try {
      await deleteCar(slug)
      setCars(p => p.filter(c => c.slug !== slug))
    } catch { alert('Failed to delete.') }
  }

  const handleSaved = (savedCar) => {
    setCars(p => {
      const exists = p.find(c => c.id === savedCar.id)
      return exists ? p.map(c => c.id === savedCar.id ? savedCar : c) : [savedCar, ...p]
    })
  }

  return (
    <AdminLayout title="Manage Cars">
      <div style={{display:'flex',justifyContent:'flex-end',marginBottom:24,gap:12}}>
        <button className="btn btn-outline btn-sm" onClick={fetchCars}
          style={{display:'flex',alignItems:'center',gap:8}}>
          <FiRefreshCw size={14}/> Refresh
        </button>
        <button className="btn btn-gold btn-sm" onClick={openAdd}
          style={{display:'flex',alignItems:'center',gap:8}}>
          <FiPlus size={16}/> Add New Car
        </button>
      </div>

      {loading ? (
        <div style={{textAlign:'center',padding:'60px 0',color:'var(--muted)'}}>Loading cars from database...</div>
      ) : (
        <div style={{background:'var(--navy-800)',border:'1px solid var(--border)',borderRadius:16,overflow:'hidden'}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead>
              <tr style={{background:'var(--navy-900)'}}>
                {['Photo','Vehicle','Category','Price','Status','Actions'].map(h=>(
                  <th key={h} style={{padding:'12px 16px',textAlign:'left',fontSize:11,
                    fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',
                    color:'var(--muted)',borderBottom:'1px solid var(--border)'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cars.length === 0 ? (
                <tr><td colSpan={6} style={{padding:'40px',textAlign:'center',color:'var(--muted)'}}>
                  No cars yet. Click "Add New Car" to get started.
                </td></tr>
              ) : cars.map(car=>(
                <tr key={car.id} style={{borderBottom:'1px solid var(--border)',transition:'background .2s'}}
                  onMouseEnter={e=>e.currentTarget.style.background='rgba(212,160,23,0.02)'}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  <td style={{padding:'12px 16px'}}>
                    <div style={{
                      width:64,height:48,borderRadius:8,overflow:'hidden',
                      background:'var(--navy-900)',border:'1px solid var(--border)',
                      display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,
                    }}>
                      {car.primary_image
                        ? <img src={resolveImageUrl(car.primary_image)} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                        : '🚗'}
                    </div>
                  </td>
                  <td style={{padding:'12px 16px'}}>
                    <p style={{fontSize:14,fontWeight:500,color:'var(--off-white)'}}>{car.title}</p>
                    <p style={{fontSize:11,color:'var(--muted)',fontWeight:300}}>{car.brand?.name}</p>
                  </td>
                  <td style={{padding:'12px 16px',fontSize:13,color:'var(--muted)',fontWeight:300}}>{car.category}</td>
                  <td style={{padding:'12px 16px',fontFamily:'var(--font-heading)',fontSize:15,color:'var(--gold-300)'}}>{formatPrice(car.price)}</td>
                  <td style={{padding:'12px 16px'}}><StatusBadge status={car.status}/></td>
                  <td style={{padding:'12px 16px'}}>
                    <div style={{display:'flex',gap:8}}>
                      <button onClick={()=>openEdit(car)}
                        style={{width:32,height:32,borderRadius:6,background:'rgba(212,160,23,0.1)',
                          border:'1px solid var(--border)',color:'var(--gold-400)',cursor:'pointer',
                          display:'flex',alignItems:'center',justifyContent:'center'}}>
                        <FiEdit2 size={14}/>
                      </button>
                      <button onClick={()=>handleDelete(car.slug)}
                        style={{width:32,height:32,borderRadius:6,background:'rgba(239,68,68,0.1)',
                          border:'1px solid rgba(239,68,68,0.3)',color:'#f87171',cursor:'pointer',
                          display:'flex',alignItems:'center',justifyContent:'center'}}>
                        <FiTrash2 size={14}/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <CarFormModal
          car={editCar}
          brands={brands}
          onClose={()=>setShowForm(false)}
          onSave={handleSaved}
        />
      )}
    </AdminLayout>
  )
}

/* ─────────────── MANAGE BIDS ─────────────── */
export function ManageBids() {
  const [bids, setBids]     = useState([])
  const [loading, setLoad]  = useState(true)

  useEffect(() => {
    api.get('/admin/bids/')
      .then(r => setBids(r.data?.results || r.data || []))
      .catch(console.error)
      .finally(()=>setLoad(false))
  }, [])

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/admin/bids/${id}/`, { status })
      setBids(p => p.map(b => b.id === id ? {...b, status} : b))
    } catch { alert('Failed to update.') }
  }

  return (
    <AdminLayout title="Bids & Inquiries">
      {loading ? (
        <div style={{textAlign:'center',padding:'60px 0',color:'var(--muted)'}}>Loading bids...</div>
      ) : bids.length === 0 ? (
        <div style={{textAlign:'center',padding:'80px 0',color:'var(--muted)'}}>
          <p style={{fontSize:48,marginBottom:16}}>💬</p>
          <p>No bids yet. They will appear here once customers submit offers.</p>
        </div>
      ) : (
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          {bids.map(bid=>(
            <div key={bid.id} style={{
              background:'var(--navy-800)',border:'1px solid var(--border)',
              borderRadius:12,padding:'20px 24px',
            }}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:12}}>
                <div>
                  <p style={{fontFamily:'var(--font-display)',fontSize:18,color:'var(--white)',marginBottom:2}}>{bid.bidder_name}</p>
                  <p style={{fontSize:13,color:'var(--muted)'}}>{bid.bidder_phone} · {bid.bidder_email}</p>
                  <p style={{fontSize:13,color:'var(--muted)',marginTop:4}}>Car: <span style={{color:'var(--off-white)'}}>{bid.car_title}</span></p>
                  {bid.message && <p style={{fontSize:13,color:'var(--muted)',marginTop:6,fontStyle:'italic'}}>"{bid.message}"</p>}
                </div>
                <div style={{textAlign:'right'}}>
                  <p style={{fontFamily:'var(--font-heading)',fontSize:22,color:'var(--gold-300)',marginBottom:8}}>{formatPrice(bid.amount)}</p>
                  <div style={{display:'flex',gap:8}}>
                    {['Accepted','Rejected'].filter(s=>s!==bid.status).map(s=>(
                      <button key={s} onClick={()=>updateStatus(bid.id,s)}
                        style={{
                          padding:'6px 14px',borderRadius:6,cursor:'pointer',fontSize:12,fontWeight:600,
                          border:'none',
                          background:s==='Accepted'?'rgba(34,197,94,0.15)':'rgba(239,68,68,0.15)',
                          color:s==='Accepted'?'#4ade80':'#f87171',
                        }}>{s}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}

/* ─────────────── MANAGE POSTS ─────────────── */
export function ManagePosts() {
  const [posts, setPosts] = useState([])
  const [loading, setLoad] = useState(true)

  useEffect(() => {
    api.get('/blog/posts/')
      .then(r => setPosts(r.data?.results || r.data || []))
      .catch(console.error)
      .finally(()=>setLoad(false))
  }, [])

  return (
    <AdminLayout title="Blog Posts">
      {loading ? (
        <div style={{textAlign:'center',padding:'60px 0',color:'var(--muted)'}}>Loading posts...</div>
      ) : posts.length === 0 ? (
        <div style={{textAlign:'center',padding:'80px 0',color:'var(--muted)'}}>
          <p style={{fontSize:48,marginBottom:16}}>📝</p>
          <p>No blog posts yet. Create them from the Django Admin at <a href="http://localhost:8000/admin" target="_blank" rel="noreferrer" style={{color:'var(--gold-400)'}}>localhost:8000/admin</a></p>
        </div>
      ) : (
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          {posts.map(post=>(
            <div key={post.id} style={{
              background:'var(--navy-800)',border:'1px solid var(--border)',
              borderRadius:12,padding:'16px 24px',
              display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:12,
            }}>
              <div>
                <p style={{fontSize:15,fontWeight:500,color:'var(--white)',marginBottom:4}}>{post.title}</p>
                <p style={{fontSize:12,color:'var(--muted)'}}>{post.category?.name} · {post.views} views</p>
              </div>
              <span style={{
                padding:'4px 12px',borderRadius:4,fontSize:11,fontWeight:700,
                background:post.is_published?'rgba(34,197,94,0.1)':'rgba(100,100,100,0.1)',
                color:post.is_published?'#4ade80':'#9ca3af',
                border:`1px solid ${post.is_published?'rgba(34,197,94,0.3)':'rgba(100,100,100,0.3)'}`,
              }}>
                {post.is_published ? 'Published' : 'Draft'}
              </span>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}

/* ─────────────── MANAGE GALLERY ─────────────── */
export function ManageGallery() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({ caption: '', category: 'cars', url: '' })
  const fileRef = useRef()

  const CATS = ['cars', 'showroom', 'dr-aliyu']

  const fetchGallery = async () => {
    setLoading(true)
    try {
      const res = await api.get('/gallery/')
      setItems(res.data?.results || res.data || [])
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchGallery() }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    const file = fileRef.current?.files[0]
    if (!form.url && !file) return
    
    setUploading(true)
    try {
      const formData = new FormData()
      if (file) formData.append('image', file)
      if (form.url) formData.append('url', form.url)
      formData.append('caption', form.caption)
      formData.append('category', form.category)
      formData.append('is_active', 'true')

      const res = await api.post('/gallery/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setItems(prev => [res.data, ...prev])
      setForm({ caption: '', category: 'cars', url: '' })
      if (fileRef.current) fileRef.current.value = ''
    } catch (e) {
      alert('Failed to add gallery item.')
      console.error(e)
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Remove from gallery?')) return
    try {
      await api.delete(`/gallery/${id}/`)
      setItems(prev => prev.filter(i => i.id !== id))
    } catch { alert('Failed to delete.') }
  }

  return (
    <AdminLayout title="Gallery Manager">
      <div style={{ marginBottom: 24, background: 'var(--navy-800)', border: '1px solid var(--border)', borderRadius: 12, padding: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--off-white)', marginBottom: 16 }}>Add New Photo</h3>
        <form onSubmit={handleAdd} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <input
            placeholder="Caption (optional)"
            value={form.caption}
            onChange={e => setForm(p => ({...p, caption: e.target.value}))}
            className="form-input"
            style={{ gridColumn: '1 / -1' }}
          />
          <select
            value={form.category}
            onChange={e => setForm(p => ({...p, category: e.target.value}))}
            className="form-select"
          >
            {CATS.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
          </select>
          <input
            placeholder="Image URL (or upload below)"
            value={form.url}
            onChange={e => setForm(p => ({...p, url: e.target.value}))}
            className="form-input"
          />
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="form-input"
            style={{ gridColumn: '1 / -1' }}
          />
          <button type="submit" className="btn btn-gold" disabled={uploading} style={{ gridColumn: '1 / -1', justifyContent: 'center' }}>
            {uploading ? (
              <FiRefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} />
            ) : (
              <FiPlus size={16}/>
            )}
            <span style={{marginLeft: 8}}>{uploading ? 'Adding...' : 'Add to Gallery'}</span>
          </button>
        </form>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--muted)' }}>Loading gallery...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
          {items.length === 0 ? (
            <div style={{ gridColumn:'1/-1', textAlign:'center', padding: 60, color: 'var(--muted)' }}>
              No gallery items yet. Add your first photo above.
            </div>
          ) : items.map(item => (
            <div key={item.id} style={{ position: 'relative', borderRadius: 14, overflow: 'hidden', background: 'var(--navy-800)', border: '1px solid var(--border)', transition: 'all 0.3s' }}
                 onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--gold-500)'}
                 onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
              <img src={resolveImageUrl(item.image || item.url)} alt={item.caption} style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }} />
              <div style={{ padding: '12px' }}>
                <p style={{ fontSize: 10, color: 'var(--gold-400)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800 }}>{item.category}</p>
                {item.caption && <p style={{ fontSize: 13, color: 'var(--off-white)', marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.caption}</p>}
              </div>
              <button onClick={() => handleDelete(item.id)}
                style={{ position:'absolute', top:10, right:10, width:32, height:32, borderRadius:'50%',
                  background:'rgba(239,68,68,0.9)', border:'none', color:'white', cursor:'pointer',
                  display:'flex', alignItems:'center', justifyContent:'center', boxShadow: '0 4px 12px rgba(0,0,0,0.3)', transition: 'transform 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                <FiTrash2 size={14}/>
              </button>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}