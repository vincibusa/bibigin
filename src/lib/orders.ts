import { Order, CartItem, ShippingAddress } from './types'
import {
  createOrder as apiCreateOrder,
  getOrderById as apiGetOrderById,
  getUserOrders as apiGetUserOrders,
  formatOrderNumber as apiFormatOrderNumber,
  getEstimatedDelivery as apiGetEstimatedDelivery,
  sendOrderEmails
} from './api-client'
import { calculateShippingCost } from './shipping'

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
 * Create a new order via API and send confirmation emails
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

    // Create the order
    const orderId = await apiCreateOrder({
      items: items.map(item => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      shipping,
      customerEmail,
      userId,
      notes
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
 * Get order by ID via API
 */
export async function getOrderById(orderId: string): Promise<Order | null> {
  try {
    const order = await apiGetOrderById(orderId)
    if (!order) return null

    // Convert date strings back to Date objects
    return {
      ...order,
      createdAt: new Date(order.createdAt),
      updatedAt: new Date(order.updatedAt)
    } as Order
  } catch (error) {
    console.error('Error fetching order:', error)
    throw new Error('Errore nel caricamento dell\'ordine')
  }
}

/**
 * Get user orders via API
 */
export async function getUserOrders(userId: string): Promise<Order[]> {
  try {
    const orders = await apiGetUserOrders(userId)
    // Convert date strings back to Date objects
    return orders.map(order => ({
      ...order,
      createdAt: new Date(order.createdAt),
      updatedAt: new Date(order.updatedAt)
    })) as Order[]
  } catch (error) {
    console.error('Error fetching user orders:', error)
    return []
  }
}

/**
 * Format order number for display
 */
export function formatOrderNumber(orderId: string): string {
  return apiFormatOrderNumber(orderId)
}

/**
 * Calculate estimated delivery date (7 business days)
 */
export function getEstimatedDelivery(): string {
  return apiGetEstimatedDelivery()
}