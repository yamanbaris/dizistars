'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '../auth/AuthContext'
import { useRouter } from 'next/navigation'

interface SignupFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export default function SignupPage() {
  const { signup, error, loading, clearError, user } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState<SignupFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [validationError, setValidationError] = useState<string>('')

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
    // Clear validation error when user starts typing
    setValidationError('')
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setValidationError('')

    // Validate password
    if (formData.password !== formData.confirmPassword) {
      setValidationError('Passwords do not match')
      return
    }

    if (formData.password.length < 8) {
      setValidationError('Password must be at least 8 characters long')
      return
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setValidationError('Please enter a valid email address')
      return
    }

    // Validate name
    if (formData.name.trim().length < 2) {
      setValidationError('Name must be at least 2 characters long')
      return
    }

    try {
      await signup(formData.name, formData.email, formData.password)
      // Redirect is handled in the auth context
    } catch (err) {
      // Error is handled by auth context
      console.error('Signup failed:', err)
    }
  }

  const displayError = validationError || error

  return (
    <div className="min-h-screen bg-[#101114] flex items-center justify-center px-4 pt-28">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C8AA6E]"></span>
            Create Account
          </h2>
          <p className="mt-2 text-sm text-white/60">
            Join our community today
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {displayError && (
            <div className="text-red-500 text-sm text-center bg-red-500/10 py-2 rounded-lg">
              {displayError}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="text-sm font-medium text-white/80">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-3 bg-[#1E1E1E] rounded-lg text-white placeholder-white/40 border border-white/10 focus:ring-2 focus:ring-[#C8AA6E] focus:border-transparent transition-colors"
                placeholder="Enter your full name"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="email" className="text-sm font-medium text-white/80">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-3 bg-[#1E1E1E] rounded-lg text-white placeholder-white/40 border border-white/10 focus:ring-2 focus:ring-[#C8AA6E] focus:border-transparent transition-colors"
                placeholder="Enter your email"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="text-sm font-medium text-white/80">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-3 bg-[#1E1E1E] rounded-lg text-white placeholder-white/40 border border-white/10 focus:ring-2 focus:ring-[#C8AA6E] focus:border-transparent transition-colors"
                placeholder="Create a password"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="text-sm font-medium text-white/80">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-3 bg-[#1E1E1E] rounded-lg text-white placeholder-white/40 border border-white/10 focus:ring-2 focus:ring-[#C8AA6E] focus:border-transparent transition-colors"
                placeholder="Confirm your password"
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 rounded border-white/10 bg-[#1E1E1E] text-[#C8AA6E] focus:ring-[#C8AA6E]"
              disabled={loading}
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-white/60">
              I agree to the{' '}
              <Link href="/terms" className="text-[#C8AA6E] hover:text-[#D4B87A] transition-colors">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-[#C8AA6E] hover:text-[#D4B87A] transition-colors">
                Privacy Policy
              </Link>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-[#C8AA6E] text-black rounded-lg text-sm font-medium hover:bg-[#D4B87A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              'Create Account'
            )}
          </button>

          <p className="text-center text-sm text-white/60">
            Already have an account?{' '}
            <Link href="/login" className="text-[#C8AA6E] hover:text-[#D4B87A] transition-colors">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
} 