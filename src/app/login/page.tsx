'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '../auth/AuthContext'

interface LoginFormData {
  email: string
  password: string
}

export default function LoginPage() {
  const { login, error, loading, clearError, user } = useAuth()
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  })

  useEffect(() => {
    // Clear any existing errors when component mounts
    clearError()
  }, [clearError])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      await login(formData.email, formData.password)
    } catch (err) {
      // Error is handled by auth context
      console.error('Login failed:', err)
    }
  }

  return (
    <div className="min-h-screen bg-[#101114] flex items-center justify-center px-4 pt-28">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C8AA6E]"></span>
            Log In
          </h2>
          <p className="mt-2 text-sm text-white/60">
            Welcome back! Please enter your details
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && (
            <div className="text-red-500 text-sm text-center bg-red-500/10 py-2 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-4">
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
                placeholder="Enter your password"
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-white/10 bg-[#1E1E1E] text-[#C8AA6E] focus:ring-[#C8AA6E]"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-white/60">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link href="/forgot-password" className="text-[#C8AA6E] hover:text-[#D4B87A] transition-colors">
                Forgot password?
              </Link>
            </div>
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
              'Sign In'
            )}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#101114] text-white/60">Or Continue With</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              disabled={loading}
              className="flex items-center justify-center px-4 py-2 border border-white/10 rounded-lg text-white/80 hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Image
                src="/img/platforms/google.png"
                alt="Google"
                width={20}
                height={20}
                className="mr-2"
              />
              Google
            </button>
            <button
              type="button"
              disabled={loading}
              className="flex items-center justify-center px-4 py-2 border border-white/10 rounded-lg text-white/80 hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Image
                src="/img/platforms/facebook.png"
                alt="Facebook"
                width={20}
                height={20}
                className="mr-2"
              />
              Facebook
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