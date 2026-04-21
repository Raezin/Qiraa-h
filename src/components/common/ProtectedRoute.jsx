import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { Box, CircularProgress } from '@mui/material'
import { useAuth } from '../../context/AuthContext'

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, loading, isAuthenticated, isAdmin } = useAuth()
  const location = useLocation()

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    // Redirect to login page but save the location they tried to access
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Check for admin role if required
  if (requiredRole === 'admin' && !isAdmin) {
    // Redirect to dashboard if not admin
    return <Navigate to="/dashboard" replace />
  }

  // Render children if all checks pass
  return children
}

export default ProtectedRoute