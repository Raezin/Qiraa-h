import React from 'react'
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
  Stack,
  useTheme,
  alpha,
} from '@mui/material'
import {
  Mic,
  Psychology,
  TrendingUp,
  Security,
  Speed,
  Support,
  RecordVoiceOver,
  Analytics,
  CloudDone,
  Speed as SpeedIcon,
} from '@mui/icons-material'
import { motion } from 'framer-motion'

const Features = () => {
  const theme = useTheme()

  const mainFeatures = [
    {
      icon: <Mic sx={{ fontSize: 48 }} />,
      title: 'Voice Recording',
      description: 'High-quality audio capture with real-time waveform visualization',
      details: 'Record your recitation clearly with our advanced audio processing technology.',
      color: '#22c55e',
    },
    {
      icon: <Psychology sx={{ fontSize: 48 }} />,
      title: 'AI Analysis',
      description: 'Advanced AI-powered pronunciation analysis',
      details: 'Get instant feedback on your Tajweed rules and pronunciation accuracy.',
      color: '#3b82f6',
    },
    {
      icon: <TrendingUp sx={{ fontSize: 48 }} />,
      title: 'Progress Tracking',
      description: 'Detailed analytics and improvement metrics',
      details: 'Track your progress over time with comprehensive statistics and reports.',
      color: '#f59e0b',
    },
    {
      icon: <RecordVoiceOver sx={{ fontSize: 48 }} />,
      title: 'Reference Audio',
      description: 'Listen to professional reciters',
      details: 'Compare your recitation with authentic Quranic recitations from famous Qaris.',
      color: '#8b5cf6',
    },
    {
      icon: <Analytics sx={{ fontSize: 48 }} />,
      title: 'Smart Feedback',
      description: 'Detailed word-by-word analysis',
      details: 'Identify exactly which words need improvement with precise feedback.',
      color: '#ec4899',
    },
    {
      icon: <CloudDone sx={{ fontSize: 48 }} />,
      title: 'Cloud Sync',
      description: 'Access your history anywhere',
      details: 'Your recitations and progress are securely stored and accessible across devices.',
      color: '#14b8a6',
    },
  ]

  const benefits = [
    {
      title: 'Learn at Your Own Pace',
      description: 'Practice anytime, anywhere with unlimited access to all features',
    },
    {
      title: 'Expert-Approved',
      description: 'Our AI model is trained by Quran recitation experts',
    },
    {
      title: 'Instant Results',
      description: 'Get immediate feedback after each recitation',
    },
    {
      title: 'Comprehensive Reports',
      description: 'Detailed insights into your strengths and areas for improvement',
    },
  ]

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          py: 10,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Stack spacing={3} alignItems="center" textAlign="center">
              <Chip label="Features" color="primary" size="large" />
              <Typography variant="h2" gutterBottom fontWeight="bold">
                Powerful Features for
                <br />
                Perfect Recitation
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700 }}>
                Everything you need to improve your Quran recitation, all in one platform
              </Typography>
            </Stack>
          </motion.div>
        </Container>
      </Box>

      {/* Main Features Grid */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {mainFeatures.map((feature, index) => (
            <Grid item xs={12} md={6} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card sx={{ height: '100%', '&:hover': { transform: 'translateY(-4px)' } }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      <Avatar
                        sx={{
                          width: 64,
                          height: 64,
                          bgcolor: alpha(feature.color, 0.1),
                          color: feature.color,
                        }}
                      >
                        {feature.icon}
                      </Avatar>
                      <Box>
                        <Typography variant="h5" gutterBottom fontWeight="bold">
                          {feature.title}
                        </Typography>
                        <Typography variant="body2" color="primary" gutterBottom>
                          {feature.description}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {feature.details}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Benefits Section */}
      <Box sx={{ py: 8, bgcolor: alpha(theme.palette.primary.main, 0.03) }}>
        <Container maxWidth="lg">
          <Stack spacing={6}>
            <Typography variant="h3" textAlign="center" fontWeight="bold">
              Why Choose Qira'a?
            </Typography>
            <Grid container spacing={4}>
              {benefits.map((benefit, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card sx={{ textAlign: 'center', height: '100%' }}>
                      <CardContent>
                        <SpeedIcon sx={{ fontSize: 48, color: '#22c55e', mb: 2 }} />
                        <Typography variant="h6" gutterBottom fontWeight="bold">
                          {benefit.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {benefit.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Stack>
        </Container>
      </Box>
    </Box>
  )
}

export default Features