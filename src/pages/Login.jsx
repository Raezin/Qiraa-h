import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  InputAdornment,
  IconButton,
  Divider,
  Stack,
  Alert,
  Checkbox,
  FormControlLabel,
  useTheme,
  alpha,
  Snackbar,
} from '@mui/material'
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Google,
  ArrowForward,
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const { login, loginWithGoogle, loading, error: authError } = useAuth()
  
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  })
  const [errors, setErrors] = useState({})
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  const validateForm = () => {
    const newErrors = {}
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (validateForm()) {
      const result = await login(formData.email, formData.password)
      if (result.success) {
        setSnackbar({
          open: true,
          message: 'Login successful! Redirecting...',
          severity: 'success'
        })
        setTimeout(() => {
          navigate('/dashboard')
        }, 1500)
      } else {
        setSnackbar({
          open: true,
          message: result.error || 'Login failed. Please try again.',
          severity: 'error'
        })
      }
    }
  }

  const handleGoogleLogin = async () => {
    const result = await loginWithGoogle()
    if (result.success) {
      setSnackbar({
        open: true,
        message: 'Google login successful! Redirecting...',
        severity: 'success'
      })
      setTimeout(() => {
        navigate('/dashboard')
      }, 1500)
    } else {
      setSnackbar({
        open: true,
        message: result.error || 'Google login failed. Please try again.',
        severity: 'error'
      })
    }
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        backgroundImage: 'url("https://images.unsplash.com/photo-1584551246679-258d2b0e3c8a?q=80&w=2070&auto=format&fit=crop")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 100%)',
        },
      }}
    >
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1, py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Paper
            elevation={24}
            sx={{
              p: { xs: 3, sm: 5 },
              borderRadius: '20px',
              background: alpha(theme.palette.background.paper, 0.95),
              backdropFilter: 'blur(10px)',
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            }}
          >
            {/* Header */}
            <Box textAlign="center" mb={4}>
              <Typography
                variant="h4"
                gutterBottom
                fontWeight="bold"
                sx={{
                  background: 'linear-gradient(135deg, #22c55e 0%, #3b82f6 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                Welcome Back
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sign in to continue your Quran recitation journey
              </Typography>
            </Box>

            {/* Error Alert */}
            {authError && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
                {authError}
              </Alert>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  error={!!errors.email}
                  helperText={errors.email}
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: '#22c55e' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  error={!!errors.password}
                  helperText={errors.password}
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: '#22c55e' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          disabled={loading}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                    },
                  }}
                />

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.rememberMe}
                        onChange={(e) =>
                          setFormData({ ...formData, rememberMe: e.target.checked })
                        }
                        disabled={loading}
                        sx={{
                          color: '#22c55e',
                          '&.Mui-checked': {
                            color: '#22c55e',
                          },
                        }}
                      />
                    }
                    label="Remember me"
                  />
                  <Link
                    to="/forgot-password"
                    style={{
                      color: '#22c55e',
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                    }}
                  >
                    Forgot password?
                  </Link>
                </Box>

                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  endIcon={<ArrowForward />}
                  sx={{
                    py: 1.5,
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 20px rgba(34, 197, 94, 0.3)',
                    },
                  }}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </Stack>
            </form>

            {/* Divider */}
            <Box sx={{ my: 3 }}>
              <Divider>
                <Typography variant="body2" color="text.secondary">
                  OR CONTINUE WITH
                </Typography>
              </Divider>
            </Box>

            {/* Social Login Buttons - Only Google */}
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Google />}
              onClick={handleGoogleLogin}
              disabled={loading}
              sx={{
                borderRadius: '12px',
                py: 1.5,
                borderColor: alpha(theme.palette.text.primary, 0.2),
                '&:hover': {
                  borderColor: '#22c55e',
                  backgroundColor: alpha('#22c55e', 0.1),
                  transform: 'translateY(-2px)',
                },
              }}
            >
              Continue with Google
            </Button>

            {/* Sign Up Link */}
            <Box textAlign="center" sx={{ mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  style={{
                    color: '#22c55e',
                    textDecoration: 'none',
                    fontWeight: 600,
                  }}
                >
                  Sign up
                </Link>
              </Typography>
            </Box>
          </Paper>
        </motion.div>
      </Container>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ borderRadius: '12px', width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default Login