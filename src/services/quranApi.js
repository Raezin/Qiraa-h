// src/services/quranApi.js
import quranData from '../data/quran_ayahs.json';

let ayahsCache = null;
let surahsCache = null;

/**
 * Load Quran data from JSON file
 */
const loadQuranData = async () => {
  if (ayahsCache) return ayahsCache;
  
  try {
    // Try to import the JSON file
    const data = await import('../data/quran_ayahs.json');
    ayahsCache = data.default || data;
    console.log(`Loaded ${ayahsCache.length} ayahs from JSON`);
    
    // Build surahs cache
    buildSurahsCache();
    
    return ayahsCache;
  } catch (error) {
    console.error('Error loading Quran data:', error);
    // Return fallback data if JSON not found
    return getFallbackData();
  }
};

/**
 * Build surahs cache from ayahs data
 */
const buildSurahsCache = () => {
  if (!ayahsCache) return;
  
  const surahMap = new Map();
  
  ayahsCache.forEach(ayah => {
    if (!surahMap.has(ayah.surahNumber)) {
      surahMap.set(ayah.surahNumber, {
        number: ayah.surahNumber,
        name: ayah.surahName,
        englishName: ayah.surahNameArabic || ayah.surahName,
        numberOfAyahs: 0,
        firstPage: ayah.page,
        lastPage: ayah.page
      });
    }
    
    const surah = surahMap.get(ayah.surahNumber);
    surah.numberOfAyahs++;
    surah.lastPage = ayah.page;
  });
  
  surahsCache = Array.from(surahMap.values());
  console.log(`Built ${surahsCache.length} surahs from data`);
};

/**
 * Get all surahs
 */
export const getSurahs = async () => {
  await loadQuranData();
  
  if (surahsCache && surahsCache.length > 0) {
    return surahsCache;
  }
  
  // Return fallback surahs
  return [
    { number: 1, name: 'Al-Fatiha', englishName: 'The Opener', numberOfAyahs: 7 },
    { number: 112, name: 'Al-Ikhlas', englishName: 'The Sincerity', numberOfAyahs: 4 },
    { number: 113, name: 'Al-Falaq', englishName: 'The Daybreak', numberOfAyahs: 5 },
    { number: 114, name: 'An-Nas', englishName: 'The Mankind', numberOfAyahs: 6 },
  ];
};

/**
 * Get surah by number
 */
export const getSurahByNumber = async (surahNumber) => {
  const surahs = await getSurahs();
  return surahs.find(s => s.number === parseInt(surahNumber));
};

/**
 * Get all ayahs
 */
export const getAyahs = async (surahNumber = null, limit = 1000) => {
  const ayahs = await loadQuranData();
  
  let filtered = ayahs;
  if (surahNumber) {
    filtered = ayahs.filter(ayah => ayah.surahNumber === parseInt(surahNumber));
  }
  
  return filtered.slice(0, limit).map(ayah => ({
    id: `${ayah.surahNumber}_${ayah.ayahNumber}`,
    surah: ayah.surahName,
    surahNumber: ayah.surahNumber,
    ayahNo: ayah.ayahNumber,
    text: ayah.text,
    translation: '',
    juz: ayah.juz,
    page: ayah.page
  }));
};

/**
 * Get specific ayah by surah and ayah number
 */
export const getAyahByNumber = async (surah, ayahNo) => {
  const ayahs = await loadQuranData();
  
  let surahNumber;
  if (typeof surah === 'string') {
    // Handle surah name (English or Arabic)
    const found = ayahs.find(a => 
      a.surahName === surah || 
      a.surahNameArabic === surah ||
      a.surahName?.toLowerCase() === surah.toLowerCase()
    );
    surahNumber = found?.surahNumber;
  } else {
    surahNumber = parseInt(surah);
  }
  
  const ayah = ayahs.find(a => 
    a.surahNumber === surahNumber && 
    a.ayahNumber === parseInt(ayahNo)
  );
  
  if (!ayah) return null;
  
  return {
    id: `${ayah.surahNumber}_${ayah.ayahNumber}`,
    surah: ayah.surahName,
    surahNumber: ayah.surahNumber,
    ayahNo: ayah.ayahNumber,
    text: ayah.text,
    translation: '',
    juz: ayah.juz,
    page: ayah.page
  };
};

/**
 * Search surahs by name
 */
export const searchSurahs = async (keyword) => {
  const surahs = await getSurahs();
  if (!keyword || keyword.trim() === '') return surahs;
  
  const searchTerm = keyword.toLowerCase();
  return surahs.filter(surah => 
    surah.name?.toLowerCase().includes(searchTerm) ||
    surah.englishName?.toLowerCase().includes(searchTerm)
  );
};

/**
 * Search ayahs by text
 */
export const searchAyahs = async (keyword) => {
  const ayahs = await loadQuranData();
  if (!keyword || keyword.trim() === '') return [];
  
  const searchTerm = keyword.toLowerCase();
  const results = ayahs.filter(ayah => 
    ayah.text.toLowerCase().includes(searchTerm) ||
    ayah.surahName.toLowerCase().includes(searchTerm)
  );
  
  return results.slice(0, 50).map(ayah => ({
    id: `${ayah.surahNumber}_${ayah.ayahNumber}`,
    surah: ayah.surahName,
    surahNumber: ayah.surahNumber,
    ayahNo: ayah.ayahNumber,
    text: ayah.text,
    translation: ''
  }));
};

/**
 * Get total number of ayahs in a surah
 */
