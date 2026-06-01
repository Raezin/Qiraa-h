import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  Avatar,
  TextField,
  Divider,
  Stack,
  Chip,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  LinearProgress,
  useTheme,
  alpha,
  Skeleton,
  Badge,
  CircularProgress,
} from '@mui/material'
import {
  Person,
  Email,
  Phone,
  LocationOn,
  Edit,
  Save,
  Security,
  Notifications,
  VpnKey,
  Delete,
  CreditCard,
  Assessment,
  EmojiEvents,
  Star,
  Verified,
  Google,
  DarkMode,
  LightMode,
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useSubscription } from '../context/SubscriptionContext'
import { getUserData, updateUserData } from '../services/firebase'
import { updateProfile, updateEmail, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth'
import { auth, db } from '../services/firebase'
import { doc, updateDoc } from 'firebase/firestore'
import toast from 'react-hot-toast'

const Profile = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const { user, logout } = useAuth()
  const { subscription, dailyUsage, subscriptionType } = useSubscription()
  
  const [activeTab, setActiveTab] = useState(0)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
  })
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    darkMode: true,
    privateProfile: false,
  })
  
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  useEffect(() => {
    if (user) {
      fetchUserData()
    } else {
      setLoading(false)
    }
  }, [user])

  const fetchUserData = async () => {
    if (!user) {
      setLoading(false)
      return
    }
    
    setLoading(true)
    try {
      const data = await getUserData(user.uid)
      setUserData(data || {})
      
      setFormData({
        name: user.displayName || data?.name || '',
        email: user.email || '',
        phone: data?.phone || '',
        location: data?.location || '',
        bio: data?.bio || '',
      })
      
      setSettings({
        emailNotifications: data?.settings?.emailNotifications ?? true,
        pushNotifications: data?.settings?.pushNotifications ?? true,
        darkMode: data?.settings?.darkMode ?? true,
        privateProfile: data?.settings?.privateProfile ?? false,
      })
    } catch (error) {
      console.error('Error fetching user data:', error)
      toast.error('Failed to load profile data')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async () => {
    setSaving(true)
    try {
      // Update Firebase Auth display name
      if (formData.name !== user.displayName && auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: formData.name })
      }
      
      // Update email if changed
      if (formData.email !== user.email && auth.currentUser) {
        await updateEmail(auth.currentUser, formData.email)
      }
      
      // Update Firestore user document
      await updateUserData(user.uid, {
        name: formData.name,
        phone: formData.phone,
        location: formData.location,
        bio: formData.bio,
        updatedAt: new Date(),
      })
      
      toast.success('Profile updated successfully!')
      setEditDialogOpen(false)
      fetchUserData()
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error(error.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveSettings = async () => {
    setSaving(true)
    try {
      // Update settings in Firestore
      const userRef = doc(db, 'users', user.uid)
      await updateDoc(userRef, {
        settings: {
          emailNotifications: settings.emailNotifications,
          pushNotifications: settings.pushNotifications,
          darkMode: settings.darkMode,
          privateProfile: settings.privateProfile,
        }
      })
      
      // Apply dark mode immediately
      if (settings.darkMode) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      
      toast.success('Settings saved successfully!')
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (!passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('Please fill in all fields')
      return
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }
    
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    
    setSaving(true)
    try {
      if (auth.currentUser && user.email) {
        const credential = EmailAuthProvider.credential(user.email, passwordData.currentPassword)
        await reauthenticateWithCredential(auth.currentUser, credential)
        await updatePassword(auth.currentUser, passwordData.newPassword)
        
        toast.success('Password changed successfully')
        setPasswordDialogOpen(false)
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        })
      }
    } catch (error) {
      console.error('Error changing password:', error)
      toast.error(error.message || 'Failed to change password. Please check your current password.')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    setSaving(true)
    try {
      if (auth.currentUser) {
        await auth.currentUser.delete()
        await logout()
        navigate('/')
        toast.success('Account deleted successfully')
      }
    } catch (error) {
      console.error('Error deleting account:', error)
      toast.error(error.message || 'Failed to delete account')
    } finally {
      setSaving(false)
    }
  }

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index} role="tabpanel">
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  )

  const StatBadge = ({ icon, label, value, color }) => (
    <Box textAlign="center">
      <Avatar sx={{ bgcolor: alpha(color, 0.1), color: color, width: 48, height: 48, mx: 'auto', mb: 1 }}>
        {icon}
      </Avatar>
      <Typography variant="h5" fontWeight="bold">
        {value}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
    </Box>
  )

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          <Grid item size={{ xs: 12, md: 4 }}>
            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: '16px' }} />
          </Grid>
          <Grid item size={{ xs: 12, md: 8 }}>
            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: '16px' }} />
          </Grid>
        </Grid>
      </Container>
    )
  }

  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Person sx={{ fontSize: 80, color: alpha(theme.palette.text.secondary, 0.3), mb: 2 }} />
            <Typography variant="h5" gutterBottom>Not Logged In</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Please log in to view your profile
            </Typography>
            <Button variant="contained" onClick={() => navigate('/login')}>Go to Login</Button>
          </CardContent>
        </Card>
      </Container>
    )
  }

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        <Box mb={4}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Your Profile
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your account settings and preferences
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Left Column - Profile Card */}
          <Grid item size={{ xs: 12, md: 4 }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                      <IconButton
                        size="small"
                        sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}
                        onClick={() => setEditDialogOpen(true)}
                      >
                        <Edit sx={{ fontSize: 16 }} />
                      </IconButton>
                    }
                  >
                    <Avatar sx={{ width: 120, height: 120, mx: 'auto', mb: 2, bgcolor: 'primary.main', fontSize: 48 }}>
                      {formData.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
                    </Avatar>
                  </Badge>
                  
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    {formData.name || user.displayName || user.email?.split('@')[0] || 'User'}
                  </Typography>
                  
                  <Box display="flex" alignItems="center" justifyContent="center" gap={1} mb={2}>
                    <Chip icon={<Verified />} label={user.emailVerified ? 'Verified' : 'Unverified'} size="small" color={user.emailVerified ? 'success' : 'default'} />
                    <Chip label={userData?.role === 'admin' ? 'Admin' : 'Member'} size="small" color="primary" variant="outlined" />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Member since {user.metadata?.creationTime?.split(' ')[0] || 'Recently'}
                  </Typography>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Stack spacing={1.5} textAlign="left">
                    <Box display="flex" alignItems="center" gap={1}>
                      <Email sx={{ fontSize: 20, color: 'primary.main' }} />
                      <Typography variant="body2" noWrap sx={{ flex: 1 }}>{user.email}</Typography>
                    </Box>
                    {userData?.phone && (
                      <Box display="flex" alignItems="center" gap={1}>
                        <Phone sx={{ fontSize: 20, color: 'primary.main' }} />
                        <Typography variant="body2">{userData.phone}</Typography>
                      </Box>
                    )}
                    {userData?.location && (
                      <Box display="flex" alignItems="center" gap={1}>
                        <LocationOn sx={{ fontSize: 20, color: 'primary.main' }} />
                        <Typography variant="body2">{userData.location}</Typography>
                      </Box>
                    )}
                  </Stack>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Grid container spacing={1}>
                    <Grid item xs={4}>
                      <StatBadge icon={<Assessment />} label="Recitations" value={userData?.totalRecitations || 0} color="#22c55e" />
                    </Grid>
                    <Grid item xs={4}>
                      <StatBadge icon={<Star />} label="Avg Score" value={`${Math.round(userData?.averageScore || 0)}%`} color="#f59e0b" />
                    </Grid>
                    <Grid item xs={4}>
                      <StatBadge icon={<EmojiEvents />} label="Achievements" value={userData?.achievements || 0} color="#8b5cf6" />
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 2 }} />

                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Today's Usage</Typography>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="caption" color="text.secondary">Recitations</Typography>
                      <Typography variant="caption" fontWeight="bold">{dailyUsage?.limit - dailyUsage?.remaining} / {dailyUsage?.limit || 5}</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={((dailyUsage?.limit - dailyUsage?.remaining) / (dailyUsage?.limit || 5)) * 100 || 0} sx={{ height: 6, borderRadius: 3 }} />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      {dailyUsage?.remaining || 0} recitations remaining today
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Right Column - Tabs */}
          <Grid item size={{ xs: 12, md: 8 }}>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
              <Card>
                <CardContent>
                  <Tabs value={activeTab} onChange={(e, val) => setActiveTab(val)} variant="scrollable" scrollButtons="auto" sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                    <Tab label="Profile Info" icon={<Person />} iconPosition="start" />
                    <Tab label="Settings" icon={<SettingsIcon />} iconPosition="start" />
                    <Tab label="Subscription" icon={<CreditCard />} iconPosition="start" />
                    <Tab label="Security" icon={<Security />} iconPosition="start" />
                  </Tabs>

                  {/* Profile Info Tab */}
                  <TabPanel value={activeTab} index={0}>
                    <Stack spacing={3}>
                      <Button variant="contained" startIcon={<Edit />} onClick={() => setEditDialogOpen(true)} sx={{ alignSelf: 'flex-end' }}>
                        Edit Profile
                      </Button>
                      
                      <TextField fullWidth label="Full Name" value={formData.name} disabled InputProps={{ readOnly: true }} />
                      <TextField fullWidth label="Email Address" type="email" value={formData.email} disabled InputProps={{ readOnly: true }} />
                      <TextField fullWidth label="Phone Number" value={formData.phone || 'Not set'} disabled InputProps={{ readOnly: true }} />
                      <TextField fullWidth label="Location" value={formData.location || 'Not set'} disabled InputProps={{ readOnly: true }} />
                      <TextField fullWidth label="Bio" multiline rows={4} value={formData.bio || 'No bio added yet'} disabled InputProps={{ readOnly: true }} />
                    </Stack>
                  </TabPanel>

                  {/* Settings Tab */}
                  <TabPanel value={activeTab} index={1}>
                    <Stack spacing={3}>
                      <Typography variant="h6" fontWeight="bold">Notifications</Typography>
                      <FormControlLabel control={<Switch checked={settings.emailNotifications} onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })} color="primary" />} label="Email Notifications" />
                      <FormControlLabel control={<Switch checked={settings.pushNotifications} onChange={(e) => setSettings({ ...settings, pushNotifications: e.target.checked })} color="primary" />} label="Push Notifications" />
                      
                      <Divider />
                      
                      <Typography variant="h6" fontWeight="bold">Preferences</Typography>
                      <FormControlLabel control={<Switch checked={settings.darkMode} onChange={(e) => setSettings({ ...settings, darkMode: e.target.checked })} color="primary" />} label={settings.darkMode ? <Box display="flex" alignItems="center" gap={1}><DarkMode fontSize="small" /> Dark Mode</Box> : <Box display="flex" alignItems="center" gap={1}><LightMode fontSize="small" /> Light Mode</Box>} />
                      <FormControlLabel control={<Switch checked={settings.privateProfile} onChange={(e) => setSettings({ ...settings, privateProfile: e.target.checked })} color="primary" />} label="Private Profile" />
                      
                      <Box display="flex" justifyContent="flex-end" mt={2}>
                        <Button variant="contained" onClick={handleSaveSettings} disabled={saving}>
                          {saving ? <CircularProgress size={24} /> : 'Save Settings'}
                        </Button>
                      </Box>
                    </Stack>
                  </TabPanel>

                  {/* Subscription Tab */}
                  <TabPanel value={activeTab} index={2}>
                    <Stack spacing={3}>
                      <Box textAlign="center" mb={2}>
                        <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
                          {subscriptionType === 'free' ? 'Free Plan' : `${subscriptionType?.charAt(0).toUpperCase() + subscriptionType?.slice(1)} Plan`}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {subscriptionType === 'free' ? 'Upgrade to unlock more features' : 'Active subscription'}
                        </Typography>
                      </Box>
                      
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Card sx={{ textAlign: 'center', p: 2, bgcolor: alpha('#22c55e', 0.1) }}>
                            <Typography variant="h3" fontWeight="bold" color="#22c55e">{dailyUsage?.limit || 5}</Typography>
                            <Typography variant="body2" color="text.secondary">Daily Limit</Typography>
                          </Card>
                        </Grid>
                        <Grid item xs={6}>
                          <Card sx={{ textAlign: 'center', p: 2, bgcolor: alpha('#3b82f6', 0.1) }}>
                            <Typography variant="h3" fontWeight="bold" color="#3b82f6">{dailyUsage?.remaining || 0}</Typography>
                            <Typography variant="body2" color="text.secondary">Remaining Today</Typography>
                          </Card>
                        </Grid>
                      </Grid>
                      
                      <Box>
                        <LinearProgress variant="determinate" value={((dailyUsage?.limit - dailyUsage?.remaining) / (dailyUsage?.limit || 5)) * 100 || 0} sx={{ height: 8, borderRadius: 4 }} />
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                          Used {dailyUsage?.limit - dailyUsage?.remaining} of {dailyUsage?.limit} recitations today
                        </Typography>
                      </Box>
                      
                      <Button fullWidth variant="contained" size="large" onClick={() => navigate('/subscription')}>
                        {subscriptionType === 'free' ? 'Upgrade Now' : 'Manage Subscription'}
                      </Button>
                      
                      <Alert severity="info" sx={{ borderRadius: '12px' }}>
                        <Typography variant="body2">
                          {subscriptionType === 'free' 
                            ? 'Free plan includes 5 recitations per day. Upgrade to Pro for unlimited recitations and advanced AI feedback.'
                            : `You are on the ${subscriptionType} plan with ${dailyUsage?.limit} recitations per day.`}
                        </Typography>
                      </Alert>
                    </Stack>
                  </TabPanel>

                  {/* Security Tab */}
                  <TabPanel value={activeTab} index={3}>
                    <Stack spacing={3}>
                      <Typography variant="h6" fontWeight="bold">Password</Typography>
                      <Button variant="outlined" startIcon={<VpnKey />} onClick={() => setPasswordDialogOpen(true)}>Change Password</Button>
                      
                      <Divider />
                      
                      <Typography variant="h6" fontWeight="bold">Connected Accounts</Typography>
                      <List>
                        <ListItem>
                          <ListItemIcon><Google /></ListItemIcon>
                          <ListItemText primary="Google" secondary={user?.providerData?.some(p => p?.providerId === 'google.com') ? 'Connected' : 'Not connected'} />
                          <ListItemSecondaryAction>
                            <Button size="small" variant="outlined" disabled>{user?.providerData?.some(p => p?.providerId === 'google.com') ? 'Connected' : 'Connect'}</Button>
                          </ListItemSecondaryAction>
                        </ListItem>
                      </List>
                      
                      <Divider />
                      
                      <Typography variant="h6" fontWeight="bold" color="error">Danger Zone</Typography>
                      <Alert severity="error" sx={{ borderRadius: '12px' }}>
                        <Typography variant="body2" gutterBottom>Once you delete your account, all your data will be permanently removed.</Typography>
                        <Button variant="contained" color="error" startIcon={<Delete />} onClick={() => setDeleteDialogOpen(true)} sx={{ mt: 2 }}>Delete Account</Button>
                      </Alert>
                    </Stack>
                  </TabPanel>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Container>

      {/* Edit Profile Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField fullWidth label="Full Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            <TextField fullWidth label="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            <TextField fullWidth label="Phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            <TextField fullWidth label="Location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
            <TextField fullWidth label="Bio" multiline rows={3} value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} placeholder="Tell us about yourself..." />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdateProfile} disabled={saving}>{saving ? <CircularProgress size={24} /> : 'Save Changes'}</Button>
        </DialogActions>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={passwordDialogOpen} onClose={() => setPasswordDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField fullWidth type="password" label="Current Password" value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} />
            <TextField fullWidth type="password" label="New Password" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} helperText="Password must be at least 6 characters" />
            <TextField fullWidth type="password" label="Confirm New Password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleChangePassword} disabled={saving}>{saving ? <CircularProgress size={24} /> : 'Update Password'}</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete your account? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDeleteAccount} disabled={saving}>{saving ? <CircularProgress size={24} /> : 'Delete Account'}</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert severity={snackbar.severity} sx={{ borderRadius: '12px' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  )
}

// Helper component for Settings icon
const SettingsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19.4 15.05L18.3 15.65C18.1 16.05 18 16.55 18.1 17.05L18.3 18.45C18.4 19.15 17.9 19.85 17.2 19.95L15.8 20.15C15.3 20.25 14.8 20.55 14.5 20.95L13.6 22.05C13.1 22.65 12.3 22.65 11.8 22.05L10.9 20.95C10.6 20.55 10.1 20.25 9.6 20.15L8.2 19.95C7.5 19.85 7 19.15 7.1 18.45L7.3 17.05C7.4 16.55 7.3 16.05 7.1 15.65L6 15.05C5.4 14.65 5.1 13.85 5.3 13.15L5.6 11.85C5.7 11.35 6 10.85 6.5 10.65L7.8 9.95C8.3 9.65 8.7 9.15 8.8 8.55L9 7.25C9.1 6.55 9.8 6.05 10.5 6.15L11.8 6.35C12.3 6.45 12.8 6.45 13.3 6.35L14.6 6.15C15.3 6.05 16 6.55 16.1 7.25L16.3 8.55C16.4 9.05 16.7 9.55 17.2 9.85L18.5 10.55C19.1 10.85 19.4 11.55 19.2 12.25L18.9 13.55C18.7 14.15 18.9 14.85 19.4 15.05Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export default Profile