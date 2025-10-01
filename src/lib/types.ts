// Tasting Note Structure
export interface TastingNote {
  phase: string
  note: string
}

// Product Types
export interface Product {
  id: string
  name: string
  price: number
  description: string
  imageUrl: string
  images: string[]
  alcoholContent: number
  bottleSize: number
  category: string
  featured: boolean
  sku: string
  stock: number
  status: 'active' | 'inactive'
  weight: number
  botanicals?: string[]
  tastingNotes?: TastingNote[]
  createdAt: Date
  updatedAt: Date
}

// Cart Types
export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  image: string
}

// Address Types
export interface Address {
  street: string
  city: string
  postalCode: string
  country: string
  isDefault?: boolean
}

// Order Types
export interface OrderItem {
  productId: string
  name: string
  productName: string // Per compatibilità gestionale
  price: number
  quantity: number
  total: number // Per compatibilità gestionale
  image: string
}

export interface ShippingAddress {
  firstName: string
  lastName: string
  street: string
  city: string
  postalCode: string
  country: string
  phone?: string
}

// Address type compatible with gestionale
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
  shipping: ShippingAddress
  shippingAddress: Address // Per compatibilità gestionale
  billingAddress: Address // Per compatibilità gestionale
  billing?: ShippingAddress
  subtotal: number
  shipping_cost: number
  total: number
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentMethod: 'manual' | 'stripe' // Per ora solo manual
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  notes?: string
  createdAt: Date
  updatedAt: Date
}

// User Types (unified User/Customer)
export interface User {
  id: string // Firebase UID
  email: string
  firstName: string
  lastName: string
  phone: string
  address: string
  city: string
  province: string
  postalCode: string
  country: string
  dateOfBirth: Date
  role: 1 | 2 // 1 = admin, 2 = normal user
  isActive: boolean
  acceptedTerms: boolean
  authProvider: 'email' | 'google'
  photoURL?: string
  emailVerified?: boolean
  // E-commerce fields
  orders: string[] // Order IDs
  totalSpent: number
  createdAt: Date
  updatedAt: Date
  lastLoginAt?: Date
}

// Cart State
export interface CartState {
  items: CartItem[]
  isOpen: boolean
  loading: boolean
  total: number
}

// Form Types
export interface LoginFormData {
  email: string
  password: string
}

export interface RegisterFormData {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
}

export interface CheckoutFormData {
  shipping: ShippingAddress
  billing?: ShippingAddress
  notes?: string
}