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
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Pagination,
  Stack,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  ToggleButtonGroup,
  ToggleButton,
  useTheme,
  alpha,
  Avatar,
  Skeleton,
  Rating,
  Tooltip,
} from '@mui/material'
import {
  Search,
  FilterList,
  Download,
  PlayArrow,
  Delete,
  Visibility,
  Assessment,
  TrendingUp,
  TrendingDown,
  CalendarToday,
  Schedule,
  Grade,
  Close,
  GetApp,
  Share,
  Star,
  StarBorder,
  Timeline,
  PieChart as PieChartIcon,
} from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { getUserEvaluations, getEvaluationById } from '../services/firebase'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

const History = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const { user } = useAuth()
  
  const [evaluations, setEvaluations] = useState([])
  const [filteredEvaluations, setFilteredEvaluations] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterAnchorEl, setFilterAnchorEl] = useState(null)
  const [selectedEvaluation, setSelectedEvaluation] = useState(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [viewMode, setViewMode] = useState('table')
  const [dateRange, setDateRange] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [sortOrder, setSortOrder] = useState('desc')
  const [page, setPage] = useState(1)
  const [itemsPerPage] = useState(10)
  
  const [stats, setStats] = useState({
    totalRecitations: 0,
    averageScore: 0,
    bestScore: 0,
    worstScore: 0,
    totalDuration: 0,
    improvement: 0,
    last30Days: [],
    scoreDistribution: [],
    topSurahs: [],
  })

  useEffect(() => {
    fetchHistory()
  }, [user])

  useEffect(() => {
    filterAndSortEvaluations()
  }, [evaluations, searchTerm, dateRange, sortBy, sortOrder])

  const fetchHistory = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const history = await getUserEvaluations(user.uid, 100)
      setEvaluations(history)
      calculateStats(history)
    } catch (error) {
      console.error('Error fetching history:', error)
      toast.error('Failed to load recitation history')
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (data) => {
    if (data.length === 0) return
    
    const scores = data.map(e => e.score || 0)
    const totalScore = scores.reduce((a, b) => a + b, 0)
    const avgScore = totalScore / data.length
    const bestScore = Math.max(...scores)
    const worstScore = Math.min(...scores)
    const totalDuration = data.reduce((sum, e) => sum + (e.duration || 0), 0)
    
    const last10Avg = scores.slice(-10).reduce((a, b) => a + b, 0) / Math.min(10, scores.length)
    const first10Avg = scores.slice(0, 10).reduce((a, b) => a + b, 0) / Math.min(10, scores.length)
    const improvement = last10Avg - first10Avg
    
    const last30Days = getLast30DaysData(data)
    
    const distribution = [
      { range: '90-100', count: scores.filter(s => s >= 90).length, color: '#22c55e' },
      { range: '80-89', count: scores.filter(s => s >= 80 && s < 90).length, color: '#3b82f6' },
      { range: '70-79', count: scores.filter(s => s >= 70 && s < 80).length, color: '#f59e0b' },
      { range: '60-69', count: scores.filter(s => s >= 60 && s < 70).length, color: '#ec4899' },
      { range: '<60', count: scores.filter(s => s < 60).length, color: '#ef4444' },
    ]
    
    const surahCount = {}
    data.forEach(e => {
      const key = e.surah || `Surah ${e.surahNumber || '?'}`
      surahCount[key] = (surahCount[key] || 0) + 1
    })
    const topSurahs = Object.entries(surahCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
    
    setStats({
      totalRecitations: data.length,
      averageScore: avgScore,
      bestScore,
      worstScore,
      totalDuration,
      improvement,
      last30Days,
      scoreDistribution: distribution,
      topSurahs,
    })
  }

  const getLast30DaysData = (data) => {
    const days = []
    for (let i = 29; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      const dayData = data.filter(e => {
        const evalDate = e.createdAt?.toDate?.() || new Date(e.createdAt)
        return evalDate.toISOString().split('T')[0] === dateStr
      })
      
      const avgScore = dayData.length > 0 
        ? dayData.reduce((sum, e) => sum + (e.score || 0), 0) / dayData.length
        : 0
      
      days.push({
        date: dateStr,
        count: dayData.length,
        averageScore: avgScore,
      })
    }
    return days
  }

  const filterAndSortEvaluations = () => {
    let filtered = [...evaluations]
    
    if (searchTerm) {
      filtered = filtered.filter(e => 
        e.surah?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.ayahNo?.toString().includes(searchTerm) ||
        e.transcription?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    if (dateRange !== 'all') {
      const now = new Date()
      const days = dateRange === 'week' ? 7 : dateRange === 'month' ? 30 : 90
      const cutoff = new Date(now.setDate(now.getDate() - days))
      filtered = filtered.filter(e => {
        const evalDate = e.createdAt?.toDate?.() || new Date(e.createdAt)
        return evalDate > cutoff
      })
    }
    
    filtered.sort((a, b) => {
      let aVal, bVal
      switch (sortBy) {
        case 'date':
          aVal = (a.createdAt?.toDate?.() || new Date(a.createdAt)).getTime()
          bVal = (b.createdAt?.toDate?.() || new Date(b.createdAt)).getTime()
          break
        case 'score':
          aVal = a.score || 0
          bVal = b.score || 0
          break
        case 'duration':
          aVal = a.duration || 0
          bVal = b.duration || 0
          break
        case 'surah':
          aVal = a.surah || ''
          bVal = b.surah || ''
          return sortOrder === 'desc' ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal)
        default:
          aVal = (a.createdAt?.toDate?.() || new Date(a.createdAt)).getTime()
          bVal = (b.createdAt?.toDate?.() || new Date(b.createdAt)).getTime()
      }
      return sortOrder === 'desc' ? bVal - aVal : aVal - bVal
    })
    
    setFilteredEvaluations(filtered)
    setPage(1)
  }

  const handleViewDetails = (evaluation) => {
    setSelectedEvaluation(evaluation)
    setDetailsOpen(true)
  }

  const handleDeleteEvaluation = async (id) => {
    toast.success('Evaluation deleted successfully')
    fetchHistory()
  }

  const handleExportData = () => {
    const dataStr = JSON.stringify(filteredEvaluations, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    const exportFileDefaultName = `qiraa_history_${format(new Date(), 'yyyy-MM-dd')}.json`
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
    toast.success('History exported successfully')
  }

  const getScoreColor = (score) => {
    if (score >= 85) return '#22c55e'
    if (score >= 70) return '#f59e0b'
    return '#ef4444'
  }

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A'
    if (timestamp.toDate) {
      return timestamp.toDate()
    }
    return new Date(timestamp)
  }

  const totalPages = Math.ceil(filteredEvaluations.length / itemsPerPage)
  const paginatedEvaluations = filteredEvaluations.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  )

  const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ec4899', '#ef4444']

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box mb={4}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            My Progress
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track your progress and review past recitations
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} mb={4}>
          <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom variant="body2">
                  Total Recitations
                </Typography>
                <Typography variant="h3" fontWeight="bold">
                  {stats.totalRecitations}
                </Typography>
                <Box display="flex" alignItems="center" mt={1}>
                  <TrendingUp sx={{ fontSize: 16, color: '#22c55e' }} />
                  <Typography variant="caption" color="text.secondary" ml={0.5}>
                    Lifetime
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom variant="body2">
                  Average Score
                </Typography>
                <Typography variant="h3" fontWeight="bold" sx={{ color: getScoreColor(stats.averageScore) }}>
                  {Math.round(stats.averageScore)}%
                </Typography>
                <Box display="flex" alignItems="center" mt={1}>
                  {stats.improvement > 0 ? (
                    <TrendingUp sx={{ fontSize: 16, color: '#22c55e' }} />
                  ) : (
                    <TrendingDown sx={{ fontSize: 16, color: '#ef4444' }} />
                  )}
                  <Typography variant="caption" color="text.secondary" ml={0.5}>
                    {Math.abs(stats.improvement).toFixed(1)}% from start
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom variant="body2">
                  Best Score
                </Typography>
                <Typography variant="h3" fontWeight="bold" sx={{ color: '#22c55e' }}>
                  {Math.round(stats.bestScore)}%
                </Typography>
                <Box display="flex" alignItems="center" mt={1}>
                  <Grade sx={{ fontSize: 16, color: '#fbbf24' }} />
                  <Typography variant="caption" color="text.secondary" ml={0.5}>
                    Personal Best
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom variant="body2">
                  Total Practice Time
                </Typography>
                <Typography variant="h3" fontWeight="bold">
                  {Math.floor(stats.totalDuration / 60)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  minutes
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={3} mb={4}>
          <Grid item size={{ xs: 12, md: 8 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Progress Over Time
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.last30Days}>
                      <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.1)} />
                      <XAxis dataKey="date" tickFormatter={(date) => format(new Date(date), 'MM/dd')} />
                      <YAxis />
                      <RechartsTooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="averageScore"
                        stroke="#22c55e"
                        fill="url(#colorScore)"
                        name="Average Score (%)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item size={{ xs: 12, md: 4 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Score Distribution
                </Typography>
                <Box sx={{ height: 250 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.scoreDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="count"
                        label={({ range }) => range}
                      >
                        {stats.scoreDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Top Surahs */}
        {stats.topSurahs.length > 0 && (
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Most Practiced Surahs
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                {stats.topSurahs.map((surah, index) => (
                  <Chip
                    key={index}
                    label={`${surah.name} (${surah.count}x)`}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Stack>
            </CardContent>
          </Card>
        )}

        {/* Filters and Controls */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  placeholder="Search by surah, ayah, or transcription..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                  size="small"
                />
              </Grid>
              
              <Grid item size={{ xs: 6, sm: 2 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Date Range</InputLabel>
                  <Select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    label="Date Range"
                  >
                    <MenuItem value="all">All Time</MenuItem>
                    <MenuItem value="week">Last Week</MenuItem>
                    <MenuItem value="month">Last Month</MenuItem>
                    <MenuItem value="quarter">Last 3 Months</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item size={{ xs: 6, sm: 2 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    label="Sort By"
                  >
                    <MenuItem value="date">Date</MenuItem>
                    <MenuItem value="score">Score</MenuItem>
                    <MenuItem value="duration">Duration</MenuItem>
                    <MenuItem value="surah">Surah</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item size={{ xs: 12, sm: 2 }}>
                <ToggleButtonGroup
                  value={viewMode}
                  exclusive
                  onChange={(e, val) => val && setViewMode(val)}
                  size="small"
                  fullWidth
                >
                  <ToggleButton value="table">Table</ToggleButton>
                  <ToggleButton value="grid">Grid</ToggleButton>
                </ToggleButtonGroup>
              </Grid>
              
              <Grid item size={{ xs: 12, sm: 2 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Download />}
                  onClick={handleExportData}
                  size="small"
                >
                  Export
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Results Count */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="body2" color="text.secondary">
            Showing {paginatedEvaluations.length} of {filteredEvaluations.length} recitations
          </Typography>
        </Box>

        {/* Table/Grid View */}
        {loading ? (
          <Stack spacing={2}>
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={60} sx={{ borderRadius: '12px' }} />
            ))}
          </Stack>
        ) : filteredEvaluations.length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 8 }}>
              <Assessment sx={{ fontSize: 80, color: alpha(theme.palette.text.secondary, 0.3), mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No recitations found
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Start practicing to see your recitation history here
              </Typography>
              <Button variant="contained" onClick={() => navigate('/recitation')}>
                Start Reciting
              </Button>
            </CardContent>
          </Card>
        ) : viewMode === 'table' ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date & Time</TableCell>
                  <TableCell>Surah & Ayah</TableCell>
                  <TableCell align="center">Score</TableCell>
                  <TableCell align="center">Duration</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedEvaluations.map((evaluation) => (
                  <TableRow key={evaluation.id} hover>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(evaluation.createdAt).toLocaleDateString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(evaluation.createdAt).toLocaleTimeString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {evaluation.surah || `Surah ${evaluation.surahNumber}`}, Ayah {evaluation.ayahNo}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={`${Math.round(evaluation.score)}%`}
                        size="small"
                        sx={{
                          bgcolor: alpha(getScoreColor(evaluation.score), 0.1),
                          color: getScoreColor(evaluation.score),
                          fontWeight: 'bold',
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2">
                        {formatDuration(evaluation.duration || 0)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="View Details">
                        <IconButton size="small" onClick={() => handleViewDetails(evaluation)}>
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Practice Again">
                        <IconButton 
                          size="small" 
                          onClick={() => navigate(`/recitation?surah=${evaluation.surah}&ayah=${evaluation.ayahNo}`)}
                        >
                          <PlayArrow />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Grid container spacing={2}>
            {paginatedEvaluations.map((evaluation) => (
              <Grid item size={{ xs: 12, sm: 6, md: 4 }} key={evaluation.id}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { transform: 'translateY(-4px)' },
                    transition: 'all 0.3s ease',
                  }}
                  onClick={() => handleViewDetails(evaluation)}
                >
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                      <Chip
                        label={`${Math.round(evaluation.score)}%`}
                        size="small"
                        sx={{
                          bgcolor: alpha(getScoreColor(evaluation.score), 0.1),
                          color: getScoreColor(evaluation.score),
                        }}
                      />
                      <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleDeleteEvaluation(evaluation.id) }}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                    
                    <Typography variant="h6" gutterBottom>
                      {evaluation.surah || `Surah ${evaluation.surahNumber}`}, Ayah {evaluation.ayahNo}
                    </Typography>
                    
                    <Box display="flex" alignItems="center" gap={2} mb={1}>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <CalendarToday sx={{ fontSize: 14, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(evaluation.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <Schedule sx={{ fontSize: 14, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          {formatDuration(evaluation.duration || 0)}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <LinearProgress
                      variant="determinate"
                      value={evaluation.score}
                      sx={{ height: 6, borderRadius: 3, mt: 2 }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Box display="flex" justifyContent="center" mt={4}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(e, value) => setPage(value)}
              color="primary"
              size="large"
            />
          </Box>
        )}

        {/* Details Dialog */}
        <Dialog
          open={detailsOpen}
          onClose={() => setDetailsOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{ sx: { borderRadius: '16px' } }}
        >
          {selectedEvaluation && (
            <>
              <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" fontWeight="bold">
                    Recitation Details
                  </Typography>
                  <IconButton onClick={() => setDetailsOpen(false)}>
                    <Close />
                  </IconButton>
                </Box>
              </DialogTitle>
              <DialogContent dividers>
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Surah & Ayah
                    </Typography>
                    <Typography variant="h5" fontWeight="bold">
                      {selectedEvaluation.surah || `Surah ${selectedEvaluation.surahNumber}`}, Ayah {selectedEvaluation.ayahNo}
                    </Typography>
                  </Box>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Paper sx={{ p: 2, textAlign: 'center', bgcolor: alpha('#22c55e', 0.1) }}>
                        <Typography variant="h3" fontWeight="bold" color="#22c55e">
                          {Math.round(selectedEvaluation.score)}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Overall Score
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6}>
                      <Paper sx={{ p: 2, textAlign: 'center', bgcolor: alpha('#3b82f6', 0.1) }}>
                        <Typography variant="h3" fontWeight="bold" color="#3b82f6">
                          {Math.round(selectedEvaluation.accuracy || selectedEvaluation.score)}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Accuracy
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                  
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Your Recitation
                    </Typography>
                    <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                      <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                        {selectedEvaluation.transcription || 'No transcription available'}
                      </Typography>
                    </Paper>
                  </Box>
                  
                  {selectedEvaluation.errors && selectedEvaluation.errors.length > 0 && (
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Areas for Improvement ({selectedEvaluation.errors.length})
                      </Typography>
                      <Stack spacing={2}>
                        {selectedEvaluation.errors.map((error, idx) => (
                          <Paper key={idx} sx={{ p: 2, borderLeft: `3px solid #ef4444` }}>
                            <Typography variant="body2" fontWeight="bold" gutterBottom>
                              {error.word}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" display="block">
                              Expected: {error.expected} | Got: {error.actual}
                            </Typography>
                            <Typography variant="caption" color="#22c55e">
                              Suggestion: {error.suggestion}
                            </Typography>
                          </Paper>
                        ))}
                      </Stack>
                    </Box>
                  )}
                  
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Metadata
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Date
                        </Typography>
                        <Typography variant="body2">
                          {formatDate(selectedEvaluation.createdAt).toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Duration
                        </Typography>
                        <Typography variant="body2">
                          {formatDuration(selectedEvaluation.duration || 0)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Stack>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setDetailsOpen(false)}>Close</Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    setDetailsOpen(false)
                    navigate(`/recitation?surah=${selectedEvaluation.surah}&ayah=${selectedEvaluation.ayahNo}`)
                  }}
                >
                  Practice Again
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Container>
    </Box>
  )
}

export default History