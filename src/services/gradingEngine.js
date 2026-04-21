// src/services/gradingEngine.js

/**
 * Compare user transcription with expected text and generate scores
 * @param {string} userTranscription - User's transcribed recitation
 * @param {string} expectedText - Expected Quranic text
 * @returns {Object} Analysis result with scores and errors
 */
export const analyzeRecitation = (userTranscription, expectedText) => {
  // Direct comparison without normalization
  const userText = userTranscription || '';
  const expected = expectedText || '';
  
  // Calculate exact match percentage
  const matchPercentage = calculateMatchPercentage(userText, expected);
  
  // Calculate points based on match percentage
  // 75-100% match = 1 point
  // 50-75% match = 0.5 points  
  // Below 50% = 0 points
  let points = 0;
  if (matchPercentage >= 75) {
    points = 1;
  } else if (matchPercentage >= 50) {
    points = 0.5;
  } else {
    points = 0;
  }
  
  // Calculate score as percentage for display (points * 100)
  const score = points * 100;
  
  // Generate word-level errors (strict comparison)
  const errors = findStrictErrors(userText, expected);
  
  // Calculate accuracy based on exact character matching
  const accuracy = calculateExactAccuracy(userText, expected);
  
  return {
    score: score,
    matchPercentage: matchPercentage,
    points: points,
    accuracy: accuracy,
    tajweedScore: calculateTajweedScore(errors),
    errors: errors,
    detailedScores: calculateDetailedScores(errors, matchPercentage),
    userTranscription: userTranscription,
    expectedText: expectedText,
  };
};

/**
 * Calculate exact match percentage between two strings
 */
const calculateMatchPercentage = (str1, str2) => {
  if (!str1 || !str2) return 0;
  
  const maxLength = Math.max(str1.length, str2.length);
  if (maxLength === 0) return 100;
  
  let matches = 0;
  const minLength = Math.min(str1.length, str2.length);
  
  for (let i = 0; i < minLength; i++) {
    if (str1[i] === str2[i]) {
      matches++;
    }
  }
  
  return (matches / maxLength) * 100;
};

/**
 * Calculate exact character-by-character accuracy
 */
const calculateExactAccuracy = (userText, expectedText) => {
  if (!userText || !expectedText) return 0;
  
  let correctChars = 0;
  const minLength = Math.min(userText.length, expectedText.length);
  
  for (let i = 0; i < minLength; i++) {
    if (userText[i] === expectedText[i]) {
      correctChars++;
    }
  }
  
  return (correctChars / Math.max(userText.length, expectedText.length)) * 100;
};

/**
 * Find word-level errors with strict comparison
 */
const findStrictErrors = (userText, expectedText) => {
  const errors = [];
  
  // Split into words (keeping Arabic script intact)
  const userWords = userText.split(/\s+/).filter(w => w.length > 0);
  const expectedWords = expectedText.split(/\s+/).filter(w => w.length > 0);
  
  const maxLength = Math.max(userWords.length, expectedWords.length);
  
  for (let i = 0; i < maxLength; i++) {
    const userWord = userWords[i] || '[missing]';
    const expectedWord = expectedWords[i] || '[extra]';
    
    if (userWord !== expectedWord) {
      // Calculate word match percentage for individual word
      let wordMatchPercent = 0;
      const maxWordLen = Math.max(userWord.length, expectedWord.length);
      if (maxWordLen > 0 && userWord !== '[missing]' && expectedWord !== '[extra]') {
        let wordMatches = 0;
        for (let j = 0; j < Math.min(userWord.length, expectedWord.length); j++) {
          if (userWord[j] === expectedWord[j]) wordMatches++;
        }
        wordMatchPercent = (wordMatches / maxWordLen) * 100;
      }
      
      errors.push({
        word: expectedWord,
        position: i + 1,
        expected: expectedWord,
        actual: userWord,
        wordMatchPercent: Math.round(wordMatchPercent),
        suggestion: generateSuggestion(expectedWord, userWord, wordMatchPercent),
        rule: identifyTajweedRule(expectedWord),
      });
    }
  }
  
  return errors;
};

