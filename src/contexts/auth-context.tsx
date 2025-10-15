'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  signInWithPopup
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db, googleProvider } from '@/lib/firebase'
import { User } from '@/lib/types'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
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
      phone: '',
      address: '',
      city: '',
      province: '',
      postalCode: '',
      country: '',
      dateOfBirth: new Date(),
      role: 2 as const,
      isActive: true,
      acceptedTerms: false,
      authProvider: 'email' as const,
      photoURL: firebaseUser.photoURL || undefined,
      emailVerified: firebaseUser.emailVerified,
      orders: [],
      totalSpent: 0,
      createdAt: new Date(firebaseUser.metadata.creationTime || Date.now()),
      updatedAt: new Date()
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
    } catch (error: unknown) {
      console.error('Sign up error:', error)

      // Handle specific Firebase errors
      if (error && typeof error === 'object' && 'code' in error) {
        const firebaseError = error as { code: string }
        if (firebaseError.code === 'auth/email-already-in-use') {
          throw new Error('Questo indirizzo email è già registrato')
        } else if (firebaseError.code === 'auth/weak-password') {
          throw new Error('La password deve essere di almeno 6 caratteri')
        } else if (firebaseError.code === 'auth/invalid-email') {
          throw new Error('Indirizzo email non valido')
        }
      }
      
      throw new Error('Errore durante la registrazione')
    }
  }

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const firebaseUser = result.user
      
      // Check if user document already exists
      const userDocRef = doc(db, 'customers', firebaseUser.uid)
      const userDocSnap = await getDoc(userDocRef)
      
      // If user document doesn't exist, create it
      if (!userDocSnap.exists()) {
        const displayName = firebaseUser.displayName || ''
        const nameParts = displayName.split(' ')
        const firstName = nameParts[0] || ''
        const lastName = nameParts.slice(1).join(' ') || ''
        
        const now = new Date()
        await setDoc(userDocRef, {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          firstName: firstName,
          lastName: lastName,
          orders: [],
          acceptedTerms: true,
          acceptedPrivacy: true,
          acceptedAge: true,
          termsAcceptedAt: now,
          privacyAcceptedAt: now,
          authProvider: 'google',
          photoURL: firebaseUser.photoURL || '',
          createdAt: now,
          updatedAt: now
        })
      }
    } catch (error: unknown) {
      console.error('Google sign in error:', error)
      
      // Handle specific Firebase errors
      if (error && typeof error === 'object' && 'code' in error) {
        const firebaseError = error as { code: string }
        if (firebaseError.code === 'auth/popup-closed-by-user') {
          throw new Error('Login annullato')
        } else if (firebaseError.code === 'auth/popup-blocked') {
          throw new Error('Popup bloccato dal browser. Abilita i popup per questo sito.')
        }
      }
      
      throw new Error('Errore durante il login con Google')
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
    signInWithGoogle,
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