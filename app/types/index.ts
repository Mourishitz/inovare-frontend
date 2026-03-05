export enum UserRole {
  BRIDE = 1,  // Bride/Host
  ADMIN = 2   // Administrator
}

export interface User {
  id: string
  email: string
  username: string
  phone_number: string
  role: UserRole
  createdAt: string
  updatedAt: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: User
}

export interface Shower {
  ID: string
  brideId?: string
  title?: string
  date?: string
  location: string
  description?: string
  guests: number
  shower_date: string
  wedding_date: string
  host_id: number
  host?: User
  catalog_id?: number | null
  catalog?: Catalog | null
  preferences_id?: number | null
  preferences?: ShowerPreferences | null
  status?: ShowerStatus
  createdAt: string
  updatedAt: string
}

export interface ShowerPreferences {
  ID?: number
  style: string
  budget?: number
  guestCount?: number
  specialRequests?: string
  notes?: string
  favoriteColors?: string[]
  preferredBra?: string
  preferredModel?: string
  preferredPanties?: string
  size?: string
  allowedModels?: string[]
  notAllowedModels?: string
}

export enum ShowerStatus {
  DRAFT = 'draft',
  PREFERENCES_SET = 'preferences_set',
  CATALOG_IN_PROGRESS = 'catalog_in_progress',
  CATALOG_READY = 'catalog_ready',
  APPROVED = 'approved',
  COMPLETED = 'completed'
}

export interface Catalog {
  ID: string
  showerId?: string
  name?: string
  products?: Product[]
  status?: CatalogStatus
  approved: boolean
  url: string
  package: string
  createdAt: string
  updatedAt: string
}

export enum CatalogStatus {
  DRAFT = 'draft',
  READY_FOR_REVIEW = 'ready_for_review',
  APPROVED = 'approved',
  CHANGES_REQUESTED = 'changes_requested'
}

export interface Product {
  id: string
  name: string  // e.g., "Conjunto de Renda", "Baby Doll"
  description: string
  price: number
  imageUrl: string
  category: string  // e.g., "Conjunto", "Baby Doll", "Camisola", "Robe"
  inStock: boolean
}

export interface Review {
  id: string
  catalogId: string
  userId: string
  approved: boolean
  comments: string
  createdAt: string
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}
