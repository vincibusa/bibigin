import { 
  collection, 
  doc, 
  addDoc, 
  getDoc,
  setDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore'
import { db } from './firebase'
import { Order, CartItem, ShippingAddress, Customer, Address } from './types'

// Constants
const ORDERS_COLLECTION = 'orders'
const CUSTOMERS_COLLECTION = 'customers'
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
 * Create or update customer record
 */
async function createOrUpdateCustomer(
  email: string, 
  shippingAddress: ShippingAddress
): Promise<string> {
  try {
    // Use email as document ID for easy lookup
    const customerDocId = email.replace(/[.#$[\]]/g, '_') // Firebase-safe ID
    const customerRef = doc(db, CUSTOMERS_COLLECTION, customerDocId)
    
    // Check if customer exists
    const customerSnap = await getDoc(customerRef)
    
    const customerData: Omit<Customer, 'id'> = {
      email,
      firstName: shippingAddress.firstName,
      lastName: shippingAddress.lastName,
      phone: shippingAddress.phone,
      defaultAddress: {
        street: shippingAddress.street,
        city: shippingAddress.city,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country,
        isDefault: true
      },
      orders: customerSnap.exists() ? customerSnap.data().orders || [] : [],
      createdAt: customerSnap.exists() ? customerSnap.data().createdAt : serverTimestamp(),
      updatedAt: serverTimestamp()
    }
    
    // Create or update customer
    await setDoc(customerRef, customerData, { merge: true })
    
    return customerDocId
  } catch (error) {
    console.error('Error creating/updating customer:', error)
    throw new Error('Errore nella creazione del profilo cliente')
  }
}

/**
 * Create a new order
 */
export async function createOrder(
  items: CartItem[],
  shipping: ShippingAddress,
  customerEmail: string,
  notes?: string
): Promise<string> {
  try {
    if (!items.length) {
      throw new Error('Il carrello è vuoto')
    }
    
    // Calculate totals
    const { subtotal, shipping_cost, total } = calculateOrderTotals(items)
    
    // Create or update customer
    const customerId = await createOrUpdateCustomer(customerEmail, shipping)
    
    // Convert ShippingAddress to Address format for gestionale compatibility
    const addressData: Address = {
      street: shipping.street,
      city: shipping.city,
      state: shipping.city, // Use city as state for Italy
      postalCode: shipping.postalCode,
      country: shipping.country
    }
    
    // Prepare order data
    const orderData: Omit<Order, 'id'> = {
      customerId,
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
      createdAt: serverTimestamp() as Timestamp,
      updatedAt: serverTimestamp() as Timestamp
    }
    
    // Create order in Firestore
    const orderRef = await addDoc(collection(db, ORDERS_COLLECTION), orderData)
    
    // Update customer's orders list
    const customerRef = doc(db, CUSTOMERS_COLLECTION, customerId)
    const customerSnap = await getDoc(customerRef)
    if (customerSnap.exists()) {
      const existingOrders = customerSnap.data().orders || []
      await setDoc(customerRef, {
        orders: [...existingOrders, orderRef.id],
        updatedAt: serverTimestamp()
      }, { merge: true })
    }
    
    return orderRef.id
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