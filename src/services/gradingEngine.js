// src/services/gradingEngine.js

/**
 * Clean text by removing diacritics and normalizing Arabic letters
 */
const cleanText = (text) => {
  if (!text) return ''
  
  return text
    .replace(/[ًٌٍَُِّْٰٓٔ]/g, '') // Remove diacritics
    .replace(/[اأإآ]/g, 'ا') // Normalize Alef
    .replace(/[ؤ]/g, 'و') // Normalize Waw
    .replace(/[ئ]/g, 'ي') // Normalize Ya
    .replace(/[ة]/g, 'ه') // Normalize Ta Marbuta
    .replace(/[ۖۗۘۙۛۜ۝۞]/g, '') // Remove Quranic markers
    .replace(/[0-9]/g, '') // Remove numbers
    .replace(/[^\u0600-\u06FF\s]/g, '') // Keep only Arabic chars and spaces
    .trim()
}

/**
 * Calculate similarity between two words (0-100)
 * Uses Levenshtein distance and character matching
 */
const calculateWordSimilarity = (word1, word2) => {
  if (!word1 || !word2) return 0
  if (word1 === word2) return 100
  
  // Calculate character-level similarity
  const maxLen = Math.max(word1.length, word2.length)
  if (maxLen === 0) return 0
  
  let matches = 0
  const minLen = Math.min(word1.length, word2.length)
  
  // Count matching characters in sequence
  for (let i = 0; i < minLen; i++) {
    if (word1[i] === word2[i]) matches++
  }
  
  // Calculate base similarity
  let similarity = (matches / maxLen) * 100
  
  // Bonus for same length
  if (word1.length === word2.length && similarity > 50) {
    similarity += 10
  }
  
  // Penalty for large length difference
  const lengthDiff = Math.abs(word1.length - word2.length)
  if (lengthDiff > 2) {
    similarity -= lengthDiff * 5
  }
  
  return Math.min(100, Math.max(0, similarity))
}

/**
 * Find best matches using sliding window algorithm with look-ahead
 */
const findBestMatches = (userWords, expectedWords) => {
  const matches = []
  let userIndex = 0
  let expectedIndex = 0
  
  while (userIndex < userWords.length || expectedIndex < expectedWords.length) {
    // If both indices are within bounds
    if (userIndex < userWords.length && expectedIndex < expectedWords.length) {
      const userWord = userWords[userIndex]
      const expectedWord = expectedWords[expectedIndex]
      const similarity = calculateWordSimilarity(userWord, expectedWord)
      
      if (similarity >= 60) {
        // Good match found
        matches.push({
          userWord: userWord,
          expectedWord: expectedWord,
          similarity: similarity,
          userIndex: userIndex,
          expectedIndex: expectedIndex,
          isMatch: true,
          status: similarity >= 85 ? 'exact' : similarity >= 70 ? 'good' : 'partial'
        })
        userIndex++
        expectedIndex++
      } 
      else {
        // Try to find match with look-ahead
        let foundMatch = false
        const lookAheadLimit = Math.min(3, expectedWords.length - expectedIndex)
        
        // Look ahead in expected words (user missed some words)
        for (let i = 1; i <= lookAheadLimit; i++) {
          const futureExpected = expectedWords[expectedIndex + i]
          if (futureExpected) {
            const futureSimilarity = calculateWordSimilarity(userWord, futureExpected)
            if (futureSimilarity >= 60) {
              // Mark skipped expected words as missing
              for (let j = 0; j < i; j++) {
                matches.push({
                  userWord: '[missing]',
                  expectedWord: expectedWords[expectedIndex + j],
                  similarity: 0,
                  userIndex: userIndex,
                  expectedIndex: expectedIndex + j,
                  isMatch: false,
                  status: 'missing'
                })
              }
              // Add the found match
              matches.push({
                userWord: userWord,
                expectedWord: futureExpected,
                similarity: futureSimilarity,
                userIndex: userIndex,
                expectedIndex: expectedIndex + i,
                isMatch: true,
                status: futureSimilarity >= 85 ? 'exact' : futureSimilarity >= 70 ? 'good' : 'partial'
              })
              userIndex++
              expectedIndex += i + 1
              foundMatch = true
              break
            }
          }
        }
        
        // Look ahead in user words (user added extra words)
        if (!foundMatch) {
          const userLookAheadLimit = Math.min(2, userWords.length - userIndex)
          for (let i = 1; i <= userLookAheadLimit; i++) {
            const futureUser = userWords[userIndex + i]
            if (futureUser) {
              const futureSimilarity = calculateWordSimilarity(futureUser, expectedWord)
              if (futureSimilarity >= 60) {
                // Mark current user word as extra
                matches.push({
                  userWord: userWord,
                  expectedWord: '[extra]',
                  similarity: 0,
                  userIndex: userIndex,
                  expectedIndex: expectedIndex,
                  isMatch: false,
                  status: 'extra'
                })
                userIndex++
                // The next iteration will handle the match
                foundMatch = true
                break
              }
            }
          }
        }
        
        if (!foundMatch) {
          // No match found - current user word is incorrect
          matches.push({
            userWord: userWord,
            expectedWord: expectedWord,
            similarity: similarity,
            userIndex: userIndex,
            expectedIndex: expectedIndex,
            isMatch: false,
            status: 'incorrect'
          })
          userIndex++
          expectedIndex++
        }
      }
    }
    // Handle remaining expected words (missing at the end)
    else if (expectedIndex < expectedWords.length) {
      matches.push({
        userWord: '[missing]',
        expectedWord: expectedWords[expectedIndex],
        similarity: 0,
        userIndex: userIndex,
        expectedIndex: expectedIndex,
        isMatch: false,
        status: 'missing'
      })
      expectedIndex++
    }
    // Handle remaining user words (extra at the end)
    else if (userIndex < userWords.length) {
      matches.push({
        userWord: userWords[userIndex],
        expectedWord: '[extra]',
        similarity: 0,
        userIndex: userIndex,
        expectedIndex: expectedIndex,
        isMatch: false,
        status: 'extra'
      })
      userIndex++
    }
  }
  
  // Count correct matches with weighted scoring
  let correctMatches = 0
  let totalMatched = 0
  
  for (const match of matches) {
    if (match.expectedWord !== '[extra]' && match.userWord !== '[missing]') {
      totalMatched++
      if (match.similarity >= 85) {
        correctMatches += 1 // Perfect match
      } else if (match.similarity >= 70) {
        correctMatches += 0.8 // Good match
      } else if (match.similarity >= 60) {
        correctMatches += 0.6 // Partial match
      }
    }
  }
  
  return {
    matches: matches,
    correctMatches: correctMatches,
    totalMatched: totalMatched
  }
}

