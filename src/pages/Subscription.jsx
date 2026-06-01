import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  FormControlLabel,
  useTheme,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Alert,
  LinearProgress,
} from '@mui/material'
import {
  CheckCircle,
  Star,
  Rocket,
  School,
  Security,
  Support,
  Favorite,
  CreditCard,
  Payment,
  Verified,
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useSubscription } from '../context/SubscriptionContext'
import toast from 'react-hot-toast'

const Subscription = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const { user } = useAuth()
  const { subscribe, subscription: currentSubscription, loading, dailyUsage } = useSubscription()
  
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [billingCycle, setBillingCycle] = useState('monthly')
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  })
  const [paymentError, setPaymentError] = useState('')
  const [paymentProcessing, setPaymentProcessing] = useState(false)

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: { monthly: 0, yearly: 0 },
      period: 'month',
      description: 'Perfect for beginners',
      features: [
        '5 recitations per day',
        'Basic AI feedback',
        '7-day history access',
        'Email support',
        'Basic analytics',
      ],
      limitations: [
        'No audio download',
        'Limited to 1 device',
        'Basic pronunciation analysis',
      ],
      icon: <School sx={{ fontSize: 48 }} />,
      color: '#64748b',
      recommended: false,
      buttonText: 'Current Plan',
    },
    {
      id: 'pro',
      name: 'Pro',
      price: { monthly: 9.99, yearly: 99.99 },
      period: 'month',
      description: 'For serious learners',
      features: [
        '100 recitations per day',
        'Advanced AI feedback',
        'Unlimited history',
        'Priority support',
        'Download audio & reports',
        'Detailed pronunciation analysis',
        'Multiple device support',
        'Progress reports',
      ],
      limitations: [],
      icon: <Rocket sx={{ fontSize: 48 }} />,
      color: '#22c55e',
      recommended: true,
      buttonText: 'Upgrade to Pro',
    },
    {
      id: 'family',
      name: 'Family',
      price: { monthly: 19.99, yearly: 199.99 },
      period: 'month',
      description: 'For the whole family',
      features: [
        '200 recitations per day',
        'All Pro features',
        'Up to 5 family members',
        'Family dashboard',
        'Dedicated support',
        'Monthly progress reports',
        'Parental controls',
        'Group learning sessions',
        'Family achievements',
      ],
      limitations: [],
      icon: <Favorite sx={{ fontSize: 48 }} />,
      color: '#8b5cf6',
      recommended: false,
      buttonText: 'Upgrade to Family',
    },
  ]

  const yearlySavings = {
    pro: 19.89,
    family: 39.89,
  }

  const handleSubscribe = (plan) => {
    if (plan.id === 'free') {
      navigate('/dashboard')
    } else {
      setSelectedPlan(plan)
      setPaymentDialogOpen(true)
    }
  }

  const handlePaymentSubmit = async () => {
    // Validate payment details
    if (!paymentDetails.cardNumber || !paymentDetails.cardName || !paymentDetails.expiryDate || !paymentDetails.cvv) {
      setPaymentError('Please fill in all payment details')
      return
    }

    setPaymentProcessing(true)
    setPaymentError('')
    
    // Simulate payment processing
    setTimeout(async () => {
      try {
        // Call the subscribe function from context
        const result = await subscribe(selectedPlan.id)
        
        if (result.success) {
          toast.success(`Successfully upgraded to ${selectedPlan.name} plan!`)
          setPaymentDialogOpen(false)
          setPaymentDetails({
            cardNumber: '',
            cardName: '',
            expiryDate: '',
            cvv: '',
          })
          // Navigate to dashboard after successful subscription
          setTimeout(() => {
            navigate('/dashboard')
          }, 1500)
        } else {
          setPaymentError(result.error || 'Payment failed. Please try again.')
          toast.error(result.error || 'Subscription failed')
        }
      } catch (error) {
        setPaymentError('Payment failed. Please try again.')
        toast.error('Subscription failed')
      } finally {
        setPaymentProcessing(false)
      }
    }, 2000)
  }

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    }
    return value
  }

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + (v.length > 2 ? '/' + v.substring(2, 4) : '')
    }
    return v
  }

  // Check if user already has a plan
  const isCurrentPlan = (planId) => {
    if (planId === 'free') {
      return !currentSubscription && (!dailyUsage || dailyUsage.subscriptionType === 'free')
    }
    return currentSubscription?.type === planId || dailyUsage?.subscriptionType === planId
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: 8,
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box textAlign="center" mb={6}>
          <Chip label="Pricing Plans" color="primary" sx={{ mb: 2, py: 2, px: 2 }} />
          <Typography variant="h2" gutterBottom fontWeight="bold">
            Choose Your Perfect Plan
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Start for free and upgrade as you grow. All plans include access to our AI technology.
          </Typography>

          {/* Current Plan Info */}
          {currentSubscription && (
            <Box sx={{ mt: 2 }}>
              <Chip 
                label={`Current Plan: ${currentSubscription.type?.charAt(0).toUpperCase() + currentSubscription.type?.slice(1)}`}
                color="success"
                variant="outlined"
              />
            </Box>
          )}

          {/* Billing Toggle */}
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <FormControlLabel
              control={
                <Switch
                  checked={billingCycle === 'yearly'}
                  onChange={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#22c55e',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#22c55e',
                    },
                  }}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body1">Monthly</Typography>
                  <Chip
                    label="Save 20%"
                    size="small"
                    sx={{
                      backgroundColor: '#22c55e',
                      color: 'white',
                      fontSize: '0.75rem',
                      height: '24px',
                    }}
                  />
                  <Typography variant="body1">Yearly</Typography>
                </Box>
              }
              labelPlacement="start"
            />
          </Box>
        </Box>

        {/* Pricing Cards */}
        <Grid container spacing={4} alignItems="flex-start">
          {plans.map((plan, index) => {
            const currentPlan = isCurrentPlan(plan.id)
            const price = billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly
            
            return (
              <Grid item size={{ xs: 12, md: 4 }} key={plan.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      position: 'relative',
                      overflow: 'visible',
                      border: plan.recommended ? `2px solid ${plan.color}` : 'none',
                      transform: plan.recommended ? 'scale(1.02)' : 'scale(1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: plan.recommended ? 'scale(1.05)' : 'scale(1.02)',
                        boxShadow: `0 20px 40px ${alpha(plan.color, 0.2)}`,
                      },
                    }}
                  >
                    {plan.recommended && (
                      <Chip
                        label="Most Popular"
                        sx={{
                          position: 'absolute',
                          top: -12,
                          right: 20,
                          backgroundColor: plan.color,
                          color: 'white',
                        }}
                      />
                    )}
                    
                    {currentPlan && (
                      <Chip
                        label="Current Plan"
                        sx={{
                          position: 'absolute',
                          top: -12,
                          left: 20,
                          backgroundColor: '#64748b',
                          color: 'white',
                        }}
                      />
                    )}

                    <CardContent sx={{ p: 4 }}>
                      <Box
                        sx={{
                          width: 80,
                          height: 80,
                          borderRadius: '20px',
                          background: alpha(plan.color, 0.1),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 3,
                        }}
                      >
                        {plan.icon}
                      </Box>

                      <Typography variant="h4" gutterBottom fontWeight="bold">
                        {plan.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {plan.description}
                      </Typography>

                      <Box sx={{ mb: 3 }}>
                        <Typography variant="h2" component="span" fontWeight="bold" sx={{ color: plan.color }}>
                          ${billingCycle === 'monthly' ? price : (price / 12).toFixed(2)}
                        </Typography>
                        <Typography variant="body2" component="span" color="text.secondary">
                          /month
                        </Typography>
                        {billingCycle === 'yearly' && (
                          <Typography variant="caption" color="success.main" sx={{ display: 'block', mt: 0.5 }}>
                            Billed annually (${price}/year)
                          </Typography>
                        )}
                        {plan.id !== 'free' && billingCycle === 'yearly' && (
                          <Typography variant="caption" color="success.main" sx={{ display: 'block' }}>
                            Save ${yearlySavings[plan.id]} per year
                          </Typography>
                        )}
                      </Box>

                      <List sx={{ mb: 3 }}>
                        {plan.features.map((feature, idx) => (
                          <ListItem key={idx} sx={{ px: 0, py: 0.5 }}>
                            <ListItemIcon sx={{ minWidth: 32 }}>
                              <CheckCircle sx={{ color: plan.color, fontSize: 20 }} />
                            </ListItemIcon>
                            <ListItemText primary={feature} primaryTypographyProps={{ variant: 'body2' }} />
                          </ListItem>
                        ))}
                        
                        {plan.limitations.map((limitation, idx) => (
                          <ListItem key={idx} sx={{ px: 0, py: 0.5, opacity: 0.6 }}>
                            <ListItemIcon sx={{ minWidth: 32 }}>
                              <CheckCircle sx={{ color: '#64748b', fontSize: 20 }} />
                            </ListItemIcon>
                            <ListItemText primary={limitation} primaryTypographyProps={{ variant: 'body2' }} />
                          </ListItem>
                        ))}
                      </List>

                      <Button
                        fullWidth
                        variant={currentPlan ? 'outlined' : 'contained'}
                        size="large"
                        disabled={currentPlan || loading}
                        onClick={() => handleSubscribe(plan)}
                        sx={{
                          borderRadius: '12px',
                          py: 1.5,
                          ...(!currentPlan && {
                            background: `linear-gradient(135deg, ${plan.color} 0%, ${alpha(plan.color, 0.8)} 100%)`,
                          }),
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: `0 8px 20px ${alpha(plan.color, 0.3)}`,
                          },
                        }}
                      >
                        {currentPlan ? 'Current Plan' : plan.buttonText}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            )
          })}
        </Grid>

        {/* Features Comparison Section */}
        <Box sx={{ mt: 8 }}>
          <Typography variant="h4" textAlign="center" gutterBottom fontWeight="bold">
            Compare All Features
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 4 }}>
            Get all the features you need to perfect your Quran recitation
          </Typography>

          <Card sx={{ overflow: 'hidden' }}>
            <Box sx={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: alpha(theme.palette.primary.main, 0.1) }}>
                    <th style={{ padding: '16px', textAlign: 'left' }}>Feature</th>
                    {plans.map(plan => (
                      <th key={plan.id} style={{ padding: '16px', textAlign: 'center' }}>
                        {plan.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: 'Daily Recitations', free: '5/day', pro: '100/day', family: '200/day' },
                    { feature: 'AI Feedback Quality', free: 'Basic', pro: 'Advanced', family: 'Advanced' },
                    { feature: 'History Access', free: '7 days', pro: 'Unlimited', family: 'Unlimited' },
                    { feature: 'Download Reports', free: '❌', pro: '✅', family: '✅' },
                    { feature: 'Audio Downloads', free: '❌', pro: '✅', family: '✅' },
                    { feature: 'Family Members', free: '1', pro: '1', family: '5' },
                    { feature: 'Priority Support', free: '❌', pro: '✅', family: '✅' },
                    { feature: 'Progress Analytics', free: 'Basic', pro: 'Advanced', family: 'Advanced' },
                  ].map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                      <td style={{ padding: '16px', fontWeight: 500 }}>{row.feature}</td>
                      <td style={{ padding: '16px', textAlign: 'center', color: row.free === '✅' ? '#22c55e' : 'inherit' }}>{row.free}</td>
                      <td style={{ padding: '16px', textAlign: 'center', color: row.pro === '✅' ? '#22c55e' : 'inherit' }}>{row.pro}</td>
                      <td style={{ padding: '16px', textAlign: 'center', color: row.family === '✅' ? '#22c55e' : 'inherit' }}>{row.family}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          </Card>
        </Box>

        {/* FAQ Section */}
        <Box sx={{ mt: 8 }}>
          <Typography variant="h4" textAlign="center" gutterBottom fontWeight="bold">
            Frequently Asked Questions
          </Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item size={{ xs: 12, md: 6 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight="bold">Can I cancel my subscription anytime?</Typography>
                  <Typography variant="body2" color="text.secondary">Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight="bold">Is there a free trial?</Typography>
                  <Typography variant="body2" color="text.secondary">Yes, all paid plans come with a 7-day free trial. No credit card required to start.</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight="bold">What payment methods do you accept?</Typography>
                  <Typography variant="body2" color="text.secondary">We accept all major credit cards (Visa, MasterCard, American Express).</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight="bold">Can I switch plans later?</Typography>
                  <Typography variant="body2" color="text.secondary">Absolutely! You can upgrade or downgrade your plan at any time from your account settings.</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Trust Badges */}
        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Stack direction="row" spacing={3} justifyContent="center" flexWrap="wrap">
            <Chip icon={<Security />} label="256-bit SSL Secure" />
            <Chip icon={<Verified />} label="Verified Company" />
            <Chip icon={<Payment />} label="Secure Payments" />
            <Chip icon={<Support />} label="24/7 Support" />
          </Stack>
        </Box>
      </Container>

      {/* Payment Dialog */}
      <Dialog
        open={paymentDialogOpen}
        onClose={() => !paymentProcessing && setPaymentDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '20px',
            background: alpha(theme.palette.background.paper, 0.95),
            backdropFilter: 'blur(10px)',
          },
        }}
      >
        <DialogTitle>
          <Typography variant="h5" fontWeight="bold">
            Complete Your Subscription
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Enter your payment details to upgrade to {selectedPlan?.name} plan
          </Typography>
        </DialogTitle>
        
        <DialogContent>
          {paymentError && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: '12px' }}>
              {paymentError}
            </Alert>
          )}
          
          <Stack spacing={3} sx={{ mt: 2 }}>
            <Box sx={{ p: 2, bgcolor: alpha('#22c55e', 0.1), borderRadius: '12px' }}>
              <Typography variant="body2" color="primary" fontWeight="bold">Order Summary</Typography>
              <Typography variant="h6" fontWeight="bold">
                {selectedPlan?.name} Plan - {billingCycle === 'monthly' ? 'Monthly' : 'Yearly'}
              </Typography>
              <Typography variant="h4" fontWeight="bold" sx={{ color: '#22c55e' }}>
                ${billingCycle === 'monthly' ? selectedPlan?.price.monthly : selectedPlan?.price.yearly}
                <Typography component="span" variant="body2" color="text.secondary">
                  /{billingCycle === 'monthly' ? 'month' : 'year'}
                </Typography>
              </Typography>
            </Box>

            <TextField
              fullWidth
              label="Card Number"
              placeholder="1234 5678 9012 3456"
              value={paymentDetails.cardNumber}
              onChange={(e) => setPaymentDetails({ ...paymentDetails, cardNumber: formatCardNumber(e.target.value) })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CreditCard sx={{ color: '#22c55e' }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Cardholder Name"
              placeholder="John Doe"
              value={paymentDetails.cardName}
              onChange={(e) => setPaymentDetails({ ...paymentDetails, cardName: e.target.value })}
            />

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Expiry Date"
                  placeholder="MM/YY"
                  value={paymentDetails.expiryDate}
                  onChange={(e) => setPaymentDetails({ ...paymentDetails, expiryDate: formatExpiryDate(e.target.value) })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="CVV"
                  placeholder="123"
                  type="password"
                  value={paymentDetails.cvv}
                  onChange={(e) => setPaymentDetails({ ...paymentDetails, cvv: e.target.value })}
                  inputProps={{ maxLength: 4 }}
                />
              </Grid>
            </Grid>

            {paymentProcessing && <LinearProgress sx={{ borderRadius: '12px' }} />}
          </Stack>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handlePaymentSubmit}
            disabled={paymentProcessing}
            sx={{
              borderRadius: '12px',
              py: 1.5,
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            }}
          >
            {paymentProcessing ? 'Processing...' : `Pay $${billingCycle === 'monthly' ? selectedPlan?.price.monthly : selectedPlan?.price.yearly}`}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Subscription