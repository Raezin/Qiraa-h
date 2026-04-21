import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Avatar,
  LinearProgress,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Stack,
  useTheme,
  alpha,
  Skeleton,
} from '@mui/material'
import {
  TrendingUp,
  Mic,
  History,
  EmojiEvents,
  School,
  Star,
  CalendarToday,
  Timer,
  TrendingDown,
  CheckCircle,
  PlayArrow,
  ArrowForward,
  Assessment,
  Psychology,
  MenuBook,
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useSubscription } from '../context/SubscriptionContext'
import {
  getUserData,
  getUserEvaluations,
  getUserProgress,
  checkDailyLimit,
  getActiveSubscription,
} from '../services/firebase'
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const Dashboard = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const { user } = useAuth()
  const { subscription } = useSubscription()
  
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    todayRecitations: 0,
    averageScore: 0,
    totalRecitations: 0,
    achievements: 0,
    masteredAyahs: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalMinutes: 0,
  })
  const [recentEvaluations, setRecentEvaluations] = useState([])
  const [progressData, setProgressData] = useState([])
  const [weaknesses, setWeaknesses] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [dailyLimit, setDailyLimit] = useState({ remaining: 5, limit: 5 })
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      // Get user data
      const userData = await getUserData(user.uid)
      setUserData(userData)
      
      // Get daily limit
      const limit = await checkDailyLimit(user.uid)
      setDailyLimit(limit)
      
      // Get evaluation history (using getUserEvaluations instead)
      const evaluations = await getUserEvaluations(user.uid, 50)
      setRecentEvaluations(evaluations.slice(0, 5))
      
      // Calculate stats
      const today = new Date().toISOString().split('T')[0]
      const todayEvaluations = evaluations.filter(e => {
        const evalDate = e.createdAt?.toDate?.() || new Date(e.createdAt)
        return evalDate.toISOString().split('T')[0] === today
      })
      
      const totalScore = evaluations.reduce((sum, e) => sum + (e.score || 0), 0)
      const avgScore = evaluations.length > 0 ? totalScore / evaluations.length : 0
      
      // Get progress stats (using getUserProgress instead)
      const progressStats = await getUserProgress(user.uid)
      
      // Calculate mastered ayahs (where best score >= 90)
      const masteredCount = progressStats.progressList?.filter(p => p.bestScore >= 90).length || 0
      
      setStats({
        todayRecitations: todayEvaluations.length,
        averageScore: avgScore,
        totalRecitations: evaluations.length,
        achievements: masteredCount,
        masteredAyahs: masteredCount,
        currentStreak: calculateStreak(evaluations),
        longestStreak: calculateLongestStreak(evaluations),
        totalMinutes: evaluations.reduce((sum, e) => sum + (e.duration || 0), 0) / 60,
      })
      
      // Prepare progress chart data
      const last7Days = getLast7Days()
      const chartData = last7Days.map(day => ({
        date: day,
        recitations: evaluations.filter(e => {
          const evalDate = e.createdAt?.toDate?.() || new Date(e.createdAt)
          return evalDate.toISOString().split('T')[0] === day
        }).length,
        averageScore: calculateAverageScoreForDay(evaluations, day),
      }))
      setProgressData(chartData)
      
      // Identify weaknesses from evaluations
      const allErrors = evaluations.flatMap(e => e.errors || [])
      if (allErrors.length > 0) {
        const errorCounts = allErrors.reduce((acc, error) => {
          const rule = error.rule || 'General'
          acc[rule] = (acc[rule] || 0) + 1
          return acc
        }, {})
        
        setWeaknesses(Object.entries(errorCounts).map(([rule, count]) => ({
          rule,
          count,
          percentage: (count / allErrors.length) * 100,
        })).slice(0, 3))
      }
      
      // Generate recommendations
      const recommendationsList = generateRecommendations(avgScore, weaknesses, progressStats)
      setRecommendations(recommendationsList)
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStreak = (evaluations) => {
    let streak = 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      const hasRecitation = evaluations.some(e => {
        const evalDate = e.createdAt?.toDate?.() || new Date(e.createdAt)
        return evalDate.toISOString().split('T')[0] === dateStr
      })
      
      if (hasRecitation) {
        streak++
      } else if (i > 0) {
        break
      }
    }
    return streak
  }

  const calculateLongestStreak = (evaluations) => {
    let longest = 0
    let current = 0
    let lastDate = null
    
    const sortedDates = evaluations
      .map(e => e.createdAt?.toDate?.() || new Date(e.createdAt))
      .filter(d => d && !isNaN(d.getTime()))
      .sort((a, b) => a - b)
    
    for (const date of sortedDates) {
      if (!lastDate) {
        current = 1
      } else {
        const diffDays = Math.floor((date - lastDate) / (1000 * 60 * 60 * 24))
        if (diffDays === 1) {
          current++
        } else {
          longest = Math.max(longest, current)
          current = 1
        }
      }
      lastDate = date
    }
    
    return Math.max(longest, current)
  }

  const getLast7Days = () => {
    const days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      days.push(date.toISOString().split('T')[0])
    }
    return days
  }

  const calculateAverageScoreForDay = (evaluations, day) => {
    const dayEvaluations = evaluations.filter(e => {
      const evalDate = e.createdAt?.toDate?.() || new Date(e.createdAt)
      return evalDate.toISOString().split('T')[0] === day
    })
    if (dayEvaluations.length === 0) return 0
    const total = dayEvaluations.reduce((sum, e) => sum + (e.score || 0), 0)
    return total / dayEvaluations.length
  }

  const generateRecommendations = (avgScore, weaknesses, progressStats) => {
    const recommendationsList = []
    
    if (avgScore < 70) {
      recommendationsList.push({
        title: 'Practice Basic Pronunciation',
        description: 'Focus on Makharij (articulation points) to improve your base',
        icon: <Mic />,
        action: '/recitation',
      })
    }
    
    if (weaknesses.length > 0 && weaknesses[0]?.percentage > 30) {
      recommendationsList.push({
        title: `Master ${weaknesses[0].rule}`,
        description: `This rule appears in ${weaknesses[0].percentage.toFixed(0)}% of your mistakes`,
        icon: <Psychology />,
        action: '/recitation',
      })
    }
    
    if (progressStats.totalAyahsPracticed < 5) {
      recommendationsList.push({
        title: 'Start with Short Surahs',
        description: 'Begin with Al-Fatiha and short surahs to build confidence',
        icon: <MenuBook />,
        action: '/recitation',
      })
    }
    
    if (stats.currentStreak < 3) {
      recommendationsList.push({
        title: 'Build a Daily Habit',
        description: 'Practice at least 5 minutes daily to maintain consistency',
        icon: <CalendarToday />,
        action: '/recitation',
      })
    }
    
    return recommendationsList.slice(0, 3)
  }

  const StatCard = ({ title, value, icon, color, trend, trendValue }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card sx={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography color="text.secondary" gutterBottom variant="body2">
                {title}
              </Typography>
              {loading ? (
                <Skeleton variant="text" width={80} height={50} />
              ) : (
                <Typography variant="h3" fontWeight="bold">
                  {value}
                </Typography>
              )}
              {trend && trendValue && (
                <Box display="flex" alignItems="center" mt={1}>
                  {trend === 'up' ? (
                    <TrendingUp sx={{ fontSize: 16, color: '#22c55e' }} />
                  ) : (
                    <TrendingDown sx={{ fontSize: 16, color: '#ef4444' }} />
                  )}
                  <Typography variant="caption" color="text.secondary" ml={0.5}>
                    {trendValue}
                  </Typography>
                </Box>
              )}
            </Box>
            <Avatar
              sx={{
                bgcolor: alpha(color, 0.1),
                color: color,
                width: 48,
                height: 48,
              }}
            >
              {icon}
            </Avatar>
          </Box>
        </CardContent>
        <LinearProgress
          variant="determinate"
          value={trend === 'up' ? 75 : 25}
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 3,
            bgcolor: alpha(color, 0.1),
            '& .MuiLinearProgress-bar': {
              bgcolor: color,
            },
          }}
        />
      </Card>
    </motion.div>
  )

  const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899']

  // Format date for display
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A'
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleDateString()
    }
    return new Date(timestamp).toLocaleDateString()
  }

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="xl">
        {/* Welcome Section */}
        <Box mb={4}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h4" gutterBottom fontWeight="bold">
              Welcome back, {userData?.name || user?.displayName || 'Student'}! 👋
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Here's your recitation progress summary for today
            </Typography>
          </motion.div>
        </Box>

        {/* Stats Grid */}
        <Grid container spacing={3} mb={4}>
          <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              title="Today's Recitations"
              value={stats.todayRecitations}
              icon={<Mic />}
              color="#22c55e"
              trend={stats.todayRecitations > 0 ? 'up' : 'down'}
              trendValue={`${dailyLimit.remaining} remaining`}
            />
          </Grid>
          <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              title="Average Score"
              value={`${Math.round(stats.averageScore)}%`}
              icon={<TrendingUp />}
              color="#3b82f6"
              trend={stats.averageScore > 70 ? 'up' : 'down'}
              trendValue={stats.averageScore > 70 ? 'Good progress' : 'Needs improvement'}
            />
          </Grid>
          <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              title="Total Recitations"
              value={stats.totalRecitations}
              icon={<History />}
              color="#f59e0b"
              trend={stats.totalRecitations > 0 ? 'up' : 'down'}
              trendValue="Lifetime"
            />
          </Grid>
          <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              title="Mastered Ayahs"
              value={stats.masteredAyahs}
              icon={<EmojiEvents />}
              color="#8b5cf6"
              trend="up"
              trendValue="Keep going!"
            />
          </Grid>
        </Grid>

        {/* Progress Charts */}
        <Grid container spacing={3} mb={4}>
          <Grid item size={{ xs: 12, md: 8 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Progress Overview (Last 7 Days)
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    {loading ? (
                      <Skeleton variant="rectangular" height={300} />
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={progressData}>
                          <defs>
                            <linearGradient id="colorRecitations" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.1)} />
                          <XAxis dataKey="date" />
                          <YAxis yAxisId="left" />
                          <YAxis yAxisId="right" orientation="right" />
                          <Tooltip />
                          <Legend />
                          <Area
                            yAxisId="left"
                            type="monotone"
                            dataKey="recitations"
                            stroke="#22c55e"
                            fill="url(#colorRecitations)"
                            name="Recitations"
                          />
                          <Area
                            yAxisId="right"
                            type="monotone"
                            dataKey="averageScore"
                            stroke="#3b82f6"
                            fill="url(#colorScore)"
                            name="Avg Score (%)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item size={{ xs: 12, md: 4 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Weakness Areas
                  </Typography>
                  {loading ? (
                    <Skeleton variant="rectangular" height={200} />
                  ) : weaknesses.length > 0 ? (
                    <Box sx={{ height: 250 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={weaknesses}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="count"
                            label={({ rule }) => rule}
                          >
                            {weaknesses.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </Box>
                  ) : (
                    <Box textAlign="center" py={4}>
                      <CheckCircle sx={{ fontSize: 60, color: '#22c55e', mb: 2 }} />
                      <Typography color="text.secondary">
                        No major weaknesses detected! Great job!
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        {/* Streak and Subscription Info */}
        <Grid container spacing={3} mb={4}>
          <Grid item size={{ xs: 12, sm: 6 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Current Streak
                      </Typography>
                      <Typography variant="h2" fontWeight="bold" color="#22c55e">
                        {stats.currentStreak}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        days in a row
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: alpha('#22c55e', 0.1), width: 64, height: 64 }}>
                      <CalendarToday sx={{ fontSize: 40, color: '#22c55e' }} />
                    </Avatar>
                  </Box>
                  <Box mt={2}>
                    <Typography variant="body2" color="text.secondary">
                      Longest streak: {stats.longestStreak} days
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={(stats.currentStreak / 30) * 100}
                      sx={{ mt: 1, height: 8, borderRadius: 4 }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item size={{ xs: 12, sm: 6 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="between">
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Daily Recitations Left
                      </Typography>
                      <Typography variant="h2" fontWeight="bold" color="#3b82f6">
                        {dailyLimit.remaining}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        out of {dailyLimit.limit}
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: alpha('#3b82f6', 0.1), width: 64, height: 64 }}>
                      <Timer sx={{ fontSize: 40, color: '#3b82f6' }} />
                    </Avatar>
                  </Box>
                  <Box mt={2}>
                    <LinearProgress
                      variant="determinate"
                      value={((dailyLimit.limit - dailyLimit.remaining) / dailyLimit.limit) * 100}
                      sx={{ mt: 1, height: 8, borderRadius: 4 }}
                    />
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => navigate('/recitation')}
                      sx={{ mt: 2 }}
                      disabled={dailyLimit.remaining === 0}
                    >
                      {dailyLimit.remaining > 0 ? 'Start Reciting' : 'Upgrade to Continue'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        {/* Recent Activity & Recommendations */}
        <Grid container spacing={3}>
          <Grid item size={{ xs: 12, md: 7 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Recent Activity
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Surah</TableCell>
                          <TableCell align="center">Score</TableCell>
                          <TableCell align="center">Date</TableCell>
                          <TableCell align="right">Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {loading ? (
                          [...Array(3)].map((_, i) => (
                            <TableRow key={i}>
                              <TableCell><Skeleton variant="text" /></TableCell>
                              <TableCell align="center"><Skeleton variant="text" /></TableCell>
                              <TableCell align="center"><Skeleton variant="text" /></TableCell>
                              <TableCell align="right"><Skeleton variant="text" /></TableCell>
                            </TableRow>
                          ))
                        ) : recentEvaluations.length > 0 ? (
                          recentEvaluations.map((evaluation) => (
                            <TableRow key={evaluation.id}>
                              <TableCell>
                                <Box display="flex" alignItems="center" gap={1}>
                                  <MenuBook sx={{ fontSize: 16, color: '#22c55e' }} />
                                  <Typography variant="body2">
                                    {evaluation.surah || `Surah ${evaluation.surahNumber || '?'}`}, Ayah {evaluation.ayahNo || '?'}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell align="center">
                                <Chip
                                  label={`${Math.round(evaluation.score)}%`}
                                  size="small"
                                  sx={{
                                    bgcolor: evaluation.score >= 80 ? alpha('#22c55e', 0.1) : alpha('#ef4444', 0.1),
                                    color: evaluation.score >= 80 ? '#22c55e' : '#ef4444',
                                  }}
                                />
                              </TableCell>
                              <TableCell align="center">
                                <Typography variant="body2" color="text.secondary">
                                  {formatDate(evaluation.createdAt)}
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <IconButton
                                  size="small"
                                  onClick={() => navigate('/recitation')}
                                >
                                  <PlayArrow sx={{ fontSize: 20 }} />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={4} align="center">
                              <Typography color="text.secondary" py={4}>
                                No recitations yet. Start your first recitation!
                              </Typography>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  {recentEvaluations.length > 0 && (
                    <Button
                      fullWidth
                      variant="text"
                      onClick={() => navigate('/progress')}
                      endIcon={<ArrowForward />}
                      sx={{ mt: 2 }}
                    >
                      View All History
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item size={{ xs: 12, md: 5 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Personalized Recommendations
                  </Typography>
                  <Stack spacing={2}>
                    {loading ? (
                      [...Array(3)].map((_, i) => (
                        <Box key={i}>
                          <Skeleton variant="text" />
                          <Skeleton variant="text" width="80%" />
                        </Box>
                      ))
                    ) : recommendations.length > 0 ? (
                      recommendations.map((rec, index) => (
                        <Paper
                          key={index}
                          sx={{
                            p: 2,
                            bgcolor: alpha(theme.palette.primary.main, 0.05),
                            cursor: 'pointer',
                            '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1) },
                          }}
                          onClick={() => navigate(rec.action)}
                        >
                          <Box display="flex" gap={2}>
                            <Avatar sx={{ bgcolor: alpha('#22c55e', 0.1), color: '#22c55e' }}>
                              {rec.icon}
                            </Avatar>
                            <Box flex={1}>
                              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                {rec.title}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {rec.description}
                              </Typography>
                            </Box>
                            <ArrowForward sx={{ color: '#22c55e' }} />
                          </Box>
                        </Paper>
                      ))
                    ) : (
                      <Box textAlign="center" py={4}>
                        <CheckCircle sx={{ fontSize: 60, color: '#22c55e', mb: 2 }} />
                        <Typography color="text.secondary">
                          You're doing great! Keep up the good work!
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        {/* Quick Actions */}
        <Box mt={4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Paper sx={{ p: 3, bgcolor: alpha('#22c55e', 0.05) }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                <Grid item size={{ xs: 6, sm: 3 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<Mic />}
                    onClick={() => navigate('/recitation')}
                    sx={{ py: 1.5 }}
                  >
                    Start Reciting
                  </Button>
                </Grid>
                <Grid item size={{ xs: 6, sm: 3 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<History />}
                    onClick={() => navigate('/progress')}
                  >
                    View History
                  </Button>
                </Grid>
                <Grid item size={{ xs: 6, sm: 3 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Assessment />}
                    onClick={() => navigate('/progress')}
                  >
                    Progress Report
                  </Button>
                </Grid>
                <Grid item size={{ xs: 6, sm: 3 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<School />}
                    onClick={() => navigate('/subscription')}
                  >
                    Upgrade Plan
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </motion.div>
        </Box>
      </Container>
    </Box>
  )
}

export default Dashboard