import React from 'react'
import { Link } from 'react-router-dom'
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Divider,
  TextField,
  Button,
  Stack,
  alpha,
  useTheme,
} from '@mui/material'
import {
  GitHub,
  Twitter,
  LinkedIn,
  Email,
  Favorite,
  Instagram,
  Facebook,
  LocationOn,
  Phone,
  Send,
} from '@mui/icons-material'

const Footer = () => {
  const theme = useTheme()
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Features', path: '/features' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Success Stories', path: '/stories' },
  ]

  const supportLinks = [
    { name: 'Help Center', path: '/help' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contact Us', path: '/contact' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms of Service', path: '/terms' },
  ]

  const resourcesLinks = [
    { name: 'Blog', path: '/blog' },
    { name: 'Learning Resources', path: '/resources' },
    { name: 'Community', path: '/community' },
    { name: 'Arabic Alphabet', path: '/alphabet' },
    { name: 'Tajweed Rules', path: '/tajweed' },
  ]

  const socialIcons = [
    { icon: <GitHub />, url: 'https://github.com', color: '#333' },
    { icon: <Twitter />, url: 'https://twitter.com', color: '#1DA1F2' },
    { icon: <LinkedIn />, url: 'https://linkedin.com', color: '#0077B5' },
    { icon: <Facebook />, url: 'https://facebook.com', color: '#1877F2' },
    { icon: <Instagram />, url: 'https://instagram.com', color: '#E4405F' },
  ]

  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        backgroundColor: theme.palette.mode === 'dark'
          ? alpha(theme.palette.background.paper, 0.95)
          : alpha(theme.palette.background.paper, 0.98),
        borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, #22c55e, #3b82f6, #22c55e)',
        },
      }}
    >
      <Container maxWidth="lg">
        {/* Main Footer Content */}
        <Grid container spacing={4} sx={{ py: 6 }}>
          {/* Brand Column */}
          <Grid item size={{xs: 12, md: 4}}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 1.5,
                }}
              >
                <img 
                  src="/favicon.svg" 
                  alt="Logo" 
                  style={{ width: 24, height: 24, filter: 'brightness(0) invert(1)' }}
                />
              </Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #22c55e 0%, #3b82f6 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                Qira'a
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
              Perfect your Quran recitation with AI-powered feedback and guidance. 
              Join thousands of users improving their pronunciation daily.
            </Typography>
            
            {/* Contact Info */}
            <Stack spacing={1.5} sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email sx={{ fontSize: 18, color: 'primary.main' }} />
                <Typography variant="body2" color="text.secondary">
                  support@qiraa.com
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone sx={{ fontSize: 18, color: 'primary.main' }} />
                <Typography variant="body2" color="text.secondary">
                  +1 (555) 123-4567
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn sx={{ fontSize: 18, color: 'primary.main' }} />
                <Typography variant="body2" color="text.secondary">
                  Islamic Center, 123 Main St, Anytown, USA
                </Typography>
              </Box>
            </Stack>
          </Grid>

          {/* Quick Links */}
          <Grid item size={{xs: 12, sm: 6, md: 2}}>
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ 
                mb: 2, 
                fontWeight: 600,
                fontSize: '1rem',
                position: 'relative',
                display: 'inline-block',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -4,
                  left: 0,
                  width: '30px',
                  height: '2px',
                  background: 'linear-gradient(90deg, #22c55e, #3b82f6)',
                },
              }}
            >
              Quick Links
            </Typography>
            <Stack spacing={1.5}>
              {quickLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  style={{
                    textDecoration: 'none',
                    color: theme.palette.text.secondary,
                    fontSize: '0.875rem',
                    transition: 'all 0.2s ease',
                    display: 'inline-block',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = theme.palette.primary.main
                    e.target.style.transform = 'translateX(5px)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = theme.palette.text.secondary
                    e.target.style.transform = 'translateX(0)'
                  }}
                >
                  {link.name}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Support */}
          <Grid item size={{xs: 12, sm: 6, md: 2}}>
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ 
                mb: 2, 
                fontWeight: 600,
                fontSize: '1rem',
                position: 'relative',
                display: 'inline-block',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -4,
                  left: 0,
                  width: '30px',
                  height: '2px',
                  background: 'linear-gradient(90deg, #22c55e, #3b82f6)',
                },
              }}
            >
              Support
            </Typography>
            <Stack spacing={1.5}>
              {supportLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  style={{
                    textDecoration: 'none',
                    color: theme.palette.text.secondary,
                    fontSize: '0.875rem',
                    transition: 'all 0.2s ease',
                    display: 'inline-block',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = theme.palette.primary.main
                    e.target.style.transform = 'translateX(5px)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = theme.palette.text.secondary
                    e.target.style.transform = 'translateX(0)'
                  }}
                >
                  {link.name}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Resources */}
          <Grid item size={{xs: 12, sm: 6, md: 2}}>
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ 
                mb: 2, 
                fontWeight: 600,
                fontSize: '1rem',
                position: 'relative',
                display: 'inline-block',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -4,
                  left: 0,
                  width: '30px',
                  height: '2px',
                  background: 'linear-gradient(90deg, #22c55e, #3b82f6)',
                },
              }}
            >
              Resources
            </Typography>
            <Stack spacing={1.5}>
              {resourcesLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  style={{
                    textDecoration: 'none',
                    color: theme.palette.text.secondary,
                    fontSize: '0.875rem',
                    transition: 'all 0.2s ease',
                    display: 'inline-block',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = theme.palette.primary.main
                    e.target.style.transform = 'translateX(5px)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = theme.palette.text.secondary
                    e.target.style.transform = 'translateX(0)'
                  }}
                >
                  {link.name}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Newsletter */}
          <Grid item size={{xs: 12, sm: 6, md: 2}}>
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ 
                mb: 2, 
                fontWeight: 600,
                fontSize: '1rem',
                position: 'relative',
                display: 'inline-block',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -4,
                  left: 0,
                  width: '30px',
                  height: '2px',
                  background: 'linear-gradient(90deg, #22c55e, #3b82f6)',
                },
              }}
            >
              Newsletter
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Subscribe to get updates about new features and tips.
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Your email address"
              variant="outlined"
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  '&:hover fieldset': {
                    borderColor: '#22c55e',
                  },
                },
              }}
            />
            <Button
              fullWidth
              variant="contained"
              endIcon={<Send />}
              sx={{
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 15px rgba(34, 197, 94, 0.3)',
                },
              }}
            >
              Subscribe
            </Button>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: alpha(theme.palette.divider, 0.1), my: 2 }} />

        {/* Bottom Bar */}
        <Box sx={{ py: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item size={{xs: 12, md: 6}}>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  textAlign: { xs: 'center', md: 'left' },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: { xs: 'center', md: 'flex-start' },
                  gap: 0.5,
                }}
              >
                Made with <Favorite sx={{ color: '#ef4444', fontSize: '1rem' }} /> for the love of Quran
              </Typography>
              <Typography 
                variant="caption" 
                color="text.secondary" 
                sx={{ 
                  display: 'block', 
                  mt: 0.5,
                  textAlign: { xs: 'center', md: 'left' },
                }}
              >
                © {currentYear} Qira'a. All rights reserved.
              </Typography>
            </Grid>
            
            <Grid item size={{xs: 12, md: 6}}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: { xs: 'center', md: 'flex-end' }, 
                gap: 1,
              }}>
                {socialIcons.map((social, index) => (
                  <IconButton
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: 'text.secondary',
                      '&:hover': {
                        color: social.color,
                        transform: 'translateY(-3px)',
                        backgroundColor: alpha(social.color, 0.1),
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {social.icon}
                  </IconButton>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  )
}

export default Footer