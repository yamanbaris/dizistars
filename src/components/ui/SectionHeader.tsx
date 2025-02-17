'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  align?: 'left' | 'center'
}

export default function SectionHeader({ 
  title, 
  subtitle, 
  align = 'left' 
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mb-12 relative ${align === 'center' ? 'text-center' : ''}`}
    >
      <h2 className="text-2xl md:text-4xl font-bold text-primary mb-4 relative inline-block">
        {title}
        <motion.div
          className="absolute -bottom-2 left-0 right-0 h-1 bg-primary/20"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.2 }}
        />
      </h2>
      {subtitle && (
        <p className="text-lg text-third/80 max-w-2xl">
          {subtitle}
        </p>
      )}
    </motion.div>
  )
} 