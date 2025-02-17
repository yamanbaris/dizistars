'use client'

import React from 'react'
import MainLayout from '@/components/layout/MainLayout'
import { AuthProvider } from './auth/AuthContext'
import { UserFeaturesProvider } from './features/UserFeaturesContext'

interface ClientLayoutProps {
  children: React.ReactNode
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <AuthProvider>
      <UserFeaturesProvider>
        <MainLayout>{children}</MainLayout>
      </UserFeaturesProvider>
    </AuthProvider>
  )
} 