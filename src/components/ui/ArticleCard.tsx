import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { NewsArticle } from '@/types/news'

interface ArticleCardProps {
  article: NewsArticle
  variant?: 'default' | 'featured' | 'simple'
}

export default function ArticleCard({ article, variant = 'default' }: ArticleCardProps) {
  const isFeatured = variant === 'featured'
  const isSimple = variant === 'simple'

  return (
    <article className={`group relative overflow-hidden rounded-xl bg-[#1E1E1E] transition-transform hover:-translate-y-1 ${
      isFeatured ? 'lg:col-span-2 lg:row-span-2' : ''
    }`}>
      <Link href={`/news/${article.slug}`} className="block">
        <div className={`relative ${
          isFeatured ? 'aspect-[2/1]' : 'aspect-[3/2]'
        }`}>
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes={isFeatured 
              ? "(max-width: 768px) 100vw, (max-width: 1024px) 66vw, 50vw"
              : "(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 25vw"
            }
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        </div>

        <div className="absolute inset-0 p-5 flex flex-col justify-end">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="inline-block px-2.5 py-1 text-xs font-medium bg-[#C8AA6E] text-black rounded">
                {article.category}
              </span>
              {!isSimple && (
                <span className="text-sm text-white/60">
                  {format(new Date(article.publishedAt), 'MMM d, yyyy')}
                </span>
              )}
            </div>

            <h3 className={`font-bold text-white line-clamp-2 ${
              isFeatured ? 'text-2xl' : 'text-lg'
            }`}>
              {article.title}
            </h3>

            {!isSimple && (
              <>
                <p className={`text-white/80 line-clamp-2 ${
                  isFeatured ? 'text-base' : 'text-sm'
                }`}>
                  {article.excerpt}
                </p>

                <div className="flex items-center gap-4 pt-2">
                  <div className="flex items-center gap-2">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden">
                      <Image
                        src={article.author.avatar}
                        alt={article.author.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-sm text-white/80">{article.author.name}</span>
                  </div>
                  <span className="text-sm text-white/60">{article.readTime} min read</span>
                </div>
              </>
            )}
          </div>
        </div>
      </Link>
    </article>
  )
} 