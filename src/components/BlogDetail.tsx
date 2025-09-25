import React from 'react';
import { Button } from './ui/button';
import { BlogPost } from './BlogPost';

interface Blog {
  id: string;
  title: string;
  content: string;
  images: string[];
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
}

interface BlogDetailProps {
  blog: Blog;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function BlogDetail({ blog, onBack, onEdit, onDelete }: BlogDetailProps) {
  return (
    <div className="w-full max-w-4xl mx-auto p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 border-b border-border pb-4">
        <Button
          variant="outline"
          onClick={onBack}
          className="border-2 border-border bg-transparent hover:bg-muted"
        >
          ← BACK
        </Button>
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={onEdit}
            className="border-2 border-border bg-transparent hover:bg-muted"
          >
            EDIT
          </Button>
          <Button
            variant="destructive"
            onClick={onDelete}
            className="border-2 border-destructive bg-destructive hover:bg-destructive/80"
          >
            DELETE
          </Button>
        </div>
      </div>

      {/* Blog Content */}
      <BlogPost
        title={blog.title}
        content={blog.content}
        images={blog.images}
        createdAt={blog.createdAt}
        updatedAt={blog.updatedAt}
        isPreview={false}
      />
    </div>
  );
}