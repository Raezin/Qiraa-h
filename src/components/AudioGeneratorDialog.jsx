// src/components/AudioGeneratorDialog.jsx

import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Slider,
  Chip,
  Stack,
  Alert,
  CircularProgress,
  IconButton,
  Paper,
  useTheme,
  alpha,
} from '@mui/material'
import {
  PlayArrow,
  Stop,
  Download,
  Close,
  VolumeUp,
} from '@mui/icons-material'
import { synthesizeSpeech } from '../services/ttsApi'
import toast from 'react-hot-toast'

const AudioGeneratorDialog = ({ open, onClose, ayahText, ayahInfo }) => {
  const theme = useTheme()
  const [selectedText, setSelectedText] = useState('')
  const [speakerIdx, setSpeakerIdx] = useState(105)
  const [generating, setGenerating] = useState(false)
  const [audioUrl, setAudioUrl] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioElement, setAudioElement] = useState(null)

  // Extract words from ayah text (split by spaces and filter)
  const words = ayahText?.split(/\s+/).filter(w => w.length > 0) || []
  
  // Helper to select a word or phrase
  const handleSelectWord = (word) => {
    setSelectedText(prev => {
      const words = prev ? prev.split(' ') : []
      if (words.includes(word)) {
        // Remove if already selected
        return words.filter(w => w !== word).join(' ')
      } else if (words.length < 10) {
        // Add if less than 10 words
        return [...words, word].join(' ')
      }
      toast.warning('Maximum 10 words allowed')
      return prev
    })
  }

  // Clear selected text
  const clearSelectedText = () => {
    setSelectedText('')
  }

  // Generate audio from selected text
  const handleGenerateAudio = async () => {
    if (!selectedText.trim()) {
      toast.error('Please select at least one word')
      return
    }

    const wordCount = selectedText.split(/\s+/).length
    if (wordCount < 3) {
      toast.error('Please select at least 3 words')
      return
    }

    setGenerating(true)
    try {
      const result = await synthesizeSpeech(selectedText, speakerIdx)
      if (result.success && result.audioUrl) {
        // Clean up previous audio
        if (audioUrl) {
          URL.revokeObjectURL(audioUrl)
        }
        setAudioUrl(result.audioUrl)
        toast.success('Audio generated successfully!')
      } else {
        throw new Error(result.error || 'Failed to generate audio')
      }
    } catch (error) {
      console.error('Generation error:', error)
      toast.error(error.message || 'Failed to generate audio')
    } finally {
      setGenerating(false)
    }
  }

  // Play audio
  const handlePlayAudio = () => {
    if (audioUrl) {
      if (audioElement) {
        audioElement.pause()
        audioElement.currentTime = 0
      }
      const audio = new Audio(audioUrl)
      setAudioElement(audio)
      audio.play()
      setIsPlaying(true)
      audio.onended = () => {
        setIsPlaying(false)
        setAudioElement(null)
      }
    }
  }

  // Stop audio
  const handleStopAudio = () => {
    if (audioElement) {
      audioElement.pause()
      audioElement.currentTime = 0
      setIsPlaying(false)
    }
  }

  // Download audio
  const handleDownloadAudio = () => {
    if (audioUrl) {
      const a = document.createElement('a')
      a.href = audioUrl
      a.download = `quran_audio_${Date.now()}.wav`
      a.click()
      toast.success('Download started')
    }
  }

  // Cleanup on close
  const handleClose = () => {
    if (audioElement) {
      audioElement.pause()
    }
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
    }
    setSelectedText('')
    setAudioUrl(null)
    setIsPlaying(false)
    setAudioElement(null)
    onClose()
  }

  const wordCount = selectedText.split(/\s+/).filter(w => w.length > 0).length
  const isValidWordCount = wordCount >= 3 && wordCount <= 10

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: '20px' }
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={1}>
            <VolumeUp sx={{ color: '#22c55e' }} />
            <Typography variant="h6" fontWeight="bold">
              Generate Audio from Text
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </Box>
        {ayahInfo && (
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
            {ayahInfo.surah} - Ayah {ayahInfo.ayahNo}
          </Typography>
        )}
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
          {/* Original Ayah Display */}
          <Box>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              Original Verse:
            </Typography>
            <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 2 }}>
              <Typography
                sx={{
                  fontFamily: 'Amiri, Noto Naskh Arabic, serif',
                  fontSize: '1.2rem',
                  textAlign: 'right',
                  lineHeight: 1.8,
                  direction: 'rtl',
                }}
              >
                {ayahText}
              </Typography>
            </Paper>
          </Box>

          {/* Word Selection */}
          <Box>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              Select Words (Minimum 3, Maximum 10):
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
              {words.map((word, idx) => (
                <Chip
                  key={idx}
                  label={word}
                  onClick={() => handleSelectWord(word)}
                  color={selectedText.includes(word) ? 'primary' : 'default'}
                  variant={selectedText.includes(word) ? 'filled' : 'outlined'}
                  sx={{
                    fontFamily: 'Amiri, Noto Naskh Arabic, serif',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                    transition: 'transform 0.2s',
                  }}
                />
              ))}
            </Box>
            {selectedText && (
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="caption" color="text.secondary">
                  Selected: <strong>{wordCount}</strong> / 10 words
                </Typography>
                <Button size="small" onClick={clearSelectedText}>
                  Clear All
                </Button>
              </Box>
            )}
            {wordCount < 3 && wordCount > 0 && (
              <Alert severity="warning" sx={{ mt: 1, borderRadius: 2 }}>
                Need {3 - wordCount} more word(s). Minimum 3 words required.
              </Alert>
            )}
          </Box>

          {/* Selected Text Preview */}
          {selectedText && (
            <Box>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Selected Text for Generation:
              </Typography>
              <Paper sx={{ p: 2, bgcolor: alpha('#22c55e', 0.05), borderRadius: 2 }}>
                <Typography
                  sx={{
                    fontFamily: 'Amiri, Noto Naskh Arabic, serif',
                    fontSize: '1.1rem',
                    textAlign: 'right',
                    direction: 'rtl',
                  }}
                >
                  {selectedText}
                </Typography>
              </Paper>
            </Box>
          )}

          {/* Speaker Voice Selection */}
          <Box>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              Speaker Voice:
            </Typography>
            <Box px={2}>
              <Slider
                value={speakerIdx}
                onChange={(e, val) => setSpeakerIdx(val)}
                min={1}
                max={150}
                step={1}
                valueLabelDisplay="auto"
                sx={{ color: '#22c55e' }}
              />
              <Box display="flex" justifyContent="space-between">
                <Typography variant="caption" color="text.secondary">Voice 1</Typography>
                <Typography variant="caption" color="text.secondary">Voice 150</Typography>
              </Box>
            </Box>
          </Box>

          {/* Generate Button */}
          <Button
            fullWidth
            variant="contained"
            onClick={handleGenerateAudio}
            disabled={!isValidWordCount || generating}
            sx={{
              py: 1.5,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            }}
          >
            {generating ? (
              <>
                <CircularProgress size={24} sx={{ mr: 1, color: 'white' }} />
                Generating Audio...
              </>
            ) : (
              'Generate Audio'
            )}
          </Button>

          {/* Audio Player */}
          {audioUrl && (
            <Box>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Generated Audio:
              </Typography>
              <Paper sx={{ p: 2, bgcolor: alpha('#3b82f6', 0.05), borderRadius: 2 }}>
                <Box display="flex" alignItems="center" justifyContent="center" gap={2}>
                  {!isPlaying ? (
                    <IconButton
                      onClick={handlePlayAudio}
                      sx={{
                        bgcolor: '#22c55e',
                        color: 'white',
                        '&:hover': { bgcolor: '#16a34a' },
                      }}
                    >
                      <PlayArrow />
                    </IconButton>
                  ) : (
                    <IconButton
                      onClick={handleStopAudio}
                      sx={{
                        bgcolor: '#ef4444',
                        color: 'white',
                        '&:hover': { bgcolor: '#dc2626' },
                      }}
                    >
                      <Stop />
                    </IconButton>
                  )}
                  <IconButton onClick={handleDownloadAudio} sx={{ color: '#3b82f6' }}>
                    <Download />
                  </IconButton>
                </Box>
              </Paper>
            </Box>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}

export default AudioGeneratorDialog