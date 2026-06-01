// src/context/SubscriptionContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { 
  getActiveSubscription, 
  checkDailyLimit, 
  incrementDailyUsage,
  createSubscription,
  deactivateUserSubscriptions
} from '../services/firebase'
import toast from 'react-hot-toast'

const SubscriptionContext = createContext()

export const useSubscription = () => {
  const context = useContext(SubscriptionContext)
  if (!context) {
    throw new Error('useSubscription must be used within SubscriptionProvider')
  }
  return context
}

export const SubscriptionProvider = ({ children }) => {
  const { user } = useAuth()
  const [subscription, setSubscription] = useState(null)
  const [dailyUsage, setDailyUsage] = useState({
    recitationsToday: 0,
    recitationsThisMonth: 0,
    limit: 5,
    remaining: 5,
    canRecite: true,
    subscriptionType: 'free'
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadSubscriptionData()
      loadDailyUsage()
    } else {
      setLoading(false)
      setSubscription(null)
    }
  }, [user])

  const loadSubscriptionData = async () => {
    if (!user) return
    try {
      const sub = await getActiveSubscription(user.uid)
      setSubscription(sub)
    } catch (error) {
      console.error('Error loading subscription:', error)
    }
  }

  const loadDailyUsage = async () => {
    if (!user) return
    try {
      const limit = await checkDailyLimit(user.uid)
      setDailyUsage({
        recitationsToday: limit.used,
        recitationsThisMonth: limit.used,
        limit: limit.limit,
        remaining: limit.remaining,
        canRecite: limit.canRecite,
        subscriptionType: limit.subscriptionType
      })
    } catch (error) {
      console.error('Error loading daily usage:', error)
    } finally {
      setLoading(false)
    }
  }

  const subscribe = async (planId, paymentMethod = 'credit_card') => {
    if (!user) {
      toast.error('You must be logged in to subscribe')
      return { success: false, error: 'Not logged in' }
    }

    setLoading(true)
    try {
      // Call Firebase function to create subscription
      const subscriptionId = await createSubscription(user.uid, planId, paymentMethod)
      
      // Reload subscription data
      await loadSubscriptionData()
      await loadDailyUsage()
      
      toast.success(`Successfully upgraded to ${planId.charAt(0).toUpperCase() + planId.slice(1)} plan!`)
      return { success: true, subscriptionId }
    } catch (error) {
      console.error('Subscription error:', error)
      toast.error(error.message || 'Subscription failed')
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const cancelSubscription = async () => {
    if (!user) {
      toast.error('You must be logged in to cancel subscription')
      return { success: false, error: 'Not logged in' }
    }

    setLoading(true)
    try {
      await deactivateUserSubscriptions(user.uid)
      
      // Reload data
      await loadSubscriptionData()
      await loadDailyUsage()
      
      toast.success('Subscription cancelled successfully')
      return { success: true }
    } catch (error) {
      console.error('Cancellation error:', error)
      toast.error(error.message || 'Cancellation failed')
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const checkRecitationLimit = async () => {
    if (!user) return false
    const limit = await checkDailyLimit(user.uid)
    setDailyUsage(prev => ({
      ...prev,
      remaining: limit.remaining,
      canRecite: limit.canRecite
    }))
    return limit.canRecite
  }

  const incrementRecitationCount = async () => {
    if (!user) return false
    
    const currentLimit = await checkDailyLimit(user.uid)
    if (!currentLimit.canRecite) {
      toast.error(`You've reached your daily limit of ${currentLimit.limit} recitations. Upgrade to continue practicing!`)
      return false
    }
    
    await incrementDailyUsage(user.uid, 1)
    await loadDailyUsage()
    return true
  }

  const value = {
    subscription,
    dailyUsage,
    loading,
    subscribe,
    cancelSubscription,
    checkRecitationLimit,
    incrementRecitationCount,
    isSubscribed: subscription?.status === 'active' && subscription?.type !== 'free',
    remainingRecitations: dailyUsage.remaining,
    subscriptionType: dailyUsage.subscriptionType,
  }

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  )
}