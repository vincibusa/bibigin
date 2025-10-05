import { 
  doc, 
  getDoc, 
  updateDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore'
import { db } from './firebase'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  address?: string
  city?: string
  province?: string
  postalCode?: string
  country?: string
  dateOfBirth?: Date
  role: number
  isActive: boolean
  orders: string[]
  totalSpent: number
  createdAt: Date
  updatedAt: Date
}

const USERS_COLLECTION = 'users'

// Helper function to convert Firestore data to User
function convertFirestoreUser(id: string, data: Record<string, unknown>): User {
  return {
    id,
    ...data,
    dateOfBirth: (data.dateOfBirth as Timestamp)?.toDate() || undefined,
    createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
    updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date()
  } as User
}

/**
 * Get user profile
 */
export async function getUserProfile(userId: string): Promise<User | null> {
  try {
    const docRef = doc(db, USERS_COLLECTION, userId)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      return convertFirestoreUser(docSnap.id, docSnap.data())
    } else {
      return null
    }
  } catch (error) {
    console.error('Error fetching user profile:', error)
    throw new Error('Failed to fetch user profile')
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  userId: string,
  updates: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'role' | 'isActive' | 'totalSpent' | 'orders'>>
): Promise<void> {
  try {
    const docRef = doc(db, USERS_COLLECTION, userId)
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    })
  } catch (error) {
    console.error('Error updating user profile:', error)
    throw new Error('Failed to update user profile')
  }
}