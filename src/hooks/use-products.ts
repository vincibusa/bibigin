import { useState, useEffect, useCallback } from 'react'
import { 
  getActiveProducts, 
  getProductById, 
  getMainProduct,
  subscribeToActiveProducts,
  subscribeToMainProduct
} from '@/lib/products'
import { Product } from '@/lib/types'

interface UseProductsState {
  products: Product[]
  loading: boolean
  error: string | null
}

interface UseProductsReturn extends UseProductsState {
  refetch: () => Promise<void>
  getProduct: (id: string) => Product | undefined
}

/**
 * Hook for managing multiple products with real-time updates
 */
export function useProducts(): UseProductsReturn {
  const [state, setState] = useState<UseProductsState>({
    products: [],
    loading: true,
    error: null
  })

  const refetch = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      const products = await getActiveProducts()
      setState(prev => ({ ...prev, products, loading: false }))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Errore nel caricamento dei prodotti'
      setState(prev => ({ ...prev, error: errorMessage, loading: false }))
    }
  }, [])

  const getProduct = useCallback((id: string) => {
    return state.products.find(product => product.id === id)
  }, [state.products])

  // Setup real-time subscription
  useEffect(() => {
    const unsubscribe = subscribeToActiveProducts((products) => {
      setState(prev => ({
        ...prev,
        products,
        loading: false,
        error: null
      }))
    })

    return unsubscribe
  }, [])

  return {
    ...state,
    refetch,
    getProduct
  }
}

interface UseProductState {
  product: Product | null
  loading: boolean
  error: string | null
}

interface UseProductReturn extends UseProductState {
  refetch: () => Promise<void>
}

/**
 * Hook for managing a single product
 */
export function useProduct(productId: string): UseProductReturn {
  const [state, setState] = useState<UseProductState>({
    product: null,
    loading: true,
    error: null
  })

  const refetch = useCallback(async () => {
    if (!productId) return

    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      const product = await getProductById(productId)
      setState(prev => ({ ...prev, product, loading: false }))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Errore nel caricamento del prodotto'
      setState(prev => ({ ...prev, error: errorMessage, loading: false }))
    }
  }, [productId])

  useEffect(() => {
    if (productId) {
      refetch()
    }
  }, [productId, refetch])

  return {
    ...state,
    refetch
  }
}

interface UseMainProductState {
  product: Product | null
  loading: boolean
  error: string | null
  isAvailable: boolean
}

interface UseMainProductReturn extends UseMainProductState {
  refetch: () => Promise<void>
}

/**
 * Hook for the main product (single-product store)
 */
export function useMainProduct(): UseMainProductReturn {
  const [state, setState] = useState<UseMainProductState>({
    product: null,
    loading: true,
    error: null,
    isAvailable: false
  })

  const refetch = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      const product = await getMainProduct()
      const isAvailable = product ? product.status === 'active' && product.stock > 0 : false
      setState(prev => ({ 
        ...prev, 
        product, 
        loading: false, 
        isAvailable 
      }))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Errore nel caricamento del prodotto'
      setState(prev => ({ 
        ...prev, 
        error: errorMessage, 
        loading: false, 
        isAvailable: false 
      }))
    }
  }, [])

  // Setup real-time subscription for main product
  useEffect(() => {
    const unsubscribe = subscribeToMainProduct((product) => {
      const isAvailable = product ? product.status === 'active' && product.stock > 0 : false
      setState(prev => ({
        ...prev,
        product,
        loading: false,
        error: null,
        isAvailable
      }))
    })

    return unsubscribe
  }, [])

  return {
    ...state,
    refetch
  }
}