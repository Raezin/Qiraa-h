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
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper,
  useTheme,
  alpha,
} from '@mui/material'
import {
  MenuBook,
  RecordVoiceOver,
  Psychology,
  TrendingUp,
  CheckCircle,
  VideoLibrary,
  Assessment,
  EmojiEvents,
} from '@mui/icons-material'
import { motion } from 'framer-motion'

const HowItWorks = () => {
  const theme = useTheme()

  const steps = [
    {
      label: 'Choose a Surah or Verse',
      description: 'Browse through the Holy Quran and select any verse you want to practice. You can choose from different Qiraat (recitation styles) and listen to reference recitations.',
      icon: <MenuBook sx={{ fontSize: 32 }} />,
      color: '#22c55e',
    },
    {
      label: 'Record Your Recitation',
      description: 'Click the record button and recite the selected verse clearly into your microphone. Our advanced audio processing ensures high-quality capture for accurate analysis.',
      icon: <RecordVoiceOver sx={{ fontSize: 32 }} />,
      color: '#3b82f6',
    },
    {
      label: 'Receive AI Analysis',
      description: 'Our AI model analyzes your recitation in real-time, comparing it with correct pronunciation patterns and Tajweed rules. Get detailed feedback on each word.',
      icon: <Psychology sx={{ fontSize: 32 }} />,
      color: '#f59e0b',
    },
    {
      label: 'Track Your Progress',
      description: 'View your results, identify areas for improvement, and track your progress over time. Practice regularly to see your recitation skills improve.',
      icon: <TrendingUp sx={{ fontSize: 32 }} />,
      color: '#8b5cf6',
    },
  ]

  const tips = [
    {
      title: 'Find a Quiet Environment',
      description: 'Ensure you are in a quiet space for the best audio quality',
      icon: <CheckCircle />,
    },
    {
      title: 'Use a Good Microphone',
      description: 'A quality microphone improves accuracy of analysis',
      icon: <CheckCircle />,
    },
    {
      title: 'Practice Regularly',
      description: 'Consistent practice leads to faster improvement',
      icon: <CheckCircle />,
    },
    {
      title: 'Review Feedback',
      description: 'Take time to understand the feedback and practice weak areas',
      icon: <CheckCircle />,
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
              <Chip label="How It Works" color="primary" size="large" />
              <Typography variant="h2" gutterBottom fontWeight="bold">
                Simple Steps to
                <br />
                Perfect Recitation
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700 }}>
                Follow these four simple steps to start improving your Quran recitation today
              </Typography>
            </Stack>
          </motion.div>
        </Container>
      </Box>

      {/* Steps Section */}
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Stepper orientation="vertical" sx={{ gap: 2 }}>
          {steps.map((step, index) => (
            <Step key={index} active={true}>
              <StepLabel
                StepIconComponent={() => (
                  <Avatar
                    sx={{
                      bgcolor: step.color,
                      width: 48,
                      height: 48,
                      color: 'white',
                    }}
                  >
                    {step.icon}
                  </Avatar>
                )}
              >
                <Typography variant="h6" fontWeight="bold">
                  {step.label}
                </Typography>
              </StepLabel>
              <StepContent>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      bgcolor: alpha(step.color, 0.05),
                      borderRadius: '16px',
                      mt: 1,
                    }}
                  >
                    <Typography variant="body1" color="text.secondary">
                      {step.description}
                    </Typography>
                  </Paper>
                </motion.div>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </Container>

      {/* Tips Section */}
      <Box sx={{ py: 8, bgcolor: alpha(theme.palette.primary.main, 0.03) }}>
        <Container maxWidth="lg">
          <Stack spacing={6}>
            <Typography variant="h3" textAlign="center" fontWeight="bold">
              Tips for Best Results
            </Typography>
            <Grid container spacing={4}>
              {tips.map((tip, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card sx={{ textAlign: 'center', height: '100%' }}>
                      <CardContent>
                        <Avatar
                          sx={{
                            width: 56,
                            height: 56,
                            bgcolor: alpha('#22c55e', 0.1),
                            color: '#22c55e',
                            mx: 'auto',
                            mb: 2,
                          }}
                        >
                          {tip.icon}
                        </Avatar>
                        <Typography variant="h6" gutterBottom fontWeight="bold">
                          {tip.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {tip.description}
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

      {/* Video Demo Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="md">
          <Stack spacing={3} alignItems="center" textAlign="center">
            <Typography variant="h3" fontWeight="bold">
              Watch a Demo
            </Typography>
            <Typography variant="h6" color="text.secondary">
              See how Qira'a works in action
            </Typography>
            <Paper
              sx={{
                position: 'relative',
                paddingTop: '56.25%', // 16:9 aspect ratio
                overflow: 'hidden',
                borderRadius: '16px',
                width: '100%',
              }}
            >
              <Box
                component="iframe"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
                allowFullScreen
              />
            </Paper>
          </Stack>
        </Container>
      </Box>
    </Box>
  )
}

export default HowItWorks