# DiziStars - Turkish Stars Platform

A comprehensive platform dedicated to Turkish entertainment, providing detailed information about actors, actresses, and the latest news about stars.

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **State Management**: React Context + Hooks
- **Image Optimization**: Next.js Image Component
- **Icons**: Heroicons
- **UI Components**: Custom components with Tailwind CSS

## Features

- Responsive design
- Authentication system
- Star profiles with detailed information
- News section with categories
- User features (favorites, comments, ratings)
- Admin dashboard
- Real-time updates
- Image upload and management
- Dark theme UI

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Git
- Supabase account

### Environment Setup

1. Clone the repository:
```bash
git clone https://github.com/yamanbaris/dizistars.git
cd dizistars
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up the database:
   - Create a new project in Supabase
   - Go to the SQL editor
   - Copy the contents of `src/lib/schema.sql`
   - Run the SQL queries to create the database schema

5. Run the development server:
```bash
npm run dev
# or
yarn dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Database Setup

The project uses Supabase as the backend. The database schema includes:

- `users`: User accounts and profiles
- `stars`: Star profiles and information
- `news`: News articles and content
- `comments`: User comments on stars and news
- `favorites`: User favorite stars
- `social_media`: Star social media links

Row Level Security (RLS) policies are implemented for data protection. See `src/lib/schema.sql` for the complete database schema and policies.

### Database Schema

#### Users Table (`users`)
- `id`: UUID (Primary Key)
- `email`: String
- `name`: String
- `avatar_url`: String (Optional)
- `role`: Enum ('admin', 'editor', 'user')
- `created_at`: Timestamp
- `updated_at`: Timestamp

#### Stars Table (`stars`)
- `id`: UUID (Primary Key)
- `full_name`: String
- `profile_image_url`: String (Optional)
- `star_type`: Enum ('actor', 'actress')
- `current_project`: String (Optional)
- `birth_date`: String
- `birth_place`: String
- `biography`: String
- `education`: String
- `cover_image_url`: String (Optional)
- `is_featured`: Boolean
- `is_trending`: Boolean
- `is_rising`: Boolean
- `is_influential`: Boolean
- `filmography`: JSON (Optional) - Complete filmography with details
- `gallery_images`: String Array (Optional) - Array of image URLs
- `slug`: String
- `created_at`: Timestamp
- `updated_at`: Timestamp

##### JSON Structures

###### Filmography JSON Structure
```json
[
  {
    "title": "String",
    "role": "String",
    "year": "Number",
    "streaming_on": "String (Optional)"
  }
]
```

#### News Table (`news`)
- `id`: UUID (Primary Key)
- `title`: String
- `slug`: String
- `content`: String
- `excerpt`: String
- `cover_image`: String
- `author_id`: UUID (Foreign Key → users.id)
- `status`: Enum ('published', 'draft', 'archived')
- `published_at`: Timestamp (Optional)
- `created_at`: Timestamp
- `updated_at`: Timestamp

#### Comments Table (`comments`)
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key → users.id)
- `target_type`: Enum ('star', 'news')
- `target_id`: UUID
- `content`: String
- `status`: Enum ('pending', 'approved', 'rejected')
- `created_at`: Timestamp
- `updated_at`: Timestamp

#### Favorites Table (`favorites`)
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key → users.id)
- `star_id`: UUID (Foreign Key → stars.id)
- `created_at`: Timestamp

#### Social Media Table (`social_media`)
- `id`: UUID (Primary Key)
- `star_id`: UUID (Foreign Key → stars.id)
- `platform`: Enum ('instagram', 'twitter', 'facebook', 'tiktok')
- `url`: String
- `created_at`: Timestamp
- `updated_at`: Timestamp

### Authentication

The project uses Supabase Auth with the following features:
- Email/password authentication
- Password reset
- Protected routes
- Role-based access control

### File Storage

Files are stored in Supabase Storage with the following buckets:
- `star_images`: Star profile and gallery images
- `news_images`: News article images
- `user_avatars`: User profile pictures
- `gallery_images`: General gallery images

### Development Guidelines

1. **TypeScript**
   - Use TypeScript for all new files
   - Define proper types and interfaces
   - Use the predefined types from `src/lib/supabase.ts`

2. **Components**
   - Create reusable components in `src/components`
   - Use Tailwind CSS for styling
   - Implement proper prop types
   - Add JSDoc comments for complex components

3. **Database Operations**
   - Use the functions from `src/lib/database.ts`
   - Handle errors appropriately
   - Use proper TypeScript types
   - Follow the established patterns

4. **State Management**
   - Use React Context for global state
   - Use local state for component-specific state
   - Implement proper loading and error states

5. **Authentication**
   - Use the `useAuth` hook for auth operations
   - Protect routes appropriately
   - Handle auth errors gracefully

6. **File Upload**
   - Use the `ImageUpload` component
   - Follow the established bucket structure
   - Handle upload errors appropriately

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Barış Yaman - [@yamanbaris](https://github.com/yamanbaris)

Project Link: [https://github.com/yamanbaris/dizistars](https://github.com/yamanbaris/dizistars)