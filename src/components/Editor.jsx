import React, { useState, useEffect } from "react";
import { Save, ArrowLeft } from "lucide-react";
import { savePost, generateId } from "../utils/storage";
import { savePostToSupabase } from "../utils/supabasePosts";
import { EditorToolbar } from "./EditorToolbar";
import { RichTextEditor } from "./RichTextEditor";

export const Editor = ({ onBack, editPost }) => {
  const [title, setTitle] = useState(editPost?.title || "");
  const [content, setContent] = useState(editPost?.content || "");
  const [isDraft, setIsDraft] = useState(editPost?.isDraft ?? true);
  const [lastSaved, setLastSaved] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!title && !content) return;

    const autoSaveTimer = setTimeout(async () => {
      const post = {
        id: editPost?.id || generateId(),
        title: title || "Untitled",
        content,
        createdAt: editPost?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isDraft: true,
      };

      setIsSaving(true);
      try {
        await savePostToSupabase(post);
        // Also save to localStorage as backup
        savePost(post);
        setLastSaved(new Date());
      } catch (error) {
        console.error("Auto-save failed:", error);
      } finally {
        setIsSaving(false);
      }
    }, 2000);

    return () => clearTimeout(autoSaveTimer);
  }, [title, content, editPost]);

  const handleSave = async (publish = false) => {
    if (!title && !content) return;

    const post = {
      id: editPost?.id || generateId(),
      title: title || "Untitled",
      content,
      createdAt: editPost?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDraft: !publish,
    };

    setIsSaving(true);
    try {
      await savePostToSupabase(post);
      // Also save to localStorage as backup
      savePost(post);
      setIsDraft(!publish);
      setLastSaved(new Date());

      if (publish) onBack();
    } catch (error) {
      console.error("Save failed:", error);
      // Still save to localStorage as fallback
      savePost(post);
      setIsDraft(!publish);
      setLastSaved(new Date());
      if (publish) onBack();
    } finally {
      setIsSaving(false);
    }
  };

  const today = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="editor-page">
      <header className="editor-brand">
        <button
          className="editor-back brand-back"
          onClick={onBack}
          title="Back"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="brand-title">XO1.618</div>
        <div className="brand-spacer" />
      </header>

      <div className="editor-controls">
        {isSaving ? (
          <span className="editor-saving">Saving...</span>
        ) : lastSaved ? (
          <span className="editor-last-saved">
            Saved {lastSaved.toLocaleTimeString()}
          </span>
        ) : null}
        <button
          className="editor-save-draft"
          onClick={() => handleSave(false)}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save Draft"}
        </button>
        <button
          className="editor-publish"
          onClick={() => handleSave(true)}
          disabled={isSaving}
        >
          <Save size={16} />
          {isSaving ? "Publishing..." : "Publish"}
        </button>
      </div>

      <main className="editor-frame">
        <div className="editor-frame-inner">
          <div className="editor-meta">
            <input
              className="editor-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
            />
            <small className="editor-date">{today}</small>
          </div>

          <div className="editor-canvas">
            <EditorToolbar id="editor-toolbar" className="editor-toolbar" />
            <RichTextEditor
              id="editor-richtext"
              className="editor-richtext"
              content={content}
              onChange={setContent}
              placeholder="Start writing..."
            />
          </div>
        </div>
      </main>
    </div>
  );
};
