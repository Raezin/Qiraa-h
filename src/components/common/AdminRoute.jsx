import React from 'react'
import { Navigate } from 'react-router-dom'
import { Box, CircularProgress, Alert } from '@mui/material'
import { useAuth } from '../../context/AuthContext'

const AdminRoute = ({ children }) => {
  const { user, loading, isAuthenticated, isAdmin } = useAuth()

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

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!isAdmin) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          p: 3,
        }}
      >
        <Alert severity="error" sx={{ maxWidth: 500 }}>
          Access Denied. You don't have permission to view this page.
        </Alert>
      </Box>
    )
  }

  return children
}

export default AdminRoute