import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  LinearProgress,
  Alert,
  Chip,
  Stack,
  Divider,
  TextField,
  Autocomplete,
  Paper,
  CircularProgress,
  useTheme,
  alpha,
  Fade,
  Slide,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
} from '@mui/material'
import {
  Mic,
  Stop,
  PlayArrow,
  Pause,
  Replay,
  Download,
  CheckCircle,
  Error as ErrorIcon,
  Science,
  Psychology,
  TrendingUp,
  KeyboardArrowDown,
  KeyboardArrowUp,
  RecordVoiceOver,
  ExpandMore,
  Api,
  Warning,
  NavigateNext,
  NavigateBefore,
  Search,
} from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useSubscription } from '../context/SubscriptionContext'
import {
  checkDailyLimit, 
  saveEvaluation,
} from '../services/firebase'
import { analyzeRecitationAudio, testConnection } from '../services/recitationApi'
import { getAyahs, getAyahByNumber, getSurahs } from '../services/quranApi'
import toast from 'react-hot-toast'

const RecitationStudio = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const { user } = useAuth()
  const { incrementRecitationCount } = useSubscription()
  
  // State for Quran data
  const [selectedAyah, setSelectedAyah] = useState(null)
  const [surahs, setSurahs] = useState([])
  const [selectedSurah, setSelectedSurah] = useState(null)
  const [currentAyahNumber, setCurrentAyahNumber] = useState(1)
  const [totalAyahsInSurah, setTotalAyahsInSurah] = useState(0)
  const [loadingAyahs, setLoadingAyahs] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  
  // State for recording
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioBlob, setAudioBlob] = useState(null)
  const [audioUrl, setAudioUrl] = useState(null)
  const [recordingTime, setRecordingTime] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  
  // State for results
  const [analysisResult, setAnalysisResult] = useState(null)
  const [rawTranscription, setRawTranscription] = useState('')
  
  // State for limits
  const [dailyLimit, setDailyLimit] = useState({ canRecite: true, remaining: 5, limit: 5 })
  
  // State for API status
  const [apiStatus, setApiStatus] = useState({ checking: true, connected: false })
  
  // UI expand/collapse
  const [expandedSections, setExpandedSections] = useState({
    feedback: true,
    details: false,
    suggestions: true,
    apiResponse: false,
  })
  
  // Refs
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const audioRef = useRef(null)
  const timerRef = useRef(null)

  // Load data on mount
  useEffect(() => {
    fetchSurahs()
    checkUserDailyLimit()
    
    const params = new URLSearchParams(location.search)
    const surah = params.get('surah')
    const ayahNo = params.get('ayah')
    if (surah && ayahNo) {
      loadAyahByNumber(surah, ayahNo)
    }
  }, [user])

  // Load ayah when surah or ayah number changes
  useEffect(() => {
    if (selectedSurah && currentAyahNumber) {
      loadAyahByNumber(selectedSurah.number, currentAyahNumber)
    }
  }, [selectedSurah, currentAyahNumber])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (audioUrl) URL.revokeObjectURL(audioUrl)
    }
  }, [audioUrl])

  // Check API availability
  useEffect(() => {
    checkApiAvailability()
  }, [])

  const checkApiAvailability = async () => {
    try {
      const result = await testConnection()
      setApiStatus({ checking: false, connected: result.success })
      if (!result.success) {
        toast.error('Whisper API is not available. Transcription will not work.')
      }
    } catch (error) {
      setApiStatus({ checking: false, connected: false })
      toast.error('Failed to connect to Whisper API')
    }
  }

  const checkUserDailyLimit = async () => {
    if (user?.uid) {
      const limit = await checkDailyLimit(user.uid)
      setDailyLimit(limit)
    }
  }

  const fetchSurahs = async () => {
    setLoadingAyahs(true)
    try {
      const surahsList = await getSurahs()
      console.log('Loaded surahs:', surahsList.length)
      setSurahs(surahsList)
      
      // Default select first surah
      if (surahsList.length > 0) {
        setSelectedSurah(surahsList[0])
        setTotalAyahsInSurah(surahsList[0].numberOfAyahs || 7)
      }
    } catch (error) {
      console.error('Error fetching surahs:', error)
      toast.error('Failed to load Quran surahs')
    } finally {
      setLoadingAyahs(false)
    }
  }

  const loadAyahByNumber = async (surahNumber, ayahNo) => {
    try {
      const ayah = await getAyahByNumber(surahNumber, ayahNo)
      if (ayah) {
        setSelectedAyah(ayah)
      }
    } catch (error) {
      console.error('Error loading ayah:', error)
    }
  }

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast.error('Please enter a search term')
      return
    }
    
    setLoadingAyahs(true)
    try {
      // Search by surah name
      const foundSurah = surahs.find(s => 
        s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.englishName?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      
      if (foundSurah) {
        setSelectedSurah(foundSurah)
        setCurrentAyahNumber(1)
        setTotalAyahsInSurah(foundSurah.numberOfAyahs || 7)
        setShowSearchResults(false)
        setSearchTerm('')
        toast.success(`Found: ${foundSurah.name}`)
      } else {
        toast.error('Surah not found. Try another name.')
      }
    } catch (error) {
      console.error('Search error:', error)
      toast.error('Search failed')
    } finally {
      setLoadingAyahs(false)
    }
  }

  const handleNextAyah = () => {
    if (currentAyahNumber < totalAyahsInSurah) {
      setCurrentAyahNumber(prev => prev + 1)
      resetRecording()
    } else {
      toast.info(`You've reached the last ayah of ${selectedSurah?.name}`)
    }
  }

  const handlePreviousAyah = () => {
    if (currentAyahNumber > 1) {
      setCurrentAyahNumber(prev => prev - 1)
      resetRecording()
    } else {
      toast.info(`You're at the first ayah of ${selectedSurah?.name}`)
    }
  }

  const handleSurahChange = (event) => {
    const surahNumber = event.target.value
    const surah = surahs.find(s => s.number === surahNumber)
    setSelectedSurah(surah)
    setCurrentAyahNumber(1)
    setTotalAyahsInSurah(surah?.numberOfAyahs || 7)
    resetRecording()
  }

  const startRecording = async () => {
    const limit = await checkDailyLimit(user?.uid)
    if (!limit.canRecite) {
      toast.error(`You've reached your daily limit (${limit.limit}/${limit.limit}). Please upgrade to continue.`)
      return
    }
    setDailyLimit(limit)

    if (!apiStatus.connected) {
      toast.error('Whisper API is not available. Please try again later.')
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
        } 
      })
      
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm' })
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorderRef.current.onstop = () => {
        const audioBlobData = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        setAudioBlob(audioBlobData)
        const url = URL.createObjectURL(audioBlobData)
        setAudioUrl(url)
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorderRef.current.start(1000)
      setIsRecording(true)
      setRecordingTime(0)
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
      
      toast.success('Recording started...')
    } catch (error) {
      console.error('Error accessing microphone:', error)
      toast.error('Unable to access microphone. Please check permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (timerRef.current) clearInterval(timerRef.current)
      toast.success('Recording stopped. Processing...')
      processRecitation()
    }
  }

  const playAudio = () => {
    if (audioRef.current && audioUrl) {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  const resetRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
    }
    setAudioBlob(null)
    setAudioUrl(null)
    setAnalysisResult(null)
    setRawTranscription('')
    setRecordingTime(0)
    setIsPlaying(false)
  }

  const processRecitation = async () => {
    if (!selectedAyah) {
      toast.error('Please select a verse first')
      return
    }

    if (!audioBlob) {
      toast.error('No recording found')
      return
    }

    if (!apiStatus.connected) {
      toast.error('Whisper API is not available. Please try again later.')
      return
    }

    setIsProcessing(true)
    setRawTranscription('')
    
    try {
      const wavBlob = await convertToWav(audioBlob)
      const result = await analyzeRecitationAudio(wavBlob, selectedAyah)
      
      if (!result.success) {
        throw new Error(result.error || 'Analysis failed')
      }
      
      setRawTranscription(result.transcription)
      
      setAnalysisResult({
        score: result.score,
        accuracy: result.accuracy,
        tajweedScore: result.tajweedScore,
        matchPercentage: result.matchPercentage,
        points: result.points,
        duration: recordingTime,
        transcription: result.transcription,
        expectedText: selectedAyah.text || '',
        errors: result.errors,
        detailedScores: result.detailedScores,
      })
      
      await saveEvaluation({
        userId: user?.uid,
        ayahNo: selectedAyah.ayahNo,
        surah: selectedAyah.surah,
        transcription: result.transcription,
        score: result.score,
        creditsUsed: 1,
        duration: recordingTime,
        accuracy: result.accuracy,
        tajweedScore: result.tajweedScore,
        errors: result.errors,
        detailedScores: result.detailedScores,
      })
      
      incrementRecitationCount()
      await checkUserDailyLimit()
      
      const pointsText = result.points === 1 ? 'Perfect!' : result.points === 0.5 ? 'Good effort!' : 'Needs practice'
      toast.success(`Score: ${Math.round(result.score)}% - ${pointsText}`)
      
    } catch (error) {
      console.error('Processing error:', error)
      toast.error(error.message || 'Failed to process recitation')
    } finally {
      setIsProcessing(false)
    }
  }

  const convertToWav = async (audioBlob) => {
    return new Promise((resolve, reject) => {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const fileReader = new FileReader()
      
      fileReader.onload = async (e) => {
        try {
          const arrayBuffer = e.target.result
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
          
          const offlineContext = new OfflineAudioContext(1, audioBuffer.duration * 16000, 16000)
          const source = offlineContext.createBufferSource()
          source.buffer = audioBuffer
          source.connect(offlineContext.destination)
          source.start()
          
          const renderedBuffer = await offlineContext.startRendering()
          const wavBlob = audioBufferToWav(renderedBuffer)
          resolve(wavBlob)
        } catch (error) {
          reject(error)
        } finally {
          audioContext.close()
        }
      }
      
      fileReader.onerror = reject
      fileReader.readAsArrayBuffer(audioBlob)
    })
  }

  const audioBufferToWav = (buffer) => {
    const numChannels = buffer.numberOfChannels
    const sampleRate = buffer.sampleRate
    const format = 1
    const bitDepth = 16
    
    let samples = buffer.getChannelData(0)
    const dataLength = samples.length * (bitDepth / 8)
    const bufferLength = 44 + dataLength
    const arrayBuffer = new ArrayBuffer(bufferLength)
    const view = new DataView(arrayBuffer)
    
    writeString(view, 0, 'RIFF')
    view.setUint32(4, bufferLength - 8, true)
    writeString(view, 8, 'WAVE')
    writeString(view, 12, 'fmt ')
    view.setUint32(16, 16, true)
    view.setUint16(20, format, true)
    view.setUint16(22, numChannels, true)
    view.setUint32(24, sampleRate, true)
    view.setUint32(28, sampleRate * numChannels * (bitDepth / 8), true)
    view.setUint16(32, numChannels * (bitDepth / 8), true)
    view.setUint16(34, bitDepth, true)
    writeString(view, 36, 'data')
    view.setUint32(40, dataLength, true)
    
    let offset = 44
    for (let i = 0; i < samples.length; i++) {
      const sample = Math.max(-1, Math.min(1, samples[i]))
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true)
      offset += 2
    }
    
    return new Blob([arrayBuffer], { type: 'audio/wav' })
  }

  const writeString = (view, offset, str) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i))
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getScoreColor = (score) => {
    if (score >= 85) return '#22c55e'
    if (score >= 50) return '#f59e0b'
    return '#ef4444'
  }

  const getScoreLabel = (score, points) => {
    if (points === 1) return 'Excellent - Perfect!'
    if (points === 0.5) return 'Good - Some improvements needed'
    return 'Needs Practice'
  }

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const canRecord = !isProcessing && !isRecording && !analysisResult && selectedAyah && dailyLimit.canRecite

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="xl">
        <Box mb={4}>
          <Box display="flex" alignItems="center" flexWrap="wrap" gap={2}>
            <Typography variant="h4" gutterBottom fontWeight="bold">
              Recitation Studio
            </Typography>
            {apiStatus.connected && (
              <Chip label="API Ready" color="success" size="small" icon={<CheckCircle sx={{ fontSize: 14 }} />} />
            )}
            {!apiStatus.connected && !apiStatus.checking && (
              <Chip label="API Offline" color="error" size="small" icon={<ErrorIcon sx={{ fontSize: 14 }} />} />
            )}
            {dailyLimit.limit > 0 && (
              <Chip 
                label={`${dailyLimit.remaining}/${dailyLimit.limit} remaining`}
                color={dailyLimit.remaining > 0 ? 'primary' : 'error'}
                size="small"
              />
            )}
          </Box>
          <Typography variant="body1" color="text.secondary">
            Select a surah, navigate to an ayah, record your recitation, and get AI feedback
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Left Column - Selection & Recording */}
          <Grid item size={{ xs: 12, md: 6 }}>
            <Stack spacing={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight="bold">Select a Surah</Typography>
                  
                  {/* Surah Selection Dropdown */}
                  <FormControl fullWidth size="medium" sx={{ mb: 3 }}>
                    <InputLabel>Surah</InputLabel>
                    <Select
                      value={selectedSurah?.number || ''}
                      onChange={handleSurahChange}
                      label="Surah"
                      disabled={!canRecord && !isProcessing}
                    >
                      {surahs.map((surah) => (
                        <MenuItem key={surah.number} value={surah.number}>
                          {surah.number}. {surah.name} - {surah.englishName} ({surah.numberOfAyahs} ayahs)
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Ayah Navigation */}
                  {selectedSurah && (
                    <Box>
                      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                        <Typography variant="body2" color="text.secondary">
                          Surah {selectedSurah.name} has {totalAyahsInSurah} ayahs
                        </Typography>
                        <Box>
                          <IconButton 
                            onClick={handlePreviousAyah} 
                            disabled={currentAyahNumber <= 1 || (!canRecord && !isProcessing)}
                            sx={{ color: '#22c55e' }}
                          >
                            <NavigateBefore />
                          </IconButton>
                          <Typography variant="body1" component="span" sx={{ mx: 2 }}>
                            Ayah {currentAyahNumber} / {totalAyahsInSurah}
                          </Typography>
                          <IconButton 
                            onClick={handleNextAyah} 
                            disabled={currentAyahNumber >= totalAyahsInSurah || (!canRecord && !isProcessing)}
                            sx={{ color: '#22c55e' }}
                          >
                            <NavigateNext />
                          </IconButton>
                        </Box>
                      </Box>
                    </Box>
                  )}

                  {/* Selected Ayah Display */}
                  {selectedAyah && (
                    <Fade in={!!selectedAyah}>
                      <Box mt={3}>
                        <Paper sx={{ p: 3, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: '12px' }}>
                          <Typography variant="h5" sx={{ fontFamily: 'Amiri, Noto Naskh Arabic, serif', textAlign: 'right', lineHeight: 1.8, mb: 2 }}>
                            {selectedAyah.text}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" textAlign="right">
                            {selectedSurah?.name} - Ayah {currentAyahNumber}
                          </Typography>
                        </Paper>
                      </Box>
                    </Fade>
                  )}
                </CardContent>
              </Card>

              {/* Recording Controls */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight="bold">Recording Studio</Typography>
                  
                  {!selectedAyah ? (
                    <Alert severity="info">Please select a surah to start reciting</Alert>
                  ) : !dailyLimit.canRecite ? (
                    <Alert severity="warning">
                      You've reached your daily limit. Please upgrade to continue.
                      <Button size="small" sx={{ ml: 2 }} onClick={() => navigate('/subscription')}>Upgrade Now</Button>
                    </Alert>
                  ) : isProcessing ? (
                    <Box textAlign="center" py={4}>
                      <CircularProgress size={40} />
                      <Typography variant="body2" color="text.secondary" mt={2}>Processing your recitation with AI...</Typography>
                    </Box>
                  ) : (
                    <>
                      <Box textAlign="center" mb={3}>
                        <Typography variant="h2" fontWeight="bold" sx={{ fontFamily: 'monospace' }}>
                          {formatTime(recordingTime)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {isRecording ? 'Recording in progress...' : 'Ready to record'}
                        </Typography>
                      </Box>

                      <Stack direction="row" spacing={2} justifyContent="center">
                        {!isRecording && !audioBlob && (
                          <Button variant="contained" startIcon={<Mic />} onClick={startRecording} size="large">
                            Start Recording
                          </Button>
                        )}
                        {isRecording && (
                          <Button variant="contained" color="error" startIcon={<Stop />} onClick={stopRecording} size="large">
                            Stop Recording
                          </Button>
                        )}
                        {audioBlob && !isProcessing && (
                          <>
                            {!isPlaying ? (
                              <Button variant="outlined" startIcon={<PlayArrow />} onClick={playAudio} size="large">Play</Button>
                            ) : (
                              <Button variant="outlined" startIcon={<Pause />} onClick={pauseAudio} size="large">Pause</Button>
                            )}
                            <Button variant="outlined" startIcon={<Replay />} onClick={resetRecording} size="large">
                              New Recording
                            </Button>
                          </>
                        )}
                      </Stack>

                      <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} style={{ display: 'none' }} />
                    </>
                  )}
                </CardContent>
              </Card>
            </Stack>
          </Grid>

          {/* Right Column - Results & Feedback (Same as before) */}
          <Grid item size={{ xs: 12, md: 6 }}>
            <AnimatePresence mode="wait">
              {analysisResult ? (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <Card>
                    <CardContent>
                      <Accordion 
                        expanded={expandedSections.apiResponse} 
                        onChange={() => toggleSection('apiResponse')}
                        sx={{ mb: 3, bgcolor: alpha('#3b82f6', 0.05) }}
                      >
                        <AccordionSummary expandIcon={<ExpandMore />}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Api sx={{ color: '#3b82f6' }} />
                            <Typography variant="subtitle1" fontWeight="bold">Whisper API Response</Typography>
                            <Chip label="Raw Output" size="small" color="info" />
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Paper sx={{ p: 2, bgcolor: alpha('#000', 0.02) }}>
                            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                              Transcription from Whisper Model:
                            </Typography>
                            <Typography variant="body1" sx={{ fontFamily: 'monospace', wordBreak: 'break-all', bgcolor: '#f5f5f5', p: 1, borderRadius: 1 }}>
                              {rawTranscription || analysisResult.transcription}
                            </Typography>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                              Expected Text (Quran):
                            </Typography>
                            <Typography variant="body1" sx={{ fontFamily: 'Amiri, serif', fontSize: '1.2rem', bgcolor: '#e8f5e9', p: 1, borderRadius: 1 }}>
                              {analysisResult.expectedText}
                            </Typography>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                              Match Percentage: <strong>{analysisResult.matchPercentage?.toFixed(1)}%</strong>
                            </Typography>
                            <Typography variant="caption" color="text.secondary" display="block">
                              Points Earned: <strong>{analysisResult.points === 1 ? '1 (Full)' : analysisResult.points === 0.5 ? '0.5 (Half)' : '0 (None)'}</strong>
                            </Typography>
                          </Paper>
                        </AccordionDetails>
                      </Accordion>

                      <Box mb={4}>
                        <Typography variant="h6" gutterBottom fontWeight="bold">Analysis Results</Typography>
                        <Grid container spacing={3}>
                          <Grid item size={{ xs: 12, sm: 4 }}>
                            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: alpha(getScoreColor(analysisResult.score), 0.1) }}>
                              <Typography variant="h2" fontWeight="bold" sx={{ color: getScoreColor(analysisResult.score) }}>
                                {Math.round(analysisResult.score)}%
                              </Typography>
                              <Typography variant="body2" color="text.secondary">Overall Score</Typography>
                              <Chip label={getScoreLabel(analysisResult.score, analysisResult.points)} size="small" sx={{ mt: 1, bgcolor: getScoreColor(analysisResult.score), color: 'white' }} />
                            </Paper>
                          </Grid>
                          <Grid item size={{ xs: 12, sm: 4 }}>
                            <Paper sx={{ p: 2, textAlign: 'center' }}>
                              <Typography variant="h4" fontWeight="bold" color="#3b82f6">{Math.round(analysisResult.accuracy)}%</Typography>
                              <Typography variant="body2" color="text.secondary">Accuracy</Typography>
                            </Paper>
                          </Grid>
                          <Grid item size={{ xs: 12, sm: 4 }}>
                            <Paper sx={{ p: 2, textAlign: 'center' }}>
                              <Typography variant="h4" fontWeight="bold" color="#8b5cf6">{Math.round(analysisResult.tajweedScore)}%</Typography>
                              <Typography variant="body2" color="text.secondary">Tajweed Score</Typography>
                            </Paper>
                          </Grid>
                        </Grid>
                      </Box>

                      <Box mb={3}>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Areas for Improvement</Typography>
                        {analysisResult.errors && analysisResult.errors.length > 0 ? (
                          <Stack spacing={2} mt={2}>
                            {analysisResult.errors.map((error, index) => (
                              <Paper key={index} sx={{ p: 2, borderLeft: `3px solid ${error.wordMatchPercent >= 75 ? '#22c55e' : error.wordMatchPercent >= 50 ? '#f59e0b' : '#ef4444'}` }}>
                                <Box display="flex" alignItems="center" gap={1} mb={1}>
                                  {error.wordMatchPercent >= 75 ? (
                                    <CheckCircle sx={{ color: '#22c55e', fontSize: 20 }} />
                                  ) : error.wordMatchPercent >= 50 ? (
                                    <Warning sx={{ color: '#f59e0b', fontSize: 20 }} />
                                  ) : (
                                    <ErrorIcon sx={{ color: '#ef4444', fontSize: 20 }} />
                                  )}
                                  <Typography variant="subtitle2" fontWeight="bold">{error.word}</Typography>
                                  <Chip label={`${error.wordMatchPercent}% match`} size="small" sx={{ bgcolor: error.wordMatchPercent >= 75 ? alpha('#22c55e', 0.1) : error.wordMatchPercent >= 50 ? alpha('#f59e0b', 0.1) : alpha('#ef4444', 0.1), color: error.wordMatchPercent >= 75 ? '#22c55e' : error.wordMatchPercent >= 50 ? '#f59e0b' : '#ef4444' }} />
                                </Box>
                                <Typography variant="body2" color="text.secondary" mb={0.5}>
                                  Expected: <span style={{ color: '#22c55e' }}>{error.expected}</span> | Got: <span style={{ color: '#ef4444' }}>{error.actual}</span>
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#22c55e' }}>💡 {error.suggestion}</Typography>
                                <Typography variant="caption" color="text.secondary">📖 Rule: {error.rule}</Typography>
                              </Paper>
                            ))}
                          </Stack>
                        ) : (
                          <Box textAlign="center" py={4}>
                            <CheckCircle sx={{ color: '#22c55e', fontSize: 48, mb: 1 }} />
                            <Typography color="text.secondary">Perfect recitation! No errors detected.</Typography>
                          </Box>
                        )}
                      </Box>

                      <Stack direction="row" spacing={2}>
                        <Button variant="contained" startIcon={<Replay />} onClick={resetRecording} fullWidth>Practice Again</Button>
                        <Button variant="outlined" startIcon={<Download />} onClick={() => {
                          if (audioBlob) {
                            const url = URL.createObjectURL(audioBlob)
                            const a = document.createElement('a')
                            a.href = url
                            a.download = `recitation_${Date.now()}.webm`
                            a.click()
                            URL.revokeObjectURL(url)
                            toast.success('Recording downloaded')
                          }
                        }} fullWidth>Download Recording</Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Card sx={{ height: '100%', minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <RecordVoiceOver sx={{ fontSize: 80, color: alpha(theme.palette.primary.main, 0.3), mb: 2 }} />
                      <Typography variant="h6" gutterBottom color="text.secondary">Ready to Recite</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Select a surah, navigate to an ayah, record your recitation, and get AI-powered feedback
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </Grid>
        </Grid>

        <Box mt={4}>
          <Card sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">Tips for Best Results</Typography>
              <Grid container spacing={2}>
                <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
                  <Box display="flex" alignItems="center" gap={1}><Mic sx={{ color: '#22c55e' }} /><Typography variant="body2">Use a good quality microphone</Typography></Box>
                </Grid>
                <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
                  <Box display="flex" alignItems="center" gap={1}><Science sx={{ color: '#22c55e' }} /><Typography variant="body2">Recite in a quiet environment</Typography></Box>
                </Grid>
                <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
                  <Box display="flex" alignItems="center" gap={1}><Psychology sx={{ color: '#22c55e' }} /><Typography variant="body2">Practice each verse multiple times</Typography></Box>
                </Grid>
                <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
                  <Box display="flex" alignItems="center" gap={1}><TrendingUp sx={{ color: '#22c55e' }} /><Typography variant="body2">Review feedback and improve</Typography></Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  )
}

export default RecitationStudio