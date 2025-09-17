# XO1.618 - Blog Platform

A modern blog platform built with React, Vite, and Supabase. Features a rich text editor with image upload support and both local storage and cloud sync capabilities.

## Features

- 📝 Rich text editor with formatting tools
- 🖼️ Image upload and drag & drop support
- 💾 Auto-save drafts
- 🌐 Cloud sync with Supabase (optional)
- 📱 Responsive design
- 🎨 Modern UI with dark mode support

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### Configuration

The app works in two modes:

#### Local Storage Mode (Default)

The app will work out of the box using local storage for data persistence. No additional configuration required.

#### Cloud Sync Mode (Optional)

To enable cloud sync with Supabase:

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
3. Create a `posts` table in your Supabase database with the following schema:
   ```sql
   CREATE TABLE posts (
     id TEXT PRIMARY KEY,
     title TEXT NOT NULL,
     content TEXT NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     is_draft BOOLEAN DEFAULT false
   );
   ```

## Usage

1. **Home Page**: View all published posts
2. **New Post**: Click "New Post" to create a new blog post
3. **Rich Text Editor**:
   - Type your content with automatic formatting
   - Use the toolbar that appears when you select text
   - Upload images by clicking "Add Images" or drag & drop
   - Auto-save drafts every 2 seconds
4. **Publishing**: Click "Publish" to make your post public

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Tech Stack

- React 19
- Vite
- React Router DOM
- Supabase
- Lucide React (icons)
- CSS3 with modern features

## Troubleshooting

If you encounter issues:

1. **Supabase connection errors**: Check your environment variables
2. **Image upload not working**: Ensure you're using a modern browser
3. **Styling issues**: Clear browser cache and restart the dev server

## License

MIT
