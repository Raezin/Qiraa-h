// src/components/EvaluationResults.jsx

import React from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Paper,
  Chip,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  alpha,
  Divider,
} from '@mui/material'
import {
  CheckCircle,
  Api,
  ExpandMore,
  PlayArrow,
  Replay,
  Download,
  Close,
  VolumeUp,
  Warning,
  Error as ErrorIcon,
} from '@mui/icons-material'
import { motion } from 'framer-motion'

const EvaluationResults = ({ 
  analysisResult, 
  perAyahResults, 
  rawTranscription, 
  selectedAyahs,
  onPracticeAgain,
  onPlayRecording,
  onDownloadRecording,
  onGenerateAudio,
  onClose
}) => {
  const theme = useTheme()

  const getScoreColor = (score) => {
    if (score >= 85) return '#22c55e'
    if (score >= 70) return '#f59e0b'
    return '#ef4444'
  }

  const getScoreMessage = (score) => {
    if (score >= 85) return 'Excellent! You did great!'
    if (score >= 70) return 'Good effort! Keep practicing!'
    if (score >= 50) return 'Keep going! You can do better!'
    return 'Needs practice. Review the correct pronunciation.'
  }

  // Get color based on match percentage
  const getMatchColor = (matchPercent) => {
    if (matchPercent >= 75) return { bg: '#22c55e', text: 'white' }
    if (matchPercent >= 50) return { bg: '#f59e0b', text: '#78350f' }
    return { bg: '#ef4444', text: 'white' }
  }

  // Get the user's transcription split into ayahs
  const getUserAyahs = () => {
    if (!rawTranscription) return []
    return rawTranscription.split('ۚ').filter(a => a.trim().length > 0).map(a => a.trim())
  }

  const userAyahs = getUserAyahs()

  // Updated highlighting function based on match percentage
  const highlightAyahWords = (userAyah, expectedAyah, ayahNumber, matchesData) => {
    if (!expectedAyah) {
      return <span style={{ color: '#ef4444' }}>No reference text</span>
    }

    if (!userAyah) {
      return <span style={{ color: '#ef4444' }}>No recitation detected</span>
    }

    // Split into words
    const userWords = userAyah.split(/\s+/).filter(w => w.length > 0)
    const expectedWords = expectedAyah.split(/\s+/).filter(w => w.length > 0)
    
    // Create a map of matches if provided
    const matchMap = new Map()
    if (matchesData && matchesData.length) {
      matchesData.forEach(match => {
        if (match.expectedWord !== '[extra]' && match.userWord !== '[missing]') {
          matchMap.set(match.expectedWord, match.similarity)
        }
      })
    }

    const highlightedWords = []
    
    // For expected words, show their match status
    for (let i = 0; i < expectedWords.length; i++) {
      const expectedWord = expectedWords[i]
      const userWord = userWords[i] || '[missing]'
      
      // Get match percentage if available
      let matchPercent = matchMap.get(expectedWord) || 0
      
      // Calculate simple match if no match data
      if (matchPercent === 0 && userWord !== '[missing]') {
        let matches = 0
        for (let j = 0; j < Math.min(userWord.length, expectedWord.length); j++) {
          if (userWord[j] === expectedWord[j]) matches++
        }
        matchPercent = (matches / Math.max(userWord.length, expectedWord.length)) * 100
      }
      
      const isExactMatch = userWord === expectedWord
      const isMissing = userWord === '[missing]'
      
      let backgroundColor = 'transparent'
      let textColor = 'inherit'
      let showCorrection = false
      let statusIcon = null
      
      if (isExactMatch || matchPercent >= 95) {
        // Perfect match - no styling
        backgroundColor = 'transparent'
        textColor = 'inherit'
        showCorrection = false
      } else if (matchPercent >= 75) {
        // Good match - minimal indication
        backgroundColor = alpha('#22c55e', 0.1)
        textColor = '#166534'
        showCorrection = false
      } else if (matchPercent >= 50) {
        // Needs improvement - orange highlight
        backgroundColor = alpha('#f59e0b', 0.15)
        textColor = '#78350f'
        showCorrection = true
        statusIcon = <Warning sx={{ fontSize: 12, color: '#f59e0b', ml: 0.5 }} />
      } else {
        // Poor match - red highlight
        backgroundColor = alpha('#ef4444', 0.15)
        textColor = '#991b1b'
        showCorrection = true
        statusIcon = <ErrorIcon sx={{ fontSize: 12, color: '#ef4444', ml: 0.5 }} />
      }
      
      if (isMissing) {
        backgroundColor = alpha('#ef4444', 0.15)
        textColor = '#991b1b'
        showCorrection = true
      }
      
      highlightedWords.push(
        <Box
          key={i}
          component="span"
          sx={{
            display: 'inline-block',
            marginRight: '8px',
            marginBottom: '4px',
            padding: '2px 6px',
            backgroundColor: backgroundColor,
            borderRadius: '6px',
            transition: 'all 0.2s ease',
            position: 'relative',
          }}
        >
          <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography
              component="span"
              sx={{
                fontFamily: 'Amiri, Noto Naskh Arabic, serif',
                fontSize: '1rem',
                color: textColor,
                textDecoration: isMissing ? 'underline' : 'none',
                textDecorationColor: '#ef4444',
                textDecorationThickness: '1px',
              }}
            >
              {isMissing ? `[${expectedWord}]` : userWord}
            </Typography>
            {statusIcon}
          </Box>
          {showCorrection && !isMissing && userWord !== '[missing]' && (
            <Typography
              component="span"
              sx={{
                display: 'block',
                fontSize: '0.6rem',
                color: '#22c55e',
                marginTop: '2px',
                textAlign: 'center',
              }}
            >
              ✓ {expectedWord}
            </Typography>
          )}
          {isMissing && (
            <Typography
              component="span"
              sx={{
                display: 'block',
                fontSize: '0.6rem',
                color: '#f59e0b',
                marginTop: '2px',
                textAlign: 'center',
              }}
            >
              Missing
            </Typography>
          )}
        </Box>
      )
    }
    
    // Handle extra words at the end
    if (userWords.length > expectedWords.length) {
      for (let i = expectedWords.length; i < userWords.length; i++) {
        highlightedWords.push(
          <Box
            key={`extra-${i}`}
            component="span"
            sx={{
              display: 'inline-block',
              marginRight: '8px',
              marginBottom: '4px',
              padding: '2px 6px',
              backgroundColor: alpha('#ef4444', 0.1),
              borderRadius: '6px',
              borderLeft: '2px solid #ef4444',
            }}
          >
            <Typography
              component="span"
              sx={{
                fontFamily: 'Amiri, Noto Naskh Arabic, serif',
                fontSize: '1rem',
                color: '#991b1b',
                textDecoration: 'line-through',
              }}
            >
              {userWords[i]}
            </Typography>
            <Typography
              component="span"
              sx={{
                display: 'block',
                fontSize: '0.6rem',
                color: '#ef4444',
                marginTop: '2px',
                textAlign: 'center',
              }}
            >
              Extra
            </Typography>
          </Box>
        )
      }
    }
    
    return highlightedWords
  }

  // Build full text for audio generation
  const fullTextForAudio = selectedAyahs.map(ayah => ayah.text).join(' ')

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <Card sx={{ position: 'relative', overflow: 'visible', maxHeight: '80vh', overflowY: 'auto' }}>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 1,
            bgcolor: alpha(theme.palette.text.primary, 0.1),
            '&:hover': { bgcolor: alpha(theme.palette.text.primary, 0.2) },
          }}
          size="small"
        >
          <Close />
        </IconButton>

        <CardContent sx={{ p: 3 }}>
          {/* Score Header */}
          <Box textAlign="center" mb={4}>
            <Box
              sx={{
                width: 120,
                height: 120,
                mx: 'auto',
                mb: 2,
                borderRadius: '50%',
                background: `conic-gradient(${getScoreColor(analysisResult.overallScore)} ${analysisResult.overallScore * 3.6}deg, #e2e8f0 0deg)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              <Box
                sx={{
                  width: 90,
                  height: 90,
                  borderRadius: '50%',
                  bgcolor: 'background.paper',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                }}
              >
                <Typography variant="h3" fontWeight="bold" sx={{ color: getScoreColor(analysisResult.overallScore) }}>
                  {Math.round(analysisResult.overallScore)}%
                </Typography>
              </Box>
            </Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              {getScoreMessage(analysisResult.overallScore)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              You recited {analysisResult.ayahCount || selectedAyahs.length} ayahs
            </Typography>
          </Box>

          {/* Per Ayah Performance Chips */}
          <Box mb={4} textAlign="center">
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              Per Ayah Performance
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap" justifyContent="center">
              {perAyahResults.map((result, idx) => (
                <Chip
                  key={idx}
                  label={`Ayah ${result.ayahNo || idx + 1}: ${Math.round(result.score)}%`}
                  size="small"
                  sx={{
                    bgcolor: getScoreColor(result.score) === '#22c55e' ? alpha('#22c55e', 0.1) : 
                             getScoreColor(result.score) === '#f59e0b' ? alpha('#f59e0b', 0.1) : 
                             alpha('#ef4444', 0.1),
                    color: getScoreColor(result.score),
                    fontWeight: 'bold',
                  }}
                />
              ))}
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Individual Ayah Comparison */}
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
            Ayah by Ayah Analysis
          </Typography>

          {selectedAyahs.map((ayah, idx) => {
            const ayahResult = perAyahResults[idx]
            const userAyah = userAyahs[idx] || ''
            const ayahScore = ayahResult?.score || 0
            const ayahColor = getScoreColor(ayahScore)

            return (
              <Paper
                key={idx}
                sx={{
                  mb: 3,
                  p: 2,
                  borderLeft: `4px solid ${ayahColor}`,
                  bgcolor: alpha(ayahColor, 0.03),
                }}
              >
                {/* Ayah Header */}
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Ayah {ayah.ayahNo}
                  </Typography>
                  <Chip
                    label={`${Math.round(ayahScore)}%`}
                    size="small"
                    sx={{
                      bgcolor: alpha(ayahColor, 0.1),
                      color: ayahColor,
                      fontWeight: 'bold',
                    }}
                  />
                </Box>

                {/* User's Recitation for this Ayah */}
                <Box mb={2}>
                  <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                    Your Recitation:
                  </Typography>
                  <Paper
                    sx={{
                      p: 2,
                      bgcolor: alpha(theme.palette.background.default, 0.5),
                      borderRadius: 1,
                      fontFamily: 'Amiri, Noto Naskh Arabic, serif',
                      fontSize: '1rem',
                      lineHeight: 1.8,
                      direction: 'rtl',
                      textAlign: 'right',
                      minHeight: 80,
                    }}
                  >
                    {highlightAyahWords(userAyah, ayah.text, ayah.ayahNo, ayahResult?.wordMatches)}
                    {!userAyah && (
                      <span style={{ color: '#ef4444' }}>No recitation detected for this ayah</span>
                    )}
                  </Paper>
                </Box>

                {/* Correct Reference for this Ayah */}
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                    Correct Recitation:
                  </Typography>
                  <Paper
                    sx={{
                      p: 2,
                      bgcolor: alpha('#22c55e', 0.05),
                      borderRadius: 1,
                      fontFamily: 'Amiri, Noto Naskh Arabic, serif',
                      fontSize: '1rem',
                      lineHeight: 1.8,
                      direction: 'rtl',
                      textAlign: 'right',
                      border: `1px solid ${alpha('#22c55e', 0.2)}`,
                    }}
                  >
                    <sup style={{ fontSize: '0.7rem', color: '#22c55e', marginRight: '4px' }}>{ayah.ayahNo}</sup>
                    {ayah.text}
                  </Paper>
                </Box>
              </Paper>
            )
          })}

          <Divider sx={{ my: 3 }} />

          {/* Whisper API Response (Collapsible) */}
          <Accordion 
            sx={{ 
              mb: 3, 
              bgcolor: alpha('#3b82f6', 0.03),
              '&:before': { display: 'none' },
            }}
            elevation={0}
          >
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box display="flex" alignItems="center" gap={1}>
                <Api sx={{ color: '#3b82f6', fontSize: 20 }} />
                <Typography variant="body2" fontWeight="bold">Raw Transcription</Typography>
                <Chip label="Whisper Output" size="small" variant="outlined" />
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Paper sx={{ p: 2, bgcolor: alpha('#000', 0.02) }}>
                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                  Complete Transcription from Whisper Model:
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                  {rawTranscription}
                </Typography>
              </Paper>
            </AccordionDetails>
          </Accordion>

          {/* Action Buttons */}
          <Box display="flex" gap={2} flexWrap="wrap">
            <button
              onClick={onPracticeAgain}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: '#22c55e',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.3s ease',
                minWidth: '120px',
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#16a34a'
                e.target.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#22c55e'
                e.target.style.transform = 'translateY(0)'
              }}
            >
              <Replay sx={{ fontSize: 18 }} />
              Practice Again
            </button>
            
            {onPlayRecording && (
              <button
                onClick={onPlayRecording}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease',
                  minWidth: '120px',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#2563eb'
                  e.target.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#3b82f6'
                  e.target.style.transform = 'translateY(0)'
                }}
              >
                <PlayArrow sx={{ fontSize: 18 }} />
                Play Recording
              </button>
            )}

            {onDownloadRecording && (
              <button
                onClick={onDownloadRecording}
                style={{
                  padding: '12px 16px',
                  backgroundColor: '#64748b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#475569'
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#64748b'
                }}
              >
                <Download sx={{ fontSize: 18 }} />
              </button>
            )}

            {onGenerateAudio && (
              <button
                onClick={onGenerateAudio}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: '#8b5cf6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease',
                  minWidth: '120px',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#7c3aed'
                  e.target.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#8b5cf6'
                  e.target.style.transform = 'translateY(0)'
                }}
              >
                <VolumeUp sx={{ fontSize: 18 }} />
                Generate Audio
              </button>
            )}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default EvaluationResults