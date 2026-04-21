import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';

// Your Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Admin credentials
const ADMIN_EMAIL = 'admin@qiraa.com';
const ADMIN_PASSWORD = 'Admin@123456'; // Change this to a strong password
const ADMIN_NAME = 'Super Admin';

async function createAdminUser() {
  try {
    console.log('🔧 Starting admin user creation...');
    
    // Check if admin already exists
    console.log('📝 Checking if admin exists...');
    
    // Try to create admin user
    let userCredential;
    try {
      userCredential = await createUserWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
      console.log('✅ Admin user created in Authentication');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log('⚠️ Admin email already exists. Signing in...');
        userCredential = await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
        console.log('✅ Signed in as existing admin');
      } else {
        throw error;
      }
    }
    
    const user = userCredential.user;
    const userId = user.uid;
    
    // Create admin user document in Firestore
    console.log('📝 Creating admin user document...');
    const adminUserRef = doc(db, 'users', userId);
    const adminUserSnap = await getDoc(adminUserRef);
    
    if (!adminUserSnap.exists()) {
      await setDoc(adminUserRef, {
        userId: userId,
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        role: 'admin',
        credits: 999999,
        subscriptionId: null,
        createdAt: new Date(),
        lastLogin: new Date(),
        emailVerified: true,
        phone: '',
        location: '',
        bio: 'System Administrator',
        photoURL: '',
        settings: {
          notifications: true,
          language: 'en',
          theme: 'dark'
        }
      });
      console.log('✅ Admin user document created');
    } else {
      // Update existing admin document
      await setDoc(adminUserRef, {
        role: 'admin',
        updatedAt: new Date()
      }, { merge: true });
      console.log('✅ Admin user document updated');
    }
    
    // Create admin subscription
    console.log('📝 Creating admin subscription...');
    const subscriptionRef = doc(db, 'subscriptions', `admin_${userId}`);
    await setDoc(subscriptionRef, {
      subscriptionId: `admin_${userId}`,
      userId: userId,
      type: 'admin',
      creditsPerDay: 999999,
      price: 0,
      startDate: new Date(),
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      status: 'active',
      paymentMethod: 'system',
      autoRenew: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // Update user with subscription ID
    await setDoc(adminUserRef, {
      subscriptionId: `admin_${userId}`
    }, { merge: true });
    console.log('✅ Admin subscription created');
    
    // Create admin stats
    console.log('📝 Creating admin stats...');
    const statsRef = doc(db, 'adminStats', 'platform');
    const statsSnap = await getDoc(statsRef);
    
    if (!statsSnap.exists()) {
      await setDoc(statsRef, {
        totalUsers: 1,
        totalEvaluations: 0,
        totalRevenue: 0,
        activeSubscriptions: 1,
        adminUsers: 1,
        regularUsers: 0,
        lastUpdated: new Date()
      });
      console.log('✅ Admin stats created');
    }
    
    console.log('\n🎉 Admin setup completed successfully!');
    console.log('=====================================');
    console.log(`📧 Admin Email: ${ADMIN_EMAIL}`);
    console.log(`🔑 Admin Password: ${ADMIN_PASSWORD}`);
    console.log(`🆔 User ID: ${userId}`);
    console.log('=====================================');
    console.log('\n⚠️  IMPORTANT: Save these credentials and delete this script after use!');
    console.log('⚠️  Change the admin password after first login!\n');
    
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    console.error('Error details:', error.message);
  }
}

// Run the setup
createAdminUser();