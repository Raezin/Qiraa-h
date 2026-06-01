import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  increment,
  arrayUnion,
  arrayRemove,
  writeBatch
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

// Your Firebase config (replace with your actual config)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

// ==================== USER COLLECTION ====================

export const createUserDocument = async (user, additionalData = {}) => {
  if (!user) return;
  
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) {
    const { email, displayName, photoURL } = user;
    const createdAt = Timestamp.now();
    
    try {
      await setDoc(userRef, {
        userId: user.uid,
        name: displayName || additionalData.name || '',
        email: email,
        role: 'user', // 'user' or 'admin'
        credits: 5, // Starting credits for free tier
        subscriptionId: null,
        createdAt: createdAt,
        lastLogin: createdAt,
        // Additional fields from schema
        phone: additionalData.phone || '',
        location: additionalData.location || '',
        bio: additionalData.bio || '',
        photoURL: photoURL || '',
        emailVerified: user.emailVerified || false,
        settings: {
          notifications: true,
          language: 'en',
          theme: 'dark'
        }
      });
      
      // Create default free subscription
      await createFreeSubscription(user.uid);
      
    } catch (error) {
      console.error('Error creating user document:', error);
    }
  } else {
    // Update last login
    await updateDoc(userRef, {
      lastLogin: Timestamp.now()
    });
  }
  
  return userRef;
};

export const getUserData = async (userId) => {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? userSnap.data() : null;
};

export const updateUserData = async (userId, data) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    ...data,
    updatedAt: Timestamp.now()
  });
  return true;
};

// ==================== SUBSCRIPTION COLLECTION ====================

export const createFreeSubscription = async (userId) => {
  const subscriptionRef = doc(collection(db, 'subscriptions'));
  const subscriptionData = {
    subscriptionId: subscriptionRef.id,
    userId: userId,
    type: 'free',
    creditsPerDay: 5,
    price: 0,
    startDate: Timestamp.now(),
    expiryDate: Timestamp.fromDate(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)), // 1 year
    status: 'active',
    paymentMethod: 'free',
    autoRenew: false,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  };
  
  await setDoc(subscriptionRef, subscriptionData);
  
  // Update user with subscriptionId
  await updateDoc(doc(db, 'users', userId), {
    subscriptionId: subscriptionRef.id
  });
  
  return subscriptionRef.id;
};

export const createSubscription = async (userId, type, paymentMethod) => {
  const subscriptionPlans = {
    basic: { creditsPerDay: 5, price: 9.99, duration: 30 }, // 30 days
    pro: { creditsPerDay: 100, price: 19.99, duration: 30 },
    family: { creditsPerDay: 200, price: 29.99, duration: 30 }
  };
  
  const plan = subscriptionPlans[type];
  if (!plan) throw new Error('Invalid subscription type');
  
  // Deactivate old subscription
  await deactivateUserSubscriptions(userId);
  
  // Create new subscription
  const subscriptionRef = doc(collection(db, 'subscriptions'));
  const subscriptionData = {
    subscriptionId: subscriptionRef.id,
    userId: userId,
    type: type,
    creditsPerDay: plan.creditsPerDay,
    price: plan.price,
    startDate: Timestamp.now(),
    expiryDate: Timestamp.fromDate(new Date(Date.now() + plan.duration * 24 * 60 * 60 * 1000)),
    status: 'active',
    paymentMethod: paymentMethod,
    autoRenew: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  };
  
  await setDoc(subscriptionRef, subscriptionData);
  
  // Update user
  await updateDoc(doc(db, 'users', userId), {
    subscriptionId: subscriptionRef.id,
    credits: plan.creditsPerDay // Give initial credits
  });
  
  return subscriptionRef.id;
};

export const deactivateUserSubscriptions = async (userId) => {
  const subscriptionsRef = collection(db, 'subscriptions');
  const q = query(
    subscriptionsRef,
    where('userId', '==', userId),
    where('status', '==', 'active')
  );
  const querySnapshot = await getDocs(q);
  
  const batch = writeBatch(db);
  querySnapshot.forEach((doc) => {
    batch.update(doc.ref, { status: 'expired', updatedAt: Timestamp.now() });
  });
  await batch.commit();
};

