'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

const footerLinks = {
  explore: [
    { name: 'Stars', href: '/stars' },
    { name: 'Latest News', href: '/news' },
    { name: 'TV Series', href: '/series' },
    { name: 'Awards', href: '/awards' },
    { name: 'Events', href: '/events' }
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Press', href: '/press' },
    { name: 'Contact', href: '/contact' }
  ],
  legal: [
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Cookie Policy', href: '/cookies' }
  ],
  social: [
    { name: 'Instagram', href: 'https://instagram.com', icon: 'instagram' },
    { name: 'Twitter', href: 'https://twitter.com', icon: 'twitter' },
    { name: 'Facebook', href: 'https://facebook.com', icon: 'facebook' },
    { name: 'YouTube', href: 'https://youtube.com', icon: 'youtube' }
  ]
}

export default function Footer() {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement newsletter signup
    console.log('Newsletter signup:', email)
    setEmail('')
  }

  const SocialIcon = ({ icon }: { icon: string }) => {
    const iconPath = `/icons/${icon}.svg`
    return (
      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary/20 transition-colors">
        <Image src={iconPath} alt={icon} width={20} height={20} />
      </div>
    )
  }

  return (
    <footer className="bg-[#0A0A0A] border-t border-white/5">
      {/* Newsletter Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-3xl opacity-30" />
          <div className="relative bg-white/5 rounded-2xl p-8 md:p-12">
            <div className="max-w-3xl mx-auto text-center">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Stay Updated with DiziStars
              </h3>
              <p className="text-white/60 mb-8">
                Get exclusive updates about your favorite Turkish stars, upcoming shows, and behind-the-scenes content
              </p>
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  required
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="px-8 py-3 bg-primary text-dark font-medium rounded-full hover:bg-primary/90 transition-colors"
                >
                  Subscribe Now
                </motion.button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-block">
              <h2 className="text-2xl font-bold text-primary">DiziStars</h2>
            </Link>
            <p className="mt-4 text-white/60 leading-relaxed">
              Your premier destination for Turkish entertainment, bringing you closer to the stars who make the magic happen on screen.
            </p>
            <div className="mt-6 flex items-center gap-4">
              {footerLinks.social.map((item) => (
                <Link key={item.name} href={item.href} className="transition-transform hover:-translate-y-1">
                  <SocialIcon icon={item.icon} />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-semibold mb-4">Explore</h3>
            <ul className="space-y-3">
              {footerLinks.explore.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-white/60 hover:text-primary transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-white/60 hover:text-primary transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-white/60 hover:text-primary transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/40 text-sm">
              © {new Date().getFullYear()} DiziStars. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <span className="text-white/40 text-sm">Made with ❤️ for Turkish drama fans</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 