'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '../auth/AuthContext'

export default function ForgotPasswordPage() {
  const { resetPassword, error, loading, clearError } = useAuth()
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    clearError()
    
    try {
      await resetPassword(email)
      setIsSubmitted(true)
    } catch (err) {
      console.error('Password reset request failed:', err)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#101114] flex items-center justify-center px-4 pt-28">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="mx-auto w-16 h-16 bg-[#C8AA6E]/10 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-[#C8AA6E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white">Check your email</h2>
          <p className="text-white/60">
            We've sent password reset instructions to {email}
          </p>
          <div className="pt-4">
            <Link
              href="/login"
              className="text-[#C8AA6E] hover:text-[#D4B87A] transition-colors"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#101114] flex items-center justify-center px-4 pt-28">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C8AA6E]"></span>
            Reset Password
          </h2>
          <p className="mt-2 text-sm text-white/60">
            Enter your email address and we'll send you instructions to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && (
            <div className="text-red-500 text-sm text-center bg-red-500/10 py-2 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="text-sm font-medium text-white/80">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-4 py-3 bg-[#1E1E1E] rounded-lg text-white placeholder-white/40 border border-white/10 focus:ring-2 focus:ring-[#C8AA6E] focus:border-transparent transition-colors"
              placeholder="Enter your email"
              disabled={loading}
            />
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
              'Send Reset Instructions'
            )}
          </button>

          <p className="text-center text-sm text-white/60">
            Remember your password?{' '}
            <Link href="/login" className="text-[#C8AA6E] hover:text-[#D4B87A] transition-colors">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
} 