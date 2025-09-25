import { projectId, publicAnonKey } from './supabase/info';

interface Blog {
  id: string;
  title: string;
  content: string;
  images: string[];
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
}

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-538d7667`;

const defaultHeaders = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${publicAnonKey}`,
};

export const blogApi = {
  async createBlog(blogData: { title: string; content: string; images: string[]; coverImage?: string }): Promise<Blog> {
    const response = await fetch(`${BASE_URL}/blog`, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify(blogData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create blog post');
    }

    const result = await response.json();
    return result.blog;
  },

  async updateBlog(id: string, blogData: { title: string; content: string; images: string[]; coverImage?: string }): Promise<Blog> {
    const response = await fetch(`${BASE_URL}/blog/${id}`, {
      method: 'PUT',
      headers: defaultHeaders,
      body: JSON.stringify(blogData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update blog post');
    }

    const result = await response.json();
    return result.blog;
  },

  async getAllBlogs(page = 1, limit = 10): Promise<{ blogs: Blog[], total: number, hasMore: boolean }> {
    const response = await fetch(`${BASE_URL}/blogs?page=${page}&limit=${limit}`, {
      headers: defaultHeaders,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch blog posts');
    }

    const result = await response.json();
    return {
      blogs: result.blogs || [],
      total: result.total || 0,
      hasMore: result.hasMore || false
    };
  },

  // Keep backward compatibility  
  async getAllBlogsLegacy(): Promise<Blog[]> {
    try {
      console.log('Fetching blogs...');
      
      const response = await fetch(`${BASE_URL}/blogs`, {
        headers: defaultHeaders,
      });

      if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`);
        return [];
      }

      const result = await response.json();
      const blogs = Array.isArray(result.blogs) ? result.blogs : [];
      console.log(`Successfully loaded ${blogs.length} blogs`);
      return blogs;
    } catch (error) {
      console.error('Error fetching blogs:', error.message || error);
      return [];
    }
  },

  async getBlog(id: string): Promise<Blog> {
    const response = await fetch(`${BASE_URL}/blog/${id}`, {
      headers: defaultHeaders,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch blog post');
    }

    const result = await response.json();
    return result.blog;
  },

  async deleteBlog(id: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/blog/${id}`, {
      method: 'DELETE',
      headers: defaultHeaders,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete blog post');
    }
  },
};