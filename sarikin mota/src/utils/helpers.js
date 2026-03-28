// Format price in Naira
export const formatPrice = (amount) => {
  if (!amount) return '₦0'
  return `₦${Number(amount).toLocaleString('en-NG')}`
}

// Format date
export const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-NG', {
    day: 'numeric', month: 'long', year: 'numeric'
  })
}

// Truncate text
export const truncate = (str, n) =>
  str?.length > n ? str.slice(0, n) + '...' : str

// Build WhatsApp link
export const buildWhatsApp = (phone, carTitle) => {
  const msg = encodeURIComponent(
    `Hello! I am interested in the ${carTitle}. Please share more details. Thank you!`
  )
  return `https://wa.me/${phone}?text=${msg}`
}

// Mileage format
export const formatMileage = (km) =>
  km ? `${Number(km).toLocaleString()} KM` : 'N/A'

// Resolve relative vs absolute image URLs
export const resolveImageUrl = (url) => {
  if (!url) return null
  if (typeof url !== 'string') return url
  if (url.startsWith('http') || url.startsWith('blob:') || url.startsWith('data:')) return url
  
  // If it starts with /media/, it's a backend asset
  // We prefix it with the server host from the environment, defaulting to localhost for dev
  if (url.startsWith('/media/')) {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
    // Remove the /api suffix if present to get the root URL
    const baseUrl = apiBaseUrl.replace('/api', '')
    return `${baseUrl}${url}`
  }
  
  // Otherwise, assume it's a local frontend public asset
  // (/logo.png, /sarkin-mota-profile.jpg, etc.)
  return url
}