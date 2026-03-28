import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiPlay, FiChevronRight, FiCheckCircle, FiTrendingUp, FiMessageCircle, FiAward, FiShield, FiTruck } from 'react-icons/fi'
import { HiOutlineStar, HiOutlineSparkles } from 'react-icons/hi'
import { SiTiktok } from 'react-icons/si'
import CarCard from '../components/CarCard'
import AnimatedHeroCard from '../components/AnimatedHeroCard'
import FlipCard from '../components/FlipCard'
import { MOCK_CARS, MOCK_TESTIMONIALS, MOCK_POSTS } from '../utils/mockData'
import { formatPrice, formatDate } from '../utils/helpers'
import { getCars } from '../services/api'
import styles from './Home.module.css'

const STATS = [
  { value: '1.5M+', label: 'TikTok Followers' },
  { value: '12M+', label: 'Total Likes' },
  { value: '312+', label: 'Cars Delivered' },
  { value: '18+', label: 'Car Brands' },
]

const TIKTOK_VIDEOS = [
  { 
    id: 1, 
    views: '1.3M', 
    likes: '50K+', 
    caption: 'My meeting with the ... [SARKINMOTA AUTOS Details]',
    url: 'https://www.tiktok.com/@alamin_sarkinmota/video/7547074004318719240',
    thumb: '/assets/tiktok/vid1.jpg'
  },
  { 
    id: 2, 
    views: '1.7M', 
    likes: '80K+', 
    caption: 'Alhamdulillah SARKINMOTA AUTOS 2.0 launched successfully.',
    url: 'https://www.tiktok.com/@alamin_sarkinmota/video/7495098572547837190',
    thumb: '/assets/tiktok/vid2.jpg'
  },
  { 
    id: 3, 
    views: '8.5M', 
    likes: '200K+', 
    caption: 'Sarkin mota showcasing new arrivals.',
    url: 'https://www.tiktok.com/@alamin_sarkinmota/video/7429050414764412165',
    thumb: '/assets/tiktok/vid3.jpg'
  },
  { 
    id: 4, 
    views: '1.4K', 
    likes: '500+', 
    caption: 'Professional consultation at Sarkinmota Autos office.',
    url: 'https://www.tiktok.com/@alamin_sarkinmota/video/7621703768043834644',
    thumb: '/assets/tiktok/vid4.jpg'
  },
]

