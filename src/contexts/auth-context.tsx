'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile
} from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { User } from '@/lib/types'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    acceptedTerms: boolean,
    acceptedPrivacy: boolean,
    acceptedAge: boolean
  ) => Promise<void>
  signOut: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Convert Firebase user to our User type
  const mapFirebaseUser = (firebaseUser: FirebaseUser | null): User | null => {
    if (!firebaseUser) return null
    
    const displayName = firebaseUser.displayName || ''
    const nameParts = displayName.split(' ')
    
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email || '',
      firstName: nameParts[0] || '',
      lastName: nameParts.slice(1).join(' ') || '',
      photoURL: firebaseUser.photoURL || undefined,
      emailVerified: firebaseUser.emailVerified,
      createdAt: new Date(firebaseUser.metadata.creationTime || Date.now())
    }
  }

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(mapFirebaseUser(firebaseUser))
      setLoading(false)
    })

    return unsubscribe
  }, [])

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      console.error('Sign in error:', error)
      throw new Error('Email o password non validi')
    }
  }

  // Sign up with email and password
  const signUp = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    acceptedTerms: boolean,
    acceptedPrivacy: boolean,
    acceptedAge: boolean
  ) => {
    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password)

      // Update profile with display name
      await updateProfile(firebaseUser, {
        displayName: `${firstName} ${lastName}`
      })

      // Create customer document in Firestore with legal acceptance
      const now = new Date()
      await setDoc(doc(db, 'customers', firebaseUser.uid), {
        id: firebaseUser.uid,
        email: email,
        firstName: firstName,
        lastName: lastName,
        orders: [],
        // Legal acceptance flags
        acceptedTerms: acceptedTerms,
        acceptedPrivacy: acceptedPrivacy,
        acceptedAge: acceptedAge,
        termsAcceptedAt: now,
        privacyAcceptedAt: now,
        createdAt: now,
        updatedAt: now
      })

      // Reload user to get updated profile
      await firebaseUser.reload()
    } catch (error: any) {
      console.error('Sign up error:', error)

      // Handle specific Firebase errors
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('Questo indirizzo email è già registrato')
      } else if (error.code === 'auth/weak-password') {
        throw new Error('La password deve essere di almeno 6 caratteri')
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Indirizzo email non valido')
      } else {
        throw new Error('Errore durante la registrazione')
      }
    }
  }

  // Sign out
  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
    } catch (error) {
      console.error('Sign out error:', error)
      throw new Error('Errore durante il logout')
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}