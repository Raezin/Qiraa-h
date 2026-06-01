// src/pages/admin/AdminDashboard.jsx

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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  Tabs,
  Tab,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  useTheme,
  alpha,
  Skeleton,
} from '@mui/material'
import {
  People,
  Assessment,
  Star,
  Logout,
  Refresh,
  CheckCircle,
  Error as ErrorIcon,
  TrendingUp,
  CreditCard as SubscriptionIcon,
  Visibility,
  Close,
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import {
  getAllUsers,
  getUserEvaluations,
  getPlatformStats,
  getReviews,
  getActiveSubscription,
} from '../../services/firebase'
import toast from 'react-hot-toast'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const { logout, isAdmin } = useAuth()
  const [loading, setLoading] = useState(true)
  const [tabValue, setTabValue] = useState(0)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvaluations: 0,
    averageScore: 0,
    paidSubscriptions: 0,
    conversionRate: 0,
  })
  const [users, setUsers] = useState([])
  const [evaluations, setEvaluations] = useState([])
  const [reviews, setReviews] = useState([])
  const [selectedEvaluation, setSelectedEvaluation] = useState(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  // Check if user is admin
  useEffect(() => {
    if (!isAdmin) {
      navigate('/dashboard')
      return
    }
    fetchAllData()
  }, [isAdmin, navigate])

  const fetchAllData = async () => {
    setLoading(true)
    try {
      await Promise.all([
        fetchStats(),
        fetchUsers(),
        fetchReviews(),
      ])
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const platformStats = await getPlatformStats()
      setStats(platformStats)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const fetchUsers = async () => {
    try {
      const usersList = await getAllUsers()
      const usersWithSub = await Promise.all(
        usersList.map(async (user) => {
          const sub = await getActiveSubscription(user.userId)
          return {
            ...user,
            subscription: sub?.type || 'free',
            subscriptionStatus: sub?.status || 'active',
          }
        })
      )
      setUsers(usersWithSub)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const fetchReviews = async () => {
    try {
      const reviewsList = await getReviews(50)
      setReviews(reviewsList)
    } catch (error) {
      console.error('Error fetching reviews:', error)
    }
  }

  const fetchUserEvaluations = async (userId) => {
    try {
      const evals = await getUserEvaluations(userId, 20)
      setEvaluations(evals)
    } catch (error) {
      console.error('Error fetching evaluations:', error)
    }
  }

  const handleViewUserDetails = async (user) => {
    await fetchUserEvaluations(user.userId)
    setTabValue(1)
  }

  const handleViewEvaluationDetails = (evaluation) => {
    setSelectedEvaluation(evaluation)
    setDetailsOpen(true)
  }

  const handleLogout = async () => {
    await logout()
  }

  const getScoreColor = (score) => {
    if (score >= 85) return '#22c55e'
    if (score >= 70) return '#f59e0b'
    return '#ef4444'
  }

  const StatCard = ({ title, value, icon, color }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography color="text.secondary" gutterBottom variant="body2">
                {title}
              </Typography>
              <Typography variant="h3" fontWeight="bold">
                {loading ? <Skeleton width={60} /> : value}
              </Typography>
            </Box>
            <Avatar sx={{ bgcolor: alpha(color, 0.1), color: color, width: 48, height: 48 }}>
              {icon}
            </Avatar>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  )

  if (!isAdmin) {
    return null
  }

  return (
    <Box sx={{ py: 4, minHeight: '100vh' }}>
      <Container maxWidth="xl">
        <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h4" gutterBottom fontWeight="bold">
              Admin Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage users, subscriptions, and monitor platform activity
            </Typography>
          </Box>
          <Box display="flex" gap={2}>
            <Button variant="outlined" startIcon={<Refresh />} onClick={fetchAllData} disabled={loading}>
              Refresh
            </Button>
            <Button variant="contained" color="error" startIcon={<Logout />} onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} mb={4}>
          <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard title="Total Users" value={stats.totalUsers} icon={<People />} color="#22c55e" />
          </Grid>
          <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard title="Total Recitations" value={stats.totalEvaluations} icon={<Assessment />} color="#3b82f6" />
          </Grid>
          <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard title="Avg. Score" value={`${Math.round(stats.averageScore)}%`} icon={<TrendingUp />} color="#f59e0b" />
          </Grid>
          <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard title="Paid Subscriptions" value={stats.paidSubscriptions} icon={<SubscriptionIcon />} color="#8b5cf6" />
          </Grid>
        </Grid>

        {/* Tabs */}
        <Card>
          <Tabs value={tabValue} onChange={(e, val) => setTabValue(val)} sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
            <Tab label="Users & Subscriptions" icon={<People />} iconPosition="start" />
            <Tab label="Recent Evaluations" icon={<Assessment />} iconPosition="start" />
            <Tab label="User Reviews" icon={<Star />} iconPosition="start" />
          </Tabs>

          {/* Users Tab */}
          <TabPanel value={tabValue} index={0}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                    <TableCell>User</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell align="center">Plan</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="center">Member Since</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    [...Array(5)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton variant="text" /></TableCell>
                        <TableCell><Skeleton variant="text" /></TableCell>
                        <TableCell align="center"><Skeleton variant="circular" width={24} height={24} /></TableCell>
                        <TableCell align="center"><Skeleton variant="text" /></TableCell>
                        <TableCell align="center"><Skeleton variant="text" /></TableCell>
                        <TableCell align="center"><Skeleton variant="circular" width={32} height={32} /></TableCell>
                      </TableRow>
                    ))
                  ) : (
                    users.map((user) => (
                      <TableRow key={user.userId} hover>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={2}>
                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                              {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                            </Avatar>
                            <Typography variant="body2" fontWeight="500">
                              {user.name || 'Anonymous'}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell align="center">
                          <Chip label={user.subscription === 'free' ? 'Free' : user.subscription?.toUpperCase()} size="small" color={user.subscription === 'free' ? 'default' : 'primary'} />
                        </TableCell>
                        <TableCell align="center">
                          <Chip label={user.subscriptionStatus} size="small" color={user.subscriptionStatus === 'active' ? 'success' : 'error'} icon={user.subscriptionStatus === 'active' ? <CheckCircle /> : <ErrorIcon />} />
                        </TableCell>
                        <TableCell align="center">{user.createdAt?.toDate().toLocaleDateString() || 'N/A'}</TableCell>
                        <TableCell align="center">
                          <IconButton size="small" onClick={() => handleViewUserDetails(user)}>
                            <Visibility />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          {/* Evaluations Tab */}
          <TabPanel value={tabValue} index={1}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                    <TableCell>User</TableCell>
                    <TableCell>Surah & Ayah</TableCell>
                    <TableCell align="center">Score</TableCell>
                    <TableCell align="center">Date</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    [...Array(5)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton variant="text" /></TableCell>
                        <TableCell><Skeleton variant="text" /></TableCell>
                        <TableCell align="center"><Skeleton variant="circular" width={50} height={24} /></TableCell>
                        <TableCell align="center"><Skeleton variant="text" /></TableCell>
                        <TableCell align="center"><Skeleton variant="circular" width={32} height={32} /></TableCell>
                      </TableRow>
                    ))
                  ) : evaluations.length > 0 ? (
                    evaluations.map((evalItem) => (
                      <TableRow key={evalItem.id} hover>
                        <TableCell>{users.find(u => u.userId === evalItem.userId)?.name || evalItem.userId?.slice(0, 8)}</TableCell>
                        <TableCell>{evalItem.surah} {evalItem.ayahNo}</TableCell>
                        <TableCell align="center">
                          <Chip label={`${Math.round(evalItem.score)}%`} size="small" sx={{ bgcolor: alpha(getScoreColor(evalItem.score), 0.1), color: getScoreColor(evalItem.score) }} />
                        </TableCell>
                        <TableCell align="center">{evalItem.createdAt?.toDate().toLocaleDateString()}</TableCell>
                        <TableCell align="center">
                          <IconButton size="small" onClick={() => handleViewEvaluationDetails(evalItem)}>
                            <Visibility />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Typography color="text.secondary" py={4}>Select a user to view their recitations</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          {/* Reviews Tab */}
          <TabPanel value={tabValue} index={2}>
            <Grid container spacing={3}>
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <Grid item size={{ xs: 12, md: 6 }} key={i}>
                    <Skeleton variant="rectangular" height={150} sx={{ borderRadius: 2 }} />
                  </Grid>
                ))
              ) : reviews.length > 0 ? (
                reviews.map((review) => (
                  <Grid item size={{ xs: 12, md: 6 }} key={review.id}>
                    <Card>
                      <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                          <Box display="flex" alignItems="center" gap={2}>
                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                              {users.find(u => u.userId === review.userId)?.name?.charAt(0) || 'U'}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle2" fontWeight="bold">
                                {users.find(u => u.userId === review.userId)?.name || 'Anonymous User'}
                              </Typography>
                              <Rating value={review.rating} readOnly size="small" />
                            </Box>
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            {review.createdAt?.toDate().toLocaleDateString()}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">"{review.comment}"</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Grid item size={{ xs: 12 }}>
                  <Box textAlign="center" py={8}>
                    <Typography color="text.secondary">No reviews yet</Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </TabPanel>
        </Card>
      </Container>

      {/* Evaluation Details Dialog */}
      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="md" fullWidth>
        {selectedEvaluation && (
          <>
            <DialogTitle>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" fontWeight="bold">Recitation Details</Typography>
                <IconButton onClick={() => setDetailsOpen(false)}><Close /></IconButton>
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Stack spacing={2}>
                <Box display="flex" justifyContent="space-between">
                  <Box><Typography variant="caption" color="text.secondary">Surah</Typography><Typography variant="body1" fontWeight="bold">{selectedEvaluation.surah}</Typography></Box>
                  <Box><Typography variant="caption" color="text.secondary">Ayah No.</Typography><Typography variant="body1" fontWeight="bold">{selectedEvaluation.ayahNo}</Typography></Box>
                  <Box><Typography variant="caption" color="text.secondary">Score</Typography><Typography variant="body1" fontWeight="bold" sx={{ color: getScoreColor(selectedEvaluation.score) }}>{Math.round(selectedEvaluation.score)}%</Typography></Box>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Transcription</Typography>
                  <Paper sx={{ p: 2, mt: 0.5, bgcolor: alpha('#000', 0.02) }}>
                    <Typography variant="body2">{selectedEvaluation.transcription || 'No transcription'}</Typography>
                  </Paper>
                </Box>
                {selectedEvaluation.errors?.length > 0 && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">Errors Detected ({selectedEvaluation.errors.length})</Typography>
                    <Stack spacing={1} mt={1}>
                      {selectedEvaluation.errors.slice(0, 5).map((error, idx) => (
                        <Paper key={idx} sx={{ p: 1, bgcolor: alpha('#ef4444', 0.05), borderLeft: '3px solid #ef4444' }}>
                          <Typography variant="body2">{error.suggestion}</Typography>
                        </Paper>
                      ))}
                    </Stack>
                  </Box>
                )}
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailsOpen(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  )
}

const TabPanel = ({ children, value, index }) => (
  <div hidden={value !== index} role="tabpanel">
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
)

export default AdminDashboard