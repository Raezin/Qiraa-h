import React, { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  auth, 
  createUserDocument, 
  getUserData,
  googleProvider 
} from '../services/firebase'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  signInWithPopup,
  onAuthStateChanged
} from 'firebase/auth'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Create or update user document
        await createUserDocument(firebaseUser)
        const userData = await getUserData(firebaseUser.uid)
        
        // Check if user is admin based on role field in Firestore
        const adminStatus = userData?.role === 'admin'
        setIsAdmin(adminStatus)
        
        setUser({ 
          ...firebaseUser, 
          ...userData, 
          role: adminStatus ? 'admin' : 'user' 
        })
      } else {
        setUser(null)
        setIsAdmin(false)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      
      // Fetch user data to check role
      const userData = await getUserData(result.user.uid)
      const isAdminUser = userData?.role === 'admin'
      
      toast.success('Login successful!')
      
      // Redirect based on role
      if (isAdminUser) {
        navigate('/admin/dashboard')
      } else {
        navigate('/dashboard')
      }
      
      return { success: true, user: result.user, isAdmin: isAdminUser }
    } catch (err) {
      let errorMessage = 'Login failed. Please try again.'
      switch (err.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email.'
          break
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password.'
          break
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later.'
          break
        default:
          errorMessage = err.message
      }
      setError(errorMessage)
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const signup = async (email, password, name) => {
    setLoading(true)
    setError(null)
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      await createUserDocument(result.user, { name })
      toast.success('Account created successfully!')
      navigate('/dashboard')
      return { success: true, user: result.user }
    } catch (err) {
      let errorMessage = 'Signup failed. Please try again.'
      switch (err.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'An account already exists with this email.'
          break
        case 'auth/weak-password':
          errorMessage = 'Password should be at least 6 characters.'
          break
        default:
          errorMessage = err.message
      }
      setError(errorMessage)
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const loginWithGoogle = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await signInWithPopup(auth, googleProvider)
      await createUserDocument(result.user)
      
      // Fetch user data to check role
      const userData = await getUserData(result.user.uid)
      const isAdminUser = userData?.role === 'admin'
      
      toast.success('Google login successful!')
      
      // Redirect based on role
      if (isAdminUser) {
        navigate('/admin')
      } else {
        navigate('/dashboard')
      }
      
      return { success: true, user: result.user, isAdmin: isAdminUser }
    } catch (err) {
      let errorMessage = 'Google login failed. Please try again.'
      setError(errorMessage)
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      await signOut(auth)
      setUser(null)
      setIsAdmin(false)
      toast.success('Logged out successfully')
      navigate('/')
      return { success: true }
    } catch (err) {
      toast.error('Logout failed. Please try again.')
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email) => {
    setLoading(true)
    setError(null)
    try {
      await sendPasswordResetEmail(auth, email)
      toast.success('Password reset email sent! Check your inbox.')
      return { success: true }
    } catch (err) {
      let errorMessage = 'Failed to send reset email.'
      if (err.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email.'
      }
      setError(errorMessage)
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    loginWithGoogle,
    resetPassword,
    isAuthenticated: !!user,
    isAdmin: isAdmin,
    userRole: user?.role || 'user',
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}