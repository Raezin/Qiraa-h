import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  Container,
  Badge,
  Divider,
  ListItemIcon,
  useTheme,
  alpha,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Mic,
  Dashboard,
  History,
  Subscriptions,
  Person,
  Logout,
  Brightness4,
  Brightness7,
  Assessment,
  Settings,
  Help,
  Notifications,
} from '@mui/icons-material'
import { useAuth } from '../../context/AuthContext'
import { motion } from 'framer-motion'

const Navbar = ({ darkMode, setDarkMode }) => {
  const theme = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout, isAuthenticated } = useAuth()
  
  const [anchorElNav, setAnchorElNav] = useState(null)
  const [anchorElUser, setAnchorElUser] = useState(null)
  const [anchorElNotifications, setAnchorElNotifications] = useState(null)

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget)
  }

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleOpenNotifications = (event) => {
    setAnchorElNotifications(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  const handleCloseNotifications = () => {
    setAnchorElNotifications(null)
  }

  const handleLogout = async () => {
    handleCloseUserMenu()
    await logout()
    navigate('/login')
  }

  // Navigation items for authenticated users
  const authNavItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <Dashboard /> },
    { name: 'Recitation', path: '/recitation', icon: <Mic /> },
    { name: 'History', path: '/history', icon: <History /> },
    { name: 'Premium', path: '/subscription', icon: <Subscriptions /> },
  ]

  // Navigation items for non-authenticated users
  const publicNavItems = [
    { name: 'Home', path: '/' },
    { name: 'Features', path: '/features' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'Pricing', path: '/subscription' },
  ]

  const navItems = isAuthenticated ? authNavItems : publicNavItems

  const userMenuItems = [
    { name: 'My Progress', path: '/history', icon: <Assessment /> },
    { name: 'Settings', path: '/profile', icon: <Settings /> },
    { name: 'Help Center', path: '/help', icon: <Help /> },
    { divider: true },
    { name: 'Logout', action: handleLogout, icon: <Logout /> },
  ]

  const notifications = [
    { id: 1, message: 'Your recitation has been analyzed!', time: '2 min ago', read: false },
    { id: 2, message: 'New achievement unlocked!', time: '1 hour ago', read: false },
    { id: 3, message: 'Weekly progress report ready', time: '1 day ago', read: true },
  ]

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <AppBar 
      position="fixed" 
      elevation={0}
      sx={{
        backgroundColor: darkMode 
          ? alpha(theme.palette.background.paper, 0.8)
          : alpha(theme.palette.background.paper, 0.9),
        backdropFilter: 'blur(10px)',
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          {/* Logo Section - Desktop */}
          <Box
            component={motion.div}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              cursor: 'pointer',
            }}
            onClick={() => navigate('/')}
          >
            {/* Vite Logo Placeholder */}
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '12px',
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
              variant="h6"
              noWrap
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #22c55e 0%, #3b82f6 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                letterSpacing: '-0.5px',
              }}
            >
              Qira'a
            </Typography>
          </Box>

          {/* Mobile Menu Icon */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              onClick={handleOpenNavMenu}
              color="inherit"
              sx={{
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                },
              }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorElNav}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
                '& .MuiPaper-root': {
                  backgroundColor: theme.palette.background.paper,
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  borderRadius: '12px',
                  minWidth: 200,
                },
              }}
            >
              {navItems.map((item) => (
                <MenuItem
                  key={item.name}
                  onClick={() => {
                    handleCloseNavMenu()
                    navigate(item.path)
                  }}
                  sx={{
                    borderRadius: '8px',
                    mx: 1,
                    my: 0.5,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    },
                  }}
                >
                  {item.icon && (
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      {item.icon}
                    </ListItemIcon>
                  )}
                  <Typography textAlign="center">{item.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Mobile Logo */}
          <Box
            sx={{
              display: { xs: 'flex', md: 'none' },
              alignItems: 'center',
              cursor: 'pointer',
              flexGrow: 1,
            }}
            onClick={() => navigate('/')}
          >
            <img 
              src="/favicon.svg" 
              alt="Logo" 
              style={{ width: 24, height: 24, marginRight: 8 }}
            />
            <Typography
              variant="h6"
              noWrap
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

          {/* Desktop Navigation */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center', gap: 1 }}>
            {navItems.map((item) => (
              <Button
                key={item.name}
                component={Link}
                to={item.path}
                startIcon={item.icon}
                sx={{
                  color: isActive(item.path) ? 'primary.main' : 'text.primary',
                  backgroundColor: isActive(item.path) 
                    ? alpha(theme.palette.primary.main, 0.1)
                    : 'transparent',
                  borderRadius: '10px',
                  px: 2,
                  py: 1,
                  mx: 0.5,
                  fontWeight: isActive(item.path) ? 600 : 500,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    color: 'primary.main',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                {item.name}
              </Button>
            ))}
          </Box>

          {/* Right Side Icons */}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {/* Theme Toggle */}
            <Tooltip title={`Switch to ${darkMode ? 'light' : 'dark'} mode`}>
              <IconButton
                onClick={() => setDarkMode(!darkMode)}
                sx={{
                  borderRadius: '10px',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  },
                }}
              >
                {darkMode ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </Tooltip>

            {/* Notifications - Only for authenticated users */}
            {isAuthenticated && (
              <>
                <Tooltip title="Notifications">
                  <IconButton
                    onClick={handleOpenNotifications}
                    sx={{
                      borderRadius: '10px',
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      },
                    }}
                  >
                    <Badge 
                      badgeContent={notifications.filter(n => !n.read).length} 
                      color="error"
                      sx={{
                        '& .MuiBadge-badge': {
                          fontSize: '10px',
                          height: '18px',
                          minWidth: '18px',
                        },
                      }}
                    >
                      <Notifications />
                    </Badge>
                  </IconButton>
                </Tooltip>

                {/* Notifications Menu */}
                <Menu
                  anchorEl={anchorElNotifications}
                  open={Boolean(anchorElNotifications)}
                  onClose={handleCloseNotifications}
                  sx={{
                    '& .MuiPaper-root': {
                      backgroundColor: theme.palette.background.paper,
                      backdropFilter: 'blur(10px)',
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      borderRadius: '12px',
                      minWidth: 320,
                      maxWidth: 320,
                    },
                  }}
                >
                  <Box sx={{ p: 2, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                    <Typography variant="h6" fontWeight={600}>
                      Notifications
                    </Typography>
                  </Box>
                  {notifications.map((notification) => (
                    <MenuItem
                      key={notification.id}
                      onClick={handleCloseNotifications}
                      sx={{
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        py: 1.5,
                        backgroundColor: !notification.read 
                          ? alpha(theme.palette.primary.main, 0.05)
                          : 'transparent',
                      }}
                    >
                      <Typography variant="body2" fontWeight={!notification.read ? 600 : 400}>
                        {notification.message}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                        {notification.time}
                      </Typography>
                    </MenuItem>
                  ))}
                  <Box sx={{ p: 1, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                    <Button fullWidth size="small" onClick={handleCloseNotifications}>
                      Mark all as read
                    </Button>
                  </Box>
                </Menu>
              </>
            )}

            {/* User Menu / Auth Button */}
            {isAuthenticated ? (
              <>
                <Tooltip title="Account settings">
                  <IconButton
                    onClick={handleOpenUserMenu}
                    sx={{
                      p: 0,
                      '&:hover': {
                        transform: 'scale(1.05)',
                      },
                      transition: 'transform 0.2s ease',
                    }}
                  >
                    <Avatar
                      alt={user?.name || 'User'}
                      src={user?.avatar}
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: 'primary.main',
                        border: `2px solid ${alpha(theme.palette.primary.main, 0.5)}`,
                      }}
                    >
                      {user?.name?.charAt(0) || 'U'}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={anchorElUser}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                  sx={{
                    '& .MuiPaper-root': {
                      backgroundColor: theme.palette.background.paper,
                      backdropFilter: 'blur(10px)',
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      borderRadius: '12px',
                      minWidth: 220,
                      mt: 1,
                    },
                  }}
                >
                  <Box sx={{ px: 2, py: 1.5, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {user?.name || 'User'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {user?.email}
                    </Typography>
                  </Box>
                  {userMenuItems.map((item, index) => (
                    item.divider ? (
                      <Divider key={index} />
                    ) : (
                      <MenuItem
                        key={item.name}
                        onClick={() => {
                          if (item.action) {
                            item.action()
                          } else {
                            navigate(item.path)
                          }
                          handleCloseUserMenu()
                        }}
                        sx={{
                          mx: 1,
                          my: 0.5,
                          borderRadius: '8px',
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                          },
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 36, color: 'text.secondary' }}>
                          {item.icon}
                        </ListItemIcon>
                        <Typography>{item.name}</Typography>
                      </MenuItem>
                    )
                  ))}
                </Menu>
              </>
            ) : (
              // Single Auth Button for non-authenticated users
              <Button
                variant="contained"
                onClick={() => navigate('/login')}
                startIcon={<Person />}
                sx={{
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                  px: 3,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 15px rgba(34, 197, 94, 0.3)',
                  },
                }}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Navbar