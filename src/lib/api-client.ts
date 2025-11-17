import { auth } from './firebase'
import { calculateShippingCost } from './shipping'

// Base URL for API requests
const API_BASE_URL =  'https://gestionale--bibiginlacorte.europe-west4.hosted.app'


/**
 * Get Firebase ID token for authenticated requests
 */
async function getAuthToken(): Promise<string | null> {
  const user = auth.currentUser
  if (!user) return null

  try {
    const token = await user.getIdToken()
    return token
  } catch (error) {
    console.error('Error getting auth token:', error)
    return null
  }
}

/**
 * Make authenticated API request
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getAuthToken()

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  // Merge with existing headers
  if (options.headers) {
    const existingHeaders = new Headers(options.headers)
    existingHeaders.forEach((value, key) => {
      headers[key] = value
    })
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }))

    // If unauthorized and no token was provided, give a more helpful error
    if (response.status === 401 && !token) {
      throw new Error('Authentication required. Please log in to continue.')
    }

    throw new Error(error.error || `API request failed: ${response.status}`)
  }

  return response.json()
}

// ============= PRODUCTS API =============

export interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  status: 'active' | 'inactive' | 'out_of_stock'
  category?: string
  sku: string
  imageUrl?: string
  images?: string[]
  featured?: boolean
  bottleSize?: number
  alcoholContent?: number
  createdAt: string
  updatedAt: string
}

/**
 * Get all active products
 */
export async function getActiveProducts(): Promise<Product[]> {
  const data = await apiRequest<{ products: Product[] }>('/api/products?status=active')
  return data.products
}

/**
 * Get product by ID
 */
export async function getProductById(productId: string): Promise<Product | null> {
  try {
    const data = await apiRequest<{ product: Product }>(`/api/products/${productId}`)
    return data.product
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

// ============= ORDERS API =============

export interface OrderItem {
  productId: string
  productName: string
  name?: string
  quantity: number
  price: number
  total: number
  image?: string
}

export interface ShippingAddress {
  street: string
  city: string
  postalCode: string
  country: string
}

export interface Address {
  street: string
  city: string
  state: string
  postalCode: string
  country: string
}

export interface Order {
  id: string
  customerId: string
  customerEmail: string
  items: OrderItem[]
  shipping?: ShippingAddress
  shippingAddress?: Address
  billingAddress?: Address
  subtotal?: number
  shipping_cost?: number
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentMethod?: string
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface CreateOrderData {
  items: {
    productId: string
    name: string
    price: number
    quantity: number
    image?: string
  }[]
  shipping: ShippingAddress
  customerEmail: string
  userId: string
  notes?: string
}

/**
 * Create a new order
 */
export async function createOrder(orderData: CreateOrderData): Promise<string> {
  // Calculate totals
  const subtotal = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  // Calculate dynamic shipping cost based on number of bottles
  const totalBottles = orderData.items.reduce((sum, item) => sum + item.quantity, 0)
  const shipping_cost = calculateShippingCost(totalBottles)

  const total = subtotal + shipping_cost

  // Convert to API format
  const apiOrderData = {
    customerId: orderData.userId,
    customerEmail: orderData.customerEmail,
    items: orderData.items.map(item => ({
      productId: item.productId,
      productName: item.name,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      total: item.price * item.quantity,
      image: item.image
    })),
    shippingAddress: {
      street: orderData.shipping.street,
      city: orderData.shipping.city,
      state: orderData.shipping.city,
      postalCode: orderData.shipping.postalCode,
      country: orderData.shipping.country
    },
    billingAddress: {
      street: orderData.shipping.street,
      city: orderData.shipping.city,
      state: orderData.shipping.city,
      postalCode: orderData.shipping.postalCode,
      country: orderData.shipping.country
    },
    subtotal,
    shipping_cost,
    total,
    status: 'pending',
    paymentMethod: 'manual',
    paymentStatus: 'pending',
    notes: orderData.notes
  }

  const response = await apiRequest<{ id: string }>('/api/orders', {
    method: 'POST',
    body: JSON.stringify(apiOrderData)
  })

  return response.id
}

/**
 * Get order by ID
 */
export async function getOrderById(orderId: string): Promise<Order | null> {
  try {
    const data = await apiRequest<{ order: Order }>(`/api/orders/${orderId}`)
    return data.order
  } catch (error) {
    console.error('Error fetching order:', error)
    return null
  }
}

/**
 * Get user orders
 */
export async function getUserOrders(userId: string): Promise<Order[]> {
  try {
    const data = await apiRequest<{ orders: Order[] }>(`/api/orders?customerId=${userId}`)
    return data.orders
  } catch (error) {
    console.error('Error fetching user orders:', error)
    return []
  }
}

/**
 * Send order confirmation emails (customer + admin)
 */
export async function sendOrderEmails(order: Order, customer: {
  firstName: string
  lastName: string
  email: string
  phone?: string
}): Promise<void> {
  try {
    await apiRequest('/api/emails/send-order-emails', {
      method: 'POST',
      body: JSON.stringify({ order, customer })
    })
  } catch (error) {
    console.error('Error sending order emails:', error)
    // Don't throw - email failure shouldn't fail the order creation
  }
}

// ============= USERS API =============

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
  createdAt: string
  updatedAt: string
}

/**
 * Get user profile
 */
export async function getUserProfile(userId: string): Promise<User | null> {
  try {
    const data = await apiRequest<{ user: User }>(`/api/users/${userId}`)
    return data.user
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return null
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  userId: string,
  updates: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'role' | 'isActive' | 'totalSpent' | 'orders'>>
): Promise<void> {
  await apiRequest(`/api/users/${userId}`, {
    method: 'PATCH',
    body: JSON.stringify(updates)
  })
}

// ============= HELPER FUNCTIONS =============

/**
 * Check if a product is available for purchase
 */
export function isProductAvailable(product: Product): boolean {
  return product.status === 'active' && product.stock > 0
}

/**
 * Format order number for display
 */
export function formatOrderNumber(orderId: string): string {
  return `#${orderId.substring(0, 8).toUpperCase()}`
}

/**
 * Calculate estimated delivery date (7 days)
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
