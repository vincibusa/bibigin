import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  query, 
  where,
  orderBy,
  runTransaction,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore'
import { db } from './firebase'
import { Order, CartItem, ShippingAddress } from './types'
import { calculateShippingCost } from './shipping'
import { sendOrderEmails } from './api-client'

const ORDERS_COLLECTION = 'orders'
const PRODUCTS_COLLECTION = 'products'
const USERS_COLLECTION = 'users'

// Helper function to convert Firestore data to Order
function convertFirestoreOrder(id: string, data: Record<string, unknown>): Order {
  return {
    id,
    ...data,
    createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
    updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date()
  } as Order
}

/**
 * Calculate order totals with dynamic shipping based on bottle quantity
 */
export function calculateOrderTotals(items: CartItem[]) {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  // Calculate total number of bottles
  const totalBottles = items.reduce((sum, item) => sum + item.quantity, 0)

  // Calculate shipping cost based on number of bottles
  const shipping_cost = calculateShippingCost(totalBottles)

  const total = subtotal + shipping_cost

  return {
    subtotal: Number(subtotal.toFixed(2)),
    shipping_cost,
    total: Number(total.toFixed(2)),
    totalBottles
  }
}

/**
 * Create a new order with transaction
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

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const totalBottles = items.reduce((sum, item) => sum + item.quantity, 0)
    const shipping_cost = calculateShippingCost(totalBottles)
    const total = subtotal + shipping_cost

    // Prepare order data
    const orderFormData = {
      customerId: userId,
      customerEmail: customerEmail,
      items: items.map(item => ({
        productId: item.productId,
        productName: item.name,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity,
        image: item.image
      })),
      shippingAddress: {
        street: shipping.street,
        city: shipping.city,
        state: shipping.city,
        postalCode: shipping.postalCode,
        country: shipping.country
      },
      billingAddress: {
        street: shipping.street,
        city: shipping.city,
        state: shipping.city,
        postalCode: shipping.postalCode,
        country: shipping.country
      },
      subtotal,
      shipping_cost,
      total,
      status: 'pending',
      paymentMethod: 'manual',
      paymentStatus: 'pending',
      notes: notes
    }

    // Use transaction to ensure atomicity
    const orderId = await runTransaction(db, async (transaction) => {
      // FIRST: Do all reads
      const productSnaps = new Map()
      
      // Read all products
      for (const item of orderFormData.items) {
        const productRef = doc(db, PRODUCTS_COLLECTION, item.productId)
        const productSnap = await transaction.get(productRef)
        productSnaps.set(item.productId, productSnap)
        
        if (!productSnap.exists()) {
          throw new Error(`Prodotto non trovato: ${item.productName}`)
        }
        
        const productData = productSnap.data()
        const currentStock = productData.stock || 0
        
        if (currentStock < item.quantity) {
          throw new Error(`Stock insufficiente per ${item.productName}. Disponibili: ${currentStock}`)
        }
      }
      
      // Read user data
      const userRef = doc(db, USERS_COLLECTION, orderFormData.customerId)
      const userSnap = await transaction.get(userRef)
      let currentOrders: string[] = []
      let currentTotalSpent = 0
      
      if (userSnap.exists()) {
        const userData = userSnap.data()
        currentOrders = userData.orders || []
        currentTotalSpent = userData.totalSpent || 0
      }
      
      // SECOND: Do all writes
      // Create order
      const orderRef = doc(collection(db, ORDERS_COLLECTION))
      transaction.set(orderRef, {
        ...orderFormData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      
      // Update stock for each product
      for (const item of orderFormData.items) {
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
      if (userSnap.exists()) {
        transaction.update(userRef, {
          orders: [...currentOrders, orderRef.id],
          totalSpent: currentTotalSpent + orderFormData.total,
          updatedAt: serverTimestamp()
        })
      }
      
      return orderRef.id
    })
    
    // Send confirmation emails (customer + admin)
    // This runs in background and doesn't block order creation
    sendOrderEmails(orderId, {
      firstName: shipping.firstName,
      lastName: shipping.lastName,
      email: customerEmail,
      phone: shipping.phone
    }).catch(error => {
      console.error('Failed to send order emails:', error)
      // Email failure is logged but doesn't fail the order
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
    const docRef = doc(db, ORDERS_COLLECTION, orderId)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      return convertFirestoreOrder(docSnap.id, docSnap.data())
    } else {
      return null
    }
  } catch (error) {
    console.error('Error fetching order:', error)
    throw new Error('Errore nel caricamento dell\'ordine')
  }
}

/**
 * Get user orders
 */
export async function getUserOrders(userId: string): Promise<Order[]> {
  try {
    const q = query(
      collection(db, ORDERS_COLLECTION), 
      where('customerId', '==', userId),
      orderBy('createdAt', 'desc')
    )
    
    const querySnapshot = await getDocs(q)
    const orders: Order[] = []
    
    querySnapshot.forEach((doc) => {
      orders.push(convertFirestoreOrder(doc.id, doc.data()))
    })
    
    return orders
  } catch (error) {
    console.error('Error fetching user orders:', error)
    return []
  }
}

/**
 * Format order number for display
 */
export function formatOrderNumber(orderId: string): string {
  return `#${orderId.substring(0, 8).toUpperCase()}`
}

/**
 * Calculate estimated delivery date (7 business days)
 */
export function getEstimatedDelivery(): string {
  const deliveryDate = new Date()
  deliveryDate.setDate(deliveryDate.getDate() + 7)

  return deliveryDate.toLocaleDateString('it-IT', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}