'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '../auth/AuthContext'
import { useRouter } from 'next/navigation'

interface LoginFormData {
  email: string
  password: string
}

export default function LoginPage() {
  const { login, error, loading, clearError, user } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  })

  useEffect(() => {
    // Clear any existing errors when component mounts
    clearError()
    // Redirect if already logged in
    if (user) {
      router.push('/profile')
    }
  }, [clearError, user, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      return
    }

    try {
      await login(formData.email, formData.password)
      // Redirect is handled in the auth context
    } catch (err) {
      // Error is handled by auth context
      console.error('Login failed:', err)
    }
  }

  return (
    <div className="min-h-screen bg-[#101114] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-[#1E1E1E] p-8 rounded-xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="appearance-none relative block w-full px-4 py-3 border border-white/10 bg-[#101114] placeholder-white/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8AA6E] focus:border-transparent"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="appearance-none relative block w-full px-4 py-3 border border-white/10 bg-[#101114] placeholder-white/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8AA6E] focus:border-transparent"
                placeholder="Password"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-black bg-[#C8AA6E] hover:bg-[#D4B87A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C8AA6E] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <p className="text-center text-sm text-white/60">
            Don't have an account?{' '}
            <Link href="/signup" className="text-[#C8AA6E] hover:text-[#D4B87A] transition-colors">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
} 