export const getActiveSubscription = async (userId) => {
  const subscriptionsRef = collection(db, 'subscriptions');
  const q = query(
    subscriptionsRef,
    where('userId', '==', userId),
    where('status', '==', 'active'),
    orderBy('expiryDate', 'desc'),
    limit(1)
  );
  const querySnapshot = await getDocs(q);
  
  if (!querySnapshot.empty) {
    return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
  }
  return null;
};

// ==================== EVALUATION COLLECTION ====================

export const saveEvaluation = async (evaluationData) => {
  const evaluationRef = doc(collection(db, 'evaluations'));
  const finalData = {
    evaluationId: evaluationRef.id,
    userId: evaluationData.userId,
    ayahNo: evaluationData.ayahNo,
    surah: evaluationData.surah,
    transcription: evaluationData.transcription,
    score: evaluationData.score,
    creditsUsed: evaluationData.creditsUsed || 1,
    createdAt: Timestamp.now(),
    // Additional fields for detailed analysis
    accuracy: evaluationData.accuracy,
    tajweedScore: evaluationData.tajweedScore,
    duration: evaluationData.duration,
    errors: evaluationData.errors || [],
    detailedScores: evaluationData.detailedScores || {}
  };
  
  await setDoc(evaluationRef, finalData);
  
  // Deduct credits
  await updateUserCredits(
    evaluationData.userId,
    -evaluationData.creditsUsed,
    'recitation',
    `Recitation of ${evaluationData.surah} ${evaluationData.ayahNo}`,
    evaluationRef.id
  );
  
  // Update user progress
  await updateUserProgress(evaluationData.userId, evaluationData.surah, evaluationData.ayahNo, evaluationData.score);
  
  return evaluationRef.id;
};

export const getUserEvaluations = async (userId, limitCount = 50) => {
  const evaluationsRef = collection(db, 'evaluations');
  const q = query(
    evaluationsRef,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );
  const querySnapshot = await getDocs(q);
  const evaluations = [];
  querySnapshot.forEach(doc => {
    evaluations.push({ id: doc.id, ...doc.data() });
  });
  return evaluations;
};

export const getEvaluationById = async (evaluationId) => {
  const evaluationRef = doc(db, 'evaluations', evaluationId);
  const evaluationSnap = await getDoc(evaluationRef);
  return evaluationSnap.exists() ? { id: evaluationSnap.id, ...evaluationSnap.data() } : null;
};

// ==================== REVIEW COLLECTION ====================

export const submitReview = async (userId, rating, comment) => {
  const reviewRef = doc(collection(db, 'reviews'));
  const reviewData = {
    reviewId: reviewRef.id,
    userId: userId,
    rating: rating, // 1-5
    comment: comment,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  };
  
  await setDoc(reviewRef, reviewData);
  return reviewRef.id;
};

export const getReviews = async (limitCount = 20) => {
  const reviewsRef = collection(db, 'reviews');
  const q = query(reviewsRef, orderBy('createdAt', 'desc'), limit(limitCount));
  const querySnapshot = await getDocs(q);
  const reviews = [];
  querySnapshot.forEach(doc => {
    reviews.push({ id: doc.id, ...doc.data() });
  });
  return reviews;
};

