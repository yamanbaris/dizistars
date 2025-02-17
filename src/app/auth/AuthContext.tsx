import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  confirmPasswordReset: (token: string, newPassword: string) => Promise<void>
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in on mount
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (err) {
        console.error('Error checking auth:', err)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)
      
      // TODO: Replace with actual API call
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Simulate successful login
      const mockUser: User = {
        id: '1',
        name: 'John Doe',
        email: email,
        avatar: '/img/avatar-placeholder.jpg'
      }
      
      localStorage.setItem('user', JSON.stringify(mockUser))
      setUser(mockUser)
      router.push('/profile')
    } catch (err) {
      setError('Invalid email or password')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const signup = async (name: string, email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)
      
      // TODO: Replace with actual API call
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Simulate successful signup
      const mockUser: User = {
        id: '1',
        name: name,
        email: email,
        avatar: '/img/avatar-placeholder.jpg'
      }
      
      localStorage.setItem('user', JSON.stringify(mockUser))
      setUser(mockUser)
      router.push('/profile')
    } catch (err) {
      setError('Failed to create account')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setLoading(true)
      // TODO: Replace with actual API call
      localStorage.removeItem('user')
      setUser(null)
      router.push('/login')
    } catch (err) {
      setError('Failed to logout')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      setLoading(true)
      setError(null)
      
      // TODO: Replace with actual API call
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // In a real implementation, this would send a password reset email
      console.log('Password reset email sent to:', email)
    } catch (err) {
      setError('Failed to send password reset email')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const confirmPasswordReset = async (token: string, newPassword: string) => {
    try {
      setLoading(true)
      setError(null)
      
      // TODO: Replace with actual API call
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // In a real implementation, this would verify the token and update the password
      console.log('Password reset confirmed with token:', token)
    } catch (err) {
      setError('Failed to reset password')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const clearError = () => setError(null)

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        error,
        login,
        signup,
        logout,
        resetPassword,
        confirmPasswordReset,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 