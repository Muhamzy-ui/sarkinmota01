// ═══════════════════════════════════════════
// About.jsx
// ═══════════════════════════════════════════
import { Link } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'
import AnimatedHeroCard from '../components/AnimatedHeroCard'
import { MOCK_TESTIMONIALS, MOCK_STATS } from '../utils/mockData'
import { HiOutlineStar } from 'react-icons/hi'

export function About() {
  const MILESTONES = [
    { year: '2012', event: 'Founded Sarkin Mota Autos in Kano with a vision to transform how Nigerians buy premium cars.' },
    { year: '2016', event: 'Expanded to Abuja. Grew to 50+ car transactions per month.' },
    { year: '2020', event: 'Launched on TikTok. "My Bratha!" became a national catchphrase overnight.' },
    { year: '2022', event: 'Hit 500,000 TikTok followers. Recognised as Nigeria\'s most followed car dealer on social media.' },
    { year: '2024', event: 'Crossed 800,000 followers across TikTok & Instagram. 300+ cars delivered nationwide annually.' },
  ]
  const AWARDS = [
    { icon: '👑', title: 'Sarkin Motochin Kasar Hausa', sub: 'King of Cars, Northern Nigeria' },
    { icon: '🏆', title: 'Nigeria Auto Influencer Award', sub: 'Most Followed Dealer on TikTok 2023' },
    { icon: '🌟', title: '5-Star Verified Dealer', sub: 'Rated by 300+ satisfied buyers' },
    { icon: '🇳🇬', title: 'National Auto Expo', sub: 'Featured Dealer 2022 & 2023' },
  ]

  return (
    <div style={{minHeight:'100vh'}}>
      {/* Hero */}
      <div className="page-hero">
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '60px', alignItems: 'center' }}>
          <div>
            <p className="section-eyebrow">The Man. The Brand. The Legend.</p>
            <h1 className="section-title">
              Meet <span className="gold-gradient">Dr. Aliyu Mohammad</span>
              <br/>Sarkin Mota
            </h1>
            <p className="section-subtitle">
              From a single showroom in Kano to Nigeria's most recognised car dealer on social media —
              this is the Sarkin Mota story.
            </p>
          </div>
          <div className="animate-in delay-2" style={{ display: 'flex', justifyContent: 'center' }}>
            <AnimatedHeroCard 
              imageSrc="/SARKIN-MOTA-PROFILE.JPG"
              title="Dr. Aliyu Mohammad"
              subtitle="The King of Auto Sales"
            />
          </div>
        </div>
      </div>

      {/* Bio Section */}
      <section className="section">
        <div className="container">
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))',gap:80,alignItems:'center'}}>
            {/* Visual */}
            <div style={{background:'var(--navy-800)',border:'1px solid var(--border-strong)',
              borderRadius:'var(--radius-xl)',padding:48,textAlign:'center',position:'relative',overflow:'hidden'}}>
              <div style={{position:'absolute',top:0,left:0,right:0,height:3,
                background:'linear-gradient(90deg,transparent,var(--gold-500),transparent)'}}/>
              <div style={{width:120,height:120,borderRadius:'50%',
                background:'var(--navy-900)', border:'2px solid var(--gold-500)',
                margin:'0 auto 24px',display:'flex',alignItems:'center',justifyContent:'center',
                overflow:'hidden'}}>
                <img src="/SARKIN-MOTA-PROFILE.JPG" alt="Dr. Aliyu Mohammad" 
                     style={{width:'100%',height:'100%',objectFit:'cover'}}
                     onError={(e) => { 
                       e.target.src = 'https://ui-avatars.com/api/?name=Aliyu+Mohammad&background=D4A017&color=070f1f';
                     }} />
              </div>
              <h2 style={{fontFamily:'var(--font-display)',fontSize:28,color:'var(--white)',marginBottom:6}}>
                Dr. Aliyu Mohammad
              </h2>
              <p style={{fontSize:13,fontWeight:700,letterSpacing:'3px',textTransform:'uppercase',
                color:'var(--gold-400)',marginBottom:24}}>
                CEO, Sarkin Mota Autos
              </p>
              <div style={{display:'flex',flexDirection:'column',gap:12}}>
                {['Sarkin Motochin Kasar Hausa','Nigeria\'s #1 TikTok Car Dealer','12+ Years in Automotive Industry'].map(t=>(
                  <div key={t} style={{display:'flex',alignItems:'center',gap:10,
                    background:'rgba(212,160,23,0.06)',border:'1px solid var(--border)',
                    borderRadius:'var(--radius-sm)',padding:'10px 16px',textAlign:'left'}}>
                    <div style={{width:6,height:6,borderRadius:'50%',background:'var(--gold-500)',flexShrink:0}}/>
                    <span style={{fontSize:13,color:'var(--muted)',fontWeight:300}}>{t}</span>
                  </div>
                ))}
              </div>
              {/* Social stats */}
              <div style={{display:'flex',justifyContent:'space-around',marginTop:28,
                paddingTop:28,borderTop:'1px solid var(--border)'}}>
                {[{n:'800K+',l:'TikTok'},{n:'479K+',l:'Instagram'},{n:'144K+',l:'Twitter'}].map(s=>(
                  <div key={s.l} style={{textAlign:'center'}}>
                    <p style={{fontFamily:'var(--font-display)',fontSize:22,fontWeight:900,
                      background:'linear-gradient(135deg,var(--gold-300),var(--gold-500))',
                      WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>{s.n}</p>
                    <p style={{fontSize:11,color:'var(--muted)',fontWeight:600,letterSpacing:'1px',textTransform:'uppercase'}}>{s.l}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Text */}
            <div>
              <p className="section-eyebrow">The Story</p>
              <h2 className="section-title" style={{fontSize:'clamp(32px,4vw,52px)'}}>
                Built on Trust,<br/>
                <span className="gold-gradient">Driven by Passion</span>
              </h2>
              <div className="gold-line"/>
              <div style={{display:'flex',flexDirection:'column',gap:16}}>
                {[
                  `Dr. Aliyu Mohammad didn't set out to become Nigeria's most famous car dealer. He started with a simple mission: give Nigerians access to quality vehicles at honest prices.`,
                  `Over 12 years, Sarkin Mota Autos grew from a single showroom in Kano into a nationwide operation — with clients from Lagos to Port Harcourt, Abuja to Kaduna.`,
                  `When he joined TikTok, his authentic personality and "My Bratha!" catchphrase captured the hearts of millions. Today he's the most followed car dealer in Nigeria — not because of marketing tricks, but because he is exactly who he appears to be: honest, passionate, and genuinely committed to his customers.`
                ].map((p,i)=>(
                  <p key={i} style={{fontSize:16,color:'var(--muted)',fontWeight:300,lineHeight:1.8}}>{p}</p>
                ))}
              </div>
              <Link to="/cars" className="btn btn-gold" style={{marginTop:32}}>
                Browse Our Inventory <FiArrowRight size={16}/>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section section-dark">
        <div className="container">
          <p className="section-eyebrow">The Journey</p>
          <h2 className="section-title" style={{marginBottom:60}}>12 Years of Excellence</h2>
          <div style={{position:'relative',maxWidth:800,margin:'0 auto'}}>
            <div style={{position:'absolute',left:79,top:0,bottom:0,width:1,background:'var(--border)'}}/>
            {MILESTONES.map(({year,event},i)=>(
              <div key={i} style={{display:'flex',gap:40,marginBottom:48,position:'relative'}}>
                <div style={{width:80,textAlign:'right',flexShrink:0}}>
                  <span style={{fontFamily:'var(--font-display)',fontSize:18,fontWeight:700,color:'var(--gold-400)'}}>{year}</span>
                </div>
                <div style={{width:20,height:20,borderRadius:'50%',background:'var(--gold-500)',
                  border:'3px solid var(--navy-800)',position:'relative',zIndex:1,flexShrink:0,marginTop:2}}/>
                <p style={{fontSize:15,color:'var(--muted)',fontWeight:300,lineHeight:1.7,flex:1}}>{event}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards */}
      <section className="section">
        <div className="container">
          <p className="section-eyebrow">Recognition</p>
          <h2 className="section-title" style={{marginBottom:48}}>Awards & Titles</h2>
          <div className="grid-4">
            {AWARDS.map(({icon,title,sub})=>(
              <div key={title} style={{background:'var(--navy-800)',border:'1px solid var(--border)',
                borderRadius:'var(--radius-lg)',padding:32,textAlign:'center',transition:'all .3s'}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--border-strong)';e.currentTarget.style.transform='translateY(-4px)'}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.transform='translateY(0)'}}>
                <div style={{fontSize:48,marginBottom:16}}>{icon}</div>
                <h4 style={{fontFamily:'var(--font-display)',fontSize:18,color:'var(--white)',marginBottom:8}}>{title}</h4>
                <p style={{fontSize:13,color:'var(--muted)',fontWeight:300}}>{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section section-dark">
        <div className="container">
          <p className="section-eyebrow">Customer Stories</p>
          <h2 className="section-title" style={{marginBottom:48}}>What Buyers Say</h2>
          <div className="grid-3">
            {MOCK_TESTIMONIALS.map(t=>(
              <div key={t.id} style={{background:'var(--navy-700)',border:'1px solid var(--border)',
                borderRadius:'var(--radius-xl)',padding:36}}>
                <div style={{display:'flex',gap:4,marginBottom:20}}>
                  {[...Array(t.rating)].map((_,i)=><HiOutlineStar key={i} size={18} color="var(--gold-400)"/>)}
                </div>
                <p style={{fontFamily:'var(--font-heading)',fontSize:17,fontStyle:'italic',
                  color:'var(--off-white)',lineHeight:1.7,marginBottom:24, textAlign:'left'}}>"{t.review}"</p>
                <div style={{display:'flex',alignItems:'center',gap:14}}>
                  <div style={{width:44,height:44,borderRadius:'50%',
                    background:'linear-gradient(135deg,var(--gold-600),var(--gold-400))',
                    display:'flex',alignItems:'center',justifyContent:'center',
                    fontFamily:'var(--font-display)',fontSize:18,fontWeight:700,color:'var(--navy-950)'}}>
                    {t.customer_name.charAt(0)}
                  </div>
                  <div>
                    <p style={{fontSize:14,fontWeight:600,color:'var(--white)', textAlign:'left'}}>{t.customer_name}</p>
                    <p style={{fontSize:12,color:'var(--muted)',fontWeight:300,marginTop:2, textAlign:'left'}}>{t.car_bought}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section">
        <div className="container">
          <p className="section-eyebrow">Our Values</p>
          <h2 className="section-title" style={{marginBottom:48}}>The Pillars of Sarkin Mota</h2>
          <div className="grid-4" style={{textAlign:'left'}}>
            {[
              {title:'Trust', icon:'🤝', text:'Our business is built on the word of our brathas. We are honest in every deal.'},
              {title:'Quality', icon:'💎', text:'Zero compromise. Every car is handpicked and thoroughly inspected.'},
              {title:'Transparency', icon:'📖', text:'The story of every car is open. No hidden fees, no hidden faults.'},
              {title:'Nationwide', icon:'🇳🇬', text:'Wherever you are in Nigeria, we deliver your dream car to your doorstep.'},
            ].map(v=>(
              <div key={v.title} style={{padding:24, background:'var(--navy-900)', border:'1px solid var(--border)', borderRadius:'var(--radius-lg)'}}>
                <div style={{fontSize:32, marginBottom:16}}>{v.icon}</div>
                <h4 style={{fontSize:18, color:'var(--white)', marginBottom:12}}>{v.title}</h4>
                <p style={{fontSize:14, color:'var(--muted)', fontWeight:300, lineHeight:1.6}}>{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section section-dark" style={{textAlign:'center'}}>
        <div className="container">
          <div style={{maxWidth:700, margin:'0 auto'}}>
            <h2 className="section-title" style={{fontSize:'clamp(28px,4vw,48px)'}}>
              Join the <span className="gold-gradient">Sarkin Mota</span> Family
            </h2>
            <p className="section-subtitle" style={{margin:'0 auto 40px'}}>
              Experience the best car buying experience in Nigeria. From the first chat to the final delivery, 
              we are with you every step of the way.
            </p>
            <div style={{display:'flex', gap:20, justifyContent:'center', flexWrap:'wrap'}}>
              <Link to="/cars" className="btn btn-gold">Browse Inventory</Link>
              <Link to="/contact" className="btn btn-outline">Contact Us</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About