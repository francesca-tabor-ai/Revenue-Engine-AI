import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AuthProvider } from './context/AuthContext'
import Header from './components/Header'
import Footer from './components/Footer'
import ChatWidget from './components/ChatWidget'
import Landing from './pages/Landing'
import Pricing from './pages/Pricing'
import CaseStudies from './pages/CaseStudies'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Signup from './pages/Signup'
import AdminLayout from './pages/admin/AdminLayout'
import AdminHome from './pages/admin/AdminHome'
import AdminEntity from './pages/admin/AdminEntity'
import ApiDocs from './pages/ApiDocs'
import Marketplace from './pages/Marketplace'
import MarketplaceAppDetail from './pages/MarketplaceAppDetail'
import BuildApp from './pages/BuildApp'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import NotFound from './pages/NotFound'

function RequireAuth({ children }) {
  const token = localStorage.getItem('token')
  if (!token) return <Navigate to="/login" replace />
  return children
}

function ScrollToHash() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      el?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [pathname, hash])
  return null
}

function App() {
  return (
    <AuthProvider>
      <ScrollToHash />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/admin"
          element={
            <RequireAuth>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route index element={<AdminHome />} />
          <Route path=":entity" element={<AdminEntity />} />
        </Route>
        <Route
          path="/*"
          element={
            <div className="app">
              <Header />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/case-studies" element={<CaseStudies />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/api-docs" element={<ApiDocs />} />
                  <Route path="/marketplace" element={<Marketplace />} />
                  <Route path="/marketplace/build" element={<BuildApp />} />
                  <Route path="/marketplace/:id" element={<MarketplaceAppDetail />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
              <ChatWidget />
            </div>
          }
        />
      </Routes>
    </AuthProvider>
  )
}

export default App
