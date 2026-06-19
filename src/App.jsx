import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'  // Add Navigate here
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { Box } from '@mui/material'
import { Toaster } from 'react-hot-toast'

// Import themes
import { theme, lightTheme } from './theme/theme'

// Import components
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'

// Import route guards
import ProtectedRoute from './components/common/ProtectedRoute'
import PublicRoute from './components/common/PublicRoute'
import AdminRoute from './components/common/AdminRoute'

// Import pages
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import RecitationStudio from './pages/RecitationStudio'
import MyProgress from './pages/History'
import Subscription from './pages/Subscription'
import Settings from './pages/Profile'
import HelpCenter from './pages/Help'
import AdminDashboard from './pages/admin/AdminDashboard'
import Features from './pages/Features'
import HowItWorks from './pages/HowItWorks'



// Import context providers
import { AuthProvider } from './context/AuthContext'
import { SubscriptionProvider } from './context/SubscriptionContext'

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved !== null ? JSON.parse(saved) : true
  })

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

  const currentTheme = darkMode ? theme : lightTheme

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <Box 
        sx={{ 
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <AuthProvider>
          <SubscriptionProvider>
            <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
            <Box component="main" sx={{ flex: 1, pt: '64px' }}>
              <Routes>
                {/* Public Routes - Accessible to everyone */}
                <Route path="/" element={<Landing />} />
                <Route 
                  path="/login" 
                  element={
                    <PublicRoute>
                      <Login />
                    </PublicRoute>
                  } 
                />
                <Route 
                  path="/signup" 
                  element={
                    <PublicRoute>
                      <Signup />
                    </PublicRoute>
                  } 
                />
                <Route 
                  path="/features" 
                  element={
                    <PublicRoute>
                      <Features />
                    </PublicRoute>
                  } 
                />
                <Route 
                  path="/how-it-works" 
                  element={
                    <PublicRoute>
                      <HowItWorks />
                    </PublicRoute>
                  } 
                />
                <Route 
                  path="/signup" 
                  element={
                    <PublicRoute>
                      <Signup />
                    </PublicRoute>
                  } 
                />
                
                {/* Protected Routes - Require authentication */}
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/recitation" 
                  element={
                    <ProtectedRoute>
                      <RecitationStudio />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/history" 
                  element={
                    <ProtectedRoute>
                      <MyProgress />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/subscription" 
                  element={
                      <Subscription />
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/help" 
                  element={
                    <ProtectedRoute>
                      <HelpCenter />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Admin Routes */}
                <Route 
                  path="/admin" 
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  } 
                />
                
                {/* Catch all - 404 redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Box>
            <Footer />
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: darkMode ? '#1e293b' : '#ffffff',
                  color: darkMode ? '#f1f5f9' : '#0f172a',
                  borderRadius: '12px',
                  border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                },
              }}
            />
          </SubscriptionProvider>
        </AuthProvider>
      </Box>
    </ThemeProvider>
  )
}

export default App