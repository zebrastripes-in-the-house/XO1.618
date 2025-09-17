# Supabase Setup Guide for XO1.618 Blog Platform

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: `xo1-618-blog` (or any name you prefer)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the closest region to your users
6. Click "Create new project"
7. Wait for the project to be set up (this takes a few minutes)

## 2. Get Your Project Credentials

1. Once your project is ready, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **anon public** key (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

## 3. Create Environment Variables

Create a `.env` file in your project root with:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important**: Replace the placeholder values with your actual credentials!

## 4. Create the Posts Table

1. Go to **Table Editor** in your Supabase dashboard
2. Click **Create a new table**
3. Use these settings:
   - **Name**: `posts`
   - **Description**: `Blog posts table`
4. Add the following columns:

| Column Name  | Type          | Default Value | Nullable | Primary Key |
| ------------ | ------------- | ------------- | -------- | ----------- |
| `id`         | `text`        | -             | No       | Yes         |
| `title`      | `text`        | -             | No       | No          |
| `content`    | `text`        | -             | No       | No          |
| `created_at` | `timestamptz` | `now()`       | No       | No          |
| `updated_at` | `timestamptz` | `now()`       | No       | No          |
| `is_draft`   | `boolean`     | `true`        | No       | No          |

5. Click **Save**

## 5. Set Up Row Level Security (RLS)

1. Go to **Authentication** → **Policies**
2. Click **New Policy** for the `posts` table
3. Create a policy with these settings:
   - **Policy Name**: `Enable all operations for all users`
   - **Allowed Operation**: `All`
   - **Target Roles**: `public`
   - **USING expression**: `true`
   - **WITH CHECK expression**: `true`
4. Click **Save**

## 6. Enable Real-time (Optional)

1. Go to **Database** → **Replication**
2. Find the `posts` table
3. Toggle **Enable** for real-time updates

## 7. Test Your Setup

1. Start your development server: `npm run dev`
2. Create a new post in the editor
3. Check your Supabase dashboard → **Table Editor** → **posts** to see if the data appears
4. Verify that posts appear on the home page

## 8. Database Schema

Your `posts` table should have this structure:

```sql
CREATE TABLE posts (
  id text PRIMARY KEY,
  title text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  is_draft boolean DEFAULT true NOT NULL
);
```

## 9. Features Enabled

With this setup, your blog platform will have:

- ✅ **Auto-save**: Drafts are automatically saved every 2 seconds
- ✅ **Cloud Sync**: All posts are stored in Supabase
- ✅ **Real-time Updates**: Changes sync across devices
- ✅ **Draft Management**: Separate draft and published posts
- ✅ **Fallback Support**: Falls back to localStorage if Supabase is unavailable
- ✅ **Rich Text Editor**: Full formatting with images, lists, etc.

## 10. Troubleshooting

### Common Issues:

1. **"Supabase not configured" warning**: Check your `.env` file has the correct credentials
2. **Posts not saving**: Verify RLS policies are set up correctly
3. **CORS errors**: Make sure your domain is added to allowed origins in Supabase settings
4. **Connection issues**: Check your internet connection and Supabase project status

### Debug Steps:

1. Check browser console for errors
2. Verify environment variables are loaded: `console.log(import.meta.env.VITE_SUPABASE_URL)`
3. Check Supabase logs in the dashboard
4. Test with a simple query in the Supabase SQL editor

## 11. Production Deployment

When deploying to production:

1. Update your environment variables in your hosting platform
2. Add your production domain to Supabase allowed origins
3. Consider setting up proper RLS policies for security
4. Enable database backups in Supabase

## 12. Security Considerations

- The current setup allows anyone to read/write posts (good for a personal blog)
- For multi-user blogs, implement proper authentication
- Consider adding user roles and permissions
- Enable audit logs for content moderation

---

Your blog platform is now ready with full Supabase integration! 🎉
