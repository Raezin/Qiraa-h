// src/services/gradingEngine.js

/**
 * Main function to analyze recitation
 * Uses sliding window algorithm to find best word matches
 */
export const analyzeRecitation = (userTranscription, expectedText) => {
  console.log('=== Grading Engine Started (Improved) ===')
  
  // Clean and prepare texts
  const cleanUserText = cleanText(userTranscription)
  const cleanExpectedText = cleanText(expectedText)
  
  console.log('User text:', cleanUserText)
  console.log('Expected text:', cleanExpectedText)
  
  // Split into words
  const userWords = cleanUserText.split(/\s+/).filter(w => w.length > 0)
  const expectedWords = cleanExpectedText.split(/\s+/).filter(w => w.length > 0)
  
  console.log(`User words: ${userWords.length}, Expected words: ${expectedWords.length}`)
  
  // Find matches using sliding window algorithm
  const matchResult = findBestMatches(userWords, expectedWords)
  
  // Calculate scores
  const totalWords = matchResult.totalMatched
  const correctWords = matchResult.correctMatches
  const score = totalWords > 0 ? (correctWords / totalWords) * 100 : 0
  
  // Calculate points
  let points = 0
  if (score >= 75) points = 1
  else if (score >= 50) points = 0.5
  else points = 0
  
  // Generate errors for display
  const errors = generateErrors(matchResult.matches, userWords, expectedWords)
  
  // Calculate detailed scores
  const detailedScores = calculateDetailedScores(errors, score)
  
  console.log(`Final Score: ${Math.round(score)}%, Points: ${points}`)
  console.log(`Matched: ${correctWords}/${totalWords} words`)
  
  return {
    score: score,
    matchPercentage: score,
    points: points,
    accuracy: score,
    tajweedScore: Math.max(0, score - 5),
    errors: errors,
    detailedScores: detailedScores,
    perAyahResults: [], // Will be populated if needed
    ayahCount: 1,
    userTranscription: userTranscription,
    expectedText: expectedText,
  }
}

/**
 * Clean text by removing diacritics and normalizing
 */
const cleanText = (text) => {
  if (!text) return ''
  
  return text
    .replace(/[ًٌٍَُِّْٰٓٔ]/g, '') // Remove diacritics
    .replace(/[اأإآ]/g, 'ا') // Normalize Alef
    .replace(/[ؤ]/g, 'و') // Normalize Waw
    .replace(/[ئ]/g, 'ي') // Normalize Ya
    .replace(/[ة]/g, 'ه') // Normalize Ta Marbuta
    .replace(/[ۖۗۘۙۛۜ۝۞]/g, '') // Remove other markers
    .replace(/[0-9]/g, '') // Remove numbers
    .trim()
}

/**
 * Calculate similarity between two words
 */
const calculateWordSimilarity = (word1, word2) => {
  if (!word1 || !word2) return 0
  if (word1 === word2) return 100
  
  // Calculate character-level similarity
  const maxLen = Math.max(word1.length, word2.length)
  if (maxLen === 0) return 0
  
  let matches = 0
  const minLen = Math.min(word1.length, word2.length)
  
  for (let i = 0; i < minLen; i++) {
    if (word1[i] === word2[i]) matches++
  }
  
  // Also check for transposition (common in Arabic)
  if (matches < minLen) {
    const word1Rev = word1.split('').reverse().join('')
    for (let i = 0; i < Math.min(word1Rev.length, word2.length); i++) {
      if (word1Rev[i] === word2[i]) matches += 0.5
    }
  }
  
  return (matches / maxLen) * 100
}

/**
 * Find best matches using sliding window algorithm
 */
