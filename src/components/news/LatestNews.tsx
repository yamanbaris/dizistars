'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarIcon, UserIcon, EyeIcon } from '@heroicons/react/24/outline';

// This would typically come from an API call
const mockNews = [
  {
    id: 1,
    slug: 'cagatay-ulusoy-to-star-in-new-netflix-series',
    title: 'Çağatay Ulusoy to Star in New Netflix Series',
    excerpt: 'Turkish star Çağatay Ulusoy has been cast in a new Netflix series...',
    category: 'Series',
    author: 'Admin',
    publishDate: 'March 15, 2024',
    views: '45K',
    featuredImage: '/images/news/cagatay-new-series.jpg'
  },
  {
    id: 2,
    slug: 'hande-ercel-signs-major-international-brand-deal',
    title: 'Hande Erçel Signs Major International Brand Deal',
    excerpt: 'Turkish actress Hande Erçel has signed a major deal with...',
    category: 'Business',
    author: 'Editor',
    publishDate: 'March 14, 2024',
    views: '32K',
    featuredImage: '/images/news/hande-brand-deal.jpg'
  },
  {
    id: 3,
    slug: 'burak-ozcivit-historical-drama-breaks-records',
    title: 'Burak Özçivit\'s Historical Drama Breaks Records',
    excerpt: 'The latest historical drama starring Burak Özçivit has broken...',
    category: 'Television',
    author: 'Senior Editor',
    publishDate: 'March 12, 2024',
    views: '78K',
    featuredImage: '/images/news/burak-drama.jpg'
  },
  {
    id: 4,
    slug: 'can-yaman-to-make-hollywood-debut',
    title: 'Can Yaman to Make Hollywood Debut',
    excerpt: 'Turkish star Can Yaman is set to make his Hollywood debut...',
    category: 'Movies',
    author: 'Editor',
    publishDate: 'March 10, 2024',
    views: '56K',
    featuredImage: '/images/news/can-hollywood.jpg'
  },
  {
    id: 5,
    slug: 'demet-ozdemir-joins-international-series-cast',
    title: 'Demet Özdemir Joins International Series Cast',
    excerpt: 'Popular Turkish actress Demet Özdemir has joined the cast...',
    category: 'Series',
    author: 'Admin',
    publishDate: 'March 8, 2024',
    views: '41K',
    featuredImage: '/images/news/demet-series.jpg'
  },
  {
    id: 6,
    slug: 'berguzar-korel-returns-to-television',
    title: 'Bergüzar Korel Returns to Television',
    excerpt: 'Beloved Turkish actress Bergüzar Korel announces her return...',
    category: 'Television',
    author: 'Senior Editor',
    publishDate: 'March 7, 2024',
    views: '38K',
    featuredImage: '/images/news/berguzar-return.jpg'
  }
];

export default function LatestNews() {
  const router = useRouter();

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-white">Latest News</h2>
          <Link 
            href="/news" 
            className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
          >
            View All
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockNews.map((article) => (
            <Link
              key={article.id}
              href={`/news/${article.slug}`}
              className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] cursor-pointer"
            >
              {/* Featured Image */}
              <div className="relative aspect-video">
                <Image
                  src={article.featuredImage}
                  alt={article.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2.5 py-0.5 bg-gray-700 text-gray-200 text-xs font-medium rounded">
                    {article.category}
                  </span>
                  <span className="text-gray-400 text-sm">
                    {article.publishDate}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-white mb-2 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                  {article.excerpt}
                </p>

                {/* Metadata */}
                <div className="flex items-center justify-between text-gray-500 text-sm">
                  <div className="flex items-center">
                    <UserIcon className="h-4 w-4 mr-1" />
                    {article.author}
                  </div>
                  <div className="flex items-center">
                    <EyeIcon className="h-4 w-4 mr-1" />
                    {article.views}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
} 