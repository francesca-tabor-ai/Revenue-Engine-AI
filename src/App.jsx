import { Routes, Route, Navigate } from 'react-router-dom'
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
import BuildApp from './pages/BuildApp'

function RequireAuth({ children }) {
  const token = localStorage.getItem('token')
  if (!token) return <Navigate to="/login" replace />
  return children
}

function App() {
  return (
    <AuthProvider>
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
