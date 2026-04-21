import React, { createContext, useContext, useState, useEffect } from 'react'

const SubscriptionContext = createContext()

export const useSubscription = () => {
  const context = useContext(SubscriptionContext)
  if (!context) {
    throw new Error('useSubscription must be used within SubscriptionProvider')
  }
  return context
}

export const SubscriptionProvider = ({ children }) => {
  const [subscription, setSubscription] = useState(null)
  const [usage, setUsage] = useState({
    recitationsToday: 0,
    recitationsThisMonth: 0,
    limit: 5, // Free tier limit
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Load subscription from localStorage
    const savedSubscription = localStorage.getItem('subscription')
    if (savedSubscription) {
      setSubscription(JSON.parse(savedSubscription))
    }
  }, [])

  const subscribe = async (planId) => {
    setLoading(true)
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const plans = {
        basic: { name: 'Basic', limit: 50, price: 9.99 },
        pro: { name: 'Pro', limit: 200, price: 19.99 },
        unlimited: { name: 'Unlimited', limit: Infinity, price: 49.99 },
      }
      
      const subscriptionData = {
        id: Date.now().toString(),
        plan: plans[planId],
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'active',
      }
      
      setSubscription(subscriptionData)
      localStorage.setItem('subscription', JSON.stringify(subscriptionData))
      return { success: true, subscription: subscriptionData }
    } catch (err) {
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const cancelSubscription = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSubscription(null)
      localStorage.removeItem('subscription')
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const checkRecitationLimit = () => {
    const limit = subscription?.plan?.limit || 5
    return usage.recitationsToday < limit
  }

  const incrementRecitationCount = () => {
    setUsage(prev => ({
      ...prev,
      recitationsToday: prev.recitationsToday + 1,
      recitationsThisMonth: prev.recitationsThisMonth + 1,
    }))
  }

  const value = {
    subscription,
    usage,
    loading,
    subscribe,
    cancelSubscription,
    checkRecitationLimit,
    incrementRecitationCount,
    isSubscribed: !!subscription,
    remainingRecitations: (subscription?.plan?.limit || 5) - usage.recitationsToday,
  }

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  )
}