/**
 * Generate detailed errors for display and feedback
 */
const generateErrors = (matches, userWords, expectedWords) => {
  const errors = []
  
  for (let i = 0; i < matches.length; i++) {
    const match = matches[i]
    
    if (match.userWord === '[missing]') {
      errors.push({
        word: match.expectedWord,
        position: match.expectedIndex + 1,
        expected: match.expectedWord,
        actual: '[missing]',
        wordMatchPercent: 0,
        suggestion: `Word "${match.expectedWord}" is missing. Listen carefully and try to pronounce it clearly.`,
        rule: 'Missing Word',
        severity: 'high',
      })
    } 
    else if (match.expectedWord === '[extra]') {
      errors.push({
        word: '[extra]',
        position: match.userIndex + 1,
        expected: '',
        actual: match.userWord,
        wordMatchPercent: 0,
        suggestion: `Extra word "${match.userWord}" detected. Focus on reciting only the verse text.`,
        rule: 'Extra Word',
        severity: 'medium',
      })
    } 
    else if (match.similarity < 60) {
      errors.push({
        word: match.expectedWord,
        position: match.expectedIndex + 1,
        expected: match.expectedWord,
        actual: match.userWord,
        wordMatchPercent: Math.round(match.similarity),
        suggestion: generateSuggestion(match.expectedWord, match.userWord, match.similarity),
        rule: identifyTajweedRule(match.expectedWord),
        severity: match.similarity < 30 ? 'high' : 'medium',
      })
    }
    else if (match.similarity < 85 && match.similarity >= 60) {
      errors.push({
        word: match.expectedWord,
        position: match.expectedIndex + 1,
        expected: match.expectedWord,
        actual: match.userWord,
        wordMatchPercent: Math.round(match.similarity),
        suggestion: `"${match.expectedWord}" needs improvement. You said "${match.userWord}". Focus on the correct pronunciation.`,
        rule: identifyTajweedRule(match.expectedWord),
        severity: 'low',
      })
    }
  }
  
  return errors.slice(0, 20) // Limit to 20 errors
}

/**
 * Calculate detailed scores for different Tajweed aspects
 */
const calculateDetailedScores = (errors, overallScore) => {
  const highSeverityErrors = errors.filter(e => e.severity === 'high').length
  const mediumSeverityErrors = errors.filter(e => e.severity === 'medium').length
  const lowSeverityErrors = errors.filter(e => e.severity === 'low').length
  
  const deduction = Math.min((highSeverityErrors * 5) + (mediumSeverityErrors * 3) + (lowSeverityErrors * 1), 30)
  
  return {
    makharij: Math.max(0, Math.min(100, overallScore - (deduction * 0.4))),
    sifaat: Math.max(0, Math.min(100, overallScore - (deduction * 0.3))),
    ghunnah: Math.max(0, Math.min(100, overallScore - (deduction * 0.2))),
    madd: Math.max(0, Math.min(100, overallScore - (deduction * 0.25))),
    qalqalah: Math.max(0, Math.min(100, overallScore - (deduction * 0.15))),
  }
}

