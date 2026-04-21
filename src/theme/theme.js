import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#22c55e',
      light: '#4ade80',
      dark: '#16a34a',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#3b82f6',
      light: '#60a5fa',
      dark: '#2563eb',
      contrastText: '#ffffff',
    },
    accent: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
    },
    background: {
      default: '#0f172a',
      paper: '#1e293b',
    },
    text: {
      primary: '#f1f5f9',
      secondary: '#94a3b8',
      disabled: '#64748b',
    },
    success: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
    },
    info: {
      main: '#3b82f6',
      light: '#60a5fa',
      dark: '#2563eb',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
  },
  typography: {
    fontFamily: [
      'Poppins',
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '3.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
      background: 'linear-gradient(135deg, #22c55e 0%, #3b82f6 100%)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      color: 'transparent',
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0, 0, 0, 0.05)',
    '0px 4px 8px rgba(0, 0, 0, 0.1)',
    '0px 8px 16px rgba(0, 0, 0, 0.1)',
    '0px 12px 24px rgba(0, 0, 0, 0.15)',
    '0px 16px 32px rgba(0, 0, 0, 0.15)',
    '0px 20px 40px rgba(0, 0, 0, 0.2)',
    '0px 24px 48px rgba(0, 0, 0, 0.2)',
    '0px 28px 56px rgba(0, 0, 0, 0.25)',
    '0px 32px 64px rgba(0, 0, 0, 0.25)',
    '0px 36px 72px rgba(0, 0, 0, 0.3)',
    '0px 40px 80px rgba(0, 0, 0, 0.3)',
    '0px 44px 88px rgba(0, 0, 0, 0.35)',
    '0px 48px 96px rgba(0, 0, 0, 0.35)',
    '0px 52px 104px rgba(0, 0, 0, 0.4)',
    '0px 56px 112px rgba(0, 0, 0, 0.4)',
    '0px 60px 120px rgba(0, 0, 0, 0.45)',
    '0px 64px 128px rgba(0, 0, 0, 0.45)',
    '0px 68px 136px rgba(0, 0, 0, 0.5)',
    '0px 72px 144px rgba(0, 0, 0, 0.5)',
    '0px 76px 152px rgba(0, 0, 0, 0.55)',
    '0px 80px 160px rgba(0, 0, 0, 0.55)',
    '0px 84px 168px rgba(0, 0, 0, 0.6)',
    '0px 88px 176px rgba(0, 0, 0, 0.6)',
    '0px 92px 184px rgba(0, 0, 0, 0.65)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          padding: '8px 24px',
          fontSize: '0.9375rem',
          fontWeight: 500,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
            boxShadow: '0 8px 20px rgba(34, 197, 94, 0.3)',
          },
        },
        outlined: {
          borderColor: '#22c55e',
          '&:hover': {
            borderColor: '#16a34a',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          backgroundColor: 'rgba(30, 41, 59, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(30, 41, 59, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
        elevation1: {
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#22c55e',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          fontWeight: 500,
        },
        colorPrimary: {
          backgroundColor: 'rgba(34, 197, 94, 0.2)',
          color: '#22c55e',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
        },
        standardSuccess: {
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          color: '#10b981',
        },
        standardError: {
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          color: '#ef4444',
        },
        standardWarning: {
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          color: '#f59e0b',
        },
        standardInfo: {
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          color: '#3b82f6',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: '20px',
          backgroundColor: '#1e293b',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          height: '8px',
        },
        bar: {
          borderRadius: '8px',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: '#22c55e',
          height: '3px',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          '&.Mui-selected': {
            color: '#22c55e',
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(34, 197, 94, 0.2)',
          color: '#22c55e',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          '&:hover': {
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(34, 197, 94, 0.2)',
            '&:hover': {
              backgroundColor: 'rgba(34, 197, 94, 0.25)',
            },
          },
        },
      },
    },
  },
})

// Light theme variant
export const lightTheme = createTheme({
  ...theme,
  palette: {
    mode: 'light',
    primary: {
      main: '#22c55e',
      light: '#4ade80',
      dark: '#16a34a',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#3b82f6',
      light: '#60a5fa',
      dark: '#2563eb',
      contrastText: '#ffffff',
    },
    accent: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a',
      secondary: '#475569',
      disabled: '#94a3b8',
    },
    success: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
    },
    info: {
      main: '#3b82f6',
      light: '#60a5fa',
      dark: '#2563eb',
    },
    divider: 'rgba(0, 0, 0, 0.12)',
  },
  components: {
    ...theme.components,
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          '&:hover': {
            border: '1px solid rgba(34, 197, 94, 0.3)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          border: '1px solid rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#ffffff',
          borderRight: '1px solid rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
})