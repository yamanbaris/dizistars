'use client'

import React, { useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import ProtectedRoute from '../auth/ProtectedRoute'
import { AvatarUpload } from '@/components/profile/AvatarUpload'
import { Toaster } from 'sonner'

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>('profile')

  if (loading) {
    return (
      <div className="min-h-screen bg-[#101114] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C8AA6E]"></div>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#101114] pt-28 pb-16">
        <div className="container mx-auto px-4">
          <Toaster />
          {/* Profile Header */}
          <div className="relative mb-8">
            {/* Cover Image */}
            <div className="h-48 md:h-64 rounded-xl overflow-hidden bg-gradient-to-r from-[#C8AA6E]/20 to-[#C8AA6E]/10">
              <div className="w-full h-full bg-[url('/img/cover-pattern.png')] bg-repeat opacity-10" />
            </div>

            {/* Profile Info */}
            <div className="flex flex-col md:flex-row gap-6 -mt-16 px-4">
              {/* Avatar */}
              <AvatarUpload 
                currentAvatarUrl={user?.avatar_url}
                onUploadComplete={() => {
                  // Avatar update is handled by the component
                }}
              />

              {/* User Info */}
              <div className="flex-1 pt-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
                    <p className="text-white/60 text-sm">{user?.email}</p>
                    <p className="text-white/60 text-sm mt-1">Role: {user?.role}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-white/10 mb-8">
            <div className="flex gap-8">
              {['profile', 'settings'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as typeof activeTab)}
                  className={`px-4 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab
                      ? 'border-[#C8AA6E] text-[#C8AA6E]'
                      : 'border-transparent text-white/60 hover:text-white'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Profile Content */}
          {activeTab === 'profile' && (
            <div className="space-y-8">
              <div className="bg-[#1E1E1E] rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">About</h3>
                <p className="text-white/60">
                  Member since {new Date(user?.created_at || '').toLocaleDateString()}
                </p>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-[#1E1E1E] rounded-lg p-6 space-y-6">
                <h3 className="text-lg font-semibold text-white">Account Settings</h3>
                
                {/* Email Notifications */}
                <div>
                  <h4 className="text-white font-medium mb-4">Email Notifications</h4>
                  <div className="space-y-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-white/10 bg-[#101114] text-[#C8AA6E] focus:ring-[#C8AA6E]"
                      />
                      <span className="ml-2 text-white/80">Email notifications</span>
                    </label>
                  </div>
                </div>

                {/* Privacy Settings */}
                <div>
                  <h4 className="text-white font-medium mb-4">Privacy</h4>
                  <div className="space-y-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-white/10 bg-[#101114] text-[#C8AA6E] focus:ring-[#C8AA6E]"
                      />
                      <span className="ml-2 text-white/80">Make profile private</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
} 