/**
 * Generate suggestion for correction
 */
const generateSuggestion = (expected, actual, similarity) => {
  if (actual === '[missing]') {
    return `Word "${expected}" is missing. Listen carefully to the recitation and try to pronounce it.`
  }
  if (expected === '[extra]') {
    return `Extra word detected. Focus on reciting the exact verse without adding words.`
  }
  
  if (similarity < 30) {
    return `The word "${expected}" needs significant improvement. Listen to the correct pronunciation and practice slowly.`
  } else if (similarity < 60) {
    return `The word "${expected}" needs improvement. You said "${actual}". Focus on the letters and their correct sounds.`
  } else {
    return `Small improvement needed for "${expected}". Almost there! Pay attention to the subtle differences.`
  }
}

/**
 * Identify Tajweed rule based on word patterns
 */
const identifyTajweedRule = (word) => {
  const tajweedPatterns = [
    { pattern: 'اللَّه', rule: 'Laam Jalalah (pronounce Allah with heavy Laam)' },
    { pattern: 'الرَّحْمَٰن', rule: 'Madd Lazim (necessary prolongation)' },
    { pattern: 'الرَّحِيم', rule: 'Madd Lazim (necessary prolongation)' },
    { pattern: 'مَالِك', rule: 'Madd Arid (temporary prolongation)' },
    { pattern: 'يَوْم', rule: 'Idgham (merging of letters)' },
    { pattern: 'الدِّين', rule: 'Shaddah (emphasis on doubled letter)' },
    { pattern: 'إِيَّاك', rule: 'Madd Munfasil (separated prolongation)' },
    { pattern: 'نَعْبُد', rule: 'Qalqalah (echoing sound)' },
    { pattern: 'نَسْتَعِين', rule: 'Idgham without Ghunnah' },
    { pattern: 'اهْدِنَا', rule: 'Madd Badal (exchange prolongation)' },
    { pattern: 'الصِّرَاط', rule: 'Full mouth letter (Tafkheem)' },
    { pattern: 'الَّذِينَ', rule: 'Lam Shamsiyya (sun letter)' },
    { pattern: 'عَلَيْهِمْ', rule: 'Ghunnah (nasalization)' },
    { pattern: 'الْمَغْضُوب', rule: 'Ikhfa (hiding of noon sound)' },
    { pattern: 'الضَّالِّين', rule: 'Idgham with Ghunnah' },
  ]
  
  const normalizedWord = cleanText(word)
  
  for (const { pattern, rule } of tajweedPatterns) {
    if (normalizedWord.includes(cleanText(pattern))) {
      return rule
    }
  }
  
  // Check for common patterns
  if (word.includes('ّ')) return 'Shaddah (emphasis on doubled consonant)'
  if (word.match(/[ضصظط]/)) return 'Full mouth letter (Tafkheem)'
  if (word.match(/[قطجدب]/) && word.charAt(word.length - 1) === 'ْ') return 'Qalqalah (echoing sound)'
  if (word.includes('ان') || word.includes('ين')) return 'Madd Asli (natural prolongation)'
  
  return 'General Pronunciation'
}

/**
 * Get score description based on points
 */
export const getScoreDescription = (points) => {
  if (points === 1) return 'Excellent - Perfect recitation! Great command of Tajweed!'
  if (points === 0.5) return 'Good - Some improvements needed. Keep practicing!'
  return 'Needs Practice - Review the correct pronunciation and try again.'
}

/**
 * Main function to analyze recitation
 * Uses sliding window algorithm to find best word matches
 */
