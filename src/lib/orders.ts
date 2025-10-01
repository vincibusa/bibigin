import { 
  collection, 
  doc, 
  addDoc, 
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
  runTransaction
} from 'firebase/firestore'
import { db } from './firebase'
import { Order, CartItem, ShippingAddress, User, Address } from './types'

// Constants
const ORDERS_COLLECTION = 'orders'
const USERS_COLLECTION = 'users'
const PRODUCTS_COLLECTION = 'products'
const SHIPPING_COST = 12 // Fixed shipping cost in euros

/**
 * Calculate order totals
 */
export function calculateOrderTotals(items: CartItem[]) {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping_cost = SHIPPING_COST
  const total = subtotal + shipping_cost
  
  return {
    subtotal: Number(subtotal.toFixed(2)),
    shipping_cost,
    total: Number(total.toFixed(2))
  }
}

/**
 * Update user order history
 */
async function updateUserOrderHistory(
  userId: string,
  orderId: string,
  orderTotal: number
): Promise<void> {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId)
    const userSnap = await getDoc(userRef)
    
    if (userSnap.exists()) {
      const userData = userSnap.data()
      const currentOrders = userData.orders || []
      const currentTotalSpent = userData.totalSpent || 0
      
      await updateDoc(userRef, {
        orders: [...currentOrders, orderId],
        totalSpent: currentTotalSpent + orderTotal,
        updatedAt: serverTimestamp()
      })
    }
  } catch (error) {
    console.error('Error updating user order history:', error)
    throw new Error('Errore nell\'aggiornamento dello storico ordini')
  }
}

/**
 * Update product stock
 */
async function updateProductStock(
  productId: string,
  quantityToReduce: number
): Promise<void> {
  try {
    const productRef = doc(db, PRODUCTS_COLLECTION, productId)
    const productSnap = await getDoc(productRef)
    
    if (productSnap.exists()) {
      const productData = productSnap.data()
      const currentStock = productData.stock || 0
      
      if (currentStock < quantityToReduce) {
        throw new Error(`Stock insufficiente. Disponibili: ${currentStock}`)
      }
      
      await updateDoc(productRef, {
        stock: currentStock - quantityToReduce,
        updatedAt: serverTimestamp()
      })
    } else {
      throw new Error('Prodotto non trovato')
    }
  } catch (error) {
    console.error('Error updating product stock:', error)
    throw error
  }
}

/**
 * Create a new order
 */
export async function createOrder(
  items: CartItem[],
  shipping: ShippingAddress,
  customerEmail: string,
  userId: string,
  notes?: string
): Promise<string> {
  try {
    if (!items.length) {
      throw new Error('Il carrello è vuoto')
    }
    
    // Verify user exists
    const userRef = doc(db, USERS_COLLECTION, userId)
    const userSnap = await getDoc(userRef)
    if (!userSnap.exists()) {
      throw new Error('Utente non trovato')
    }
    
    // Calculate totals
    const { subtotal, shipping_cost, total } = calculateOrderTotals(items)
    
    // Convert ShippingAddress to Address format for gestionale compatibility
    const addressData: Address = {
      street: shipping.street,
      city: shipping.city,
      state: shipping.city, // Use city as state for Italy
      postalCode: shipping.postalCode,
      country: shipping.country
    }
    
    // Use transaction to ensure atomicity
    const orderId = await runTransaction(db, async (transaction) => {
      // FIRST: Do all reads
      const productSnaps = new Map()
      
      // Read all products
      for (const item of items) {
        const productRef = doc(db, PRODUCTS_COLLECTION, item.productId)
        const productSnap = await transaction.get(productRef)
        productSnaps.set(item.productId, productSnap)
        
        if (!productSnap.exists()) {
          throw new Error(`Prodotto non trovato: ${item.name}`)
        }
        
        const productData = productSnap.data()
        const currentStock = productData.stock || 0
        
        if (currentStock < item.quantity) {
          throw new Error(`Stock insufficiente per ${item.name}. Disponibili: ${currentStock}`)
        }
      }
      
      // Read user data
      const userData = userSnap.data()
      const currentOrders = userData.orders || []
      const currentTotalSpent = userData.totalSpent || 0
      
      // SECOND: Do all writes
      // Prepare order data
      const orderData: Omit<Order, 'id'> = {
        customerId: userId, // Use Firebase UID
        customerEmail,
        items: items.map(item => ({
          productId: item.productId,
          name: item.name,
          productName: item.name, // For gestionale compatibility
          price: item.price,
          quantity: item.quantity,
          total: item.price * item.quantity, // For gestionale compatibility
          image: item.image
        })),
        shipping,
        shippingAddress: addressData, // For gestionale compatibility
        billingAddress: addressData, // Same as shipping for now
        subtotal,
        shipping_cost,
        total,
        status: 'pending',
        paymentMethod: 'manual',
        paymentStatus: 'pending',
        notes,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
      
      // Create order
      const orderRef = doc(collection(db, ORDERS_COLLECTION))
      transaction.set(orderRef, orderData)
      
      // Update stock for each product
      for (const item of items) {
        const productRef = doc(db, PRODUCTS_COLLECTION, item.productId)
        const productSnap = productSnaps.get(item.productId)
        const productData = productSnap.data()
        const newStock = (productData?.stock || 0) - item.quantity
        
        transaction.update(productRef, {
          stock: newStock,
          updatedAt: serverTimestamp()
        })
      }
      
      // Update user order history
      transaction.update(userRef, {
        orders: [...currentOrders, orderRef.id],
        totalSpent: currentTotalSpent + total,
        updatedAt: serverTimestamp()
      })
      
      return orderRef.id
    })
    
    return orderId
  } catch (error) {
    console.error('Error creating order:', error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Errore nella creazione dell\'ordine')
  }
}

/**
 * Get order by ID
 */
export async function getOrderById(orderId: string): Promise<Order | null> {
  try {
    const orderRef = doc(db, ORDERS_COLLECTION, orderId)
    const orderSnap = await getDoc(orderRef)
    
    if (orderSnap.exists()) {
      const data = orderSnap.data()
      return {
        id: orderSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
      } as Order
    }
    
    return null
  } catch (error) {
    console.error('Error fetching order:', error)
    throw new Error('Errore nel caricamento dell\'ordine')
  }
}

/**
 * Format order number for display
 */
export function formatOrderNumber(orderId: string): string {
  return `#${orderId.substring(0, 8).toUpperCase()}`
}

/**
 * Calculate estimated delivery date (5-7 business days)
 */
export function getEstimatedDelivery(): string {
  const deliveryDate = new Date()
  deliveryDate.setDate(deliveryDate.getDate() + 7) // 7 days from now
  
  return deliveryDate.toLocaleDateString('it-IT', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}