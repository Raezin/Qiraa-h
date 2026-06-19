// src/components/EvaluationResults.jsx

import React, { useState } from 'react'
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
  Tooltip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,        // Add this
  Grid,         // Add this
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
  TrendingUp,
  Science,
  School,
  EmojiEvents,
} from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'

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
  const [expandedAyah, setExpandedAyah] = useState(null)

  const getScoreColor = (score) => {
    if (score >= 85) return '#22c55e'
    if (score >= 70) return '#f59e0b'
    if (score >= 50) return '#f97316'
    return '#ef4444'
  }

  const getScoreMessage = (score) => {
    if (score >= 85) return 'Excellent! You did great!'
    if (score >= 70) return 'Good effort! Keep practicing!'
    if (score >= 50) return 'Keep going! You can do better!'
    return 'Needs practice. Review the correct pronunciation.'
  }

  const getScoreGrade = (score) => {
    if (score >= 90) return 'A+'
    if (score >= 85) return 'A'
    if (score >= 80) return 'B+'
    if (score >= 75) return 'B'
    if (score >= 70) return 'C+'
    if (score >= 60) return 'C'
    if (score >= 50) return 'D'
    return 'F'
  }

  /**
   * Clean text for comparison
   */
  const cleanText = (text) => {
    if (!text) return ''
    return text
      .replace(/[ًٌٍَُِّْٰٓٔ]/g, '')
      .replace(/[اأإآ]/g, 'ا')
      .replace(/[ؤ]/g, 'و')
      .replace(/[ئ]/g, 'ي')
      .replace(/[ة]/g, 'ه')
      .trim()
  }

  /**
   * Get status icon based on match status
   */
  const getStatusIcon = (status, similarity) => {
    if (status === 'exact' || similarity >= 85) {
      return <CheckCircle sx={{ fontSize: 14, color: '#22c55e' }} />
    }
    if (status === 'good' || similarity >= 70) {
      return <CheckCircle sx={{ fontSize: 14, color: '#84cc16' }} />
    }
    if (status === 'partial' || similarity >= 50) {
      return <Warning sx={{ fontSize: 14, color: '#f59e0b' }} />
    }
    if (status === 'missing') {
      return <ErrorIcon sx={{ fontSize: 14, color: '#ef4444' }} />
    }
    if (status === 'extra') {
      return <ErrorIcon sx={{ fontSize: 14, color: '#f97316' }} />
    }
    return <ErrorIcon sx={{ fontSize: 14, color: '#ef4444' }} />
  }

  /**
   * Get background color based on match status
   */
  const getWordBackground = (status, similarity) => {
    if (status === 'exact' || similarity >= 85) {
      return alpha('#22c55e', 0.15)
    }
    if (status === 'good' || similarity >= 70) {
      return alpha('#84cc16', 0.12)
    }
    if (status === 'partial' || similarity >= 50) {
      return alpha('#f59e0b', 0.12)
    }
    if (status === 'missing') {
      return alpha('#ef4444', 0.12)
    }
    if (status === 'extra') {
      return alpha('#f97316', 0.1)
    }
    return alpha('#ef4444', 0.1)
  }

  /**
   * Get text color based on match status
   */
  const getWordTextColor = (status, similarity) => {
    if (status === 'exact' || similarity >= 85) return '#166534'
    if (status === 'good' || similarity >= 70) return '#3f6212'
    if (status === 'partial' || similarity >= 50) return '#78350f'
    if (status === 'missing') return '#991b1b'
    if (status === 'extra') return '#9a3412'
    return '#991b1b'
  }

  /**
   * Highlight individual ayah words with match information
   */
  const highlightAyahWords = (userAyah, expectedAyah, ayahNumber, matchesData) => {
    if (!expectedAyah) {
      return <span style={{ color: '#ef4444' }}>No reference text</span>
    }

    if (!userAyah || userAyah.trim().length === 0) {
      return <span style={{ color: '#ef4444' }}>No recitation detected for this ayah</span>
    }

    // Clean the texts for comparison
    const cleanExpected = cleanText(expectedAyah)
    const cleanUser = cleanText(userAyah)
    
    // Split into words
    const expectedWords = cleanExpected.split(/\s+/).filter(w => w.length > 0)
    const userWords = cleanUser.split(/\s+/).filter(w => w.length > 0)
    
    // Create a map of matches from matchesData
    const matchMap = new Map()
    if (matchesData && matchesData.length) {
      matchesData.forEach(match => {
        if (match.expectedWord && match.expectedWord !== '[extra]') {
          matchMap.set(match.expectedWord, {
            similarity: match.similarity || 0,
            userWord: match.userWord,
            status: match.status || 'incorrect',
            isMatch: match.isMatch
          })
        }
      })
    }

    const highlightedWords = []
    
    // For expected words, show their match status
    for (let i = 0; i < expectedWords.length; i++) {
      const expectedWord = expectedWords[i]
      const matchInfo = matchMap.get(expectedWord)
      const userWord = matchInfo?.userWord || userWords[i] || '[missing]'
      const similarity = matchInfo?.similarity || 0
      const status = matchInfo?.status || (similarity >= 70 ? 'good' : 'incorrect')
      
      const isMissing = userWord === '[missing]' || !userWord
      const backgroundColor = getWordBackground(status, similarity)
      const textColor = getWordTextColor(status, similarity)
      const showCorrection = similarity < 85 && !isMissing && status !== 'exact'
      
      highlightedWords.push(
        <Tooltip
          key={i}
          title={
            <Box sx={{ p: 0.5 }}>
              <Typography variant="caption" display="block" sx={{ fontWeight: 'bold' }}>
                Match: {Math.round(similarity)}%
              </Typography>
              {showCorrection && (
                <Typography variant="caption" display="block" sx={{ color: '#22c55e' }}>
                  Correct: {expectedWord}
                </Typography>
              )}
              {similarity < 70 && similarity > 0 && (
                <Typography variant="caption" display="block" sx={{ color: '#f59e0b' }}>
                  You said: {userWord}
                </Typography>
              )}
            </Box>
          }
          arrow
          placement="top"
        >
          <Box
            component="span"
            sx={{
              display: 'inline-flex',
              flexDirection: 'column',
              marginRight: '8px',
              marginBottom: '6px',
              padding: '4px 10px',
              backgroundColor: backgroundColor,
              borderRadius: '8px',
              transition: 'all 0.2s ease',
              border: similarity >= 85 ? `1px solid ${alpha('#22c55e', 0.3)}` : 'none',
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              },
            }}
          >
            <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <Typography
                component="span"
                sx={{
                  fontFamily: 'Amiri, Noto Naskh Arabic, serif',
                  fontSize: '1.1rem',
                  color: textColor,
                  textDecoration: isMissing ? 'underline' : 'none',
                  textDecorationColor: '#ef4444',
                  textDecorationThickness: '2px',
                  textDecorationStyle: 'dotted',
                  fontWeight: similarity >= 85 ? 'bold' : 'normal',
                }}
              >
                {isMissing ? `[${expectedWord}]` : userWord}
              </Typography>
              {getStatusIcon(status, similarity)}
            </Box>
            
            {showCorrection && similarity < 85 && similarity >= 50 && (
              <Typography
                component="span"
                sx={{
                  display: 'block',
                  fontSize: '0.65rem',
                  color: '#22c55e',
                  marginTop: '2px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                }}
              >
                ✓ {expectedWord}
              </Typography>
            )}
            
            {similarity < 50 && similarity > 0 && !isMissing && (
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
                Needs improvement
              </Typography>
            )}
            
            {isMissing && (
              <Typography
                component="span"
                sx={{
                  display: 'block',
                  fontSize: '0.65rem',
                  color: '#f59e0b',
                  marginTop: '2px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                }}
              >
                Missing: {expectedWord}
              </Typography>
            )}
            
            {similarity >= 85 && (
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
                Perfect!
              </Typography>
            )}
          </Box>
        </Tooltip>
      )
    }
    
    // Handle extra words (user said words not in expected text)
    if (userWords.length > expectedWords.length) {
      for (let i = expectedWords.length; i < userWords.length; i++) {
        // Check if this extra word was matched to any expected word
        let isMatchedExtra = false
        for (const [_, matchInfo] of matchMap) {
          if (matchInfo.userWord === userWords[i] && matchInfo.similarity > 50) {
            isMatchedExtra = true
            break
          }
        }
        
        if (!isMatchedExtra) {
          highlightedWords.push(
            <Tooltip
              key={`extra-${i}`}
              title="Extra word detected. Focus on reciting only the verse text."
              arrow
              placement="top"
            >
              <Box
                component="span"
                sx={{
                  display: 'inline-flex',
                  flexDirection: 'column',
                  marginRight: '8px',
                  marginBottom: '6px',
                  padding: '4px 10px',
                  backgroundColor: alpha('#ef4444', 0.1),
                  borderRadius: '8px',
                  borderLeft: `3px solid #ef4444`,
                  cursor: 'pointer',
                }}
              >
                <Typography
                  component="span"
                  sx={{
                    fontFamily: 'Amiri, Noto Naskh Arabic, serif',
                    fontSize: '1.1rem',
                    color: '#991b1b',
                    textDecoration: 'line-through',
                    textDecorationColor: '#ef4444',
                    textDecorationThickness: '2px',
                  }}
                >
                  {userWords[i]}
                </Typography>
                <Typography
                  component="span"
                  sx={{
                    display: 'block',
                    fontSize: '0.65rem',
                    color: '#ef4444',
                    marginTop: '2px',
                    textAlign: 'center',
                    fontWeight: 'bold',
                  }}
                >
                  Extra word
                </Typography>
              </Box>
            </Tooltip>
          )
        }
      }
    }
    
    return highlightedWords.length > 0 ? highlightedWords : (
      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
        Unable to process words for this ayah
      </Typography>
    )
  }

  /**
   * Calculate overall statistics
   */
  const calculateStatistics = () => {
    let totalScore = 0
    let totalPerfectWords = 0
    let totalGoodWords = 0
    let totalPartialWords = 0
    let totalMissingWords = 0
    let totalExtraWords = 0
    
    perAyahResults.forEach(result => {
      totalScore += result.score
      
      if (result.wordMatches) {
        result.wordMatches.forEach(match => {
          if (match.status === 'exact' || match.similarity >= 85) totalPerfectWords++
          else if (match.status === 'good' || match.similarity >= 70) totalGoodWords++
          else if (match.status === 'partial' || match.similarity >= 50) totalPartialWords++
          else if (match.userWord === '[missing]') totalMissingWords++
          else if (match.expectedWord === '[extra]') totalExtraWords++
        })
      }
    })
    
    const averageScore = perAyahResults.length > 0 ? totalScore / perAyahResults.length : 0
    const totalWords = totalPerfectWords + totalGoodWords + totalPartialWords + totalMissingWords
    
    return {
      averageScore,
      totalPerfectWords,
      totalGoodWords,
      totalPartialWords,
      totalMissingWords,
      totalExtraWords,
      totalWords,
      accuracy: totalWords > 0 ? ((totalPerfectWords + totalGoodWords) / totalWords) * 100 : 0,
    }
  }

  const stats = calculateStatistics()
  const overallScore = analysisResult?.overallScore || 0
  const scoreColor = getScoreColor(overallScore)

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <Card sx={{ 
        position: 'relative', 
        overflow: 'visible', 
        maxHeight: '85vh', 
        overflowY: 'auto',
        borderRadius: 4,
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: alpha(theme.palette.text.primary, 0.05),
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: alpha(theme.palette.text.primary, 0.2),
          borderRadius: '4px',
        },
      }}>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 10,
            bgcolor: alpha(theme.palette.text.primary, 0.1),
            '&:hover': { bgcolor: alpha(theme.palette.text.primary, 0.2) },
          }}
          size="small"
        >
          <Close />
        </IconButton>

        <CardContent sx={{ p: 4 }}>
          {/* Score Header with Animation */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <Box textAlign="center" mb={4}>
              <Box
                sx={{
                  width: 140,
                  height: 140,
                  mx: 'auto',
                  mb: 2,
                  borderRadius: '50%',
                  background: `conic-gradient(${scoreColor} ${overallScore * 3.6}deg, #e2e8f0 0deg)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  boxShadow: `0 0 20px ${alpha(scoreColor, 0.3)}`,
                }}
              >
                <Box
                  sx={{
                    width: 110,
                    height: 110,
                    borderRadius: '50%',
                    bgcolor: 'background.paper',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  }}
                >
                  <Typography variant="h2" fontWeight="bold" sx={{ color: scoreColor, lineHeight: 1 }}>
                    {Math.round(overallScore)}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                    Grade: {getScoreGrade(overallScore)}
                  </Typography>
                </Box>
              </Box>
              
              <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: scoreColor }}>
                {getScoreMessage(overallScore)}
              </Typography>
              
              <Typography variant="body2" color="text.secondary">
                You recited {analysisResult?.ayahCount || selectedAyahs.length} ayahs • {stats.totalWords} words analyzed
              </Typography>
            </Box>
          </motion.div>

          {/* Statistics Cards */}
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={6} sm={3}>
              <Paper sx={{ p: 2, textAlign: 'center', bgcolor: alpha('#22c55e', 0.05), borderRadius: 2 }}>
                <EmojiEvents sx={{ color: '#22c55e', fontSize: 28, mb: 0.5 }} />
                <Typography variant="h6" fontWeight="bold" sx={{ color: '#22c55e' }}>
                  {stats.totalPerfectWords}
                </Typography>
                <Typography variant="caption" color="text.secondary">Perfect Words</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper sx={{ p: 2, textAlign: 'center', bgcolor: alpha('#84cc16', 0.05), borderRadius: 2 }}>
                <TrendingUp sx={{ color: '#84cc16', fontSize: 28, mb: 0.5 }} />
                <Typography variant="h6" fontWeight="bold" sx={{ color: '#84cc16' }}>
                  {stats.totalGoodWords}
                </Typography>
                <Typography variant="caption" color="text.secondary">Good Words</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper sx={{ p: 2, textAlign: 'center', bgcolor: alpha('#f59e0b', 0.05), borderRadius: 2 }}>
                <Science sx={{ color: '#f59e0b', fontSize: 28, mb: 0.5 }} />
                <Typography variant="h6" fontWeight="bold" sx={{ color: '#f59e0b' }}>
                  {stats.totalPartialWords}
                </Typography>
                <Typography variant="caption" color="text.secondary">Needs Work</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper sx={{ p: 2, textAlign: 'center', bgcolor: alpha('#ef4444', 0.05), borderRadius: 2 }}>
                <School sx={{ color: '#ef4444', fontSize: 28, mb: 0.5 }} />
                <Typography variant="h6" fontWeight="bold" sx={{ color: '#ef4444' }}>
                  {stats.totalMissingWords + stats.totalExtraWords}
                </Typography>
                <Typography variant="caption" color="text.secondary">Errors</Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Per Ayah Performance */}
          <Box mb={4}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrendingUp sx={{ fontSize: 20 }} />
              Per Ayah Performance
            </Typography>
            <Box display="flex" gap={1.5} flexWrap="wrap" justifyContent="center">
              {perAyahResults.map((result, idx) => (
                <Chip
                  key={idx}
                  label={`Ayah ${result.ayahNo}: ${Math.round(result.score)}%`}
                  onClick={() => setExpandedAyah(expandedAyah === idx ? null : idx)}
                  sx={{
                    bgcolor: alpha(getScoreColor(result.score), 0.1),
                    color: getScoreColor(result.score),
                    fontWeight: 'bold',
                    fontSize: '0.85rem',
                    py: 2,
                    '&:hover': { transform: 'translateY(-2px)' },
                    transition: 'transform 0.2s',
                    cursor: 'pointer',
                  }}
                  icon={getStatusIcon(result.score >= 85 ? 'exact' : result.score >= 70 ? 'good' : 'partial', result.score)}
                />
              ))}
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Individual Ayah Comparison */}
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Science sx={{ fontSize: 20 }} />
            Word by Word Analysis
          </Typography>

          <AnimatePresence>
            {selectedAyahs.map((ayah, idx) => {
              const ayahResult = perAyahResults[idx]
              const userAyah = ayahResult?.userTranscription || ''
              const ayahScore = ayahResult?.score || 0
              const ayahColor = getScoreColor(ayahScore)
              const isExpanded = expandedAyah === idx

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Paper
                    sx={{
                      mb: 3,
                      p: 2,
                      borderLeft: `4px solid ${ayahColor}`,
                      bgcolor: alpha(ayahColor, 0.02),
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                      },
                    }}
                  >
                    {/* Ayah Header */}
                    <Box 
                      display="flex" 
                      justifyContent="space-between" 
                      alignItems="center" 
                      mb={2}
                      sx={{ cursor: 'pointer' }}
                      onClick={() => setExpandedAyah(isExpanded ? null : idx)}
                    >
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          Ayah {ayah.ayahNo}
                        </Typography>
                        <Chip
                          label={`${Math.round(ayahScore)}%`}
                          size="small"
                          sx={{
                            bgcolor: alpha(ayahColor, 0.15),
                            color: ayahColor,
                            fontWeight: 'bold',
                            fontSize: '0.75rem',
                          }}
                        />
                      </Box>
                      <IconButton size="small">
                        <ExpandMore sx={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
                      </IconButton>
                    </Box>

                    {/* Progress bar for this ayah */}
                    <LinearProgress 
                      variant="determinate" 
                      value={ayahScore} 
                      sx={{ 
                        mb: 2, 
                        height: 6, 
                        borderRadius: 3,
                        bgcolor: alpha(ayahColor, 0.2),
                        '& .MuiLinearProgress-bar': {
                          bgcolor: ayahColor,
                          borderRadius: 3,
                        }
                      }} 
                    />

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {/* User's Recitation for this Ayah */}
                          <Box mb={3}>
                            <Typography variant="caption" color="text.secondary" display="block" gutterBottom sx={{ fontWeight: 'bold' }}>
                              🎙️ Your Recitation:
                            </Typography>
                            <Paper
                              sx={{
                                p: 2.5,
                                bgcolor: alpha(theme.palette.background.default, 0.5),
                                borderRadius: 2,
                                fontFamily: 'Amiri, Noto Naskh Arabic, serif',
                                fontSize: '1rem',
                                lineHeight: 2,
                                direction: 'rtl',
                                textAlign: 'right',
                                minHeight: 100,
                                display: 'flex',
                                flexWrap: 'wrap',
                                alignItems: 'center',
                              }}
                            >
                              {highlightAyahWords(userAyah, ayah.text, ayah.ayahNo, ayahResult?.wordMatches)}
                            </Paper>
                          </Box>

                          {/* Correct Reference for this Ayah */}
                          <Box>
                            <Typography variant="caption" color="text.secondary" display="block" gutterBottom sx={{ fontWeight: 'bold' }}>
                              📖 Correct Recitation:
                            </Typography>
                            <Paper
                              sx={{
                                p: 2.5,
                                bgcolor: alpha('#22c55e', 0.03),
                                borderRadius: 2,
                                fontFamily: 'Amiri, Noto Naskh Arabic, serif',
                                fontSize: '1rem',
                                lineHeight: 2,
                                direction: 'rtl',
                                textAlign: 'right',
                                border: `1px solid ${alpha('#22c55e', 0.2)}`,
                              }}
                            >
                              <sup style={{ fontSize: '0.7rem', color: '#22c55e', marginRight: '4px', fontWeight: 'bold' }}>{ayah.ayahNo}</sup>
                              {ayah.text}
                            </Paper>
                          </Box>

                          {/* Errors for this ayah */}
                          {ayahResult?.errors && ayahResult.errors.length > 0 && (
                            <Box mt={2}>
                              <Typography variant="caption" color="text.secondary" display="block" gutterBottom sx={{ fontWeight: 'bold' }}>
                                ⚠️ Suggestions for Improvement:
                              </Typography>
                              <Stack spacing={1}>
                                {ayahResult.errors.slice(0, 5).map((error, errIdx) => (
                                  <Paper
                                    key={errIdx}
                                    sx={{
                                      p: 1.5,
                                      bgcolor: alpha('#ef4444', 0.05),
                                      borderRadius: 1,
                                      borderLeft: `3px solid ${error.severity === 'high' ? '#ef4444' : '#f59e0b'}`,
                                    }}
                                  >
                                    <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                                      <strong>{error.word}:</strong> {error.suggestion}
                                    </Typography>
                                  </Paper>
                                ))}
                              </Stack>
                            </Box>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Paper>
                </motion.div>
              )
            })}
          </AnimatePresence>

          <Divider sx={{ my: 3 }} />

          {/* Whisper API Response (Collapsible) */}
          <Accordion 
            sx={{ 
              mb: 3, 
              bgcolor: alpha('#3b82f6', 0.02),
              '&:before': { display: 'none' },
              borderRadius: 2,
            }}
            elevation={0}
          >
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box display="flex" alignItems="center" gap={1}>
                <Api sx={{ color: '#3b82f6', fontSize: 20 }} />
                <Typography variant="body2" fontWeight="bold">Raw Transcription</Typography>
                <Chip label="Whisper API Output" size="small" variant="outlined" />
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Paper sx={{ p: 2, bgcolor: alpha('#000', 0.02), borderRadius: 1 }}>
                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                  Complete Transcription from Whisper Model:
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontFamily: 'monospace', 
                    wordBreak: 'break-all',
                    bgcolor: alpha('#000', 0.02),
                    p: 1.5,
                    borderRadius: 1,
                    fontSize: '0.8rem',
                  }}
                >
                  {rawTranscription || 'No transcription available'}
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