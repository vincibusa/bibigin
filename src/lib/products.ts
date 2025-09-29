import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy,
  onSnapshot,
  Unsubscribe
} from 'firebase/firestore'
import { db } from './firebase'
import { Product } from './types'

// Constants
const PRODUCTS_COLLECTION = 'products'

/**
 * Get all active products from Firestore
 */
export async function getActiveProducts(): Promise<Product[]> {
  try {
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc')
    )
    
    const snapshot = await getDocs(q)
    const products: Product[] = []
    
    snapshot.forEach((doc) => {
      const data = doc.data()
      products.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
      } as Product)
    })
    
    return products
  } catch (error) {
    console.error('Error fetching active products:', error)
    throw new Error('Errore nel caricamento dei prodotti')
  }
}

/**
 * Get a single product by ID
 */
export async function getProductById(productId: string): Promise<Product | null> {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, productId)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      const data = docSnap.data()
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
      } as Product
    }
    
    return null
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
 */
export function subscribeToActiveProducts(
  callback: (products: Product[]) => void
): Unsubscribe {
  const q = query(
    collection(db, PRODUCTS_COLLECTION),
    where('status', '==', 'active'),
    orderBy('createdAt', 'desc')
  )
  
  return onSnapshot(
    q,
    (snapshot) => {
      const products: Product[] = []
      
      snapshot.forEach((doc) => {
        const data = doc.data()
        products.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        } as Product)
      })
      
      callback(products)
    },
    (error) => {
      console.error('Error in products subscription:', error)
      callback([])
    }
  )
}

/**
 * Subscribe to real-time updates for the main product
 */
export function subscribeToMainProduct(
  callback: (product: Product | null) => void
): Unsubscribe {
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