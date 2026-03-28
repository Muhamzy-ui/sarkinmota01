import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  timeout: 15000,
})

// Auto-refresh token on 401
api.interceptors.response.use(
  res => res,
  async err => {
    const original = err.config
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true
      const refresh = localStorage.getItem('refresh_token')
      if (refresh) {
        try {
          const res = await axios.post(`${api.defaults.baseURL}/auth/token/refresh/`, { refresh })
          localStorage.setItem('access_token', res.data.access)
          api.defaults.headers.common['Authorization'] = `Bearer ${res.data.access}`
          original.headers['Authorization'] = `Bearer ${res.data.access}`
          return api(original)
        } catch {
          localStorage.clear()
          window.location.href = '/login'
        }
      }
    }
    return Promise.reject(err)
  }
)

// ── Cars ──────────────────────────────────
export const getCars = (params = {}) => api.get('/cars/', { params })
export const getFeaturedCars = () => api.get('/cars/featured/')
export const getCarDetail = (slug) => api.get(`/cars/${slug}/`)
export const getCarBrands = () => api.get('/cars/brands/')
export const getCarStats = () => api.get('/cars/stats/')
export const submitBid = (data) => api.post('/cars/bids/', data)
export const submitCarRequest = (data) => api.post('/cars/requests/', data)

// ── Admin Cars ────────────────────────────
export const createCar = (data) => api.post('/cars/', data)
export const updateCar = (slug, data) => api.patch(`/cars/${slug}/`, data)
export const deleteCar = (slug) => api.delete(`/cars/${slug}/`)
export const getAdminBids = (params) => api.get('/admin/bids/', { params })
export const updateBid = (id, data) => api.patch(`/admin/bids/${id}/`, data)
export const getAdminRequests = () => api.get('/admin/requests/')

// ── Brand ─────────────────────────────────
export const getAbout = () => api.get('/brand/about/')
export const getTestimonials = () => api.get('/brand/testimonials/')
export const getPress = () => api.get('/brand/press/')
export const getAwards = () => api.get('/brand/awards/')

// ── Blog ──────────────────────────────────
export const getPosts = (params = {}) => api.get('/blog/posts/', { params })
export const getPostDetail = (slug) => api.get(`/blog/posts/${slug}/`)
export const getFeaturedPosts = () => api.get('/blog/featured/')
export const getPostCategories = () => api.get('/blog/categories/')
export const createPost = (data) => api.post('/blog/posts/', data)
export const updatePost = (slug, data) => api.patch(`/blog/posts/${slug}/`, data)
export const deletePost = (slug) => api.delete(`/blog/posts/${slug}/`)

// ── Contact & Newsletter ──────────────────
export const submitContact = (data) => api.post('/contact/', data)
export const subscribeNewsletter = (email) => api.post('/newsletter/signup/', { email })

export default api