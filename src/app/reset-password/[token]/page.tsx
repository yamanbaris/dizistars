'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '../../auth/AuthContext'

interface ResetPasswordFormData {
  password: string
  confirmPassword: string
}

export default function ResetPasswordPage({
  params
}: {
  params: { token: string }
}) {
  const { confirmPasswordReset, error, loading, clearError } = useAuth()
  const [formData, setFormData] = useState<ResetPasswordFormData>({
    password: '',
    confirmPassword: ''
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [validationError, setValidationError] = useState<string>('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    clearError()
    setValidationError('')

    if (formData.password !== formData.confirmPassword) {
      setValidationError('Passwords do not match')
      return
    }

    if (formData.password.length < 8) {
      setValidationError('Password must be at least 8 characters long')
      return
    }

    try {
      await confirmPasswordReset(params.token, formData.password)
      setIsSubmitted(true)
    } catch (err) {
      console.error('Password reset failed:', err)
    }
  }

  const displayError = validationError || error

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#101114] flex items-center justify-center px-4 pt-28">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="mx-auto w-16 h-16 bg-[#C8AA6E]/10 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-[#C8AA6E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white">Password reset successful</h2>
          <p className="text-white/60">
            Your password has been reset successfully. You can now log in with your new password.
          </p>
          <div className="pt-4">
            <Link
              href="/login"
              className="text-[#C8AA6E] hover:text-[#D4B87A] transition-colors"
            >
              Go to Login
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
            Set New Password
          </h2>
          <p className="mt-2 text-sm text-white/60">
            Enter your new password below.
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
              <label htmlFor="password" className="text-sm font-medium text-white/80">
                New Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-3 bg-[#1E1E1E] rounded-lg text-white placeholder-white/40 border border-white/10 focus:ring-2 focus:ring-[#C8AA6E] focus:border-transparent transition-colors"
                placeholder="Enter your new password"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="text-sm font-medium text-white/80">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-3 bg-[#1E1E1E] rounded-lg text-white placeholder-white/40 border border-white/10 focus:ring-2 focus:ring-[#C8AA6E] focus:border-transparent transition-colors"
                placeholder="Confirm your new password"
                disabled={loading}
              />
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
              'Reset Password'
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