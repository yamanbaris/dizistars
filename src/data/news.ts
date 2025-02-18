import { NewsArticle, NewsCategory, NewsFilter } from '@/types/news'

export const newsArticles: NewsArticle[] = [
  {
    id: '1',
    title: 'Price of Passion, Fatmagül, and more Kanal D International Dramas To Air in France',
    slug: 'price-of-passion-fatmagul-france',
    excerpt: 'Turkish superstar Çağatay Ulusoy is set to lead a new Netflix original series, marking his return to the streaming platform.',
    content: `Turkish actor Çağatay Ulusoy, known for his roles in "The Protector" and "Medcezir," is returning to Netflix in a new original series. The upcoming show, currently under wraps, is said to be a psychological thriller set in modern-day Istanbul.

The series, which begins production next month, will see Ulusoy in the role of a complex character navigating between two worlds. This marks his third collaboration with Netflix, following the success of "The Protector" and his appearance in the anthology series "Paper Lives."

Industry insiders suggest that the new project will be one of Netflix's most ambitious Turkish productions to date, with an international creative team and a storyline that bridges East and West.

"I'm excited to be part of this unique project," Ulusoy said in a statement. "The script is unlike anything I've read before, and I believe audiences worldwide will be captivated by the story we're going to tell."

The series is expected to premiere on Netflix in early 2025, with the first season consisting of eight episodes. Further casting announcements are expected in the coming weeks.`,
    coverImage: '/img/banners/serenay-sarikaya.jpg',
    category: 'Series',
    author: {
      name: 'Mehmet Yılmaz',
      avatar: '/img/authors/mehmet-yilmaz.jpg'
    },
    publishedAt: '2024-02-15T09:00:00Z',
    readTime: 4,
    tags: ['Netflix', 'Çağatay Ulusoy', 'Turkish Series', 'Streaming'],
    relatedArticles: ['2', '3']
  },
  {
    id: '2',
    title: 'Hande Erçel and Burak Deniz Join Forces in New Romantic Drama',
    slug: 'hande-ercel-burak-deniz-new-drama',
    excerpt: 'Two of Turkey\'s most beloved actors are set to star together in a highly anticipated romantic drama series.',
    content: `Turkish television's most anticipated collaboration of the year has been announced as Hande Erçel and Burak Deniz are set to star together in a new romantic drama series. The project, titled "Kalp Yarası" (Heart Wound), brings together two of the industry's most popular actors for the first time.

The series, produced by Ay Yapım, will tell the story of two individuals from different worlds whose paths cross in unexpected ways. The production promises to bring a fresh take on the romantic drama genre while maintaining the emotional depth that Turkish series are known for.

Both actors expressed their excitement about the project during the press conference held in Istanbul. "Working with Burak is something I've always looked forward to," Erçel shared. "The chemistry readings were incredible, and I believe we'll create something special."

Deniz, known for his powerful performances, added, "The script captured me from the first page. This isn't just another love story - it's a journey of self-discovery and growth."

The series is scheduled to begin airing in the fall season on Star TV, with international distribution rights already generating significant interest from multiple countries.`,
    coverImage: '/img/banners/burak-ozcivit.jpg',
    category: 'Series',
    author: {
      name: 'Ayşe Kaya',
      avatar: '/img/authors/ayse-kaya.jpg'
    },
    publishedAt: '2024-02-14T14:30:00Z',
    readTime: 5,
    tags: ['Hande Erçel', 'Burak Deniz', 'Turkish Drama', 'Star TV'],
    relatedArticles: ['1', '4']
  },
  {
    id: '3',
    title: 'Turkish TV Industry Sees Record International Sales in 2023',
    slug: 'turkish-tv-record-sales-2023',
    excerpt: 'Turkish television content reaches new heights in global markets, with exports exceeding previous records.',
    content: `The Turkish television industry has achieved unprecedented success in international markets during 2023, with content exports reaching a record-breaking $500 million. This milestone marks a significant increase from the previous year's figures and cements Turkey's position as one of the world's leading content exporters.

According to data released by the Turkish Exporters Assembly (TİM), Turkish TV series and formats are now broadcast in more than 150 countries across Europe, Latin America, and Asia. The industry's success has been attributed to high production values, compelling storytelling, and universal themes that resonate with global audiences.

"Turkish content has become a global phenomenon," says industry expert Dr. Ahmet Yıldırım. "Our series combine production quality with emotional depth in a way that appeals to diverse audiences worldwide."

Latin America remains the largest market for Turkish content, followed by Middle Eastern countries and increasingly, European nations. The success has also led to increased investment in the local industry, with production budgets reaching new heights.

Several factors have contributed to this success:
- Investment in production quality
- Strong international distribution networks
- Growing popularity of Turkish actors globally
- Adaptation of universal themes with local flavor

The industry is projected to continue its growth trajectory, with experts predicting exports could reach $750 million by 2025.`,
    coverImage: '/img/banners/can-yaman.jpeg',
    category: 'Industry',
    author: {
      name: 'Mehmet Yılmaz',
      avatar: '/img/authors/mehmet-yilmaz.jpg'
    },
    publishedAt: '2024-02-13T11:15:00Z',
    readTime: 6,
    tags: ['Industry News', 'Exports', 'Turkish Television', 'Global Market'],
    relatedArticles: ['5', '6']
  },
  {
    id: '4',
    title: 'Exclusive Interview: Can Yaman on His International Career',
    slug: 'can-yaman-interview-international-career',
    excerpt: 'Turkish star Can Yaman opens up about his growing international career and upcoming projects in exclusive interview.',
    content: `In an exclusive interview with DiziStars, international Turkish star Can Yaman discusses his expanding career beyond Turkey's borders and his upcoming projects. The actor, who has gained significant popularity in Italy and Spain, shares insights about his journey and future plans.

Speaking from Rome, where he's currently filming a new series, Yaman reflects on his transition from Turkish television to international productions. "It's been an incredible journey," he says. "The warmth I've received from fans worldwide has been overwhelming and motivating."

The actor discusses his approach to selecting roles: "I'm looking for characters that challenge me as an actor and stories that can connect with audiences across cultures. It's not just about being in international productions; it's about being part of meaningful projects."

Yaman also revealed details about his upcoming projects, including a new Italian series and a potential Hollywood collaboration. He emphasizes the importance of maintaining his connection with Turkish audiences while expanding internationally.

The interview touches on:
- His experience working in different production environments
- The challenges of acting in multiple languages
- His fitness routine and preparation for roles
- Future plans and dream projects
- His relationship with fans worldwide

"I'm grateful for where my career has taken me," Yaman concludes. "But I never forget my roots in Turkish television - it's what made me who I am today."`,
    coverImage: '/img/banners/serenay-sarikaya.jpg',
    category: 'Interviews',
    author: {
      name: 'Ayşe Kaya',
      avatar: '/img/authors/ayse-kaya.jpg'
    },
    publishedAt: '2024-02-12T16:45:00Z',
    readTime: 7,
    tags: ['Can Yaman', 'Interview', 'International Career', 'Italian TV'],
    relatedArticles: ['2', '5']
  },
  {
    id: '5',
    title: 'Behind the Scenes: Making of "Kara Sevda"',
    slug: 'behind-scenes-kara-sevda',
    excerpt: 'An exclusive look at the making of the internationally acclaimed series "Kara Sevda" and its impact on Turkish television.',
    content: `Five years after its finale, "Kara Sevda" (Endless Love) remains one of Turkey's most successful international series. In this exclusive behind-the-scenes look, we explore how this groundbreaking show was created and the elements that contributed to its worldwide success.

The series, which won an International Emmy Award, set new standards for Turkish television production. Through interviews with cast members, directors, and crew, we uncover the dedication and creativity that went into making each episode.

Burak Özçivit and Neslihan Atagül, the lead actors, share their memories of filming the intense emotional scenes that captivated audiences worldwide. "Every scene was approached with absolute commitment to authenticity," Özçivit reveals. "We wanted the emotions to feel real and raw."

Director Hilal Saral discusses the technical challenges and creative decisions that shaped the series: "We weren't just making a love story; we were creating an experience that would resonate with people across cultures."

The article includes:
- Never-before-seen set photos
- Production challenges and solutions
- Impact on Turkish television industry
- International reception and awards
- Legacy and influence on current productions

The success of "Kara Sevda" helped pave the way for other Turkish series in the international market and continues to influence production quality standards today.`,
    coverImage: '/img/banners/burak-ozcivit.jpg',
    category: 'Behind The Scenes',
    author: {
      name: 'Mehmet Yılmaz',
      avatar: '/img/authors/mehmet-yilmaz.jpg'
    },
    publishedAt: '2024-02-11T13:20:00Z',
    readTime: 8,
    tags: ['Kara Sevda', 'Behind The Scenes', 'Burak Özçivit', 'Neslihan Atagül'],
    relatedArticles: ['3', '6']
  }
]

