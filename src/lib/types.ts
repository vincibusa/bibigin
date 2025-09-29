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

// Customer Types
export interface Address {
  street: string
  city: string
  postalCode: string
  country: string
  isDefault?: boolean
}

export interface Customer {
  id: string // Firebase UID
  email: string
  firstName: string
  lastName: string
  phone?: string
  defaultAddress?: Address
  orders: string[]
  createdAt: Date
  updatedAt: Date
}

// Order Types
export interface OrderItem {
  productId: string
  name: string
  price: number
  quantity: number
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

export interface Order {
  id: string
  customerId: string
  customerEmail: string
  items: OrderItem[]
  shipping: ShippingAddress
  billing?: ShippingAddress
  subtotal: number
  shipping_cost: number
  total: number
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentMethod: 'manual' | 'stripe' // Per ora solo manual
  paymentStatus: 'pending' | 'paid' | 'failed'
  notes?: string
  createdAt: Date
  updatedAt: Date
}

// Auth Types
export interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  photoURL?: string
  emailVerified: boolean
  createdAt: Date
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