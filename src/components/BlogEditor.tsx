import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { RichTextEditor } from './RichTextEditor';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Search } from 'lucide-react';

interface BlogEditorProps {
  onSave: (blog: { title: string; content: string; images: string[]; coverImage?: string }) => void;
  onCancel: () => void;
  initialBlog?: { title: string; content: string; images: string[]; coverImage?: string };
}

export function BlogEditor({ onSave, onCancel, initialBlog }: BlogEditorProps) {
  const [title, setTitle] = useState(initialBlog?.title || '');
  const [content, setContent] = useState<string>(initialBlog?.content || '');
  const [images, setImages] = useState<string[]>(initialBlog?.images || []);
  const [coverImage, setCoverImage] = useState(initialBlog?.coverImage || '');
  const [coverImageQuery, setCoverImageQuery] = useState('');
  const [isAddingCoverImage, setIsAddingCoverImage] = useState(false);
  const [isUploadingCoverImage, setIsUploadingCoverImage] = useState(false);
  const coverImageInputRef = useRef<HTMLInputElement>(null);
  const [imageQuery, setImageQuery] = useState('');
  const [isAddingImage, setIsAddingImage] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addImage = async () => {
    if (!imageQuery.trim()) return;
    
    setIsAddingImage(true);
    try {
      const { projectId, publicAnonKey } = await import('../utils/supabase/info');
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-538d7667/unsplash`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ query: imageQuery }),
      });
      
      if (response.ok) {
        const { imageUrl } = await response.json();
        setImages([...images, imageUrl]);
        setImageQuery('');
      } else {
        // Fallback to Lorem Picsum
        const imageUrl = `https://picsum.photos/400/300?random=${Date.now()}`;
        setImages([...images, imageUrl]);
        setImageQuery('');
      }
    } catch (error) {
      console.error('Error adding image:', error);
      // Fallback to Lorem Picsum
      const imageUrl = `https://picsum.photos/400/300?random=${Date.now()}`;
      setImages([...images, imageUrl]);
      setImageQuery('');
    } finally {
      setIsAddingImage(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const compressImage = (file: File, maxWidth: number = 800, quality: number = 0.8): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        
        // Draw and compress
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files) return;
    
    const fileArray = Array.from(files);
    const maxFiles = 5;
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    
    // Limit number of files
    if (fileArray.length > maxFiles) {
      alert(`You can only upload up to ${maxFiles} images at once.`);
      return;
    }
    
    // Filter and validate files
    const validFiles = fileArray.filter(file => {
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image file.`);
        return false;
      }
      if (file.size > maxFileSize) {
        alert(`${file.name} is too large. Maximum file size is 5MB.`);
        return false;
      }
      return true;
    });
    
    if (validFiles.length === 0) return;
    
    setIsUploadingFiles(true);
    
    try {
      const compressedImages = await Promise.all(
        validFiles.map(file => compressImage(file))
      );
      
      setImages(prev => [...prev, ...compressedImages]);
    } catch (error) {
      console.error('Error processing images:', error);
      alert('Error processing some images. Please try again.');
    } finally {
      setIsUploadingFiles(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const generateSolidColor = () => {
    return '#808080'; // Always use grey
  };

  const [previewColor] = useState(() => generateSolidColor());

  const addCoverImage = async () => {
    if (!coverImageQuery.trim()) return;
    
    setIsAddingCoverImage(true);
    try {
      const { projectId, publicAnonKey } = await import('../utils/supabase/info');
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-538d7667/unsplash`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ query: coverImageQuery }),
      });
      
      if (response.ok) {
        const { imageUrl } = await response.json();
        setCoverImage(imageUrl);
        setCoverImageQuery('');
      } else {
        // Fallback to Lorem Picsum
        const imageUrl = `https://picsum.photos/800/400?random=${Date.now()}`;
        setCoverImage(imageUrl);
        setCoverImageQuery('');
      }
    } catch (error) {
      console.error('Error adding cover image:', error);
      // Fallback to Lorem Picsum
      const imageUrl = `https://picsum.photos/800/400?random=${Date.now()}`;
      setCoverImage(imageUrl);
      setCoverImageQuery('');
    } finally {
      setIsAddingCoverImage(false);
    }
  };

  const handleCoverImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    
    // Validate file
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }
    if (file.size > maxFileSize) {
      alert('File is too large. Maximum file size is 5MB.');
      return;
    }
    
    setIsUploadingCoverImage(true);
    
    try {
      const compressedDataUrl = await compressImage(file, 800, 0.8);
      setCoverImage(compressedDataUrl);
    } catch (error) {
      console.error('Error processing cover image:', error);
      alert('Error processing image. Please try again.');
    } finally {
      setIsUploadingCoverImage(false);
    }
  };

  const triggerCoverImageInput = () => {
    coverImageInputRef.current?.click();
  };

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;
    
    // If no cover image is provided, generate a solid color
    const finalCoverImage = coverImage || generateSolidColor();
    
    onSave({ title, content, images, coverImage: finalCoverImage });
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 border-b border-border pb-4">
        <h2 className="font-[JetBrains_Mono] text-[20px] font-bold">
          {initialBlog ? 'EDIT POST' : 'NEW POST'}
        </h2>
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={onCancel}
            className="border-2 border-border bg-transparent hover:bg-muted font-[JetBrains_Mono] text-[14px]"
          >
            CANCEL
          </Button>
          <Button
            onClick={handleSave}
            disabled={!title.trim() || !content.trim()}
            className="border-2 border-primary bg-primary hover:bg-accent font-[JetBrains_Mono]"
          >
            SAVE
          </Button>
        </div>
      </div>

      {/* Title Input */}
      <div className="mb-6">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post title..."
          className="border-2 border-border bg-input-background p-4 text-xl font-medium"
        />
      </div>

      {/* Cover Image */}
      <div className="mb-6">
        <h3 className="mb-4 font-bold text-foreground text-[20px] tracking-[0.3px] border-b-2 border-border pb-2 font-[JetBrains_Mono]">COVER IMAGE</h3>
        <p className="text-sm text-muted-foreground mb-4">Upload an image, add a URL, or search for stock images. If left empty, a grey solid color will be used.</p>
        
        {/* Upload Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 items-stretch">
          {/* Upload from Device */}
          <button
            type="button"
            onClick={triggerCoverImageInput}
            disabled={isUploadingCoverImage}
            className="bg-background border-2 border-border border-solid px-4 py-3 font-bold text-foreground text-[14px] tracking-[0.2px] hover:bg-muted transition-colors disabled:opacity-50 text-center font-[JetBrains_Mono]"
          >
            {isUploadingCoverImage ? 'UPLOADING...' : 'UPLOAD IMAGE'}
          </button>
          
          {/* Hidden file input */}
          <input
            ref={coverImageInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleCoverImageUpload(e.target.files)}
            className="hidden"
          />

          {/* Search Stock Images */}
          <div className="flex">
            <input
              value={coverImageQuery}
              onChange={(e) => setCoverImageQuery(e.target.value)}
              placeholder="Search stock images..."
              className="flex-1 bg-background border-2 border-border border-solid px-3 py-3 font-normal text-foreground text-[14px] tracking-[-0.1px] placeholder:text-muted-foreground font-[JetBrains_Mono]"
            />
            <button
              onClick={addCoverImage}
              disabled={!coverImageQuery.trim() || isAddingCoverImage}
              className="bg-background border-2 border-border border-l-0 border-solid px-4 py-3 font-bold text-foreground text-[14px] tracking-[0.2px] hover:bg-muted transition-colors disabled:opacity-50"
            >
              {isAddingCoverImage ? '...' : <Search size={16} />}
            </button>
          </div>

          {/* URL Input - spans full width on mobile */}
          <div className="md:col-span-1">
            <Input
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="Or paste image URL..."
              className="border-2 border-border bg-input-background p-3 text-[14px] font-[JetBrains_Mono]"
            />
          </div>
        </div>

        {/* Cover Image Preview */}
        {coverImage && (
          <div className="relative mb-4">
            <ImageWithFallback
              src={coverImage}
              alt="Cover image preview"
              className="w-full h-48 object-cover border-2 border-border"
            />
            <button
              onClick={() => setCoverImage('')}
              className="absolute top-2 right-2 bg-muted-foreground border-2 border-border border-solid w-8 h-8 font-bold text-background text-[12px] hover:bg-border hover:text-foreground transition-colors"
            >
              ✕
            </button>
          </div>
        )}

        {/* Solid Color Preview */}
        {!coverImage && (
          <div className="mb-4">
            <div 
              className="w-full h-48 border-2 border-border flex items-center justify-center text-white font-bold text-lg"
              style={{ backgroundColor: 'var(--secondary)' }}
            >
              
            </div>
          </div>
        )}
      </div>

      {/* Rich Text Editor */}
      <div className="mb-6">
        <h3 className="mb-4 font-bold text-foreground text-[20px] tracking-[0.3px] border-b-2 border-border pb-2 font-[JetBrains_Mono]">CONTENT</h3>
        <RichTextEditor
          content={content}
          onChange={setContent}
        />
      </div>

      {/* Image Management */}

    </div>
  );
}