'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface ArtistCardProps {
  id: number
  name: string
  image: string
  type: 'actor' | 'actress'
  currentProject?: string
}

export default function ArtistCard({ id, name, image, type, currentProject }: ArtistCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="group relative"
    >
      <Link href={`/${type}s/${id}`}>
        <div className="actor-card ottoman-frame">
          <div className="aspect-[3/4] relative overflow-hidden rounded-lg">
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="actor-overlay">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-light">{name}</h3>
                {currentProject && (
                  <p className="text-sm text-third/80">
                    Currently in: {currentProject}
                  </p>
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-2 px-4 py-2 bg-primary text-dark font-medium rounded hover:bg-secondary transition-colors"
                >
                  View Profile
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
} 