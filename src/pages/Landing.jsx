import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  Stack,
  Chip,
  Avatar,
  Paper,
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
  PlayArrow,
  ChevronRight,
  Star,
  School,
  MenuBook,
  RecordVoiceOver,
  CheckCircle,
  ArrowForward,
} from '@mui/icons-material'
import { motion } from 'framer-motion'

const Landing = () => {
  const navigate = useNavigate()
  const theme = useTheme()

  const features = [
    {
      icon: <Mic sx={{ fontSize: 40 }} />,
      title: 'Voice Recording',
      description: 'Record your recitation with high-quality audio capture and instant processing',
      color: '#22c55e',
    },
    {
      icon: <Psychology sx={{ fontSize: 40 }} />,
      title: 'AI Analysis',
      description: 'Get instant feedback on pronunciation, tajweed rules, and accuracy',
      color: '#3b82f6',
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      title: 'Progress Tracking',
      description: 'Monitor your improvement over time with detailed analytics and insights',
      color: '#f59e0b',
    },
    {
      icon: <Security sx={{ fontSize: 40 }} />,
      title: 'Secure & Private',
      description: 'Your data is encrypted and protected. Audio is never stored permanently',
      color: '#8b5cf6',
    },
    {
      icon: <Speed sx={{ fontSize: 40 }} />,
      title: 'Instant Feedback',
      description: 'Receive real-time feedback on your recitation accuracy',
      color: '#ec4899',
    },
    {
      icon: <Support sx={{ fontSize: 40 }} />,
      title: '24/7 Support',
      description: 'Get help whenever you need it from our support team',
      color: '#14b8a6',
    },
  ]

  const howItWorks = [
    {
      step: '01',
      title: 'Choose a Surah',
      description: 'Select any verse from the Holy Quran to practice',
      icon: <MenuBook />,
    },
    {
      step: '02',
      title: 'Record Your Voice',
      description: 'Recite the verse clearly into your microphone',
      icon: <RecordVoiceOver />,
    },
    {
      step: '03',
      title: 'Get AI Feedback',
      description: 'Receive detailed analysis and improvement suggestions',
      icon: <Psychology />,
    },
    {
      step: '04',
      title: 'Track Progress',
      description: 'Monitor your improvement over time',
      icon: <TrendingUp />,
    },
  ]

  const testimonials = [
    {
      name: 'Ahmed Khan',
      role: 'Student',
      content: 'This platform has transformed my Quran recitation. The AI feedback is incredibly accurate and helpful!',
      rating: 5,
      avatar: 'A',
    },
    {
      name: 'Fatima Rahman',
      role: 'Teacher',
      content: 'As a Quran teacher, I recommend this to all my students. It\'s like having a personal tutor 24/7.',
      rating: 5,
      avatar: 'F',
    },
    {
      name: 'Omar Hassan',
      role: 'Beginner Learner',
      content: 'Started learning Quran recently and this app has been instrumental in improving my pronunciation.',
      rating: 5,
      avatar: 'O',
    },
  ]

  const stats = [
    { value: '98%', label: 'Accuracy Rate', icon: <CheckCircle /> },
    { value: '10K+', label: 'Active Users', icon: <School /> },
    { value: '50K+', label: 'Recitations', icon: <RecordVoiceOver /> },
    { value: '4.9', label: 'User Rating', icon: <Star /> },
  ]

  const pricingPlans = [
    {
      name: 'Free',
      price: '$0',
      period: '/month',
      features: ['5 recitations/day', 'Basic feedback', '7-day history', 'Email support'],
      recommended: false,
    },
    {
      name: 'Pro',
      price: '$9.99',
      period: '/month',
      features: ['Unlimited recitations', 'Advanced AI feedback', 'Full history', 'Priority support', 'Download reports'],
      recommended: true,
    },
    {
      name: 'Family',
      price: '$19.99',
      period: '/month',
      features: ['Up to 5 users', 'All Pro features', 'Family dashboard', 'Dedicated support', 'Monthly progress reports'],
      recommended: false,
    },
  ]

  return (
    <Box>
      {/* Hero Section with Background Image */}
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          backgroundImage: 'url("https://images.unsplash.com/photo-1584551246679-258d2b0e3c8a?q=80&w=2070&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
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
        {/* Animated Background Elements */}
        <Box
          sx={{
            position: 'absolute',
            top: '10%',
            left: '5%',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${alpha('#22c55e', 0.2)} 0%, transparent 70%)`,
            animation: 'float 6s ease-in-out infinite',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '10%',
            right: '5%',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${alpha('#3b82f6', 0.2)} 0%, transparent 70%)`,
            animation: 'float 8s ease-in-out infinite',
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Stack spacing={4} alignItems="center" textAlign="center">
              <Chip
                label="AI-Powered Quran Recitation"
                sx={{
                  mb: 2,
                  py: 2,
                  px: 2,
                  fontSize: '1rem',
                  backgroundColor: alpha('#22c55e', 0.9),
                  color: 'white',
                  '& .MuiChip-label': { px: 2 },
                }}
              />
              <Typography variant="h1" gutterBottom sx={{ color: 'white' }}>
                Perfect Your Quran
                <br />
                Recitation with AI
              </Typography>
              <Typography
                variant="h5"
                sx={{ maxWidth: 700, mx: 'auto', color: alpha('#fff', 0.9) }}
              >
                Get instant feedback on your pronunciation, identify areas for improvement,
                and master the art of Quranic recitation with our advanced AI technology.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/signup')}
                  endIcon={<ChevronRight />}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    backgroundColor: '#22c55e',
                    '&:hover': {
                      backgroundColor: '#16a34a',
                    },
                  }}
                >
                  Start Free Trial
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<PlayArrow />}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    color: 'white',
                    borderColor: 'white',
                    '&:hover': {
                      borderColor: '#22c55e',
                      backgroundColor: alpha('#22c55e', 0.1),
                    },
                  }}
                >
                  Watch Demo
                </Button>
              </Stack>

              {/* Stats */}
              <Grid container spacing={3} sx={{ mt: 6 }}>
                {stats.map((stat, index) => (
                  <Grid item xs={6} sm={3} key={index}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          textAlign: 'center',
                          background: alpha('#fff', 0.1),
                          backdropFilter: 'blur(10px)',
                          borderRadius: '16px',
                          color: 'white',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                          {stat.icon}
                        </Box>
                        <Typography variant="h4" fontWeight="bold" sx={{ color: '#22c55e' }}>
                          {stat.value}
                        </Typography>
                        <Typography variant="body2" sx={{ color: alpha('#fff', 0.8) }}>
                          {stat.label}
                        </Typography>
                      </Paper>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Stack>
          </motion.div>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 10, position: 'relative' }}>
        <Container maxWidth="lg">
          <Stack spacing={6}>
            <Stack alignItems="center" textAlign="center">
              <Chip label="Features" color="primary" sx={{ mb: 2 }} />
              <Typography variant="h2" gutterBottom>
                Powerful Features
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600 }}>
                Everything you need to improve your Quran recitation skills
              </Typography>
            </Stack>

            <Grid container spacing={4}>
              {features.map((feature, index) => (
                <Grid item size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card
                      sx={{
                        height: '100%',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: `0 20px 40px ${alpha(feature.color, 0.2)}`,
                        },
                      }}
                    >
                      <CardContent>
                        <Avatar
                          sx={{
                            bgcolor: `${feature.color}20`,
                            color: feature.color,
                            width: 64,
                            height: 64,
                            mb: 2,
                          }}
                        >
                          {feature.icon}
                        </Avatar>
                        <Typography variant="h5" gutterBottom fontWeight="bold">
                          {feature.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {feature.description}
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

      {/* How It Works Section with Background Pattern */}
      <Box sx={{ 
        py: 10, 
        bgcolor: alpha(theme.palette.primary.main, 0.03),
        position: 'relative',
        backgroundImage: 'url("https://www.transparenttextures.com/contents/islamic-pattern.png")',
        backgroundRepeat: 'repeat',
        backgroundOpacity: 0.05,
      }}>
        <Container maxWidth="lg">
          <Stack spacing={6}>
            <Stack alignItems="center" textAlign="center">
              <Chip label="Process" color="primary" sx={{ mb: 2 }} />
              <Typography variant="h2" gutterBottom>
                How It Works
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600 }}>
                Four simple steps to perfect your recitation
              </Typography>
            </Stack>

            <Grid container spacing={4}>
              {howItWorks.map((step, index) => (
                <Grid item size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card
                      sx={{
                        textAlign: 'center',
                        height: '100%',
                        position: 'relative',
                        overflow: 'visible',
                      }}
                    >
                      <Box
                        sx={{
                          position: 'absolute',
                          top: -20,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                        }}
                      >
                        {step.step}
                      </Box>
                      <CardContent sx={{ mt: 3 }}>
                        <Avatar
                          sx={{
                            width: 64,
                            height: 64,
                            bgcolor: `${theme.palette.primary.main}20`,
                            color: 'primary.main',
                            mx: 'auto',
                            mb: 2,
                          }}
                        >
                          {step.icon}
                        </Avatar>
                        <Typography variant="h6" gutterBottom fontWeight="bold">
                          {step.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {step.description}
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

      {/* Testimonials Section */}
      <Box sx={{ py: 10 }}>
        <Container maxWidth="lg">
          <Stack spacing={6}>
            <Stack alignItems="center" textAlign="center">
              <Chip label="Testimonials" color="primary" sx={{ mb: 2 }} />
              <Typography variant="h2" gutterBottom>
                What Our Users Say
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600 }}>
                Join thousands of satisfied users who have improved their recitation
              </Typography>
            </Stack>

            <Grid container spacing={4}>
              {testimonials.map((testimonial, index) => (
                <Grid item size={{ xs: 12, md: 4 }} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', mb: 2 }}>
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} sx={{ color: '#fbbf24', fontSize: 20 }} />
                          ))}
                        </Box>
                        <Typography variant="body1" sx={{ mb: 2, fontStyle: 'italic' }}>
                          "{testimonial.content}"
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                          <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                            {testimonial.avatar}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" fontWeight="bold">
                              {testimonial.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {testimonial.role}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Stack>
        </Container>
      </Box>

      {/* Pricing Section with Background Image */}
      <Box sx={{ 
        py: 10, 
        position: 'relative',
        backgroundImage: 'url("https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=80&w=2070&auto=format&fit=crop")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 27, 75, 0.95) 100%)',
        },
      }}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Stack spacing={6}>
            <Stack alignItems="center" textAlign="center">
              <Chip label="Pricing" sx={{ backgroundColor: '#22c55e', color: 'white' }} />
              <Typography variant="h2" gutterBottom sx={{ color: 'white' }}>
                Choose Your Plan
              </Typography>
              <Typography variant="h6" sx={{ color: alpha('#fff', 0.8), maxWidth: 600 }}>
                Start for free and upgrade as you grow
              </Typography>
            </Stack>

            <Grid container spacing={4} alignItems="center">
              {pricingPlans.map((plan, index) => (
                <Grid item size={{ xs: 12, md: 4 }} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card
                      sx={{
                        height: '100%',
                        position: 'relative',
                        border: plan.recommended ? `2px solid ${theme.palette.primary.main}` : 'none',
                        backgroundColor: alpha('#1e293b', 0.9),
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      {plan.recommended && (
                        <Chip
                          label="Recommended"
                          sx={{
                            position: 'absolute',
                            top: -7,
                            right: 20,
                            backgroundColor: '#22c55e',
                            color: 'white',
                          }}
                        />
                      )}
                      <CardContent sx={{ textAlign: 'center', p: 4 }}>
                        <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: 'white' }}>
                          {plan.name}
                        </Typography>
                        <Box sx={{ my: 3 }}>
                          <Typography variant="h2" component="span" fontWeight="bold" sx={{ color: '#22c55e' }}>
                            {plan.price}
                          </Typography>
                          <Typography variant="body2" component="span" sx={{ color: alpha('#fff', 0.6) }}>
                            {plan.period}
                          </Typography>
                        </Box>
                        <Stack spacing={2} sx={{ mb: 3 }}>
                          {plan.features.map((feature, idx) => (
                            <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <CheckCircle sx={{ color: '#22c55e', fontSize: 16 }} />
                              <Typography variant="body2" sx={{ color: alpha('#fff', 0.8) }}>
                                {feature}
                              </Typography>
                            </Box>
                          ))}
                        </Stack>
                        <Button
                          variant={plan.recommended ? 'contained' : 'outlined'}
                          fullWidth
                          onClick={() => navigate('/subscription')}
                          endIcon={<ArrowForward />}
                          sx={{
                            borderColor: '#22c55e',
                            color: plan.recommended ? 'white' : '#22c55e',
                            '&:hover': {
                              backgroundColor: alpha('#22c55e', 0.1),
                              borderColor: '#22c55e',
                            },
                          }}
                        >
                          Get Started
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Stack>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: 12,
          background: 'linear-gradient(135deg, #22c55e 0%, #3b82f6 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="md">
          <Stack spacing={3} alignItems="center" textAlign="center">
            <Typography variant="h3" fontWeight="bold">
              Ready to Perfect Your Recitation?
            </Typography>
            <Typography variant="h6">
              Join thousands of users who are improving their Quran recitation daily
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/signup')}
              sx={{
                bgcolor: 'white',
                color: '#f3f3f3',
                px: 4,
                py: 1.5,
                '&:hover': {
                  bgcolor: 'white',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                },
              }}
            >
              Start Free Trial
            </Button>
            <Typography variant="body2">
              No credit card required • Free 7-day trial
            </Typography>
          </Stack>
        </Container>
      </Box>

      {/* Add CSS animations */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
        `}
      </style>
    </Box>
  )
}

export default Landing