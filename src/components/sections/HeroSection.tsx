import React, { useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { addTouchHandlers, isMobileDevice } from '@/lib/mobile-utils'

interface HeroSectionProps {
  title: string
  subtitle: string
  backgroundImage: string
}

export default function HeroSection({ title, subtitle, backgroundImage }: HeroSectionProps) {
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (heroRef.current && isMobileDevice()) {
      return addTouchHandlers(heroRef.current, {
        onSwipe: (direction) => {
          if (direction === 'up') {
            // Smooth scroll to content section
            window.scrollTo({
              top: window.innerHeight,
              behavior: 'smooth'
            })
          }
        }
      })
    }
  }, [])

  return (
    <div 
      ref={heroRef}
      className="relative min-h-[85vh] w-full overflow-hidden bg-gradient-to-br from-dark via-dark/95 to-dark/90"
    >
      {/* Decorative Elements - Optimized for mobile */}
      <div className="absolute inset-0 opacity-20 md:opacity-30">
        <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-primary/20 via-transparent to-transparent blur-2xl md:blur-3xl" />
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-secondary/20 via-transparent to-transparent blur-2xl md:blur-3xl" />
      </div>

      {/* Background Pattern - Reduced complexity for mobile */}
      <div className="absolute inset-0 opacity-[0.03] md:opacity-5">
        <div className="h-full w-full bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:2rem_2rem] md:bg-[size:4rem_4rem]" />
      </div>

      <div className="relative h-full max-w-[90rem] mx-auto px-4 md:px-8 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 h-full items-center">
          {/* Text Content - Mobile optimized */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 md:space-y-8 text-center lg:text-left"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium"
              >
                Discover Turkish Talent
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl sm:text-5xl md:text-7xl font-bold text-light leading-tight"
              >
                {title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg md:text-xl text-third/80 max-w-xl mx-auto lg:mx-0"
              >
                {subtitle}
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4"
            >
              <button 
                className="w-full sm:w-auto px-8 py-4 md:py-3 rounded-lg bg-primary text-dark font-medium hover:bg-primary/90 transition-colors active:bg-primary/80 touch-manipulation"
                role="button"
                aria-label="Explore Stars"
              >
                Explore Stars
              </button>
              <button 
                className="w-full sm:w-auto px-8 py-4 md:py-3 rounded-lg bg-dark border border-primary/20 text-light font-medium hover:border-primary transition-colors active:bg-white/5 touch-manipulation"
                role="button"
                aria-label="View Categories"
              >
                View Categories
              </button>
            </motion.div>

            {/* Mobile scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 text-white/40 text-sm block lg:hidden text-center"
            >
              Swipe up to explore more
              <div className="mt-2 animate-bounce">
                <svg 
                  className="w-6 h-6 mx-auto" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M19 14l-7 7m0 0l-7-7m7 7V3" 
                  />
                </svg>
              </div>
            </motion.div>
          </motion.div>

          {/* Image Section - Mobile optimized */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative h-[400px] sm:h-[500px] lg:h-[600px] rounded-[2rem] overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/20 to-transparent z-10" />
            <Image
              src={backgroundImage}
              alt="Hero background"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover rounded-[2rem]"
              priority
            />
            {/* Decorative Border */}
            <div className="absolute inset-0 border border-primary/10 rounded-[2rem] z-20" />
          </motion.div>
        </div>
      </div>
    </div>
  )
} 