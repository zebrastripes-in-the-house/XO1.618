import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  ImagePlus,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
} from "lucide-react";
// import EditorToolbar from "./EditorToolbar";
// import { Editor } from "./components/Editor";x
import { EditorToolbar } from "./EditorToolbar";
// import { RichTextEditor } from "./components/RichTextEditor";

export const RichTextEditor = ({
  content,
  onChange,
  placeholder = "Start writing...",
}) => {
  const editorRef = useRef(null);
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });
  const [isDragOver, setIsDragOver] = useState(false);
  const [showFloatingToolbar, setShowFloatingToolbar] = useState(false);
  const [floatingToolbarPosition, setFloatingToolbarPosition] = useState({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    if (editorRef.current && content !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = content;
    }
  }, [content]);

  const handleSelectionChange = useCallback(() => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      // Check if selection is within the editor
      const editorRect = editorRef.current?.getBoundingClientRect();
      if (
        editorRect &&
        rect.top >= editorRect.top &&
        rect.bottom <= editorRect.bottom &&
        rect.left >= editorRect.left &&
        rect.right <= editorRect.right
      ) {
        // Position for floating toolbar (above selection)
        setFloatingToolbarPosition({
          x: rect.left + rect.width / 2 - 100, // Center above selection
          y: rect.top + window.scrollY - 50, // Above the selection
        });
        setShowFloatingToolbar(true);

        // Also update regular toolbar position
        setToolbarPosition({
          x: rect.left + rect.width / 2 - 150,
          y: rect.top + window.scrollY,
        });
        setShowToolbar(true);
      } else {
        setShowFloatingToolbar(false);
        setShowToolbar(false);
      }
    } else {
      setShowFloatingToolbar(false);
      setShowToolbar(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, [handleSelectionChange]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleFormat = (command, value) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  const handleList = (type) => {
    if (!editorRef.current) return;

    // Focus the editor first
    editorRef.current.focus();

    // Execute the appropriate list command
    if (type === "unordered") {
      document.execCommand("insertUnorderedList", false, null);
    } else if (type === "ordered") {
      document.execCommand("insertOrderedList", false, null);
    }

    // Trigger input event to update content
    handleInput();
  };

  const handleFloatingFormat = (command, value = null) => {
    if (!editorRef.current) return;

    // Focus the editor first
    editorRef.current.focus();

    // Execute the command
    document.execCommand(command, false, value);

    // Trigger input event to update content
    handleInput();
  };

  const handleFloatingList = (type) => {
    if (!editorRef.current) return;

    // Focus the editor first
    editorRef.current.focus();

    // Execute the appropriate list command
    if (type === "unordered") {
      document.execCommand("insertUnorderedList", false, null);
    } else if (type === "ordered") {
      document.execCommand("insertOrderedList", false, null);
    }

    // Trigger input event to update content
    handleInput();
  };

  const handleImageUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;

    input.onchange = (e) => {
      const files = e.target.files;
      if (files) {
        Array.from(files).forEach((file) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const img = `<img src="${e.target.result}" alt="Uploaded image" />`;
            document.execCommand("insertHTML", false, img);
            handleInput();
          };
          reader.readAsDataURL(file);
        });
      }
    };

    input.click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = `<img src="${e.target.result}" alt="Uploaded image" />`;
        document.execCommand("insertHTML", false, img);
        handleInput();
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div id="richtext-editor-container" className="richtext-editor-container">
      <div id="image-upload-btn" className="image-upload-btn">
        <button
          onClick={handleImageUpload}
          id="btn-add-images"
          className="btn-add-images"
          title="Upload images"
        >
          <ImagePlus id="icon-add-images" className="icon-add-images" />
          <span id="text-add-images" className="text-add-images">
            Add Images
          </span>
        </button>
      </div>

      <div
        id="richtext-editor"
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="richtext-editor"
        data-placeholder={placeholder}
      />

      {isDragOver && (
        <div id="drag-overlay" className="drag-overlay">
          <div id="drag-overlay-content" className="drag-overlay-content">
            <ImagePlus id="icon-drag" className="icon-drag" />
            <p id="drag-text" className="drag-text">
              Drop images here
            </p>
          </div>
        </div>
      )}

      <EditorToolbar
        id="editor-toolbar"
        className="editor-toolbar"
        onFormat={handleFormat}
        onImageUpload={handleImageUpload}
        onList={handleList}
        visible={showToolbar}
        position={toolbarPosition}
      />

      {/* Floating Toolbar */}
      {showFloatingToolbar && (
        <div
          id="floating-toolbar"
          className="floating-toolbar"
          style={{
            position: "absolute",
            left: `${floatingToolbarPosition.x}px`,
            top: `${floatingToolbarPosition.y}px`,
            zIndex: 1000,
          }}
        >
          <div
            id="floating-toolbar-content"
            className="floating-toolbar-content"
          >
            <button
              id="floating-btn-bold"
              className="floating-toolbar-btn"
              onClick={() => handleFloatingFormat("bold")}
              title="Bold"
            >
              <Bold
                id="floating-icon-bold"
                className="floating-toolbar-icon"
                size={14}
              />
            </button>

            <button
              id="floating-btn-italic"
              className="floating-toolbar-btn"
              onClick={() => handleFloatingFormat("italic")}
              title="Italic"
            >
              <Italic
                id="floating-icon-italic"
                className="floating-toolbar-icon"
                size={14}
              />
            </button>

            <button
              id="floating-btn-underline"
              className="floating-toolbar-btn"
              onClick={() => handleFloatingFormat("underline")}
              title="Underline"
            >
              <Underline
                id="floating-icon-underline"
                className="floating-toolbar-icon"
                size={14}
              />
            </button>

            <button
              id="floating-btn-unordered-list"
              className="floating-toolbar-btn"
              onClick={() => handleFloatingList("unordered")}
              title="Bullet List"
            >
              <List
                id="floating-icon-unordered-list"
                className="floating-toolbar-icon"
                size={14}
              />
            </button>

            <button
              id="floating-btn-ordered-list"
              className="floating-toolbar-btn"
              onClick={() => handleFloatingList("ordered")}
              title="Numbered List"
            >
              <ListOrdered
                id="floating-icon-ordered-list"
                className="floating-toolbar-icon"
                size={14}
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