export default function Home() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const [showAllBlog, setShowAllBlog] = useState(false)
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [cars, setCars] = useState([])
  const [loadingCars, setLoadingCars] = useState(true)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    getCars({ limit: 8 })
      .then(res => {
        const data = res.data?.results || res.data || []
        setCars(data.length > 0 ? data : MOCK_CARS.slice(0, 8))
      })
      .catch(() => setCars(MOCK_CARS.slice(0, 8)))
      .finally(() => setLoadingCars(false))
  }, [])

  useEffect(() => {
    const t = setInterval(() => {
      setActiveTestimonial(p => (p + 1) % MOCK_TESTIMONIALS.length)
    }, 5000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className={styles.page}>

      {/* ── HERO ───────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <div className={styles.heroGlow1} />
          <div className={styles.heroGlow2} />
          <div className={styles.heroGrid} />
        </div>

        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroContent}>
            <div className={`animate-in delay-1`} style={{marginBottom: 20}}>
              {isMobile ? (
                <div className={styles.mobileHeroLogoCard}>
                  <img src="/logo-gold.png" alt="Sarkin Mota" className={styles.mobileHeroLogo} />
                  <div className={styles.mobileHeroText}>
                    <h3>Sarkin Mota</h3>
                    <span>Nigeria's Most Trusted</span>
                  </div>
                </div>
              ) : (
                <FlipCard 
                  frontImage="/logo-gold.png" 
                  title="Sarkin Mota"
                  backText="Nigeria's most trusted luxury car dealer. From Kano to the world, we deliver quality with zero compromise. My Bratha, your dream car is here."
                />
              )}
            </div>

            <div className={`section-eyebrow animate-in delay-1 ${styles.eyebrow}`}>
              Nigeria's Premier Auto House
            </div>

            <h1 className={`animate-in delay-2 ${styles.heroTitle}`}>
              <span className={styles.titleLine1}>MY BRATHA,</span>
              <span className={`shimmer-text ${styles.titleLine2}`}>CHOOSE</span>
              <span className={styles.titleLine3}>YOUR CAR</span>
            </h1>

            <p className={`animate-in delay-3 ${styles.heroSub}`}>
              Nigeria's most trusted luxury car dealer. Tokunbo, Nigerian Used & Brand New.
              Nationwide delivery. Zero compromise on quality.
            </p>

            <div className={`animate-in delay-4 ${styles.heroCtas}`}>
              <Link to="/cars" className="btn btn-gold">
                Browse Inventory
                <FiArrowRight size={16} />
              </Link>
              <Link to="/request-car" className="btn btn-outline">
                Request a Car
              </Link>
            </div>

            <div className={`animate-in delay-5 ${styles.trustRow}`}>
              <div className={styles.trustBadge}>
                <div className={styles.trustStars}>
                  {[...Array(5)].map((_, i) => <HiOutlineStar key={i} size={14} fill="var(--gold-400)" color="var(--gold-400)" />)}
                </div>
                <span>5.0 Rating</span>
              </div>
              <div className={styles.trustDivider} />
              <div className={styles.trustBadge}>
                <span className={styles.trustDot} />
                <span>1.5M+ Followers</span>
              </div>
            </div>
          </div>

          <div className={`animate-in delay-3 ${styles.heroVisual}`}>
            <AnimatedHeroCard 
              imageSrc="/SARKIN-MOTA-PROFILE.JPG"
              title="Dr. Aliyu Mohammad"
              subtitle="Nigeria's #1 Car Dealer"
            />
          </div>
        </div>
      </section>

      {/* ── STATS ──────────────────────────────────── */}
      <section className={styles.statsBar}>
        <div className="container">
          <div className={styles.statsGrid}>
            {STATS.map((s, i) => (
              <div key={i} className={styles.statItem}>
                <div className={styles.statValue}>{s.value}</div>
                <div className={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED DEAL (EX-HERO) ───────────────── */}
      <section className="section section-light" style={{paddingBottom: 0}}>
        <div className="container">
          <div className={styles.specialDeal}>
            <div className={styles.heroCard} style={{maxWidth: 500, margin: '0 auto'}}>
              <div className={styles.heroCardTop}>
                <div className={styles.heroCardLive}>
                  <div className={styles.liveDot} />
                  <span>DEAL OF THE WEEK</span>
                </div>
                <div className={styles.trustStars}>
                  {[...Array(5)].map((_, i) => <HiOutlineStar key={i} size={14} fill="var(--gold-400)" color="var(--gold-400)" />)}
                </div>
              </div>

              <div className={styles.heroCarVisual}>
                <svg viewBox="0 0 480 240" className={styles.heroCarSvg}>
                  <defs>
                    <linearGradient id="carGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="var(--gold-600)" />
                      <stop offset="100%" stopColor="var(--gold-400)" />
                    </linearGradient>
                  </defs>
                  <path d="M60 155 L97 97 Q135 72 170 70 L310 70 Q345 72 383 97 L420 155 L432 168 L432 186 L48 186 L48 168 Z" 
                        fill="rgba(212,160,23,0.1)" stroke="url(#carGrad2)" strokeWidth="2.5"/>
                  <circle cx="148" cy="186" r="34" fill="var(--navy-950)" stroke="var(--gold-500)" strokeWidth="3"/>
                  <circle cx="148" cy="186" r="20" fill="rgba(212,160,23,0.2)" stroke="var(--gold-400)" strokeWidth="1"/>
                  <circle cx="332" cy="186" r="34" fill="var(--navy-950)" stroke="var(--gold-500)" strokeWidth="3"/>
                  <circle cx="332" cy="186" r="20" fill="rgba(212,160,23,0.2)" stroke="var(--gold-400)" strokeWidth="1"/>
                  <path d="M160 102 L188 75 L292 75 L320 102 Z" fill="rgba(21,45,96,0.8)" stroke="rgba(212,160,23,0.3)" strokeWidth="1.5"/>
                </svg>
              </div>

              <div className={styles.heroCardInfo}>
                <div>
                  <p className={styles.heroCarBrand}>Special Listing</p>
                  <h3 className={styles.heroCarName}>Mercedes-Benz G63 AMG</h3>
                  <p className={styles.heroCarSpecs}>2023 · 0KM · Biturbo V8</p>
                </div>
                <div>
                  <p className={styles.heroPriceLabel}>Asking Price</p>
                  <p className={styles.heroPriceValue}>₦185M</p>
                </div>
              </div>

              <div className={styles.heroCardActions} style={{marginTop: 10}}>
                <Link to="/cars/mercedes-benz-gle-2022" className="btn btn-gold btn-sm" style={{flex:1, justifyContent:'center'}}>View Details</Link>
                <button className="btn btn-outline btn-sm" style={{padding:'10px'}}>
                  <HiOutlineSparkles size={18}/>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED CARS ──────────────────────────── */}
      <section className="section" id="inventory">
        <div className="container">
          <div className={styles.sectionHead}>
            <div>
              <p className="section-eyebrow">Handpicked Vehicles</p>
              <h2 className="section-title">New Arrivals & Featured</h2>
            </div>
            <Link to="/cars" className={`btn btn-outline ${styles.viewAllBtn}`}>
              Explore All <FiArrowRight size={16} />
            </Link>
          </div>

          <div className={styles.carsGrid}>
            {cars.slice(0, isMobile ? 4 : 8).map((car, index) => (
              <CarCard key={car.id || index} car={car} variant="home" />
            ))}
          </div>

          <div className={styles.inventoryCta}>
            <Link to="/cars" className="btn btn-gold">View More Cars</Link>
            <Link to="/request-car" className="btn btn-outline">Don't see your car? Request it</Link>
          </div>
        </div>
      </section>

      {/* ── FOUNDER SECTION (EX-HERO) ──────────────── */}
      <section className="section section-dark">
        <div className="container" style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap: 60, alignItems:'center'}}>
          <div className={styles.profileCard}>
            <div className={styles.verifiedBadge}>✓ Verified Dealer</div>
            
            <div className={styles.ringWrap}>
              <div className={styles.ringSpinner} />
              <div className={styles.ringPhoto}>
                <img src="/SARKIN-MOTA-PROFILE.JPG" alt="Dr. Aliyu Mohammad" className={styles.realPhoto} 
                     onError={(e) => { 
                       e.target.src = 'https://ui-avatars.com/api/?name=Aliyu+Mohammad&background=D4A017&color=070f1f';
                     }} />
              </div>
            </div>

            <div className={styles.profileName}>
              <h3 className={styles.pName}>Dr. Aliyu Mohammad</h3>
              <p className={styles.pTitle}>Sarkin Motochin Kasar Hausa</p>
            </div>

            <div className={styles.profileStats}>
              <div className={styles.pStat}>
                <span className={styles.pStatNum}>12+</span>
                <span className={styles.pStatLabel}>Years</span>
              </div>
              <div className={styles.pStat}>
                <span className={styles.pStatNum}>300+</span>
                <span className={styles.pStatLabel}>Deals</span>
              </div>
              <div className={styles.pStat}>
                <span className={styles.pStatNum}>5.0</span>
                <span className={styles.pStatLabel}>Rating</span>
              </div>
            </div>

            <div className={styles.floatCard}>
              <span className={styles.floatIcon}>📈</span>
              <div>
                <p className={styles.floatTitle}>Market Leader</p>
                <p className={styles.floatSub}>Nigeria's #1 Car Dealer</p>
              </div>
            </div>
          </div>
          <div>
            <p className="section-eyebrow">Trust & Integrity</p>
            <h2 className="section-title white">A Promise from the Founder</h2>
            <p className={styles.whyText}>
              "My Bratha, every car that leaves our house carries my personal seal of quality. 
              We are not just selling machines; we are building relationships based on trust 
              and mutual respect across the nation."
            </p>
            <div style={{display:'flex', gap: 20}}>
               <div style={{display:'flex', alignItems:'center', gap: 8, color: 'var(--gold-400)', border: '1px solid rgba(212,160,23,0.2)', padding:'10px 20px', borderRadius:8}}>
                  <FiAward /> <span>Verified Dealer</span>
               </div>
               <div style={{display:'flex', alignItems:'center', gap: 8, color: 'var(--gold-400)', border: '1px solid rgba(212,160,23,0.2)', padding:'10px 20px', borderRadius:8}}>
                  <FiShield /> <span>Zero Compromise</span>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ──────────────────────────── */}
      <section className={`section ${styles.whySection}`}>
        <div className="container">
          <div className={styles.whyGrid}>
            <div className={styles.whyContent}>
              <p className="section-eyebrow">The Sarkin Mota Difference</p>
              <h2 className="section-title">Why My Bratha Trusts Us</h2>
              <p className={styles.whyText}>
                We are more than just a car dealer. We are an auto house built on integrity,
                transparency, and the pursuit of automotive excellence.
              </p>

              <div className={styles.quote}>
                <span className={styles.quoteMarks}>"</span>
                <p className={styles.quote}>
                  Everything we do is for our brathas across Nigeria. 
                  Quality is our signature.
                  <span className={styles.quoteAttr}>— CEO Sarkin Mota</span>
                </p>
              </div>
            </div>

            <div className={styles.whyRight}>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>🛡️</div>
                <div className={styles.featureText}>
                  <h4 className={styles.featureTitle}>Verified & Inspected</h4>
                  <p className={styles.featureDesc}>Every vehicle undergoes a thorough 50-point inspection before listing.</p>
                </div>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>🚚</div>
                <div className={styles.featureText}>
                  <h4 className={styles.featureTitle}>Nationwide Delivery</h4>
                  <p className={styles.featureDesc}>From Kano to Lagos, Port Harcourt to Abuja — we deliver to your doorstep.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TIKTOK SECTION ─────────────────────────── */}
      <section className={`section section-dark ${styles.tiktokSection}`}>
        <div className="container">
          <div className={styles.tiktokHead}>
            <div>
              <p className="section-eyebrow">Dr. Aliyu on TikTok</p>
              <h2 className="section-title white">Join the Movement</h2>
            </div>
            <a href="https://tiktok.com/@alamin_sarkinmota" target="_blank" rel="noopener noreferrer" 
               className="btn btn-navy" style={{gap:10}}>
              <SiTiktok size={18} /> Follow @alamin_sarkinmota
            </a>
          </div>

          <div className={styles.tiktokGrid}>
            {TIKTOK_VIDEOS.map(video => (
              <a key={video.id} href={video.url} target="_blank" rel="noopener noreferrer" className={styles.tiktokCard}>
                <div className={styles.tiktokThumb} style={{ 
                  backgroundImage: `url(${video.thumb})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}>
                  <div className={styles.tiktokGlow} />
                  <div className={styles.tiktokPlayBtn}>
                    <FiPlay size={20} fill="white" color="white" />
                  </div>
                </div>
                <div className={styles.tiktokMeta}>
                  <p className={styles.tiktokCaption}>{video.caption}</p>
                  <div className={styles.tiktokStats}>
                    <span>👁️ {video.views}</span>
                    <span>❤️ {video.likes}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>

          <div className={styles.tiktokFollowers}>
            <div className={styles.followerStat}>
              <span className={styles.followerNum}>1.5M+</span>
              <span className={styles.followerLabel}>Followers</span>
            </div>
            <div className={styles.followerDivider} />
            <div className={styles.followerStat}>
              <span className={styles.followerNum}>12M+</span>
              <span className={styles.followerLabel}>Total Likes</span>
            </div>
            <div className={styles.followerDivider} />
            <div className={styles.followerStat}>
              <span className={styles.followerNum}>150M+</span>
              <span className={styles.followerLabel}>Total Views</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ───────────────────────────── */}
      <section className={`section ${styles.testimonialSection}`}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <p className="section-eyebrow">Success Stories</p>
            <h2 className="section-title">What Our Clients Say</h2>
          </div>

          <div className={styles.testimonialTrack}>
            {MOCK_TESTIMONIALS.slice(0, 3).map((t, i) => (
              <div key={t.id}
                className={`${styles.testimonialCard} ${i === activeTestimonial ? styles.testimonialActive : ''}`}>
                <div className={styles.testimonialStars}>
                  {[...Array(5)].map((_, j) => <HiOutlineStar key={j} size={16} fill="var(--gold-400)" color="var(--gold-400)" />)}
                </div>
                <p className={styles.testimonialText}>"{t.review}"</p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.testimonialAvatar}>
                    {t.customer_name?.[0]}
                  </div>
                  <div>
                    <p className={styles.testimonialName}>{t.customer_name}</p>
                    <p className={styles.testimonialCar}>{t.car_bought} · {t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.testimonialDots}>
            {[0, 1, 2].map((_, i) => (
              <button key={i} className={`${styles.dot} ${i === activeTestimonial ? styles.dotActive : ''}`}
                onClick={() => setActiveTestimonial(i)} />
            ))}
          </div>
        </div>
      </section>

      {/* ── BLOG ───────────────────────────────────── */}
      <section className={`section section-dark ${styles.blogSection}`}>
        <div className="container">
          <div className={styles.sectionHead}>
            <div>
              <p className="section-eyebrow">Car Knowledge Hub</p>
              <h2 className="section-title white">Latest from the Blog</h2>
            </div>
            <Link to="/blog" className={`btn btn-outline ${styles.viewAllBtn}`}>
              All Articles <FiArrowRight size={16} />
            </Link>
          </div>

          <div className={styles.blogGrid}>
            {(isMobile && !showAllBlog ? MOCK_POSTS.slice(0, 1) : MOCK_POSTS.slice(0, 3)).map((post, i) => (
              <Link key={post.id} to={`/blog/${post.slug}`}
                className={`${styles.blogCard} ${i === 0 && !isMobile ? styles.blogFeatured : ''}`}>
                <div className={styles.blogThumb}>
                  <div className={styles.blogThumbInner}>
                    <span className={styles.blogThumbIcon}>
                      {i === 0 ? '📊' : i === 1 ? '💰' : '🏆'}
                    </span>
                  </div>
                </div>
                <div className={styles.blogBody}>
                  <span className={styles.blogCat}>{post.category?.name || 'Automotive'}</span>
                  <h3 className={styles.blogTitle}>{post.title}</h3>
                  <p className={styles.blogExcerpt}>{post.excerpt}</p>
                  <div className={styles.blogFooter}>
                    <span className={styles.blogDate}>{formatDate(post.published_at)}</span>
                    <span className={styles.blogRead}>
                      Read Article <FiChevronRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {isMobile && (
            <div style={{ textAlign: 'center', marginTop: 32 }}>
              <button 
                onClick={() => setShowAllBlog(!showAllBlog)}
                className="btn btn-outline btn-sm"
              >
                {showAllBlog ? 'Show Less' : 'Show More Articles'}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA BANNER ─────────────────────────────── */}
      <section className={styles.ctaBanner}>
        <div className={styles.ctaBannerBg}>
          <div className={styles.ctaGlow} />
        </div>
        <div className="container">
          <div className={styles.ctaInner}>
            <div>
              <p className="section-eyebrow">Ready to Drive?</p>
              <h2 className={styles.ctaTitle}>
                Can't Find Your<br />
                <span className="gold-gradient">Dream Car?</span>
              </h2>
              <p className={styles.ctaSub}>
                Tell us what you want — brand, model, year, budget. My Bratha, we dey for you!
              </p>
            </div>
            <div className={styles.ctaActions}>
              <Link to="/request-car" className="btn btn-gold">
                Request a Car
                <FiArrowRight size={16} />
              </Link>
              <a href="https://wa.me/2348000000000" target="_blank" rel="noopener noreferrer"
                className="btn btn-outline" style={{gap:10}}>
                <FiMessageCircle size={18}/> Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}