import React from 'react'
import { Box, Typography, Button, Paper } from '@mui/material'
import { ErrorOutline } from '@mui/icons-material'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    this.setState({ error, errorInfo })
  }

  render() {
    if (this.state.hasError) {
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
          <Paper
            sx={{
              maxWidth: 500,
              p: 4,
              textAlign: 'center',
              borderRadius: '16px',
            }}
          >
            <ErrorOutline sx={{ fontSize: 64, color: '#ef4444', mb: 2 }} />
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Something went wrong
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {this.state.error?.message || 'An unexpected error occurred'}
            </Typography>
            <Button
              variant="contained"
              onClick={() => {
                this.setState({ hasError: false })
                window.location.href = '/'
              }}
            >
              Go back home
            </Button>
          </Paper>
        </Box>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary