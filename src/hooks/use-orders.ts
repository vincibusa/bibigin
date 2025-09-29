'use client'

import { useState, useCallback } from 'react'
import { Order, CartItem, ShippingAddress } from '@/lib/types'
import { createOrder, getOrderById, calculateOrderTotals } from '@/lib/orders'

interface UseCreateOrderReturn {
  loading: boolean
  error: string | null
  createNewOrder: (items: CartItem[], shipping: ShippingAddress, email: string, notes?: string) => Promise<string>
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
    notes?: string
  ): Promise<string> => {
    try {
      setLoading(true)
      setError(null)
      
      const orderId = await createOrder(items, shipping, email, notes)
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