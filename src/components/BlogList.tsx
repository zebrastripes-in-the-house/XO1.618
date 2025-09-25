import React, { useState, useEffect, useRef } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Blog {
  id: string;
  title: string;
  content: string;
  images: string[];
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
}

interface BlogListProps {
  blogs: Blog[];
  onBlogClick: (blog: Blog) => void;
}

export function BlogList({ blogs, onBlogClick }: BlogListProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to current blog on index change
  useEffect(() => {
    if (containerRef.current) {
      const blogElement = containerRef.current.children[currentIndex] as HTMLElement;
      if (blogElement) {
        blogElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }
  }, [currentIndex]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' && currentIndex > 0) {
        e.preventDefault();
        setCurrentIndex(currentIndex - 1);
      } else if (e.key === 'ArrowDown' && currentIndex < blogs.length - 1) {
        e.preventDefault();
        setCurrentIndex(currentIndex + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, blogs.length]);

  // Handle scroll navigation
  useEffect(() => {
    let isScrolling = false;

    const handleWheel = (e: WheelEvent) => {
      if (isScrolling) return;
      
      e.preventDefault();
      isScrolling = true;

      if (e.deltaY > 0 && currentIndex < blogs.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else if (e.deltaY < 0 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }

      setTimeout(() => {
        isScrolling = false;
      }, 700); // Increased to match transition duration
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [currentIndex, blogs.length]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPreviewText = (content: string) => {
    // Strip HTML tags and get first 150 characters
    const text = content.replace(/<[^>]*>/g, '').trim();
    return text.length > 150 ? text.substring(0, 150) + '...' : text;
  };

  const isValidImageUrl = (url: string) => {
    return url && (url.startsWith('http') || url.startsWith('data:'));
  };

  const isSolidColor = (coverImage: string) => {
    return coverImage && coverImage.startsWith('#');
  };

  if (blogs.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="border-2 border-border bg-card p-12">
            <h2 className="font-[JetBrains_Mono] mb-4 text-xl">NO POSTS YET</h2>
            <p className="text-muted-foreground">
              Start writing your first blog post.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-[104px] py-[0px] p-[0px]">
      <div className="w-full max-w-4xl mx-auto px-8">
        {/* Navigation Indicator */}
        <div className="fixed top-1/2 right-8 transform -translate-y-1/2 z-40 flex flex-col gap-2">
          {blogs.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 border-2 border-border transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-primary' 
                  : 'bg-background hover:bg-muted'
              }`}
            />
          ))}
        </div>

        {/* Navigation Instructions */}
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40">

        </div>

        {/* Blog Slideshow */}
        <div 
          ref={containerRef}
          className="relative"
          style={{ height: '80vh', position: 'sticky', top: 0, zIndex: 30, backgroundColor: 'var(--background)' }}
        >
          {blogs.map((blog, index) => {
            const distance = Math.abs(index - currentIndex);
            const isActive = index === currentIndex;
            const isPrev = index === currentIndex - 1;
            const isNext = index === currentIndex + 1;
            
            // Calculate positioning and scaling
            let transform = '';
            let scale = 1;
            let opacity = 0.3;
            let zIndex = 1;

            if (isActive) {
              transform = 'translateY(0)';
              scale = 1;
              opacity = 1;
              zIndex = 10;
            } else if (isPrev) {
              transform = 'translateY(-120%)'; // Increased gap
              scale = 1; // Keep same size
              opacity = 0.6;
              zIndex = 5;
            } else if (isNext) {
              transform = 'translateY(120%)'; // Increased gap
              scale = 1; // Keep same size
              opacity = 0.6;
              zIndex = 5;
            } else if (distance <= 2) {
              if (index < currentIndex) {
                transform = `translateY(-${140 + (distance - 1) * 30}%)`; // Increased gap
              } else {
                transform = `translateY(${140 + (distance - 1) * 30}%)`; // Increased gap
              }
              scale = 1; // Keep same size
              opacity = Math.max(0.2, 0.6 - (distance - 1) * 0.2);
              zIndex = Math.max(1, 5 - distance);
            } else {
              // Hide blogs that are too far away
              opacity = 0;
              scale = 1; // Keep same size
              zIndex = 0;
            }

            return (
              <div
                key={blog.id}
                className="absolute top-1/2 left-1/2 w-full cursor-pointer transition-all duration-700 ease-out"
                style={{
                  transform: `translate(-50%, -50%) ${transform} scale(${scale})`,
                  opacity,
                  zIndex,
                  pointerEvents: isActive ? 'auto' : 'none'
                }}
                onClick={() => isActive && onBlogClick(blog)}
              >
                <div className="bg-card border-2 border-border overflow-hidden max-w-2xl mx-auto">
                  {/* Cover Image */}
                  <div className="relative h-64 overflow-hidden">
                    {blog.coverImage && isSolidColor(blog.coverImage) ? (
                      <div 
                        className="w-full h-full flex items-center justify-center"
                        style={{ backgroundColor: blog.coverImage }}
                      >

                      </div>
                    ) : blog.coverImage && isValidImageUrl(blog.coverImage) ? (
                      <ImageWithFallback
                        src={blog.coverImage}
                        alt={`Cover for ${blog.title}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div 
                        className="w-full h-full flex items-center justify-center"
                        style={{ backgroundColor: '#808080' }}
                      >
                        <div className="text-white font-bold text-2xl tracking-wider opacity-20">
                          {blog.title.substring(0, 3).toUpperCase()}
                        </div>
                      </div>
                    )}
                    
                    {/* Date Overlay */}
                    <div className="absolute top-4 right-4 bg-background border-2 border-border px-3 py-1">
                      <span className="font-[JetBrains_Mono] text-sm">
                        {formatDate(blog.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    <h2 className="font-bold mb-4 text-2xl leading-tight">
                      {blog.title}
                    </h2>
                    
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {getPreviewText(blog.content)}
                    </p>

                    <div className="flex justify-between items-center">
                      <span className="font-[JetBrains_Mono] text-sm text-muted-foreground">
                        CLICK TO READ MORE →
                      </span>
                      
                      {blog.images && blog.images.length > 0 && (
                        <span className="font-[JetBrains_Mono] text-xs bg-muted px-2 py-1 border border-border">
                          {blog.images.length} IMAGE{blog.images.length !== 1 ? 'S' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <div className="fixed left-8 top-1/2 transform -translate-y-1/2 flex flex-col gap-4 z-40">
          <button
            onClick={() => currentIndex > 0 && setCurrentIndex(currentIndex - 1)}
            disabled={currentIndex === 0}
            className="w-12 h-12 border-2 border-border bg-background hover:bg-muted transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <span className="font-[JetBrains_Mono] text-lg">↑</span>
          </button>
          
          <button
            onClick={() => currentIndex < blogs.length - 1 && setCurrentIndex(currentIndex + 1)}
            disabled={currentIndex === blogs.length - 1}
            className="w-12 h-12 border-2 border-border bg-background hover:bg-muted transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <span className="font-[JetBrains_Mono] text-lg">↓</span>
          </button>
        </div>
      </div>
    </div>
  );
}