export const getUserReviews = async (userId) => {
  const reviewsRef = collection(db, 'reviews');
  const q = query(reviewsRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  const reviews = [];
  querySnapshot.forEach(doc => {
    reviews.push({ id: doc.id, ...doc.data() });
  });
  return reviews;
};

// ==================== CREDIT TRANSACTIONS ====================

export const updateUserCredits = async (userId, amount, type, description, evaluationId = null) => {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  const currentCredits = userSnap.data()?.credits || 0;
  const newBalance = currentCredits + amount;
  
  // Update user credits
  await updateDoc(userRef, {
    credits: newBalance
  });
  
  // Create credit transaction record
  const transactionRef = doc(collection(db, 'creditTransactions'));
  await setDoc(transactionRef, {
    transactionId: transactionRef.id,
    userId,
    amount,
    type, // 'subscription', 'recitation', 'admin_add', 'refund'
    description,
    evaluationId,
    balanceAfter: newBalance,
    createdAt: Timestamp.now()
  });
  
  return newBalance;
};

export const getUserCreditTransactions = async (userId, limitCount = 50) => {
  const transactionsRef = collection(db, 'creditTransactions');
  const q = query(
    transactionsRef,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );
  const querySnapshot = await getDocs(q);
  const transactions = [];
  querySnapshot.forEach(doc => {
    transactions.push({ id: doc.id, ...doc.data() });
  });
  return transactions;
};

// ==================== DAILY USAGE & LIMITS ====================

export const checkDailyLimit = async (userId) => {
  const today = new Date().toISOString().split('T')[0];
  const usageRef = doc(db, 'dailyUsage', `${userId}_${today}`);
  const usageSnap = await getDoc(usageRef);
  
  const subscription = await getActiveSubscription(userId);
  const dailyLimit = subscription?.creditsPerDay || 5;
  const currentCount = usageSnap.exists() ? usageSnap.data()?.recitationsCount || 0 : 0;
  
  return {
    canRecite: currentCount < dailyLimit,
    remaining: dailyLimit - currentCount,
    used: currentCount,
    limit: dailyLimit,
    subscriptionType: subscription?.type || 'free'
  };
};

export const incrementDailyUsage = async (userId, creditsUsed = 1) => {
  const today = new Date().toISOString().split('T')[0];
  const usageRef = doc(db, 'dailyUsage', `${userId}_${today}`);
  const usageSnap = await getDoc(usageRef);
  
  if (usageSnap.exists()) {
    await updateDoc(usageRef, {
      recitationsCount: increment(1),
      creditsUsed: increment(creditsUsed),
      evaluationsCount: increment(1),
      lastUpdated: Timestamp.now()
    });
  } else {
    await setDoc(usageRef, {
      id: `${userId}_${today}`,
      userId,
      date: today,
      recitationsCount: 1,
      creditsUsed: creditsUsed,
      evaluationsCount: 1,
      createdAt: Timestamp.now()
    });
  }
};

// ==================== USER PROGRESS TRACKING ====================

export const updateUserProgress = async (userId, surah, ayahNo, score) => {
  const progressId = `${userId}_${surah}_${ayahNo}`;
  const progressRef = doc(db, 'userProgress', progressId);
  const progressSnap = await getDoc(progressRef);
  
  if (progressSnap.exists()) {
    const data = progressSnap.data();
    const newScores = [...(data.previousScores || []), { score, date: Timestamp.now() }];
    const bestScore = Math.max(data.bestScore || 0, score);
    const attemptsCount = (data.attemptsCount || 0) + 1;
    
    await updateDoc(progressRef, {
      previousScores: newScores,
      bestScore,
      attemptsCount,
      lastAttemptAt: Timestamp.now(),
      lastScore: score
    });
  } else {
    await setDoc(progressRef, {
      progressId,
      userId,
      surah,
      ayahNo,
      previousScores: [{ score, date: Timestamp.now() }],
      bestScore: score,
      attemptsCount: 1,
      firstAttemptAt: Timestamp.now(),
      lastAttemptAt: Timestamp.now(),
      lastScore: score
    });
  }
};

export const getUserProgress = async (userId) => {
  const progressRef = collection(db, 'userProgress');
  const q = query(progressRef, where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  
  let totalScore = 0;
  let totalAttempts = 0;
  const progress = [];
  
  querySnapshot.forEach(doc => {
    const data = doc.data();
    totalScore += data.bestScore || 0;
    totalAttempts += data.attemptsCount || 0;
    progress.push({ id: doc.id, ...data });
  });
  
  return {
    totalAyahsPracticed: querySnapshot.size,
    averageScore: querySnapshot.size > 0 ? totalScore / querySnapshot.size : 0,
    totalAttempts,
    progressList: progress
  };
};

// ==================== AYAH COLLECTION (Quran Verses) ====================

// export const getAyahs = async (surah = null, limitCount = 50) => {
//   const ayahsRef = collection(db, 'ayahs');
//   let q = query(ayahsRef, limit(limitCount));
  
//   if (surah) {
//     q = query(ayahsRef, where('surah', '==', surah), limit(limitCount));
//   }
  
//   const querySnapshot = await getDocs(q);
//   const ayahs = [];
//   querySnapshot.forEach(doc => {
//     ayahs.push({ id: doc.id, ...doc.data() });
//   });
//   return ayahs;
// };

// export const getAyahByNumber = async (surah, ayahNo) => {
//   const ayahsRef = collection(db, 'ayahs');
//   const q = query(ayahsRef, where('surah', '==', surah), where('ayahNo', '==', ayahNo), limit(1));
//   const querySnapshot = await getDocs(q);
  
//   if (!querySnapshot.empty) {
//     return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
//   }
//   return null;
// };

// ==================== PRONUNCIATION AUDIO COLLECTION ====================

export const savePronunciationAudio = async (ayahId, reciter, audioFile) => {
  const audioRef = doc(collection(db, 'pronunciationAudios'));
  const storageRef = ref(storage, `pronunciation_audios/${audioRef.id}`);
  
  // Upload to storage
  await uploadBytes(storageRef, audioFile);
  const audioUrl = await getDownloadURL(storageRef);
  
  const audioData = {
    audioId: audioRef.id,
    ayahId: ayahId,
    reciter: reciter,
    audioUrl: audioUrl,
    createdAt: Timestamp.now(),
    downloads: 0
  };
  
  await setDoc(audioRef, audioData);
  return audioRef.id;
};

export const getPronunciationAudios = async (ayahId) => {
  const audiosRef = collection(db, 'pronunciationAudios');
  const q = query(audiosRef, where('ayahId', '==', ayahId));
  const querySnapshot = await getDocs(q);
  const audios = [];
  querySnapshot.forEach(doc => {
    audios.push({ id: doc.id, ...doc.data() });
  });
  return audios;
};

// ==================== ADMIN FUNCTIONS ====================

export const getAllUsers = async () => {
  const usersRef = collection(db, 'users');
  const querySnapshot = await getDocs(usersRef);
  const users = [];
  querySnapshot.forEach(doc => {
    users.push({ id: doc.id, ...doc.data() });
  });
  return users;
};

export const getPlatformStats = async () => {
  // Get total users
  const usersRef = collection(db, 'users');
  const usersSnapshot = await getDocs(usersRef);
  const totalUsers = usersSnapshot.size;
  
  // Get total evaluations
  const evaluationsRef = collection(db, 'evaluations');
  const evaluationsSnapshot = await getDocs(evaluationsRef);
  const totalEvaluations = evaluationsSnapshot.size;
  
  // Get average score
  let totalScore = 0;
  evaluationsSnapshot.forEach(doc => {
    totalScore += doc.data().score || 0;
  });
  const averageScore = totalEvaluations > 0 ? totalScore / totalEvaluations : 0;
  
  // Get subscription stats
  const subscriptionsRef = collection(db, 'subscriptions');
  const subscriptionsSnapshot = await getDocs(subscriptionsRef);
  let paidSubscriptions = 0;
  subscriptionsSnapshot.forEach(doc => {
    if (doc.data().type !== 'free') paidSubscriptions++;
  });
  
  return {
    totalUsers,
    totalEvaluations,
    averageScore,
    paidSubscriptions,
    conversionRate: totalUsers > 0 ? (paidSubscriptions / totalUsers) * 100 : 0
  };
};

// ==================== AUTH HELPER FUNCTIONS ====================

export const loginWithEmail = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const signUpWithEmail = async (email, password, name) => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  await createUserDocument(result.user, { name });
  return result;
};

export const loginWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  await createUserDocument(result.user);
  return result;
};

export const logoutUser = async () => {
  return await signOut(auth);
};

export const resetUserPassword = async (email) => {
  return await sendPasswordResetEmail(auth, email);
};

// ==================== HELPER FUNCTIONS ====================

export const formatTimestamp = (timestamp) => {
  if (!timestamp) return null;
  return timestamp.toDate();
};

export const getCurrentTimestamp = () => {
  return Timestamp.now();
};