export const getArticleBySlug = (slug: string): NewsArticle | undefined => {
  return newsArticles.find(article => article.slug === slug)
}

export const getRelatedArticles = (article: NewsArticle): NewsArticle[] => {
  if (!article.relatedArticles) return []
  return newsArticles.filter(a => article.relatedArticles?.includes(a.id))
}

export const filterArticles = (filters: NewsFilter): NewsArticle[] => {
  let filtered = [...newsArticles]

  if (filters.category) {
    filtered = filtered.filter(article => article.category === filters.category)
  }

  if (filters.tag && filters.tag.length > 0) {
    filtered = filtered.filter(article => article.tags.includes(filters.tag!))
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    filtered = filtered.filter(article =>
      article.title.toLowerCase().includes(searchLower) ||
      article.excerpt.toLowerCase().includes(searchLower) ||
      article.content.toLowerCase().includes(searchLower)
    )
  }

  // Sort by date (newest first)
  filtered.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

  // Handle pagination
  if (filters.page && filters.limit) {
    const start = (filters.page - 1) * filters.limit
    filtered = filtered.slice(start, start + filters.limit)
  }

  return filtered
}

export const getAllCategories = (): NewsCategory[] => {
  return [
    'Series',
    'Actors',
    'Industry',
    'Awards',
    'Interviews',
    'Behind The Scenes'
  ]
}

export const getAllTags = (): string[] => {
  const tagSet = new Set<string>()
  newsArticles.forEach(article => {
    article.tags.forEach(tag => tagSet.add(tag))
  })
  return Array.from(tagSet).sort()
} 