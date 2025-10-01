import { Product } from './types'
import { getActiveProducts as apiGetActiveProducts, getProductById as apiGetProductById } from './api-client'

/**
 * Get all active products from API
 */
export async function getActiveProducts(): Promise<Product[]> {
  try {
    const products = await apiGetActiveProducts()
    // Convert date strings back to Date objects
    return products.map(p => ({
      ...p,
      createdAt: new Date(p.createdAt),
      updatedAt: new Date(p.updatedAt)
    })) as Product[]
  } catch (error) {
    console.error('Error fetching active products:', error)
    throw new Error('Errore nel caricamento dei prodotti')
  }
}

/**
 * Get a single product by ID from API
 */
export async function getProductById(productId: string): Promise<Product | null> {
  try {
    const product = await apiGetProductById(productId)
    if (!product) return null

    // Convert date strings back to Date objects
    return {
      ...product,
      createdAt: new Date(product.createdAt),
      updatedAt: new Date(product.updatedAt)
    } as Product
  } catch (error) {
    console.error('Error fetching product:', error)
    throw new Error('Errore nel caricamento del prodotto')
  }
}

/**
 * Get the first active product (for single-product store)
 */
export async function getMainProduct(): Promise<Product | null> {
  try {
    const products = await getActiveProducts()
    return products.length > 0 ? products[0] : null
  } catch (error) {
    console.error('Error fetching main product:', error)
    throw new Error('Errore nel caricamento del prodotto principale')
  }
}

/**
 * Subscribe to real-time updates for active products
 * Note: Polling-based implementation (API doesn't support real-time subscriptions)
 */
export function subscribeToActiveProducts(
  callback: (products: Product[]) => void
): () => void {
  // Initial fetch
  getActiveProducts().then(callback).catch(error => {
    console.error('Error in products subscription:', error)
    callback([])
  })

  // Poll every 30 seconds for updates
  const intervalId = setInterval(() => {
    getActiveProducts().then(callback).catch(error => {
      console.error('Error in products subscription:', error)
      callback([])
    })
  }, 30000)

  // Return unsubscribe function
  return () => clearInterval(intervalId)
}

/**
 * Subscribe to real-time updates for the main product
 * Note: Polling-based implementation
 */
export function subscribeToMainProduct(
  callback: (product: Product | null) => void
): () => void {
  return subscribeToActiveProducts((products) => {
    callback(products.length > 0 ? products[0] : null)
  })
}

/**
 * Check if a product is available for purchase
 */
export function isProductAvailable(product: Product): boolean {
  return product.status === 'active' && product.stock > 0
}

/**
 * Get product display information for cart/checkout
 */
export function getProductDisplayInfo(product: Product) {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.imageUrl || product.images?.[0] || '/logo.png',
    volume: `${product.bottleSize}L`,
    alcohol: `${product.alcoholContent}°`
  }
}

// Re-export from api-client for convenience
export { isProductAvailable as isProductAvailableAPI } from './api-client'