/**
 * Generate suggestion based on word match percentage
 */
const generateSuggestion = (expected, actual, wordMatchPercent) => {
  if (actual === '[missing]') {
    return `Word "${expected}" is missing. Listen to the reference recitation carefully.`;
  }
  if (expected === '[extra]') {
    return `Extra word "${actual}" detected. Focus on the correct verse text.`;
  }
  
  if (wordMatchPercent < 30) {
    return `The word "${expected}" needs significant improvement. Practice its pronunciation with the reference audio.`;
  } else if (wordMatchPercent < 70) {
    return `The word "${expected}" needs some improvement. Pay attention to the letters and their correct articulation.`;
  } else {
    return `Small improvement needed for "${expected}". Focus on the exact pronunciation.`;
  }
};

/**
 * Identify Tajweed rule based on word
 */
const identifyTajweedRule = (word) => {
  const tajweedPatterns = {
    'اللَّهُ': 'Laam Jalalah (Rules of the letter Allah)',
    'الرَّحْمَٰنِ': 'Madd Lazim (Required prolongation)',
    'الرَّحِيمِ': 'Madd Lazim (Required prolongation)',
    'مَالِكِ': 'Madd Arid (Temporary prolongation)',
    'يَوْمِ': 'Idgham (Merging of letters)',
    'الدِّينِ': 'Shaddah (Emphasis on doubled letter)',
    'إِيَّاكَ': 'Madd Munfasil (Separated prolongation)',
    'نَعْبُدُ': 'Qalqalah (Echoing sound)',
    'نَسْتَعِينُ': 'Idgham without Ghunnah',
    'الصِّرَاطَ': 'Heavy letter (Tafkheem)',
  };
  
  // Check for patterns
  for (const [pattern, rule] of Object.entries(tajweedPatterns)) {
    if (word.includes(pattern) || pattern.includes(word)) {
      return rule;
    }
  }
  return 'General Pronunciation';
};

/**
 * Calculate Tajweed score based on errors
 */
const calculateTajweedScore = (errors) => {
  if (errors.length === 0) return 100;
  
  // Each error reduces score by 10 points, minimum 0
  const deduction = Math.min(errors.length * 10, 100);
  return Math.max(0, 100 - deduction);
};

/**
 * Calculate detailed scores based on errors and match percentage
 */
const calculateDetailedScores = (errors, matchPercentage) => {
  // Base scores on match percentage
  const baseScore = matchPercentage;
  
  // Deduct based on error types
  const missingWordsCount = errors.filter(e => e.actual === '[missing]').length;
  const extraWordsCount = errors.filter(e => e.expected === '[extra]').length;
  const mispronouncedCount = errors.length - missingWordsCount - extraWordsCount;
  
  return {
    makharij: Math.max(0, baseScore - (mispronouncedCount * 8)),
    sifaat: Math.max(0, baseScore - (mispronouncedCount * 5)),
    ghunnah: Math.max(0, baseScore - (mispronouncedCount * 3)),
    madd: Math.max(0, baseScore - (mispronouncedCount * 4)),
    qalqalah: Math.max(0, baseScore - (mispronouncedCount * 6)),
  };
};

/**
 * Get score description based on points
 */
export const getScoreDescription = (points) => {
  if (points === 1) return 'Excellent - Perfect recitation!';
  if (points === 0.5) return 'Good - Some improvements needed';
  return 'Needs Practice - Review the correct pronunciation';
};

/**
 * Get letter grade based on percentage
 */
export const getLetterGrade = (percentage) => {
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B';
  if (percentage >= 60) return 'C';
  if (percentage >= 50) return 'D';
  return 'F';
};