import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  InputAdornment,
  Button,
  Chip,
  Stack,
  Avatar,
  Divider,
  useTheme,
  alpha,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import {
  Search,
  ExpandMore,
  HelpOutline,
  LiveHelp,
  Email,
  Phone,
  Chat,
  Article,
  VideoLibrary,
  School,
  Security,
  Payment,
  AccountCircle,
  Mic,
  History,
  TrendingUp,
  ContactSupport,
  GetApp,
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const Help = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const { user } = useAuth()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [contactDialogOpen, setContactDialogOpen] = useState(false)
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: '',
  })

  const faqCategories = [
    {
      category: 'Getting Started',
      icon: <School />,
      questions: [
        {
          q: 'How do I create an account?',
          a: 'Click on the "Sign Up" button in the top right corner. Enter your name, email, and password to create your account. You can also sign up using Google for quicker access.',
        },
        {
          q: 'Is Qira\'a free to use?',
          a: 'Yes! Qira\'a offers a free plan with 5 recitations per day. You can upgrade to Pro for unlimited recitations and advanced AI feedback.',
        },
        {
          q: 'How do I start reciting?',
          a: 'Navigate to the Recitation Studio from the dashboard, select a verse from the Quran, click "Start Recording", and recite the verse. Our AI will analyze your recitation and provide feedback.',
        },
      ],
    },
    {
      category: 'Recitation & Feedback',
      icon: <Mic />,
      questions: [
        {
          q: 'How accurate is the AI feedback?',
          a: 'Our AI model has been trained on thousands of Quran recitations and achieves 98% accuracy in pronunciation detection. It provides detailed feedback on Makharij (articulation points) and Tajweed rules.',
        },
        {
          q: 'What should I do if the AI misinterprets my recitation?',
          a: 'While our AI is highly accurate, occasional misinterpretations can happen due to background noise or unclear pronunciation. Try reciting in a quiet environment and ensure your microphone is working properly.',
        },
        {
          q: 'Can I listen to my recordings?',
          a: 'Yes! After each recitation, you can play back your recording and compare it with the correct pronunciation. Recordings are temporarily stored and deleted after your session.',
        },
      ],
    },
    {
      category: 'Account & Subscription',
      icon: <AccountCircle />,
      questions: [
        {
          q: 'How do I upgrade my subscription?',
          a: 'Go to the Subscription page from your dashboard or click on "Premium" in the navigation bar. Choose your preferred plan and complete the payment process.',
        },
        {
          q: 'Can I cancel my subscription anytime?',
          a: 'Absolutely! You can cancel your subscription at any time from your Profile settings. You\'ll continue to have access until the end of your billing period.',
        },
        {
          q: 'What payment methods do you accept?',
          a: 'We accept all major credit cards (Visa, MasterCard, American Express) and PayPal. All payments are processed securely.',
        },
      ],
    },
    {
      category: 'Technical Support',
      icon: <Security />,
      questions: [
        {
          q: 'What browsers are supported?',
          a: 'Qira\'a works best on modern browsers including Chrome, Firefox, Safari, and Edge. We recommend using the latest version of Chrome for the best experience.',
        },
        {
          q: 'Why is my microphone not working?',
          a: 'Make sure you\'ve granted microphone permissions to your browser. Check your browser settings and ensure no other application is using your microphone.',
        },
        {
          q: 'Is my data secure?',
          a: 'Yes! We take security seriously. Your data is encrypted and protected. We never store your audio recordings permanently, and all personal information is kept confidential.',
        },
      ],
    },
  ]

  const videoTutorials = [
    {
      title: 'Getting Started with Qira\'a',
      duration: '3:45',
      icon: <VideoLibrary />,
    },
    {
      title: 'How to Record Your Recitation',
      duration: '2:30',
      icon: <VideoLibrary />,
    },
    {
      title: 'Understanding Your Feedback',
      duration: '4:15',
      icon: <VideoLibrary />,
    },
    {
      title: 'Tracking Your Progress',
      duration: '3:00',
      icon: <VideoLibrary />,
    },
  ]

  const supportOptions = [
    { icon: <Email />, title: 'Email Support', description: 'Get response within 24 hours', action: 'support@qiraa.com' },
    { icon: <Chat />, title: 'Live Chat', description: 'Available 9 AM - 6 PM', action: 'Start Chat' },
    { icon: <Phone />, title: 'Phone Support', description: 'Emergency support only', action: '+1 (555) 123-4567' },
  ]

  const handleContactSubmit = () => {
    if (!contactForm.subject || !contactForm.message) {
      toast.error('Please fill in all fields')
      return
    }
    toast.success('Message sent successfully! We\'ll get back to you soon.')
    setContactDialogOpen(false)
    setContactForm({ subject: '', message: '' })
  }

  const filteredFAQs = searchTerm
    ? faqCategories.map(cat => ({
        ...cat,
        questions: cat.questions.filter(q => 
          q.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.a.toLowerCase().includes(searchTerm.toLowerCase())
        ),
      })).filter(cat => cat.questions.length > 0)
    : faqCategories

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box mb={4} textAlign="center">
          <Typography variant="h4" gutterBottom fontWeight="bold">
            How Can We Help You?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Find answers to common questions or get in touch with our support team
          </Typography>
        </Box>

        {/* Search Bar */}
        <Box mb={4} sx={{ maxWidth: 600, mx: 'auto' }}>
          <TextField
            fullWidth
            placeholder="Search for help articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                backgroundColor: alpha(theme.palette.background.paper, 0.6),
              },
            }}
          />
        </Box>

        {/* Quick Actions */}
        <Grid container spacing={3} mb={5}>
          <Grid item size={{ xs: 12, sm: 4 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card
                sx={{
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': { transform: 'translateY(-4px)' },
                }}
                onClick={() => setContactDialogOpen(true)}
              >
                <CardContent>
                  <Avatar sx={{ bgcolor: alpha('#22c55e', 0.1), color: '#22c55e', width: 56, height: 56, mx: 'auto', mb: 2 }}>
                    <ContactSupport />
                  </Avatar>
                  <Typography variant="h6" gutterBottom>
                    Contact Support
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Get help from our support team
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
          
          <Grid item size={{ xs: 12, sm: 4 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card
                sx={{
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': { transform: 'translateY(-4px)' },
                }}
                onClick={() => navigate('/faq')}
              >
                <CardContent>
                  <Avatar sx={{ bgcolor: alpha('#3b82f6', 0.1), color: '#3b82f6', width: 56, height: 56, mx: 'auto', mb: 2 }}>
                    {/* <FAQ /> */}
                  </Avatar>
                  <Typography variant="h6" gutterBottom>
                    FAQ
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Frequently asked questions
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
          
          <Grid item size={{ xs: 12, sm: 4 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card
                sx={{
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': { transform: 'translateY(-4px)' },
                }}
                onClick={() => window.open('https://www.youtube.com', '_blank')}
              >
                <CardContent>
                  <Avatar sx={{ bgcolor: alpha('#f59e0b', 0.1), color: '#f59e0b', width: 56, height: 56, mx: 'auto', mb: 2 }}>
                    <VideoLibrary />
                  </Avatar>
                  <Typography variant="h6" gutterBottom>
                    Video Tutorials
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Watch our tutorial videos
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        {/* FAQ Section */}
        <Typography variant="h5" fontWeight="bold" gutterBottom mb={3}>
          Frequently Asked Questions
        </Typography>
        
        {filteredFAQs.length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 6 }}>
              <Search sx={{ fontSize: 64, color: alpha(theme.palette.text.secondary, 0.3), mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No results found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try searching with different keywords
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {filteredFAQs.map((category, idx) => (
              <Grid item size={{ xs: 12, md: 6 }} key={idx}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <Card>
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={1} mb={2}>
                        <Avatar sx={{ bgcolor: alpha('#22c55e', 0.1), color: '#22c55e' }}>
                          {category.icon}
                        </Avatar>
                        <Typography variant="h6" fontWeight="bold">
                          {category.category}
                        </Typography>
                      </Box>
                      
                      {category.questions.map((item, qIdx) => (
                        <Accordion key={qIdx} elevation={0} sx={{ '&:before': { display: 'none' } }}>
                          <AccordionSummary expandIcon={<ExpandMore />}>
                            <Typography variant="subtitle2" fontWeight="500">
                              {item.q}
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Typography variant="body2" color="text.secondary">
                              {item.a}
                            </Typography>
                          </AccordionDetails>
                        </Accordion>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Video Tutorials Section */}
        <Box mt={6}>
          <Typography variant="h5" fontWeight="bold" gutterBottom mb={3}>
            Video Tutorials
          </Typography>
          <Grid container spacing={2}>
            {videoTutorials.map((video, idx) => (
              <Grid item size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
                <Card sx={{ cursor: 'pointer', '&:hover': { transform: 'translateY(-4px)' } }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Avatar sx={{ bgcolor: alpha('#f59e0b', 0.1), color: '#f59e0b', width: 56, height: 56, mx: 'auto', mb: 2 }}>
                      {video.icon}
                    </Avatar>
                    <Typography variant="body2" fontWeight="bold" gutterBottom>
                      {video.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {video.duration}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Support Options */}
        <Box mt={6}>
          <Typography variant="h5" fontWeight="bold" gutterBottom mb={3}>
            Still Need Help?
          </Typography>
          <Grid container spacing={3}>
            {supportOptions.map((option, idx) => (
              <Grid item size={{ xs: 12, md: 4 }} key={idx}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Avatar sx={{ bgcolor: alpha('#8b5cf6', 0.1), color: '#8b5cf6', width: 56, height: 56, mx: 'auto', mb: 2 }}>
                      {option.icon}
                    </Avatar>
                    <Typography variant="h6" gutterBottom>
                      {option.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {option.description}
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        if (option.title === 'Email Support') {
                          window.location.href = `mailto:${option.action}`
                        } else if (option.title === 'Live Chat') {
                          setContactDialogOpen(true)
                        } else {
                          navigator.clipboard.writeText(option.action)
                          toast.success('Phone number copied!')
                        }
                      }}
                    >
                      {option.action}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Contact Dialog */}
        <Dialog open={contactDialogOpen} onClose={() => setContactDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Contact Support</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                fullWidth
                label="Subject"
                value={contactForm.subject}
                onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                placeholder="Brief description of your issue"
              />
              <TextField
                fullWidth
                label="Message"
                multiline
                rows={6}
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                placeholder="Please provide details about your issue..."
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setContactDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleContactSubmit}>Send Message</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  )
}

export default Help