const findBestMatches = (userWords, expectedWords) => {
  const matches = []
  let userIndex = 0
  let expectedIndex = 0
  
  while (userIndex < userWords.length && expectedIndex < expectedWords.length) {
    const userWord = userWords[userIndex]
    const expectedWord = expectedWords[expectedIndex]
    const similarity = calculateWordSimilarity(userWord, expectedWord)
    
    if (similarity >= 50) {
      // Good match found
      matches.push({
        userWord: userWord,
        expectedWord: expectedWord,
        similarity: similarity,
        userIndex: userIndex,
        expectedIndex: expectedIndex,
        isMatch: true
      })
      userIndex++
      expectedIndex++
    } else {
      // Try to find if this user word matches any future expected word
      let foundMatch = false
      let lookAheadLimit = Math.min(3, expectedWords.length - expectedIndex)
      
      for (let i = 1; i <= lookAheadLimit; i++) {
        const futureExpected = expectedWords[expectedIndex + i]
        if (futureExpected) {
          const futureSimilarity = calculateWordSimilarity(userWord, futureExpected)
          if (futureSimilarity >= 50) {
            // Mark skipped words as missing
            for (let j = 0; j < i; j++) {
              matches.push({
                userWord: '[missing]',
                expectedWord: expectedWords[expectedIndex + j],
                similarity: 0,
                userIndex: userIndex,
                expectedIndex: expectedIndex + j,
                isMatch: false
              })
            }
            // Add the found match
            matches.push({
              userWord: userWord,
              expectedWord: futureExpected,
              similarity: futureSimilarity,
              userIndex: userIndex,
              expectedIndex: expectedIndex + i,
              isMatch: true
            })
            userIndex++
            expectedIndex += i + 1
            foundMatch = true
            break
          }
        }
      }
      
      if (!foundMatch) {
        // No match found, mark user word as extra
        matches.push({
          userWord: userWord,
          expectedWord: '[extra]',
          similarity: 0,
          userIndex: userIndex,
          expectedIndex: expectedIndex,
          isMatch: false
        })
        userIndex++
      }
    }
  }
  
  // Handle any remaining expected words (missing at the end)
  while (expectedIndex < expectedWords.length) {
    matches.push({
      userWord: '[missing]',
      expectedWord: expectedWords[expectedIndex],
      similarity: 0,
      userIndex: userIndex,
      expectedIndex: expectedIndex,
      isMatch: false
    })
    expectedIndex++
  }
  
  // Handle any remaining user words (extra at the end)
  while (userIndex < userWords.length) {
    matches.push({
      userWord: userWords[userIndex],
      expectedWord: '[extra]',
      similarity: 0,
      userIndex: userIndex,
      expectedIndex: expectedIndex,
      isMatch: false
    })
    userIndex++
  }
  
  // Count correct matches (ignoring words with similarity < 50 that aren't exact)
  let correctMatches = 0
  let totalMatched = 0
  
  for (const match of matches) {
    if (match.expectedWord !== '[extra]' && match.userWord !== '[missing]') {
      totalMatched++
      if (match.similarity >= 70) {
        correctMatches++
      } else if (match.similarity >= 50) {
        correctMatches += 0.5
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
 * Generate errors for display
 */
const generateErrors = (matches, userWords, expectedWords) => {
  const errors = []
  
  for (let i = 0; i < matches.length; i++) {
    const match = matches[i]
    
    if (match.userWord === '[missing]') {
      errors.push({
        word: match.expectedWord,
        position: i + 1,
        expected: match.expectedWord,
        actual: '[missing]',
        wordMatchPercent: 0,
        suggestion: `Word "${match.expectedWord}" is missing.`,
        rule: 'Missing Word',
      })
    } else if (match.expectedWord === '[extra]') {
      errors.push({
        word: '[extra]',
        position: i + 1,
        expected: '',
        actual: match.userWord,
        wordMatchPercent: 0,
        suggestion: `Extra word "${match.userWord}" detected. Remove it.`,
        rule: 'Extra Word',
      })
    } else if (match.similarity < 70 && match.similarity >= 50) {
      errors.push({
        word: match.expectedWord,
        position: i + 1,
        expected: match.expectedWord,
        actual: match.userWord,
        wordMatchPercent: Math.round(match.similarity),
        suggestion: generateSuggestion(match.expectedWord, match.userWord, match.similarity),
        rule: identifyTajweedRule(match.expectedWord),
      })
    } else if (match.similarity < 50) {
      errors.push({
        word: match.expectedWord,
        position: i + 1,
        expected: match.expectedWord,
        actual: match.userWord,
        wordMatchPercent: Math.round(match.similarity),
        suggestion: generateSuggestion(match.expectedWord, match.userWord, match.similarity),
        rule: identifyTajweedRule(match.expectedWord),
      })
    }
  }
  
  return errors.slice(0, 15)
}

/**
 * Calculate detailed scores based on errors and overall score
 */
const calculateDetailedScores = (errors, overallScore) => {
  const errorCount = errors.length
  const deduction = Math.min(errorCount * 3, 25)
  
  return {
    makharij: Math.max(0, overallScore - deduction),
    sifaat: Math.max(0, overallScore - deduction + 5),
    ghunnah: Math.max(0, overallScore - deduction + 10),
    madd: Math.max(0, overallScore - deduction + 8),
    qalqalah: Math.max(0, overallScore - deduction + 12),
  }
}

/**
 * Generate suggestion for correction
 */
const generateSuggestion = (expected, actual, similarity) => {
  if (actual === '[missing]') {
    return `Word "${expected}" is missing. Listen carefully to the recitation.`
  }
  if (expected === '[extra]') {
    return `Extra word detected. Focus on the exact verse.`
  }
  
  if (similarity < 30) {
    return `The word "${expected}" needs significant improvement. Practice its pronunciation.`
  } else if (similarity < 70) {
    return `The word "${expected}" needs some improvement. Pay attention to the letters.`
  } else {
    return `Small improvement needed for "${expected}". Almost there!`
  }
}

/**
 * Identify Tajweed rule
 */
const identifyTajweedRule = (word) => {
  const tajweedPatterns = {
    'اللَّهُ': 'Laam Jalalah',
    'الرَّحْمَٰنِ': 'Madd Lazim',
    'الرَّحِيمِ': 'Madd Lazim',
    'مَالِكِ': 'Madd Arid',
    'يَوْمِ': 'Idgham',
    'الدِّينِ': 'Shaddah',
    'إِيَّاكَ': 'Madd Munfasil',
    'نَعْبُدُ': 'Qalqalah',
    'نَسْتَعِينُ': 'Idgham without Ghunnah',
  }
  
  const normalizedWord = cleanText(word)
  
  for (const [pattern, rule] of Object.entries(tajweedPatterns)) {
    if (normalizedWord.includes(cleanText(pattern)) || cleanText(pattern).includes(normalizedWord)) {
      return rule
    }
  }
  return 'General Pronunciation'
}

export const getScoreDescription = (points) => {
  if (points === 1) return 'Excellent - Perfect recitation!'
  if (points === 0.5) return 'Good - Some improvements needed'
  return 'Needs Practice - Review the correct pronunciation'
}