import React from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface RichContentRendererProps {
  content: string;
  className?: string;
}

export function RichContentRenderer({ content, className = '' }: RichContentRendererProps) {
  // Parse markdown-style content and render with images
  const renderContent = () => {
    // Split content by markdown image syntax: ![alt](url)
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = imageRegex.exec(content)) !== null) {
      // Add text before the image
      if (match.index > lastIndex) {
        const textBefore = content.substring(lastIndex, match.index);
        if (textBefore.trim()) {
          parts.push({
            type: 'text',
            content: textBefore,
            key: `text-${lastIndex}`
          });
        }
      }

      // Add the image
      const altText = match[1] || 'Image';
      const imageUrl = match[2];
      parts.push({
        type: 'image',
        content: imageUrl,
        altText,
        key: `image-${match.index}`
      });

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text after the last image
    if (lastIndex < content.length) {
      const remainingText = content.substring(lastIndex);
      if (remainingText.trim()) {
        parts.push({
          type: 'text',
          content: remainingText,
          key: `text-${lastIndex}`
        });
      }
    }

    // If no images found, return the entire content as text
    if (parts.length === 0) {
      parts.push({
        type: 'text',
        content: content,
        key: 'text-only'
      });
    }

    return parts.map((part) => {
      if (part.type === 'image') {
        return (
          <div key={part.key} className="my-4">
            <ImageWithFallback
              src={part.content}
              alt={part.altText || 'Content image'}
              className="w-full h-auto object-cover"
            />
          </div>
        );
      } else {
        // Render text with basic markdown support
        return (
          <div key={part.key} className="whitespace-pre-wrap">
            {renderTextWithBasicMarkdown(part.content)}
          </div>
        );
      }
    });
  };

  const renderTextWithBasicMarkdown = (text: string) => {
    // Simple markdown rendering for headers, bold, italic
    const lines = text.split('\n');
    
    return lines.map((line, index) => {
      const key = `line-${index}`;
      
      // Headers
      if (line.startsWith('# ')) {
        return <h1 key={key} className="text-2xl font-medium mt-6 mb-3 first:mt-0">{line.slice(2)}</h1>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={key} className="text-xl font-medium mt-5 mb-2">{line.slice(3)}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={key} className="text-lg font-medium mt-4 mb-2">{line.slice(4)}</h3>;
      }
      
      // Empty lines
      if (line.trim() === '') {
        return <br key={key} />;
      }
      
      // Regular text with inline formatting
      const processedLine = line
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
        .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
        .replace(/`(.*?)`/g, '<code>$1</code>'); // Inline code
      
      return (
        <p 
          key={key} 
          className="mb-2" 
          dangerouslySetInnerHTML={{ __html: processedLine }}
        />
      );
    });
  };

  return (
    <div className={`prose-coffee ${className}`}>
      {renderContent()}
    </div>
  );
}