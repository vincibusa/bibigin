'use client'

import { useState, useCallback, useEffect } from 'react'
import { Order, CartItem, ShippingAddress } from '@/lib/types'
import { createOrder, getOrderById, calculateOrderTotals } from '@/lib/orders'
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface UseCreateOrderReturn {
  loading: boolean
  error: string | null
  createNewOrder: (items: CartItem[], shipping: ShippingAddress, email: string, userId: string, notes?: string) => Promise<string>
  clearError: () => void
}

/**
 * Hook for creating orders (frontend checkout)
 */
export function useCreateOrder(): UseCreateOrderReturn {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createNewOrder = useCallback(async (
    items: CartItem[], 
    shipping: ShippingAddress, 
    email: string,
    userId: string,
    notes?: string
  ): Promise<string> => {
    try {
      setLoading(true)
      setError(null)
      
      const orderId = await createOrder(items, shipping, email, userId, notes)
      return orderId
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Errore nella creazione dell\'ordine'
      setError(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    loading,
    error,
    createNewOrder,
    clearError
  }
}

interface UseOrderReturn {
  order: Order | null
  loading: boolean
  error: string | null
  fetchOrder: (id: string) => Promise<void>
}

/**
 * Hook for fetching a single order (for success page)
 */
export function useOrder(): UseOrderReturn {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchOrder = useCallback(async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      const orderData = await getOrderById(id)
      setOrder(orderData)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Errore nel caricamento dell\'ordine'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    order,
    loading,
    error,
    fetchOrder
  }
}

/**
 * Hook for order calculations (cart totals)
 */
export function useOrderCalculations() {
  const calculateTotals = useCallback((items: CartItem[]) => {
    return calculateOrderTotals(items)
  }, [])

  return {
    calculateTotals
  }
}

interface UseOrdersReturn {
  orders: Order[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

/**
 * Hook for fetching all orders for a user
 */
export function useOrders(customerId: string): UseOrdersReturn {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = useCallback(async () => {
    if (!customerId) {
      setOrders([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Query orders collection for this customer
      const ordersRef = collection(db, 'orders')
      const q = query(
        ordersRef,
        where('customerId', '==', customerId),
        orderBy('createdAt', 'desc')
      )

      const querySnapshot = await getDocs(q)
      const ordersData: Order[] = []

      querySnapshot.forEach((doc) => {
        const data = doc.data()
        ordersData.push({
          id: doc.id,
          customerId: data.customerId,
          customerEmail: data.customerEmail,
          items: data.items || [],
          shipping: data.shipping,
          shippingAddress: data.shippingAddress,
          billingAddress: data.billingAddress,
          billing: data.billing,
          subtotal: data.subtotal,
          shipping_cost: data.shipping_cost,
          total: data.total,
          status: data.status || 'pending',
          paymentMethod: data.paymentMethod || 'manual',
          paymentStatus: data.paymentStatus || 'pending',
          notes: data.notes,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        })
      })

      setOrders(ordersData)
    } catch (err) {
      console.error('Error fetching orders:', err)
      const message = err instanceof Error ? err.message : 'Errore nel caricamento degli ordini'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [customerId])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  return {
    orders,
    loading,
    error,
    refetch: fetchOrders
  }
}