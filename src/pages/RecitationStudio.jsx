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
  Paper,
  CircularProgress,
  useTheme,
  alpha,
  Fade,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
  NavigateNext,
  NavigateBefore,
  Assessment,
} from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useSubscription } from '../context/SubscriptionContext'
import {
  checkDailyLimit, 
  saveEvaluation,
} from '../services/firebase'
import { analyzeRecitationAudio, testConnection } from '../services/recitationApi'
import { getAyahByNumber, getSurahs } from '../services/quranApi'
import toast from 'react-hot-toast'
import EvaluationResults from '../components/EvaluationResults'
import AudioGeneratorDialog from '../components/AudioGeneratorDialog'

const AYAH_CHUNK_SIZE = 5

const RecitationStudio = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const { user } = useAuth()
  const { incrementRecitationCount } = useSubscription()
  
  // State for Quran data
  const [selectedAyahs, setSelectedAyahs] = useState([])
  const [surahs, setSurahs] = useState([])
  const [selectedSurah, setSelectedSurah] = useState(null)
  const [chunkStartAyah, setChunkStartAyah] = useState(1)
  const [totalAyahsInSurah, setTotalAyahsInSurah] = useState(0)
  const [loadingAyahs, setLoadingAyahs] = useState(true)
  
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
  const [perAyahResults, setPerAyahResults] = useState([])
  const [wordMatches, setWordMatches] = useState([])
  
  // State for limits
  const [dailyLimit, setDailyLimit] = useState({ canRecite: true, remaining: 5, limit: 5 })
  
  // State for API status
  const [apiStatus, setApiStatus] = useState({ checking: true, connected: false })
  
  // State for audio generator dialog
  const [audioDialogOpen, setAudioDialogOpen] = useState(false)
  
  // UI expand/collapse
  const [expandedSections, setExpandedSections] = useState({
    apiResponse: false,
  })
  
  // Refs
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const audioRef = useRef(null)
  const timerRef = useRef(null)
  const audioBlobRef = useRef(null)

  // Load data on mount
  useEffect(() => {
    fetchSurahs()
    checkUserDailyLimit()
  }, [user])

  // Load ayahs when surah or chunk changes
  useEffect(() => {
    if (selectedSurah) {
      loadAyahChunk()
    }
  }, [selectedSurah, chunkStartAyah])

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
      setSurahs(surahsList)
      
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

  const loadAyahChunk = async () => {
    setLoadingAyahs(true)
    try {
      const ayahs = []
      const endAyah = Math.min(chunkStartAyah + AYAH_CHUNK_SIZE - 1, totalAyahsInSurah)
      
      for (let i = chunkStartAyah; i <= endAyah; i++) {
        const ayah = await getAyahByNumber(selectedSurah.number, i)
        if (ayah) {
          ayahs.push({
            ...ayah,
          })
        }
      }
      
      setSelectedAyahs(ayahs)
      
    } catch (error) {
      console.error('Error loading ayah chunk:', error)
      toast.error('Failed to load ayahs')
    } finally {
      setLoadingAyahs(false)
    }
  }

  const handleNextChunk = () => {
    const newStart = chunkStartAyah + AYAH_CHUNK_SIZE
    if (newStart <= totalAyahsInSurah) {
      setChunkStartAyah(newStart)
      resetRecording()
      setAnalysisResult(null)
      setPerAyahResults([])
      setWordMatches([])
    } else {
      toast.info(`You've reached the end of ${selectedSurah?.name}`)
    }
  }

  const handlePreviousChunk = () => {
    const newStart = Math.max(1, chunkStartAyah - AYAH_CHUNK_SIZE)
    if (newStart !== chunkStartAyah) {
      setChunkStartAyah(newStart)
      resetRecording()
      setAnalysisResult(null)
      setPerAyahResults([])
      setWordMatches([])
    }
  }

  const handleSurahChange = (event) => {
    const surahNumber = event.target.value
    const surah = surahs.find(s => s.number === surahNumber)
    setSelectedSurah(surah)
    setChunkStartAyah(1)
    setTotalAyahsInSurah(surah?.numberOfAyahs || 7)
    resetRecording()
    setAnalysisResult(null)
    setPerAyahResults([])
    setWordMatches([])
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

    if (selectedAyahs.length === 0) {
      toast.error('No ayahs loaded')
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
      audioBlobRef.current = null

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorderRef.current.onstop = () => {
        const audioBlobData = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        audioBlobRef.current = audioBlobData
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
      
      toast.success('Recording started. Recite all ayahs continuously...')
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
      
      toast.success('Recording stopped. Processing all ayahs...')
      
      const checkBlobAndProcess = () => {
        if (audioBlobRef.current) {
          processFullRecitation(audioBlobRef.current)
        } else {
          setTimeout(checkBlobAndProcess, 100)
        }
      }
      
      setTimeout(checkBlobAndProcess, 100)
    }
  }

  const processFullRecitation = async (blob) => {
    if (selectedAyahs.length === 0) {
      toast.error('No ayahs loaded')
      setIsProcessing(false)
      return
    }

    if (!blob) {
      toast.error('No recording found')
      setIsProcessing(false)
      return
    }

    if (!apiStatus.connected) {
      toast.error('Whisper API is not available')
      setIsProcessing(false)
      return
    }

    if (!user?.uid) {
      toast.error('You must be logged in')
      setIsProcessing(false)
      return
    }

    setIsProcessing(true)
    setRawTranscription('')
    setPerAyahResults([])
    setWordMatches([])
    
    try {
      const wavBlob = await convertToWav(blob)
      
      // Build the complete expected text
      const expectedText = selectedAyahs.map(ayah => ayah.text).join(' ')
      
      // Send the entire recording for transcription and grading
      const result = await analyzeRecitationAudio(wavBlob, { text: expectedText })
      
      if (!result.success) {
        throw new Error(result.error || 'Analysis failed')
      }
      
      setRawTranscription(result.transcription)
      
      // Process per-ayah results from the enhanced grading engine
      const processedResults = processPerAyahResults(result, selectedAyahs)
      setPerAyahResults(processedResults)
      
      // Store word matches for detailed highlighting
      if (result.wordMatches) {
        setWordMatches(result.wordMatches)
      }
      
      setAnalysisResult({
        overallScore: result.score,
        totalScore: result.score,
        ayahCount: selectedAyahs.length,
        duration: recordingTime,
        transcription: result.transcription,
      })
      
      // Save evaluation to Firebase
      await saveEvaluation({
        userId: user.uid,
        ayahNo: selectedAyahs[0].ayahNo,
        surah: selectedAyahs[0].surah,
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
      
      const pointsText = result.score >= 85 ? 'Excellent!' : result.score >= 50 ? 'Good effort!' : 'Needs practice'
      toast.success(`Overall Score: ${Math.round(result.score)}% - ${pointsText}`)
      
    } catch (error) {
      console.error('Processing error:', error)
      toast.error(error.message || 'Failed to process recitation')
    } finally {
      setIsProcessing(false)
    }
  }

  // Helper function to process per-ayah results from the grading engine
  const processPerAyahResults = (gradingResult, ayahs) => {
    const results = []
    
    for (let i = 0; i < ayahs.length; i++) {
      const ayah = ayahs[i]
      // Find errors related to this ayah
      const ayahErrors = gradingResult.errors?.filter(e => e.ayah === i + 1) || []
      
      // Calculate score for this ayah
      let ayahScore = gradingResult.score
      if (ayahErrors.length > 0) {
        const deduction = Math.min(ayahErrors.length * 10, 50)
        ayahScore = Math.max(0, gradingResult.score - deduction)
      }
      
      results.push({
        ayahNo: ayah.ayahNo,
        score: ayahScore,
        points: ayahScore >= 75 ? 1 : ayahScore >= 50 ? 0.5 : 0,
        errors: ayahErrors,
        wordMatches: gradingResult.wordMatches,
      })
    }
    
    return results
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
    audioBlobRef.current = null
    setAnalysisResult(null)
    setPerAyahResults([])
    setWordMatches([])
    setRawTranscription('')
    setRecordingTime(0)
    setIsPlaying(false)
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

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  // Build continuous text for display
  const continuousText = selectedAyahs.map((ayah, idx) => (
    <span key={ayah.ayahNo}>
      <sup style={{ fontSize: '0.7rem', color: '#22c55e', marginRight: '4px', fontWeight: 'bold' }}>{ayah.ayahNo}</sup>
      {ayah.text}
      {idx < selectedAyahs.length - 1 && <span style={{ marginRight: '8px' }} />}
    </span>
  ))

  const canRecord = !isProcessing && !isRecording && !analysisResult && selectedAyahs.length > 0 && dailyLimit.canRecite

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="xl">
        <Box mb={4}>
          <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
            <Box>
              <Typography variant="h4" gutterBottom fontWeight="bold">
                Recitation Studio
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Recite {AYAH_CHUNK_SIZE} ayahs continuously, get feedback for all at once
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={2}>
              {apiStatus.connected && (
                <Chip label="API Ready" color="success" size="small" icon={<CheckCircle sx={{ fontSize: 14 }} />} />
              )}
              {dailyLimit.limit > 0 && (
                <Chip 
                  label={`${dailyLimit.remaining}/${dailyLimit.limit} remaining`}
                  color={dailyLimit.remaining > 0 ? 'primary' : 'error'}
                  size="small"
                />
              )}
            </Box>
          </Box>
        </Box>

        <Grid container spacing={4}>
          {/* Left Column - Selection & Controls */}
          <Grid item size={{ xs: 12, md: 4 }}>
            <Stack spacing={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight="bold">Select Surah & Chunk</Typography>
                  
                  <FormControl fullWidth size="medium" sx={{ mb: 3 }}>
                    <InputLabel>Surah</InputLabel>
                    <Select
                      value={selectedSurah?.number || ''}
                      onChange={handleSurahChange}
                      label="Surah"
                    >
                      {surahs.map((surah) => (
                        <MenuItem key={surah.number} value={surah.number}>
                          {surah.number}. {surah.name} - {surah.englishName} ({surah.numberOfAyahs} ayahs)
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {selectedSurah && (
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                      <Button 
                        variant="outlined" 
                        onClick={handlePreviousChunk}
                        disabled={chunkStartAyah === 1}
                        startIcon={<NavigateBefore />}
                        size="small"
                      >
                        Prev
                      </Button>
                      <Typography variant="body2" color="text.secondary" align="center">
                        Ayahs {chunkStartAyah} - {Math.min(chunkStartAyah + AYAH_CHUNK_SIZE - 1, totalAyahsInSurah)}
                      </Typography>
                      <Button 
                        variant="outlined" 
                        onClick={handleNextChunk}
                        disabled={chunkStartAyah + AYAH_CHUNK_SIZE - 1 >= totalAyahsInSurah}
                        endIcon={<NavigateNext />}
                        size="small"
                      >
                        Next
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>

              {/* Recording Controls */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight="bold">Recording Studio</Typography>
                  
                  {selectedAyahs.length === 0 ? (
                    <Alert severity="info">Please select a surah to start reciting</Alert>
                  ) : !dailyLimit.canRecite ? (
                    <Alert severity="warning">
                      You've reached your daily limit. Please upgrade to continue.
                      <Button size="small" sx={{ ml: 2 }} onClick={() => navigate('/subscription')}>Upgrade Now</Button>
                    </Alert>
                  ) : isProcessing ? (
                    <Box textAlign="center" py={4}>
                      <CircularProgress size={40} />
                      <Typography variant="body2" color="text.secondary" mt={2}>Processing your recitation...</Typography>
                    </Box>
                  ) : analysisResult ? (
                    <Box textAlign="center" py={2}>
                      <Assessment sx={{ fontSize: 48, color: '#22c55e', mb: 1 }} />
                      <Typography variant="h5" fontWeight="bold" color="#22c55e">
                        {Math.round(analysisResult.overallScore)}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Overall Score
                      </Typography>
                      <Button 
                        variant="contained" 
                        sx={{ mt: 2 }}
                        onClick={resetRecording}
                        fullWidth
                      >
                        Practice This Chunk Again
                      </Button>
                    </Box>
                  ) : (
                    <>
                      <Box textAlign="center" mb={3}>
                        <Typography variant="h2" fontWeight="bold" sx={{ fontFamily: 'monospace' }}>
                          {formatTime(recordingTime)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {isRecording ? 'Recording in progress...' : 'Ready to record all ayahs'}
                        </Typography>
                      </Box>

                      <Stack direction="row" spacing={2} justifyContent="center">
                        {!isRecording && !audioBlob && (
                          <Button variant="contained" startIcon={<Mic />} onClick={startRecording} size="large" fullWidth>
                            Start Recording All Ayahs
                          </Button>
                        )}
                        {isRecording && (
                          <Button variant="contained" color="error" startIcon={<Stop />} onClick={stopRecording} size="large" fullWidth>
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
                              Re-record
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

          {/* Right Column - Ayah Display & Results */}
          <Grid item size={{ xs: 12, md: 8 }}>
            <AnimatePresence mode="wait">
              {analysisResult && perAyahResults.length > 0 ? (
                <EvaluationResults 
                  analysisResult={analysisResult}
                  perAyahResults={perAyahResults}
                  rawTranscription={rawTranscription}
                  selectedAyahs={selectedAyahs}
                  originalText={selectedAyahs.map(a => a.text).join(' ')}
                  onPracticeAgain={resetRecording}
                  onPlayRecording={playAudio}
                  onDownloadRecording={() => {
                    if (audioBlob) {
                      const url = URL.createObjectURL(audioBlob)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = `recitation_${Date.now()}.webm`
                      a.click()
                      URL.revokeObjectURL(url)
                      toast.success('Recording downloaded')
                    }
                  }}
                  onGenerateAudio={() => setAudioDialogOpen(true)}
                  onClose={() => {
                    setAnalysisResult(null)
                    setPerAyahResults([])
                    setRawTranscription('')
                  }}
                />
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Card sx={{ height: '100%', minHeight: 500 }}>
                    <CardContent>
                      <Box 
                        sx={{ 
                          p: 4, 
                          bgcolor: alpha(theme.palette.primary.main, 0.03), 
                          borderRadius: 3,
                          minHeight: 400,
                        }}
                      >
                        <Typography 
                          sx={{ 
                            fontFamily: 'Amiri, Noto Naskh Arabic, serif',
                            textAlign: 'right',
                            lineHeight: 2,
                            fontSize: { xs: '1rem', sm: '1.3rem', md: '1.6rem' },
                            direction: 'rtl',
                          }}
                        >
                          {continuousText}
                        </Typography>
                        
                        <Divider sx={{ my: 3 }} />
                        
                        <Box textAlign="center" py={2}>
                          {selectedAyahs.length > 0 && (
                            <Alert severity="info" sx={{ borderRadius: 2 }}>
                              <Typography variant="body2">
                                <strong>Instructions:</strong> Press "Start Recording" and recite <strong>ALL {selectedAyahs.length} ayahs continuously</strong> from beginning to end.
                              </Typography>
                            </Alert>
                          )}
                          {selectedAyahs.length === 0 && (
                            <Typography color="text.secondary">
                              Select a surah and chunk to start practicing
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </Grid>
        </Grid>
      </Container>

      {/* Audio Generator Dialog */}
      <AudioGeneratorDialog
        open={audioDialogOpen}
        onClose={() => setAudioDialogOpen(false)}
        ayahText={selectedAyahs.map(a => a.text).join(' ')}
        ayahInfo={{
          surah: selectedSurah?.name,
          ayahNo: selectedAyahs.length > 0 ? `${selectedAyahs[0]?.ayahNo}-${selectedAyahs[selectedAyahs.length-1]?.ayahNo}` : ''
        }}
      />
    </Box>
  )
}

export default RecitationStudio