export const getTotalAyahsInSurah = async (surahNumber) => {
  const ayahs = await loadQuranData();
  return ayahs.filter(a => a.surahNumber === parseInt(surahNumber)).length;
};

/**
 * Get ayah audio URL
 */
export const getAyahAudioUrl = (surahNumber, ayahNumber, reciter = 'abdulbasit') => {
  const reciters = {
    abdulbasit: 'abdulbasit',
    mishary: 'mishary',
    sudais: 'sudais',
    husary: 'husary',
    minshawi: 'minshawi',
  };
  
  const reciterId = reciters[reciter] || reciters.abdulbasit;
  return `https://cdn.islamic.network/quran/audio/${reciterId}/${surahNumber}_${ayahNumber}.mp3`;
};

/**
 * Fallback data in case JSON file is not available
 */
const getFallbackData = () => {
  console.warn('Using fallback Quran data');
  return [
    { surahNumber: 1, surahName: 'Al-Fatiha', surahNameArabic: 'Al-Faatiha', ayahNumber: 1, text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', juz: 1, page: 1 },
    { surahNumber: 1, surahName: 'Al-Fatiha', surahNameArabic: 'Al-Faatiha', ayahNumber: 2, text: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', juz: 1, page: 1 },
    { surahNumber: 1, surahName: 'Al-Fatiha', surahNameArabic: 'Al-Faatiha', ayahNumber: 3, text: 'الرَّحْمَٰنِ الرَّحِيمِ', juz: 1, page: 1 },
    { surahNumber: 1, surahName: 'Al-Fatiha', surahNameArabic: 'Al-Faatiha', ayahNumber: 4, text: 'مَالِكِ يَوْمِ الدِّينِ', juz: 1, page: 1 },
    { surahNumber: 1, surahName: 'Al-Fatiha', surahNameArabic: 'Al-Faatiha', ayahNumber: 5, text: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', juz: 1, page: 1 },
    { surahNumber: 1, surahName: 'Al-Fatiha', surahNameArabic: 'Al-Faatiha', ayahNumber: 6, text: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ', juz: 1, page: 1 },
    { surahNumber: 1, surahName: 'Al-Fatiha', surahNameArabic: 'Al-Faatiha', ayahNumber: 7, text: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ', juz: 1, page: 1 },
    { surahNumber: 112, surahName: 'Al-Ikhlas', surahNameArabic: 'Al-Ikhlas', ayahNumber: 1, text: 'قُلْ هُوَ اللَّهُ أَحَدٌ', juz: 30, page: 604 },
    { surahNumber: 112, surahName: 'Al-Ikhlas', surahNameArabic: 'Al-Ikhlas', ayahNumber: 2, text: 'اللَّهُ الصَّمَدُ', juz: 30, page: 604 },
    { surahNumber: 112, surahName: 'Al-Ikhlas', surahNameArabic: 'Al-Ikhlas', ayahNumber: 3, text: 'لَمْ يَلِدْ وَلَمْ يُولَدْ', juz: 30, page: 604 },
    { surahNumber: 112, surahName: 'Al-Ikhlas', surahNameArabic: 'Al-Ikhlas', ayahNumber: 4, text: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ', juz: 30, page: 604 },
    { surahNumber: 113, surahName: 'Al-Falaq', surahNameArabic: 'Al-Falaq', ayahNumber: 1, text: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ', juz: 30, page: 604 },
    { surahNumber: 113, surahName: 'Al-Falaq', surahNameArabic: 'Al-Falaq', ayahNumber: 2, text: 'مِن شَرِّ مَا خَلَقَ', juz: 30, page: 604 },
    { surahNumber: 113, surahName: 'Al-Falaq', surahNameArabic: 'Al-Falaq', ayahNumber: 3, text: 'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ', juz: 30, page: 604 },
    { surahNumber: 113, surahName: 'Al-Falaq', surahNameArabic: 'Al-Falaq', ayahNumber: 4, text: 'وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ', juz: 30, page: 604 },
    { surahNumber: 113, surahName: 'Al-Falaq', surahNameArabic: 'Al-Falaq', ayahNumber: 5, text: 'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ', juz: 30, page: 604 },
    { surahNumber: 114, surahName: 'An-Nas', surahNameArabic: 'An-Nas', ayahNumber: 1, text: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ', juz: 30, page: 604 },
    { surahNumber: 114, surahName: 'An-Nas', surahNameArabic: 'An-Nas', ayahNumber: 2, text: 'مَلِكِ النَّاسِ', juz: 30, page: 604 },
    { surahNumber: 114, surahName: 'An-Nas', surahNameArabic: 'An-Nas', ayahNumber: 3, text: 'إِلَٰهِ النَّاسِ', juz: 30, page: 604 },
    { surahNumber: 114, surahName: 'An-Nas', surahNameArabic: 'An-Nas', ayahNumber: 4, text: 'مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ', juz: 30, page: 604 },
    { surahNumber: 114, surahName: 'An-Nas', surahNameArabic: 'An-Nas', ayahNumber: 5, text: 'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ', juz: 30, page: 604 },
    { surahNumber: 114, surahName: 'An-Nas', surahNameArabic: 'An-Nas', ayahNumber: 6, text: 'مِنَ الْجِنَّةِ وَالنَّاسِ', juz: 30, page: 604 },
  ];
};

// Export all functions
// export {
//   getAyahs,
//   getAyahByNumber,
//   getSurahs,
//   getSurahByNumber,
//   searchSurahs,
//   searchAyahs,
//   getTotalAyahsInSurah,
//   getAyahAudioUrl,
// };