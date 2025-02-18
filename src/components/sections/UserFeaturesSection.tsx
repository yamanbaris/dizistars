'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'
import { useUserFeatures } from '@/app/features/UserFeaturesContext'

export default function UserFeaturesSection() {
  const {
    favorites,
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    removeFromFavorites
  } = useUserFeatures()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Favorites */}
      <div className="bg-[#1E1E1E] rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">Favorite Stars</h3>
          <Link
            href="/favorites"
            className="text-sm text-[#C8AA6E] hover:text-[#D4B87A] transition-colors"
          >
            View All
          </Link>
        </div>
        <div className="space-y-4">
          {favorites.slice(0, 3).map((favorite) => (
            <div key={favorite.id} className="flex gap-4 group">
              <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={favorite.stars?.profile_image_url || '/img/star-placeholder.jpeg'}
                  alt={favorite.stars?.full_name || 'Star'}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-white group-hover:text-[#C8AA6E] transition-colors line-clamp-2">
                  {favorite.stars?.full_name}
                </h4>
                <span className="text-sm text-white/60 mt-1 block">
                  Turkish Star
                </span>
                <button
                  onClick={() => removeFromFavorites(favorite.star_id)}
                  className="text-sm text-red-500 hover:text-red-400 transition-colors mt-2"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          {favorites.length === 0 && (
            <p className="text-white/60 text-sm">No favorite stars yet</p>
          )}
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-[#1E1E1E] rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white">Notifications</h3>
            {unreadNotificationsCount > 0 && (
              <span className="px-2 py-1 text-xs font-medium bg-[#C8AA6E] text-black rounded-full">
                {unreadNotificationsCount}
              </span>
            )}
          </div>
          <Link
            href="/notifications"
            className="text-sm text-[#C8AA6E] hover:text-[#D4B87A] transition-colors"
          >
            View All
          </Link>
        </div>
        <div className="space-y-4">
          {notifications.slice(0, 3).map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg ${
                notification.isRead ? 'bg-[#101114]' : 'bg-[#C8AA6E]/5'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-white/60 mt-1">
                    {notification.message}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <time className="text-xs text-white/40">
                      {format(new Date(notification.created_at), 'MMM d, yyyy')}
                    </time>
                    {!notification.isRead && (
                      <button
                        onClick={() => markNotificationAsRead(notification.id)}
                        className="text-xs text-[#C8AA6E] hover:text-[#D4B87A] transition-colors"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {notifications.length === 0 && (
            <p className="text-white/60 text-sm">No notifications yet</p>
          )}
        </div>
      </div>
    </div>
  )
} 