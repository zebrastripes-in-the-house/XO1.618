import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

interface FormatState {
  textType: 'body' | 'h1' | 'h2' | 'h3';
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
}

export function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [formatState, setFormatState] = useState<FormatState>({
    textType: 'body',
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false
  });

  // Clean up and normalize content
  const cleanupContent = useCallback(() => {
    if (!editorRef.current) return;
    
    // Find and fix any broken image displays
    const textNodes = editorRef.current.querySelectorAll('*');
    textNodes.forEach(node => {
      if (node.textContent && node.textContent.includes('data:image/')) {
        // Check if this is raw image data displayed as text
        const dataUrlMatch = node.textContent.match(/data:image\/[^;]+;base64,[A-Za-z0-9+/=]+/);
        if (dataUrlMatch) {
          // Replace the text node with an actual image
          const img = document.createElement('img');
          img.src = dataUrlMatch[0];
          img.style.maxWidth = '100%';
          img.style.height = 'auto';
          img.style.display = 'block';
          img.style.margin = '16px 0';
          img.alt = 'Image';
          
          // Clear the text content and add the image
          node.textContent = '';
          node.appendChild(img);
        }
      }
    });
    
    // Ensure all existing images have proper styling
    const images = editorRef.current.querySelectorAll('img');
    images.forEach(img => {
      img.style.maxWidth = '100%';
      img.style.height = 'auto';
      img.style.display = 'block';
      img.style.margin = '16px 0';
    });
  }, []);

  // Initialize editor content
  useEffect(() => {
    if (editorRef.current && content !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = content;
      
      // Ensure all images have proper styling after content is set
      setTimeout(() => {
        cleanupContent();
      }, 0);
    }
  }, [content, cleanupContent]);

  // Update format state based on current selection
  const updateFormatState = useCallback(() => {
    if (!document.getSelection()?.rangeCount) return;

    const selection = document.getSelection()!;
    const range = selection.getRangeAt(0);
    const parentElement = range.commonAncestorContainer.nodeType === Node.TEXT_NODE 
      ? range.commonAncestorContainer.parentElement 
      : range.commonAncestorContainer as Element;

    if (!parentElement) return;

    // Determine text type
    let textType: 'body' | 'h1' | 'h2' | 'h3' = 'body';
    const tagName = (parentElement as Element).tagName?.toLowerCase();
    if (tagName === 'h1') textType = 'h1';
    else if (tagName === 'h2') textType = 'h2';
    else if (tagName === 'h3') textType = 'h3';

    setFormatState({
      textType,
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      strikethrough: document.queryCommandState('strikeThrough')
    });
  }, []);

  // Handle content changes
  const handleInput = useCallback(() => {
    if (editorRef.current) {
      cleanupContent();
      onChange(editorRef.current.innerHTML);
      updateFormatState();
    }
  }, [onChange, updateFormatState, cleanupContent]);

  // Handle selection changes
  const handleSelectionChange = useCallback(() => {
    updateFormatState();
  }, [updateFormatState]);

  useEffect(() => {
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, [handleSelectionChange]);

  // Format commands
  const applyFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  const setTextType = (type: 'body' | 'h1' | 'h2' | 'h3') => {
    const tagMap = {
      'body': 'div',
      'h1': 'h1',
      'h2': 'h2',
      'h3': 'h3'
    };
    applyFormat('formatBlock', tagMap[type]);
  };

  // Image handling
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

  const insertImage = async (file: File) => {
    const imageUrl = await handleFileUpload(file);
    
    // Create a wrapper div to ensure proper spacing and layout
    const wrapper = document.createElement('div');
    wrapper.style.margin = '16px 0';
    wrapper.style.display = 'block';
    
    const img = document.createElement('img');
    img.src = imageUrl;
    img.style.maxWidth = '100%';
    img.style.height = 'auto';
    img.style.display = 'block';
    img.alt = 'Uploaded image';
    
    wrapper.appendChild(img);
    
    const selection = document.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(wrapper);
      
      // Move cursor after the image
      range.setStartAfter(wrapper);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    } else if (editorRef.current) {
      editorRef.current.appendChild(wrapper);
    }
    
    handleInput();
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = Array.from(e.clipboardData.items);
    const imageItems = items.filter(item => item.type.startsWith('image/'));

    if (imageItems.length > 0) {
      e.preventDefault();
      
      for (const item of imageItems) {
        const file = item.getAsFile();
        if (file) {
          await insertImage(file);
        }
      }
      return;
    }

    // Handle regular paste - clean up any accidentally pasted image data
    setTimeout(() => {
      cleanupContent();
    }, 0);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));

    for (const file of imageFiles) {
      await insertImage(file);
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

  return (
    <div className="border-2 border-border bg-card">
      {/* Toolbar */}
      <div className="border-b-2 border-border p-4 bg-muted/20 font-[JetBrains_Mono]">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Text Type */}
          <div className="flex items-center gap-2">
            <span className="font-[JetBrains_Mono] text-sm font-medium">TYPE:</span>
            <div className="flex border-2 border-border">
              <button
                onClick={() => setTextType('body')}
                className={`px-3 py-1 text-sm border-r-2 border-border transition-colors ${
                  formatState.textType === 'body' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-background hover:bg-muted'
                }`}
              >
                Body
              </button>
              <button
                onClick={() => setTextType('h3')}
                className={`px-3 py-1 text-sm border-r-2 border-border transition-colors ${
                  formatState.textType === 'h3' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-background hover:bg-muted'
                }`}
              >
                H3
              </button>
              <button
                onClick={() => setTextType('h2')}
                className={`px-3 py-1 text-sm border-r-2 border-border transition-colors ${
                  formatState.textType === 'h2' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-background hover:bg-muted'
                }`}
              >
                H2
              </button>
              <button
                onClick={() => setTextType('h1')}
                className={`px-3 py-1 text-sm transition-colors ${
                  formatState.textType === 'h1' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-background hover:bg-muted'
                }`}
              >
                H1
              </button>
            </div>
          </div>

          {/* Text Formatting */}
          <div className="flex items-center gap-2">
            <span className="font-[JetBrains_Mono] text-sm font-medium">FORMAT:</span>
            <div className="flex border-2 border-border">
              <button
                onClick={() => applyFormat('bold')}
                className={`px-3 py-1 text-sm font-bold border-r-2 border-border transition-colors ${
                  formatState.bold 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-background hover:bg-muted'
                }`}
              >
                B
              </button>
              <button
                onClick={() => applyFormat('italic')}
                className={`px-3 py-1 text-sm italic border-r-2 border-border transition-colors ${
                  formatState.italic 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-background hover:bg-muted'
                }`}
              >
                I
              </button>
              <button
                onClick={() => applyFormat('underline')}
                className={`px-3 py-1 text-sm underline border-r-2 border-border transition-colors ${
                  formatState.underline 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-background hover:bg-muted'
                }`}
              >
                U
              </button>
              <button
                onClick={() => applyFormat('strikeThrough')}
                className={`px-3 py-1 text-sm line-through transition-colors ${
                  formatState.strikethrough 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-background hover:bg-muted'
                }`}
              >
                S
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div 
        className={`relative min-h-[400px] ${isDragging ? 'bg-muted/50' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onPaste={handlePaste}
          className="p-4 min-h-[400px] outline-none rich-text-editor"
          suppressContentEditableWarning={true}
          data-placeholder={!content ? (placeholder || "Start typing your content...\n\nPaste images with Ctrl+V or drag & drop images anywhere") : undefined}
        />

        {isDragging && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/80 border-2 border-dashed border-primary">
            <p className="mono text-primary">Drop images here</p>
          </div>
        )}

        {/* Help text */}
        <div className="px-4 pb-4 text-xs text-muted-foreground font-[JetBrains_Mono]">
          Select text to apply formatting • Ctrl+V to paste images • Drag & drop images
        </div>
      </div>
    </div>
  );
}