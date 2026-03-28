import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import WhatsAppFloat from './components/WhatsAppFloat'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import LoadingScreen from './components/LoadingScreen'
import BottomNav from './components/BottomNav'
import { SavedCarsProvider } from './context/SavedCarsContext'
import { CartProvider } from './context/CartContext'
import CartDrawer from './components/CartDrawer'

import Home from './pages/Home'
import Cars from './pages/Cars'
import CarDetail from './pages/CarDetail'
import { About } from './pages/About'
import { Blog, BlogPost, RequestCar, Contact, Login } from './pages/Pages'
import { Dashboard, ManageCars, ManageBids, ManagePosts, ManageGallery } from './pages/admin/Admin'
import Gallery from './pages/Gallery'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

import { ThemeProvider } from './context/ThemeContext'

/* ... imports ... */

export default function App() {
  const { pathname } = useLocation()
  const [loading, setLoading] = useState(true)
  const isAdmin = pathname.startsWith('/admin') || pathname === '/login'

  if (loading) return <LoadingScreen onComplete={() => setLoading(false)} />

  return (
    <ThemeProvider>
      <AuthProvider>
        <SavedCarsProvider>
          <CartProvider>
            <ScrollToTop />
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: 'var(--navy-800)',
                  color: 'var(--off-white)',
                  border: '1px solid var(--border)',
                  fontFamily: 'Outfit, sans-serif',
                },
              }}
            />
            {!isAdmin && <Navbar />}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cars" element={<Cars />} />
              <Route path="/cars/:slug" element={<CarDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/request-car" element={<RequestCar />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/admin/cars" element={<ProtectedRoute><ManageCars /></ProtectedRoute>} />
              <Route path="/admin/bids" element={<ProtectedRoute><ManageBids /></ProtectedRoute>} />
              <Route path="/admin/posts" element={<ProtectedRoute><ManagePosts /></ProtectedRoute>} />
              <Route path="/admin/gallery" element={<ProtectedRoute><ManageGallery /></ProtectedRoute>} />
            </Routes>
            {!isAdmin && <Footer />}
            {!isAdmin && <BottomNav />}
            {!isAdmin && <WhatsAppFloat />}
            {!isAdmin && <CartDrawer />}
          </CartProvider>
        </SavedCarsProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}