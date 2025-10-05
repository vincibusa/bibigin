import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  query, 
  where,
  orderBy,
  onSnapshot,
  Timestamp
} from 'firebase/firestore'
import { db } from './firebase'
import { Product } from './types'

const PRODUCTS_COLLECTION = 'products'

// Helper function to convert Firestore data to Product
function convertFirestoreProduct(id: string, data: Record<string, unknown>): Product {
  return {
    id,
    ...data,
    createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
    updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date()
  } as Product
}

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
    
    const querySnapshot = await getDocs(q)
    const products: Product[] = []
    
    querySnapshot.forEach((doc) => {
      products.push(convertFirestoreProduct(doc.id, doc.data()))
    })
    
    return products
  } catch (error) {
    console.error('Error fetching active products:', error)
    throw new Error('Errore nel caricamento dei prodotti')
  }
}

/**
 * Get a single product by ID from Firestore
 */
export async function getProductById(productId: string): Promise<Product | null> {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, productId)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      return convertFirestoreProduct(docSnap.id, docSnap.data())
    } else {
      return null
    }
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
): () => void {
  const q = query(
    collection(db, PRODUCTS_COLLECTION), 
    where('status', '==', 'active'),
    orderBy('createdAt', 'desc')
  )

  return onSnapshot(q, (querySnapshot) => {
    const products: Product[] = []
    
    querySnapshot.forEach((doc) => {
      products.push(convertFirestoreProduct(doc.id, doc.data()))
    })
    
    callback(products)
  }, (error) => {
    console.error('Error in products subscription:', error)
    callback([])
  })
}

/**
 * Subscribe to real-time updates for the main product
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

