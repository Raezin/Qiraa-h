import React from 'react'
import { Button } from '@mui/material'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../services/firebase'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const SetAdminButton = () => {
  const { user } = useAuth()

  const makeAdmin = async () => {
    if (!user) {
      toast.error('Please log in first')
      return
    }

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        role: 'admin'
      })
      toast.success('Admin role set! Please log out and log back in.')
    } catch (error) {
      console.error('Error setting admin role:', error)
      toast.error('Failed to set admin role')
    }
  }

  return (
    <Button variant="contained" color="warning" onClick={makeAdmin}>
      Make Me Admin (Temporary)
    </Button>
  )
}

export default SetAdminButton