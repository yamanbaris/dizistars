'use client'

import React from 'react'
import { motion } from 'framer-motion'
import SectionHeader from '@/components/ui/SectionHeader'

interface NewsArticle {
  id: number
  title: string
  excerpt: string
  date: string
  category: string
  image: string
}

interface NewsSectionProps {
  title?: string
  subtitle?: string
  articles: NewsArticle[]
  showNewsletter?: boolean
}

export default function NewsSection({
  title = "Latest News",
  subtitle = "Stay updated with the latest happenings in Turkish entertainment",
  articles,
  showNewsletter = true
}: NewsSectionProps) {
  return (
    <section className="py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          title={title}
          subtitle={subtitle}
        />

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <div className="bg-dark/50 rounded-lg overflow-hidden border border-primary/10 hover:border-primary/30 transition-colors">
                {/* Image */}
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/80 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="px-3 py-1 bg-primary/90 text-dark text-sm font-medium rounded">
                      {article.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <time className="text-third/60 text-sm">
                    {new Date(article.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                  <h3 className="text-xl font-semibold text-light mt-2 mb-3">
                    {article.title}
                  </h3>
                  <p className="text-third/80 mb-4">
                    {article.excerpt}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-primary font-medium hover:text-secondary transition-colors"
                  >
                    Read More →
                  </motion.button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Newsletter Section */}
        {showNewsletter && (
          <div className="mt-16 py-12 px-6 bg-primary/5 rounded-2xl border border-primary/20">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4">
                Never Miss an Update
              </h2>
              <p className="text-third/80 mb-8">
                Subscribe to our newsletter and stay informed about your favorite Turkish stars
              </p>
              <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-lg bg-dark border border-primary/20 text-light focus:outline-none focus:border-primary transition-colors"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="px-6 py-2 bg-primary text-dark font-medium rounded-lg hover:bg-secondary transition-colors"
                >
                  Subscribe
                </motion.button>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
