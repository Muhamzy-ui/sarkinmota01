import { useState, useEffect, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { FiSearch, FiSliders, FiX, FiGrid, FiList, FiHeart, FiTrash2 } from 'react-icons/fi'
import CarCard from '../components/CarCard'
import { MOCK_CARS, MOCK_BRANDS } from '../utils/mockData'
import { getCars, getCarBrands } from '../services/api'
import { useSavedCars } from '../context/SavedCarsContext'
import { useCart } from '../context/CartContext'
import { formatPrice, resolveImageUrl } from '../utils/helpers'
import styles from './Cars.module.css'

const CATEGORIES = ['All', 'Tokunbo', 'Nigerian Used', 'Brand New']
const TRANSMISSIONS = ['All', 'Automatic', 'Manual']
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'year_desc', label: 'Year: Newest' },
]

export default function Cars() {
  const [searchParams, setSearchParams] = useSearchParams()
  const viewParam = searchParams.get('view')
  const showSaved = viewParam === 'saved'

  const { savedCars, getSavedCount } = useSavedCars()

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [activeBrand, setActiveBrand] = useState('All')
  const [transmission, setTransmission] = useState('All')
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [sort, setSort] = useState('newest')
  const [view, setView] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [statusFilter, setStatusFilter] = useState('Available')

  const [cars, setCars] = useState([])
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true)
      try {
        const [carsRes, brandsRes] = await Promise.all([
          getCars(),
          getCarBrands()
        ])
        const carData = carsRes.data?.results || carsRes.data || []
        const brandData = brandsRes.data?.results || brandsRes.data || []
        
        setCars(carData.length > 0 ? carData : MOCK_CARS)
        setBrands(brandData.length > 0 ? brandData : MOCK_BRANDS)
      } catch (err) {
        setCars(MOCK_CARS)
        setBrands(MOCK_BRANDS)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const filtered = useMemo(() => {
    let list = showSaved ? [...savedCars] : [...cars]
    if (!showSaved && statusFilter !== 'All') list = list.filter(c => c.status === statusFilter)
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(c => 
        c.title?.toLowerCase().includes(q) || 
        c.brand?.name?.toLowerCase().includes(q) ||
        c.brand_name?.toLowerCase().includes(q)
      )
    }
    if (!showSaved) {
      if (category !== 'All') list = list.filter(c => c.category === category)
      if (activeBrand !== 'All') list = list.filter(c => (c.brand?.name || c.brand_name) === activeBrand)
      if (transmission !== 'All') list = list.filter(c => c.transmission === transmission)
      if (priceMin) list = list.filter(c => Number(c.price) >= Number(priceMin) * 1_000_000)
      if (priceMax) list = list.filter(c => Number(c.price) <= Number(priceMax) * 1_000_000)
    }
    
    if (sort === 'price_asc') list.sort((a, b) => Number(a.price) - Number(b.price))
    if (sort === 'price_desc') list.sort((a, b) => Number(b.price) - Number(a.price))
    if (sort === 'year_desc') list.sort((a, b) => b.year - a.year)
    return list
  }, [cars, savedCars, showSaved, search, category, activeBrand, transmission, priceMin, priceMax, sort, statusFilter])

  const resetFilters = () => {
    setSearch(''); setCategory('All'); setActiveBrand('All')
    setTransmission('All'); setPriceMin(''); setPriceMax('')
    setStatusFilter('Available')
  }

  return (
    <div className={styles.page}>
      {/* Page hero */}
      <div className="page-hero">
        <div className="container">
          <p className="section-eyebrow">Verified Vehicles</p>
          <h1 className="section-title">
            {showSaved ? '❤️ My Saved Cars' : 'Our Inventory'}
          </h1>
          <p className="section-subtitle">
            {showSaved
              ? `You have ${getSavedCount()} saved vehicle${getSavedCount() !== 1 ? 's' : ''}. Click the heart again to remove.`
              : `Browse ${cars.length}+ premium vehicles — Tokunbo, Nigerian Used & Brand New. Every car inspected. Every price transparent.`}
          </p>
        </div>
      </div>

      <div className="container">
        {/* Tab switcher */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 32, marginTop: 24 }}>
          <button
            onClick={() => setSearchParams({})}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 20px', borderRadius: 6, cursor: 'pointer',
              fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600,
              letterSpacing: '0.5px',
              background: !showSaved ? 'var(--gold-500)' : 'transparent',
              color: !showSaved ? 'var(--navy-950)' : 'var(--muted)',
              border: !showSaved ? 'none' : '1px solid var(--border)',
              transition: 'all 0.25s',
            }}>
            <FiGrid size={15} /> All Inventory
          </button>
          <button
            onClick={() => setSearchParams({ view: 'saved' })}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 20px', borderRadius: 6, cursor: 'pointer',
              fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600,
              letterSpacing: '0.5px',
              background: showSaved ? 'rgba(220,60,60,0.15)' : 'transparent',
              color: showSaved ? '#f87171' : 'var(--muted)',
              border: showSaved ? '1px solid rgba(248,113,113,0.4)' : '1px solid var(--border)',
              transition: 'all 0.25s',
            }}>
            <FiHeart size={15} fill={showSaved ? 'currentColor' : 'none'} />
            Saved Cars {getSavedCount() > 0 && `(${getSavedCount()})`}
          </button>
        </div>

        <div className={styles.layout}>

          {/* ── Sidebar ── */}
          {!showSaved && (
            <aside className={`${styles.sidebar} ${showFilters ? styles.sidebarOpen : ''}`}>
              <div className={styles.sidebarHeader}>
                <h3 className={styles.sidebarTitle}>Filters</h3>
                <button onClick={resetFilters} className={styles.resetBtn}>Reset All</button>
                <button className={styles.closeSidebar} onClick={() => setShowFilters(false)}>
                  <FiX size={20} />
                </button>
              </div>

              {/* Status */}
              <FilterGroup label="Availability">
                {['Available', 'Sold', 'All'].map(s => (
                  <FilterRadio key={s} label={s} checked={statusFilter === s}
                    onChange={() => setStatusFilter(s)} />
                ))}
              </FilterGroup>

              {/* Category */}
              <FilterGroup label="Category">
                {CATEGORIES.map(c => (
                  <FilterRadio key={c} label={c} checked={category === c}
                    onChange={() => setCategory(c)} />
                ))}
              </FilterGroup>

              {/* Brand */}
              <FilterGroup label="Brand">
                {['All', ...brands.map(b => b.name)].map(b => (
                  <FilterRadio key={b} label={b} checked={activeBrand === b}
                    onChange={() => setActiveBrand(b)} />
                ))}
              </FilterGroup>

              {/* Transmission */}
              <FilterGroup label="Transmission">
                {TRANSMISSIONS.map(t => (
                  <FilterRadio key={t} label={t} checked={transmission === t}
                    onChange={() => setTransmission(t)} />
                ))}
              </FilterGroup>

              {/* Price range */}
              <FilterGroup label="Price Range (₦M)">
                <div className={styles.priceInputs}>
                  <input type="number" value={priceMin} onChange={e => setPriceMin(e.target.value)}
                    placeholder="Min" className={`form-input ${styles.priceInput}`} />
                  <span className={styles.priceDash}>—</span>
                  <input type="number" value={priceMax} onChange={e => setPriceMax(e.target.value)}
                    placeholder="Max" className={`form-input ${styles.priceInput}`} />
                </div>
              </FilterGroup>
            </aside>
          )}

          {/* Sidebar backdrop */}
          {showFilters && <div className={styles.backdrop} onClick={() => setShowFilters(false)} />}

          {/* ── Main Content ── */}
          <div className={styles.main}>

            {/* Toolbar */}
            <div className={styles.toolbar}>
              <div className={styles.searchBox}>
                <FiSearch size={16} className={styles.searchIcon} />
                <input type="text" value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search cars, brands..."
                  className={styles.searchInput} />
              </div>

              <div className={styles.toolbarRight}>
                <select value={sort} onChange={e => setSort(e.target.value)}
                  className={`form-select ${styles.sortSelect}`}>
                  {SORT_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>

                <div className={styles.viewToggle}>
                  <button onClick={() => setView('grid')}
                    className={`${styles.viewBtn} ${view === 'grid' ? styles.viewActive : ''}`}>
                    <FiGrid size={16} />
                  </button>
                  <button onClick={() => setView('list')}
                    className={`${styles.viewBtn} ${view === 'list' ? styles.viewActive : ''}`}>
                    <FiList size={16} />
                  </button>
                </div>

                {!showSaved && (
                  <button onClick={() => setShowFilters(prev => !prev)}
                    className={`btn btn-outline btn-sm ${styles.filterToggle}`}
                    style={{ background: showFilters ? 'rgba(212,160,23,0.12)' : '' }}>
                    <FiSliders size={14} /> Filters
                  </button>
                )}
              </div>
            </div>

            {/* Result count */}
            <div className={styles.resultMeta}>
              <p className={styles.resultCount}>
                <span>{filtered.length}</span> vehicles {showSaved ? 'saved' : 'found'}
              </p>
              {!showSaved && (category !== 'All' || activeBrand !== 'All' || search) && (
                <button onClick={resetFilters} className={styles.clearBtn}>
                  <FiX size={13} /> Clear filters
                </button>
              )}
            </div>

            {/* Cars / Wishlist */}
            {loading && !showSaved ? (
              <div className={styles.empty}>
                <div className="loader" />
                <p>Finding cars for my bratha...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className={styles.empty}>
                <div className={styles.emptyIcon}>{showSaved ? '💔' : '🔍'}</div>
                <h3 className={styles.emptyTitle}>
                  {showSaved ? 'No saved cars yet' : 'No cars found'}
                </h3>
                <p className={styles.emptySub}>
                  {showSaved
                    ? 'Tap the ❤️ on any vehicle to save it here for quick access.'
                    : 'Try adjusting your filters or search term.'}
                </p>
                {showSaved ? (
                  <button onClick={() => setSearchParams({})} className="btn btn-gold">Browse Inventory</button>
                ) : (
                  <button onClick={resetFilters} className="btn btn-gold">Clear Filters</button>
                )}
              </div>
            ) : showSaved ? (
              /* Premium Wishlist Layout */
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {filtered.map(car => <WishlistCard key={car.id} car={car} />)}
                {/* Summary bar */}
                <div style={{
                  marginTop: 8, padding: '16px 20px',
                  background: 'rgba(212,160,23,0.06)',
                  border: '1px solid rgba(212,160,23,0.2)',
                  borderRadius: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  flexWrap: 'wrap', gap: 12,
                }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--muted)' }}>
                    {filtered.length} vehicle{filtered.length !== 1 ? 's' : ''} saved
                  </span>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={() => setSearchParams({})} className="btn btn-outline btn-sm">
                      + Browse More
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className={view === 'grid' ? styles.carsGrid : styles.carsList}>
                {filtered.map(car => <CarCard key={car.id} car={car} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Wishlist Card ── */
function WishlistCard({ car }) {
  const { toggleSavedCar } = useSavedCars()
  const { addToCart, isInCart } = useCart()

  const primaryImg = resolveImageUrl(car.primary_image || car.images?.[0]?.image || car.images?.[0]?.url)
  const inCart = isInCart(car.id)
  const pStr = formatPrice(car.price)

  return (
    <div className={styles.wishlistCard}>
      {/* Image */}
      <div className={styles.wishlistImage}>
        {primaryImg ? (
          <img src={primaryImg} alt={car.title} />
        ) : (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>🚗</div>
        )}
        {car.status === 'Sold' && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(4,8,18,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '2px', color: '#94a3b8', textTransform: 'uppercase', padding: '4px 10px', background: 'rgba(100,116,139,0.3)', borderRadius: 3, border: '1px solid rgba(100,116,139,0.4)' }}>Sold</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className={styles.wishlistInfo}>
        <p className={styles.wishlistBrand}>{car.brand?.name || car.brand_name}</p>
        <h3 className={styles.wishlistTitle}>{car.title}</h3>
        <div className={styles.wishlistMeta}>
          {car.year && <span>{car.year}</span>}
          {car.transmission && <span>• {car.transmission}</span>}
          {car.mileage && <span>• {Number(car.mileage).toLocaleString()} km</span>}
        </div>
        <p className={styles.wishlistPrice}>{pStr}</p>
        
        <div className={styles.wishlistActions}>
          <Link to={`/cars/${car.slug}`} className="btn btn-gold btn-sm">View Details</Link>
          <button 
            onClick={() => addToCart(car)} 
            className={`btn btn-outline btn-sm ${inCart ? 'btn-success' : ''}`}
            style={{ color: inCart ? '#4ade80' : '', borderColor: inCart ? 'rgba(74,222,128,0.4)' : '' }}
          >
            {inCart ? '✓ In Cart' : '🛒 Add to Cart'}
          </button>
        </div>
      </div>

      {/* Remove */}
      <div className={styles.wishlistRemove}>
        <button onClick={() => toggleSavedCar(car)} className={styles.removeBtn} title="Remove from wishlist">
          <FiTrash2 size={18} />
        </button>
      </div>
    </div>
  )
}


function FilterGroup({ label, children }) {
  const [open, setOpen] = useState(true)
  return (
    <div style={{borderBottom: '1px solid var(--border)', paddingBottom: 20, marginBottom: 20}}>
      <button onClick={() => setOpen(!open)}
        style={{display:'flex', justifyContent:'space-between', alignItems:'center',
          width:'100%', background:'none', border:'none', cursor:'pointer',
          color:'var(--gold-400)', fontSize:11, fontWeight:700,
          letterSpacing:'2px', textTransform:'uppercase', marginBottom: open ? 14 : 0,
          fontFamily:'var(--font-body)'}}>
        {label}
        <span style={{color:'var(--muted)', fontSize:18, lineHeight:1}}>{open ? '−' : '+'}</span>
      </button>
      {open && <div style={{display:'flex', flexDirection:'column', gap:10}}>{children}</div>}
    </div>
  )
}

function FilterRadio({ label, checked, onChange }) {
  return (
    <label style={{display:'flex', alignItems:'center', gap:10, cursor:'pointer'}}>
      <div onClick={onChange}
        style={{
          width:18, height:18, borderRadius:'50%',
          border: `2px solid ${checked ? 'var(--gold-500)' : 'var(--border-strong)'}`,
          background: checked ? 'var(--gold-500)' : 'transparent',
          flexShrink:0, transition:'all 0.2s',
          display:'flex', alignItems:'center', justifyContent:'center',
        }}>
        {checked && <div style={{width:6, height:6, borderRadius:'50%', background:'var(--navy-950)'}} />}
      </div>
      <span onClick={onChange}
        style={{fontSize:14, color: checked ? 'var(--off-white)' : 'var(--muted)',
          fontWeight: checked ? 500 : 300, transition:'color 0.2s'}}>
        {label}
      </span>
    </label>
  )
}