import React, { useState, useEffect, lazy, Suspense } from 'react';
import { ThemeToggle } from './components/ThemeToggle';
import { blogApi } from './utils/blogApi';

// Lazy load heavy components
const BlogEditor = lazy(() => import('./components/BlogEditor').then(module => ({ default: module.BlogEditor })));
const BlogList = lazy(() => import('./components/BlogList').then(module => ({ default: module.BlogList })));
const BlogDetail = lazy(() => import('./components/BlogDetail').then(module => ({ default: module.BlogDetail })));

interface Blog {
  id: string;
  title: string;
  content: string; // Simple markdown-style content with inline images
  images: string[]; // Keep for backward compatibility
  coverImage?: string; // Cover image URL or solid color
  createdAt: string;
  updatedAt: string;
}

type View = 'home' | 'editor' | 'detail';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load blogs only when needed
  useEffect(() => {
    if (currentView === 'home') {
      loadBlogs();
    }
  }, [currentView]);

  // Theme management
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    setIsDarkMode(shouldUseDark);
    document.documentElement.classList.toggle('dark', shouldUseDark);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    document.documentElement.classList.toggle('dark', newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const loadBlogs = async () => {
    setIsLoading(true);
    try {
      console.log('Loading blogs...');
      const fetchedBlogs = await blogApi.getAllBlogsLegacy();
      console.log(`Loaded ${fetchedBlogs.length} blogs`);
      setBlogs(fetchedBlogs);
    } catch (error) {
      console.error('Error loading blogs:', error);
      // Set empty array on error to prevent crash
      setBlogs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveBlog = async (blogData: { title: string; content: string; images: string[]; coverImage?: string }) => {
    setIsLoading(true);
    try {
      if (editingBlog) {
        // Update existing blog
        const updatedBlog = await blogApi.updateBlog(editingBlog.id, blogData);
        setBlogs(blogs.map(blog => blog.id === editingBlog.id ? updatedBlog : blog));
        setEditingBlog(null);
      } else {
        // Create new blog
        const newBlog = await blogApi.createBlog(blogData);
        setBlogs([newBlog, ...blogs]);
      }
      setCurrentView('home');
    } catch (error) {
      console.error('Error saving blog:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBlog = async (blog: Blog) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    setIsLoading(true);
    try {
      await blogApi.deleteBlog(blog.id);
      setBlogs(blogs.filter(b => b.id !== blog.id));
      setCurrentView('home');
      setSelectedBlog(null);
    } catch (error) {
      console.error('Error deleting blog:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBlogClick = (blog: Blog) => {
    setSelectedBlog(blog);
    setCurrentView('detail');
  };

  const handleEditBlog = (blog: Blog) => {
    setEditingBlog(blog);
    setCurrentView('editor');
  };

  const handleNewPost = () => {
    setEditingBlog(null);
    setCurrentView('editor');
  };

  const handleCancel = () => {
    setEditingBlog(null);
    setCurrentView('home');
  };

  const handleBack = () => {
    setSelectedBlog(null);
    setCurrentView('home');
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Theme Toggle - Fixed Position */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle isDark={isDarkMode} onToggle={toggleTheme} />
      </div>

      {/* Hero Section */}
      <header className="w-full sticky top-0 z-40 bg-background border-border">
        <div className="max-w-4xl mx-auto p-8">
          <div className="text-center">
            <h1
              className="font-[Ciguatera] text-4xl font-medium cursor-pointer text-[64px]"
              onClick={() => setCurrentView("home")}
            >
              XO1.618
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {isLoading && (
          <div className="w-full max-w-4xl mx-auto p-8 text-center">
            <div className="border-2 border-border bg-card p-8">
              <p className="font-[JetBrains_Mono]">LOADING...</p>
            </div>
          </div>
        )}

        <Suspense
          fallback={
            <div className="w-full max-w-4xl mx-auto p-8 text-center">
              <div className="border-2 border-border bg-card p-8">
                <p className="mono">LOADING...</p>
              </div>
            </div>
          }
        >
          {!isLoading && currentView === "home" && (
            <>
              <BlogList blogs={blogs} onBlogClick={handleBlogClick} />
              {/* New Post Button - Fixed Position */}
              <div className="fixed bottom-8 right-1/2 transform translate-x-1/2 z-50">
                <button
                  onClick={handleNewPost}
                  className="brutalist-btn font-[JetBrains_Mono] text-sm px-6 py-3 bg-primary text-primary-foreground border-primary"
                  disabled={isLoading}
                >
                  + NEW POST
                </button>
              </div>
            </>
          )}

          {!isLoading && currentView === "editor" && (
            <BlogEditor
              onSave={handleSaveBlog}
              onCancel={handleCancel}
              initialBlog={
                editingBlog
                  ? {
                      title: editingBlog.title,
                      content: editingBlog.content,
                      images: editingBlog.images,
                      coverImage: editingBlog.coverImage,
                    }
                  : undefined
              }
            />
          )}

          {!isLoading && currentView === "detail" && selectedBlog && (
            <BlogDetail
              blog={selectedBlog}
              onBack={handleBack}
              onEdit={() => handleEditBlog(selectedBlog)}
              onDelete={() => handleDeleteBlog(selectedBlog)}
            />
          )}
        </Suspense>
      </main>
    </div>
  );
}