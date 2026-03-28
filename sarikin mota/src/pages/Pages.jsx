// ═══════════════════════════════════════════
// Blog.jsx
// ═══════════════════════════════════════════
import { useState } from 'react'
import { Link, useParams, Navigate, useNavigate } from 'react-router-dom'
import { FiArrowRight, FiArrowLeft, FiCheck } from 'react-icons/fi'
import { MOCK_POSTS } from '../utils/mockData'
import { formatDate } from '../utils/helpers'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export function Blog() {
  const [active, setActive] = useState('All')
  const CATS = ['All', "Buyer's Guide", 'Market Watch', 'Reviews', 'Maintenance']
  const ICONS = ["📊", "💰", "🏆", "🔧", "📊"]
  const filtered = active === 'All' ? MOCK_POSTS : MOCK_POSTS.filter(p => p.category?.name === active)

  return (
    <div style={{minHeight:'100vh'}}>
      <div className="page-hero">
        <div className="container">
          <p className="section-eyebrow">Car Knowledge Hub</p>
          <h1 className="section-title">The Sarkin Mota Blog</h1>
          <p className="section-subtitle">
            Expert guides, market analysis, and insider tips from Nigeria's most trusted car dealer.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {/* Category tabs */}
          <div style={{display:'flex',gap:10,marginBottom:48,flexWrap:'wrap'}}>
            {CATS.map(c=>(
              <button key={c} onClick={()=>setActive(c)}
                style={{padding:'9px 22px',borderRadius:2,fontFamily:'var(--font-body)',
                  fontSize:13,fontWeight:500,letterSpacing:'1px',cursor:'pointer',transition:'all .25s',
                  border:`1px solid ${active===c?'var(--gold-500)':'var(--border)'}`,
                  background: active===c?'rgba(212,160,23,0.12)':'transparent',
                  color: active===c?'var(--gold-300)':'var(--muted)'}}>
                {c}
              </button>
            ))}
          </div>

          {/* Featured post */}
          {filtered[0] && (
            <Link to={`/blog/${filtered[0].slug}`}
              style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))',gap:0,marginBottom:48,
                background:'var(--navy-800)',border:'1px solid var(--border)',
                borderRadius:'var(--radius-xl)',overflow:'hidden',textDecoration:'none',
                transition:'all .3s'}}
              onMouseEnter={e=>e.currentTarget.style.borderColor='var(--border-strong)'}
              onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border)'}>
              <div style={{background:'var(--navy-900)',display:'flex',alignItems:'center',
                justifyContent:'center',minHeight:320,fontSize:96}}>📊</div>
              <div style={{padding:'clamp(28px,4vw,48px)',display:'flex',flexDirection:'column',justifyContent:'center'}}>
                <span style={{fontSize:10,fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',
                  color:'var(--gold-400)',marginBottom:12, textAlign:'left'}}>Featured · {filtered[0].category?.name}</span>
                <h2 style={{fontFamily:'var(--font-display)',fontSize:'clamp(22px,3vw,34px)', textAlign:'left',
                  fontWeight:700,color:'var(--white)',lineHeight:1.2,marginBottom:16}}>{filtered[0].title}</h2>
                <p style={{fontSize:15,color:'var(--muted)',fontWeight:300,lineHeight:1.7,marginBottom:24, textAlign:'left'}}>{filtered[0].excerpt}</p>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <span style={{fontSize:12,color:'var(--muted-dark)',fontWeight:300}}>{formatDate(filtered[0].published_at)}</span>
                  <span style={{display:'flex',alignItems:'center',gap:6,fontSize:12,fontWeight:700,
                    color:'var(--gold-400)',textTransform:'uppercase',letterSpacing:'1px'}}>
                    Read <FiArrowRight size={14}/>
                  </span>
                </div>
              </div>
            </Link>
          )}

          {/* Grid */}
          <div className="grid-3">
            {filtered.slice(1).map((post,i)=>(
              <Link key={post.id} to={`/blog/${post.slug}`}
                style={{background:'var(--navy-800)',border:'1px solid var(--border)',
                  borderRadius:'var(--radius-lg)',overflow:'hidden',textDecoration:'none',
                  display:'flex',flexDirection:'column',transition:'all .3s'}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--border-strong)';e.currentTarget.style.transform='translateY(-4px)'}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.transform='translateY(0)'}}>
                <div style={{height:180,background:'var(--navy-900)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:64}}>
                  {ICONS[i+1]||'📄'}
                </div>
                <div style={{padding:24,flex:1,display:'flex',flexDirection:'column'}}>
                  <span style={{fontSize:10,fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',color:'var(--gold-400)',marginBottom:10, textAlign:'left'}}>{post.category?.name}</span>
                  <h3 style={{fontFamily:'var(--font-display)',fontSize:20,fontWeight:700,color:'var(--white)',lineHeight:1.3,marginBottom:12,flex:1, textAlign:'left'}}>{post.title}</h3>
                  <p style={{fontSize:13,color:'var(--muted)',fontWeight:300,lineHeight:1.7,marginBottom:20, textAlign:'left'}}>{post.excerpt}</p>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',paddingTop:16,borderTop:'1px solid var(--border)'}}>
                    <span style={{fontSize:12,color:'var(--muted-dark)',fontWeight:300}}>{formatDate(post.published_at)}</span>
                    <span style={{fontSize:11,fontWeight:700,color:'var(--gold-400)',textTransform:'uppercase',letterSpacing:'1px'}}>Read →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

// ═══════════════════════════════════════════
// BlogPost.jsx
// ═══════════════════════════════════════════


export function BlogPost() {
  const { slug } = useParams()
  const post = MOCK_POSTS.find(p => p.slug === slug)
  if (!post) return <Navigate to="/blog" replace />

  return (
    <div style={{minHeight:'100vh',paddingTop:80}}>
      <div className="container" style={{maxWidth:800,padding:'60px clamp(20px,4vw,60px)'}}>
        <Link to="/blog" style={{display:'inline-flex',alignItems:'center',gap:8,
          color:'var(--muted)',textDecoration:'none',fontSize:14,marginBottom:40,fontFamily:'var(--font-body)'}}>
          <FiArrowLeft/> Back to Blog
        </Link>
        <span style={{fontSize:10,fontWeight:700,letterSpacing:'3px',textTransform:'uppercase',
          color:'var(--gold-400)',marginBottom:16,display:'block', textAlign:'left'}}>{post.category?.name}</span>
        <h1 style={{fontFamily:'var(--font-display)',fontSize:'clamp(32px,5vw,52px)',fontWeight:900,
          color:'var(--white)',lineHeight:1.1,marginBottom:20, textAlign:'left'}}>{post.title}</h1>
        <div style={{display:'flex',alignItems:'center',gap:20,marginBottom:48,
          paddingBottom:32,borderBottom:'1px solid var(--border)'}}>
          <div style={{width:40,height:40,borderRadius:'50%',
            background:'linear-gradient(135deg,var(--gold-600),var(--gold-400))',
            display:'flex',alignItems:'center',justifyContent:'center',
            fontFamily:'var(--font-display)',fontSize:16,fontWeight:700,color:'var(--navy-950)'}}>S</div>
          <div>
            <p style={{fontSize:14,fontWeight:600,color:'var(--white)', textAlign:'left'}}>Sarkin Mota</p>
            <p style={{fontSize:12,color:'var(--muted)',fontWeight:300, textAlign:'left'}}>{formatDate(post.published_at)} · {post.views?.toLocaleString()} views</p>
          </div>
        </div>
        <div style={{background:'var(--navy-900)',borderRadius:'var(--radius-xl)',
          height:300,display:'flex',alignItems:'center',justifyContent:'center',
          fontSize:96,marginBottom:48}}>📊</div>
        <div style={{fontFamily:'var(--font-body)',fontSize:17,color:'var(--muted)',
          fontWeight:300,lineHeight:1.9, textAlign:'left'}}>
          <p style={{marginBottom:24}}>{post.excerpt}</p>
          <p style={{marginBottom:24}}>
            The Nigerian automotive market is one of the most dynamic in Africa, shaped by forex fluctuations,
            customs policy, and the unique preferences of millions of car buyers across the country. Understanding
            these forces is key to making the right purchase decision.
          </p>
          <p style={{marginBottom:24}}>
            At Sarkin Mota Autos, we've spent over 12 years studying this market so our customers don't have to.
            Our goal is simple: give you the information you need to buy confidently, at the right price, from
            a source you can trust.
          </p>
          <blockquote style={{borderLeft:'3px solid var(--gold-500)',paddingLeft:24,margin:'36px 0',
            fontFamily:'var(--font-heading)',fontSize:20,fontStyle:'italic',color:'var(--off-white)'}}>
            "My Bratha, the best investment you'll make this year is a quality car from a trusted dealer.
            Don't let price alone guide you — let quality guide you."
          </blockquote>
          <p>
            Whether you're buying your first car or your fifth, the principles remain the same. Do your research,
            inspect thoroughly, verify documentation, and work with a dealer who has a track record you can verify.
          </p>
        </div>
        <div style={{marginTop:60,background:'var(--navy-800)',border:'1px solid var(--border-strong)',
          borderRadius:'var(--radius-xl)',padding:'clamp(28px,4vw,40px)',display:'flex',
          justifyContent:'space-between',alignItems:'center',gap:24,flexWrap:'wrap'}}>
          <div>
            <p style={{fontSize:13,fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',
              color:'var(--gold-400)',marginBottom:8, textAlign:'left'}}>Ready to Buy?</p>
            <p style={{fontSize:16,color:'var(--off-white)',fontWeight:400, textAlign:'left'}}>Browse our verified inventory today</p>
          </div>
          <Link to="/cars" className="btn btn-gold">Browse Cars <FiArrowLeft size={16} style={{transform:'rotate(180deg)'}}/></Link>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════
// RequestCar.jsx
// ═══════════════════════════════════════════


export function RequestCar() {
  const [form, setForm] = useState({name:'',phone:'',email:'',brand:'',model:'',year:'',budget:'',category:'',notes:''})
  const [submitted, setSubmitted] = useState(false)
  const set = (k,v) => setForm(p=>({...p,[k]:v}))

  const handleSubmit = (e) => { e.preventDefault(); setSubmitted(true) }

  return (
    <div style={{minHeight:'100vh'}}>
      <div className="page-hero">
        <div className="container">
          <p className="section-eyebrow">Can't Find It? We'll Source It</p>
          <h1 className="section-title">Request a Car</h1>
          <p className="section-subtitle">
            Tell us exactly what you want. Brand, model, year, colour, budget — we'll find it for you,
            from Nigeria or anywhere in the world.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container" style={{maxWidth:800}}>
          {submitted ? (
            <div style={{textAlign:'center',padding:'80px 40px',background:'var(--navy-800)',
              border:'1px solid var(--border-strong)',borderRadius:'var(--radius-xl)'}}>
              <div style={{fontSize:72,marginBottom:20}}>✅</div>
              <h2 style={{fontFamily:'var(--font-display)',fontSize:36,color:'var(--white)',marginBottom:16}}>
                Request Received!
              </h2>
              <p style={{fontSize:16,color:'var(--muted)',fontWeight:300,maxWidth:480,margin:'0 auto 32px',lineHeight:1.7}}>
                My Bratha, we have received your request. Our team will review it and reach out within 24 hours.
              </p>
              <div style={{display:'flex',gap:16,justifyContent:'center',flexWrap:'wrap'}}>
                <button onClick={()=>setSubmitted(false)} className="btn btn-outline">Submit Another</button>
                <a href="https://wa.me/2348000000000" target="_blank" rel="noopener noreferrer" className="btn btn-gold">
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{background:'var(--navy-800)',border:'1px solid var(--border)',
                borderRadius:'var(--radius-xl)',padding:'clamp(28px,4vw,48px)',marginBottom:24}}>
                <h2 style={{fontFamily:'var(--font-display)',fontSize:24,color:'var(--white)',marginBottom:28, textAlign:'left'}}>
                  Your Details
                </h2>
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))',gap:20, textAlign:'left'}}>
                  <div><label className="form-label">Full Name *</label><input className="form-input" value={form.name} onChange={e=>set('name',e.target.value)} placeholder="Alhaji Musa Ibrahim" required/></div>
                  <div><label className="form-label">Phone / WhatsApp *</label><input className="form-input" value={form.phone} onChange={e=>set('phone',e.target.value)} placeholder="+234 800 000 0000" required/></div>
                  <div style={{gridColumn:'1/-1'}}><label className="form-label">Email Address</label><input className="form-input" type="email" value={form.email} onChange={e=>set('email',e.target.value)} placeholder="you@email.com"/></div>
                </div>
              </div>

              <div style={{background:'var(--navy-800)',border:'1px solid var(--border)',
                borderRadius:'var(--radius-xl)',padding:'clamp(28px,4vw,48px)',marginBottom:24}}>
                <h2 style={{fontFamily:'var(--font-display)',fontSize:24,color:'var(--white)',marginBottom:28, textAlign:'left'}}>
                  Car Details
                </h2>
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))',gap:20, textAlign:'left'}}>
                  <div><label className="form-label">Car Brand *</label><input className="form-input" value={form.brand} onChange={e=>set('brand',e.target.value)} placeholder="e.g. Toyota, Mercedes, Lexus" required/></div>
                  <div><label className="form-label">Model</label><input className="form-input" value={form.model} onChange={e=>set('model',e.target.value)} placeholder="e.g. Land Cruiser, GLE, LX 570"/></div>
                  <div><label className="form-label">Year Range</label><input className="form-input" value={form.year} onChange={e=>set('year',e.target.value)} placeholder="e.g. 2020 - 2023"/></div>
                  <div>
                    <label className="form-label">Category</label>
                    <select className="form-select" value={form.category} onChange={e=>set('category',e.target.value)}>
                      <option value="">Select category</option>
                      <option>Tokunbo (Foreign Used)</option>
                      <option>Nigerian Used</option>
                      <option>Brand New</option>
                    </select>
                  </div>
                  <div style={{gridColumn:'1/-1'}}><label className="form-label">Budget (₦)</label><input className="form-input" value={form.budget} onChange={e=>set('budget',e.target.value)} placeholder="e.g. ₦25,000,000 - ₦35,000,000"/></div>
                  <div style={{gridColumn:'1/-1'}}>
                    <label className="form-label">Additional Notes</label>
                    <textarea className="form-textarea" value={form.notes} onChange={e=>set('notes',e.target.value)}
                      placeholder="Colour preference, specific features, timeline, anything else we should know..."/>
                  </div>
                </div>
              </div>

              <button type="submit" className="btn btn-gold" style={{width:'100%',justifyContent:'center',padding:'18px 36px',fontSize:15}}>
                <FiCheck size={18}/> Submit Car Request
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}

// ═══════════════════════════════════════════
// Contact.jsx
// ═══════════════════════════════════════════
export function Contact() {
  const [form, setForm] = useState({name:'',phone:'',email:'',subject:'',message:''})
  const [sent, setSent] = useState(false)
  const set = (k,v) => setForm(p=>({...p,[k]:v}))

  return (
    <div style={{minHeight:'100vh'}}>
      <div className="page-hero">
        <div className="container">
          <p className="section-eyebrow">We're Here For You</p>
          <h1 className="section-title">Contact Us</h1>
          <p className="section-subtitle">
            My Bratha, reach us by phone, WhatsApp, email or in person. We are always available for you.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))',gap:60,alignItems:'start'}}>
            {/* Info */}
            <div>
              <p className="section-eyebrow">Get in Touch</p>
              <h2 className="section-title" style={{fontSize:'clamp(28px,4vw,42px)',marginBottom:36, textAlign:'left'}}>
                We'd Love to<br/><span className="gold-gradient">Hear From You</span>
              </h2>
              {[
                {icon:'📞',label:'Phone',val:'+234 800 000 0000',href:'tel:+2348000000000'},
                {icon:'💬',label:'WhatsApp',val:'Chat with us now',href:'https://wa.me/2348000000000'},
                {icon:'📧',label:'Email',val:'info@sarkinmota.com',href:'mailto:info@sarkinmota.com'},
                {icon:'📍',label:'Showroom',val:'Kano & Abuja, Nigeria',href:null},
              ].map(({icon,label,val,href})=>(
                <div key={label} style={{display:'flex',gap:16,marginBottom:24, textAlign:'left'}}>
                  <div style={{width:52,height:52,borderRadius:'var(--radius-md)',
                    background:'rgba(212,160,23,0.1)',border:'1px solid var(--border)',
                    display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,flexShrink:0}}>
                    {icon}
                  </div>
                  <div>
                    <p style={{fontSize:11,fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',color:'var(--gold-400)',marginBottom:4}}>{label}</p>
                    {href
                      ? <a href={href} target="_blank" rel="noopener noreferrer"
                          style={{fontSize:15,color:'var(--off-white)',fontWeight:400,textDecoration:'none',transition:'color .2s'}}
                          onMouseEnter={e=>e.target.style.color='var(--gold-300)'}
                          onMouseLeave={e=>e.target.style.color='var(--off-white)'}>{val}</a>
                      : <p style={{fontSize:15,color:'var(--off-white)',fontWeight:400}}>{val}</p>
                    }
                  </div>
                </div>
              ))}

              <a href="https://wa.me/2348000000000" target="_blank" rel="noopener noreferrer"
                className="btn btn-gold" style={{width:'100%',justifyContent:'center',marginTop:16}}>
                Chat on WhatsApp Now
              </a>
            </div>

            {/* Form */}
            <div style={{background:'var(--navy-800)',border:'1px solid var(--border)',borderRadius:'var(--radius-xl)',padding:'clamp(28px,4vw,48px)'}}>
              {sent ? (
                <div style={{textAlign:'center',padding:'40px 0'}}>
                  <div style={{fontSize:56,marginBottom:16}}>✅</div>
                  <h3 style={{fontFamily:'var(--font-display)',fontSize:28,color:'var(--white)',marginBottom:12}}>Message Sent!</h3>
                  <p style={{color:'var(--muted)',fontWeight:300}}>We'll respond within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={e=>{e.preventDefault();setSent(true)}} style={{display:'flex',flexDirection:'column',gap:18, textAlign:'left'}}>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))',gap:18}}>
                    <div><label className="form-label">Name *</label><input className="form-input" value={form.name} onChange={e=>set('name',e.target.value)} placeholder="Your name" required/></div>
                    <div><label className="form-label">Phone</label><input className="form-input" value={form.phone} onChange={e=>set('phone',e.target.value)} placeholder="+234..."/></div>
                  </div>
                  <div><label className="form-label">Email *</label><input className="form-input" type="email" value={form.email} onChange={e=>set('email',e.target.value)} placeholder="you@email.com" required/></div>
                  <div>
                    <label className="form-label">Subject</label>
                    <select className="form-select" value={form.subject} onChange={e=>set('subject',e.target.value)}>
                      <option value="">Select a subject</option>
                      <option>Car Inquiry</option>
                      <option>Request a Car</option>
                      <option>After-Sale Support</option>
                      <option>Partnership</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div><label className="form-label">Message *</label><textarea className="form-textarea" value={form.message} onChange={e=>set('message',e.target.value)} placeholder="Tell us how we can help..." required style={{minHeight:140}}/></div>
                  <button type="submit" className="btn btn-gold" style={{justifyContent:'center'}}>Send Message</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

// ═══════════════════════════════════════════
// Login.jsx
// ═══════════════════════════════════════════
export function Login() {
  const [form, setForm] = useState({username:'',password:''})
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true)
    try {
      await login(form.username, form.password)
      navigate('/admin')
    } catch {
      toast.error('Invalid credentials')
    } finally { setLoading(false) }
  }

  return (
    <div style={{minHeight:'100vh',background:'var(--navy-950)',display:'flex',
      alignItems:'center',justifyContent:'center',padding:20}}>
      <div style={{width:'100%',maxWidth:420}}>
        <div style={{textAlign:'center',marginBottom:40}}>
          <div style={{width:56,height:56,borderRadius:8,
            background:'linear-gradient(135deg,var(--gold-600),var(--gold-400))',
            margin:'0 auto 16px',display:'flex',alignItems:'center',justifyContent:'center',
            fontFamily:'var(--font-display)',fontSize:22,fontWeight:900,color:'var(--navy-950)'}}>SM</div>
          <h1 style={{fontFamily:'var(--font-display)',fontSize:28,color:'var(--white)',marginBottom:6}}>Admin Login</h1>
          <p style={{fontSize:14,color:'var(--muted)',fontWeight:300}}>Sarkin Mota Autos Management</p>
        </div>
        <div style={{background:'var(--navy-800)',border:'1px solid var(--border)',
          borderRadius:'var(--radius-xl)',padding:40}}>
          <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:18, textAlign:'left'}}>
            <div><label className="form-label">Username</label><input className="form-input" value={form.username} onChange={e=>setForm(p=>({...p,username:e.target.value}))} placeholder="admin" required autoFocus/></div>
            <div><label className="form-label">Password</label><input className="form-input" type="password" value={form.password} onChange={e=>setForm(p=>({...p,password:e.target.value}))} placeholder="••••••••" required/></div>
            <button type="submit" className="btn btn-gold" style={{justifyContent:'center',marginTop:8}} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login