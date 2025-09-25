import React from 'react';

interface RichTextRendererProps {
  content: string;
  className?: string;
  isPreview?: boolean;
}

export function RichTextRenderer({ content, className = '', isPreview = false }: RichTextRendererProps) {
  // If content appears to be HTML, render it directly
  // If it's markdown-style, fall back to text extraction for previews
  const isHtmlContent = content.includes('<') && content.includes('>');
  
  if (isPreview && !isHtmlContent) {
    // For markdown content previews, extract text
    const textOnly = content
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '') // Remove images
      .replace(/[#*`]/g, '') // Remove markdown formatting
      .replace(/\n+/g, ' ') // Replace newlines with spaces
      .trim();
    
    const previewText = textOnly.length > 150 
      ? textOnly.substring(0, 150) + '...'
      : textOnly;
    
    return (
      <div className={`prose-coffee ${className}`}>
        <p className="line-clamp-4 leading-relaxed mono">{previewText}</p>
      </div>
    );
  }

  if (isPreview && isHtmlContent) {
    // For HTML content previews, extract text from HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    const textOnly = tempDiv.textContent || tempDiv.innerText || '';
    
    const previewText = textOnly.length > 150 
      ? textOnly.substring(0, 150) + '...'
      : textOnly;
    
    return (
      <div className={`prose-coffee ${className}`}>
        <p className="line-clamp-4 leading-relaxed">{previewText}</p>
      </div>
    );
  }

  if (isHtmlContent) {
    // Render HTML content directly
    return (
      <div 
        className={`prose-coffee ${className}`}
        dangerouslySetInnerHTML={{ __html: content }}
        style={{
          lineHeight: '1.6'
        }}
      />
    );
  }

  // Fallback for plain text or markdown - render as basic markdown
  return (
    <div className={`prose-coffee ${className}`}>
      {renderBasicMarkdown(content)}
    </div>
  );
}

function renderBasicMarkdown(text: string) {
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
    
    // Images
    const imageMatch = line.match(/!\[([^\]]*)\]\(([^)]+)\)/);
    if (imageMatch) {
      return (
        <div key={key} className="my-4">
          <img
            src={imageMatch[2]}
            alt={imageMatch[1] || 'Image'}
            className="w-full h-auto object-cover"
          />
        </div>
      );
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
}