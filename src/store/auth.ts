import { create } from 'zustand'

export interface User {
  id: number
  display_name: string
  username: string
  email: string
  profile_url: string
  registered: string
  status: number
  role_id?: number
  twofa?: number
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => (
  {
    user: null,
    token: null,
    isAuthenticated: false,
    setUser: (user) => set({ user, isAuthenticated: !!user }),
    setToken: (token) => set({ token }),
    logout: () => set({ user: null, token: null, isAuthenticated: false }),
  }
))

export interface AdminState {
  users: User[]
  loading: boolean
  error: string | null
  setUsers: (users: User[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useAdminStore = create<AdminState>((set) => (
  {
    users: [],
    loading: false,
    error: null,
    setUsers: (users) => set({ users }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
  }
))