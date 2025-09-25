import React from 'react';
import { RichTextRenderer } from './RichTextRenderer';

interface BlogPostProps {
  title: string;
  content: string;
  images: string[];
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
  isPreview?: boolean;
  onClick?: () => void;
}

export function BlogPost({ 
  title, 
  content, 
  images, 
  coverImage,
  createdAt, 
  updatedAt, 
  isPreview = false,
  onClick 
}: BlogPostProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPreviewText = (maxLength: number = 150) => {
    // Handle both HTML and markdown content
    const isHtmlContent = content.includes('<') && content.includes('>');
    
    if (isHtmlContent) {
      // Extract text from HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = content;
      const textOnly = tempDiv.textContent || tempDiv.innerText || '';
      
      return textOnly.length > maxLength 
        ? textOnly.substring(0, maxLength) + '...'
        : textOnly;
    } else {
      // Extract text from markdown content, removing image syntax and formatting
      const textOnly = content
        .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '') // Remove images
        .replace(/[#*`]/g, '') // Remove markdown formatting
        .replace(/\n+/g, ' ') // Replace newlines with spaces
        .trim();
      
      return textOnly.length > maxLength 
        ? textOnly.substring(0, maxLength) + '...'
        : textOnly;
    }
  };

  const getPreviewImage = () => {
    // Extract first image from markdown content
    const imageMatch = content.match(/!\[([^\]]*)\]\(([^)]+)\)/);
    if (imageMatch) return imageMatch[2];
    
    // Fall back to images array
    return images.length > 0 ? images[0] : null;
  };

  return (
    <article 
      className={`border-2 border-border bg-card p-8 ${isPreview ? 'h-80' : ''} ${onClick ? 'cursor-pointer hover:bg-muted transition-colors' : ''}`}
      onClick={onClick}
    >
      {/* Cover Image */}
      {coverImage && (
        <div className="mb-4 -mx-8 -mt-8">
          {coverImage.startsWith('#') ? (
            <div 
              className="w-full h-32 border-b-2 border-border"
              style={{ backgroundColor: coverImage }}
            />
          ) : (
            <img
              src={coverImage}
              alt={`Cover for ${title}`}
              className="w-full h-32 object-cover border-b-2 border-border"
            />
          )}
        </div>
      )}

      {/* Header */}
      <header className="mb-4 border-b border-border pb-3">
        <h1 className="mb-2 font-medium text-lg line-clamp-2">{title}</h1>
        <div className="flex gap-4 font-[JetBrains_Mono] text-xs text-muted-foreground">
          <time>CREATED: {formatDate(createdAt)}</time>
          {updatedAt !== createdAt && (
            <time>UPDATED: {formatDate(updatedAt)}</time>
          )}
        </div>
      </header>

      {/* Content with inline image */}
      <div className="flex-1 overflow-hidden">
        {/* First image inline if exists (preview only) */}
        {isPreview && getPreviewImage() && (
          <div className="float-right ml-4 mb-2 w-24 h-24">
            <img
              src={getPreviewImage()!}
              alt="Blog preview"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className={`max-w-none ${isPreview ? 'text-sm' : ''}`}>
          <RichTextRenderer 
            content={content}
            isPreview={isPreview}
          />
        </div>
      </div>

      {/* Read more indicator for preview */}
      {isPreview && (
        <div className="mt-3 pt-3 border-t border-border">
          <span className="font-[JetBrains_Mono] text-xs text-muted-foreground">
            CLICK TO READ MORE...
          </span>
        </div>
      )}
    </article>
  );
}