export const analyzeRecitation = (userTranscription, expectedText) => {
  console.log('=== Grading Engine Started ===')
  console.log('User transcription:', userTranscription)
  console.log('Expected text:', expectedText)
  
  // Clean and prepare texts
  const cleanUserText = cleanText(userTranscription)
  const cleanExpectedText = cleanText(expectedText)
  
  console.log('Cleaned user text:', cleanUserText)
  console.log('Cleaned expected text:', cleanExpectedText)
  
  // Split into words
  const userWords = cleanUserText.split(/\s+/).filter(w => w.length > 0)
  const expectedWords = cleanExpectedText.split(/\s+/).filter(w => w.length > 0)
  
  console.log(`User words: ${userWords.length}, Expected words: ${expectedWords.length}`)
  console.log('User words list:', userWords)
  console.log('Expected words list:', expectedWords)
  
  // Find matches using sliding window algorithm
  const matchResult = findBestMatches(userWords, expectedWords)
  
  console.log('Match results:', matchResult.matches)
  
  // Calculate overall score
  const totalWords = matchResult.totalMatched
  const correctWords = matchResult.correctMatches
  const score = totalWords > 0 ? (correctWords / totalWords) * 100 : 0
  
  // Calculate points (for gamification)
  let points = 0
  if (score >= 85) points = 1
  else if (score >= 70) points = 0.5
  else if (score >= 50) points = 0.25
  else points = 0
  
  // Generate errors for display
  const errors = generateErrors(matchResult.matches, userWords, expectedWords)
  
  // Calculate detailed scores
  const detailedScores = calculateDetailedScores(errors, score)
  
  // Calculate accuracy (simplified score)
  const accuracy = score
  
  // Calculate Tajweed score (slightly penalized)
  const tajweedScore = Math.max(0, Math.min(100, score - (errors.length * 2)))
  
  console.log(`Final Score: ${Math.round(score)}%`)
  console.log(`Points: ${points}`)
  console.log(`Correct matches: ${correctWords}/${totalWords} words`)
  console.log(`Errors found: ${errors.length}`)
  
  return {
    score: score,
    matchPercentage: score,
    points: points,
    accuracy: accuracy,
    tajweedScore: tajweedScore,
    errors: errors,
    detailedScores: detailedScores,
    wordMatches: matchResult.matches, // Return detailed word matches for UI
    ayahCount: 1,
    userTranscription: userTranscription,
    expectedText: expectedText,
    summary: {
      totalWords: totalWords,
      correctWords: Math.floor(correctWords),
      missingWords: matchResult.matches.filter(m => m.userWord === '[missing]').length,
      extraWords: matchResult.matches.filter(m => m.expectedWord === '[extra]').length,
      partialMatches: matchResult.matches.filter(m => m.isMatch && m.similarity < 85 && m.similarity >= 60).length,
    }
  }
}

/**
 * Analyze multiple ayahs by splitting into chunks
 */
export const analyzeMultipleAyahs = (userTranscription, expectedAyahs) => {
  const perAyahResults = []
  let currentPosition = 0
  
  for (let i = 0; i < expectedAyahs.length; i++) {
    const ayah = expectedAyahs[i]
    const cleanAyahText = cleanText(ayah.text)
    const cleanFullText = cleanText(userTranscription)
    
    // Try to extract this ayah's portion from the full transcription
    let ayahTranscription = ''
    const ayahStartIndex = cleanFullText.indexOf(cleanAyahText, currentPosition)
    
    if (ayahStartIndex !== -1) {
      ayahTranscription = userTranscription.substring(ayahStartIndex, ayahStartIndex + ayah.text.length)
      currentPosition = ayahStartIndex + ayah.text.length
    } else {
      // If exact match not found, use word-based extraction
      const words = cleanFullText.split(/\s+/)
      const ayahWords = cleanAyahText.split(/\s+/)
      let matchCount = 0
      let bestMatchIndex = -1
      
      for (let j = 0; j <= words.length - ayahWords.length; j++) {
        let matches = 0
        for (let k = 0; k < ayahWords.length && j + k < words.length; k++) {
          if (calculateWordSimilarity(words[j + k], ayahWords[k]) >= 70) {
            matches++
          }
        }
        if (matches > matchCount) {
          matchCount = matches
          bestMatchIndex = j
        }
      }
      
      if (bestMatchIndex !== -1 && matchCount >= ayahWords.length * 0.5) {
        const startPos = userTranscription.split(/\s+/).slice(0, bestMatchIndex).join(' ').length
        const endPos = userTranscription.split(/\s+/).slice(0, bestMatchIndex + ayahWords.length).join(' ').length
        ayahTranscription = userTranscription.substring(startPos, endPos)
      }
    }
    
    // Analyze this ayah
    const result = analyzeRecitation(ayahTranscription || '', ayah.text)
    perAyahResults.push({
      ayahNo: ayah.ayahNo,
      score: result.score,
      points: result.points,
      errors: result.errors,
      wordMatches: result.wordMatches,
      transcription: ayahTranscription
    })
  }
  
  // Calculate overall score
  const overallScore = perAyahResults.reduce((sum, r) => sum + r.score, 0) / perAyahResults.length
  
  return {
    overallScore: overallScore,
    perAyahResults: perAyahResults,
    totalPoints: perAyahResults.reduce((sum, r) => sum + r.points, 0),
    totalErrors: perAyahResults.reduce((sum, r) => sum + r.errors.length, 0)
  }
}