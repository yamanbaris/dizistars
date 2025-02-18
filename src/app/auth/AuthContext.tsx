import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import type { Session, User } from '@supabase/supabase-js'
import type { TableRow } from '@/types/supabase'

interface AuthUser extends TableRow<'users'> {}

interface AuthContextType {
  session: Session | null
  user: AuthUser | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  confirmPasswordReset: (token: string, newPassword: string) => Promise<void>
  updateProfile: (data: Partial<Omit<AuthUser, 'id' | 'email'>>) => Promise<void>
  clearError: () => void
}

export const AuthContext = createContext<AuthContextType | null>(null)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps): React.ReactElement {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session?.user) {
        loadUserData(session.user.id)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      if (session?.user) {
        await loadUserData(session.user.id)
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadUserData = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error loading user data:', error)
        setError(error.message)
        return null
      }

      if (!data) {
        setError('User not found')
        return null
      }

      setUser(data)
      return data
    } catch (err) {
      console.error('Error in loadUserData:', err)
      setError('Failed to load user data')
      return null
    }
  }

  const signup = async (name: string, email: string, password: string) => {
    try {
      setError(null)
      setLoading(true)

      // First, create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name // Store name in auth metadata
          }
        }
      })

      if (authError) throw authError

      if (authData.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('users')
          .insert([
            {
              id: authData.user.id,
              email,
              name,
              role: 'user',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ])

        if (profileError) {
          console.error('Error creating user profile:', profileError)
          // Delete the auth user if profile creation fails
          await supabase.auth.admin.deleteUser(authData.user.id)
          throw profileError
        }
      }

      router.push('/login')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during signup')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        setError(authError.message)
        return
      }

      if (!authData?.user) {
        setError('No user data returned')
        return
      }

      const userData = await loadUserData(authData.user.id)
      if (userData) {
        router.push('/')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('An error occurred during login')
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setError(null)
      setLoading(true)

      const { error } = await supabase.auth.signOut()
      if (error) throw error

      setUser(null)
      router.push('/login')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during logout')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) throw error
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred during password reset')
    } finally {
      setLoading(false)
    }
  }

  const confirmPasswordReset = async (token: string, newPassword: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) throw error

      router.push('/login')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred during password reset')
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (data: Partial<Omit<AuthUser, 'id' | 'email'>>) => {
    if (!user) {
      setError('No user logged in')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const { error } = await supabase
        .from('users')
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) throw error

      // Reload user data to get updated profile
      await loadUserData(user.id)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred while updating profile')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const clearError = () => setError(null)

  return (
    <AuthContext.Provider 
      value={{ 
        session, 
        user, 
        loading, 
        error, 
        signup, 
        login, 
        logout, 
        resetPassword, 
        confirmPasswordReset, 
        updateProfile,
        clearError 
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 