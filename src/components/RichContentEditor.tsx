import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ContentPart {
  type: 'text' | 'image';
  content: string;
  id: string;
}

interface RichContentEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function RichContentEditor({ content, onChange, placeholder }: RichContentEditorProps) {
  const [parts, setParts] = useState<ContentPart[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const textareaRefs = useRef<{ [key: string]: HTMLTextAreaElement | null }>({});

  // Parse markdown content into parts
  const parseContent = useCallback((markdownContent: string): ContentPart[] => {
    if (!markdownContent.trim()) {
      return [{
        type: 'text',
        content: '',
        id: 'initial'
      }];
    }

    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    const parts: ContentPart[] = [];
    let lastIndex = 0;
    let match;

    while ((match = imageRegex.exec(markdownContent)) !== null) {
      // Add text before the image
      if (match.index > lastIndex) {
        const textBefore = markdownContent.substring(lastIndex, match.index);
        if (textBefore) {
          parts.push({
            type: 'text',
            content: textBefore,
            id: `text-${parts.length}`
          });
        }
      }

      // Add the image
      const imageUrl = match[2];
      parts.push({
        type: 'image',
        content: imageUrl,
        id: `image-${parts.length}`
      });

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text after the last image
    if (lastIndex < markdownContent.length) {
      const remainingText = markdownContent.substring(lastIndex);
      parts.push({
        type: 'text',
        content: remainingText,
        id: `text-${parts.length}`
      });
    }

    // If no images found, return the entire content as text
    if (parts.length === 0) {
      parts.push({
        type: 'text',
        content: markdownContent,
        id: 'initial'
      });
    }

    return parts;
  }, []);

  // Convert parts back to markdown
  const partsToMarkdown = useCallback((contentParts: ContentPart[]): string => {
    return contentParts.map(part => {
      if (part.type === 'image') {
        return `![Image](${part.content})`;
      }
      return part.content;
    }).join('');
  }, []);

  // Initialize parts from content
  useEffect(() => {
    const newParts = parseContent(content);
    setParts(newParts);
  }, [content, parseContent]);

  // Update content when parts change
  const updateContent = useCallback((newParts: ContentPart[]) => {
    setParts(newParts);
    const newMarkdown = partsToMarkdown(newParts);
    onChange(newMarkdown);
  }, [onChange, partsToMarkdown]);

  const handleFileUpload = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        resolve(result);
      };
      reader.readAsDataURL(file);
    });
  };

  const insertImageAfterPart = async (file: File, afterPartId: string) => {
    const imageUrl = await handleFileUpload(file);
    const afterIndex = parts.findIndex(part => part.id === afterPartId);
    
    const newParts = [...parts];
    
    // Insert image after the current part
    newParts.splice(afterIndex + 1, 0, {
      type: 'image',
      content: imageUrl,
      id: `image-${Date.now()}`
    });

    // Add empty text part after image if needed
    if (afterIndex + 1 === parts.length - 1 || newParts[afterIndex + 2]?.type === 'image') {
      newParts.splice(afterIndex + 2, 0, {
        type: 'text',
        content: '',
        id: `text-${Date.now()}`
      });
    }

    updateContent(newParts);
  };

  const handlePaste = async (e: React.ClipboardEvent, partId: string) => {
    const items = Array.from(e.clipboardData.items);
    const imageItems = items.filter(item => item.type.startsWith('image/'));

    if (imageItems.length > 0) {
      e.preventDefault();
      
      for (const item of imageItems) {
        const file = item.getAsFile();
        if (file) {
          await insertImageAfterPart(file, partId);
        }
      }
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));

    // Insert images at the end
    const lastPartId = parts[parts.length - 1]?.id || 'initial';
    for (const file of imageFiles) {
      await insertImageAfterPart(file, lastPartId);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleTextChange = (partId: string, newText: string) => {
    const newParts = parts.map(part => 
      part.id === partId ? { ...part, content: newText } : part
    );
    updateContent(newParts);
  };

  const removeImage = (partId: string) => {
    const newParts = parts.filter(part => part.id !== partId);
    // Ensure we always have at least one text part
    if (newParts.length === 0 || newParts.every(part => part.type === 'image')) {
      newParts.push({
        type: 'text',
        content: '',
        id: `text-${Date.now()}`
      });
    }
    updateContent(newParts);
  };

  const autoResizeTextarea = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  };

  return (
    <div 
      className={`border-2 border-border bg-card p-4 min-h-[400px] relative ${
        isDragging ? 'border-primary bg-muted/50' : ''
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {parts.length === 0 && (
        <textarea
          placeholder={placeholder || `Start typing your content...

Paste images with Ctrl+V or drag & drop images anywhere

# Project Title
Brief description...

## Installation
Steps to install...

More content...`}
          className="w-full h-full bg-transparent border-none outline-none resize-none mono p-2 min-h-[360px]"
          onChange={(e) => {
            const newParts = parseContent(e.target.value);
            updateContent(newParts);
          }}
        />
      )}

      {parts.map((part, index) => (
        <div key={part.id} className="mb-2">
          {part.type === 'text' ? (
            <textarea
              ref={(el) => {
                textareaRefs.current[part.id] = el;
                if (el) autoResizeTextarea(el);
              }}
              value={part.content}
              onChange={(e) => {
                handleTextChange(part.id, e.target.value);
                autoResizeTextarea(e.target);
              }}
              onPaste={(e) => handlePaste(e, part.id)}
              placeholder={index === 0 && part.content === '' ? (placeholder || `Start typing your content...

Paste images with Ctrl+V or drag & drop images anywhere

# Project Title
Brief description...

## Installation  
Steps to install...

More content...`) : 'Continue writing...'}
              className="w-full bg-transparent border-none outline-none resize-none mono p-2 min-h-[40px] leading-relaxed"
              style={{ height: 'auto' }}
            />
          ) : (
            <div className="relative group my-4">
              <ImageWithFallback
                src={part.content}
                alt="Content image"
                className="w-full h-auto object-cover"
              />
              <button
                onClick={() => removeImage(part.id)}
                className="absolute top-2 right-2 bg-destructive text-destructive-foreground w-8 h-8 border-2 border-border hover:bg-destructive/80 transition-colors opacity-0 group-hover:opacity-100 mono text-sm"
              >
                ×
              </button>
            </div>
          )}
        </div>
      ))}

      {isDragging && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/80 border-2 border-dashed border-primary">
          <p className="mono text-primary">Drop images here</p>
        </div>
      )}

      <div className="mt-2 text-xs text-muted-foreground mono">
        Ctrl+V to paste images • Drag & drop images • Use markdown syntax
      </div>
    </div>
  );
}