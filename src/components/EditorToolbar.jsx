import React from "react";
import {
  Bold,
  Italic,
  Link,
  List,
  ListOrdered,
  ImagePlus,
  Type,
} from "lucide-react";

export const EditorToolbar = ({
  onFormat,
  onImageUpload,
  onList,
  visible,
  position,
}) => {
  if (!visible) return null;

  const tools = [
    { icon: Type, command: "formatBlock", value: "h2", title: "Heading" },
    { icon: Bold, command: "bold", title: "Bold" },
    { icon: Italic, command: "italic", title: "Italic" },
    { icon: Link, command: "createLink", title: "Link" },
  ];

  return (
    <div
      id="editor-toolbar-container"
      className="editor-toolbar-container"
      style={{
        left: `${position.x}px`,
        top: `${position.y - 50}px`,
      }}
    >
      {tools.map(({ icon: Icon, command, value, title }) => (
        <button
          key={command}
          id={`toolbar-btn-${command}`}
          className="toolbar-btn"
          onClick={() => {
            if (command === "createLink") {
              const url = prompt("Enter URL:");
              if (url) onFormat(command, url);
            } else {
              onFormat(command, value);
            }
          }}
          title={title}
        >
          <Icon
            id={`toolbar-icon-${command}`}
            className="toolbar-icon"
            size={14}
          />
        </button>
      ))}

      {/* List Buttons */}
      <button
        id="toolbar-btn-unordered-list"
        className="toolbar-btn-list"
        onClick={() => onList("unordered")}
        title="Bullet List"
      >
        <List
          id="toolbar-icon-unordered-list"
          className="toolbar-icon-list"
          size={14}
        />
      </button>

      <button
        id="toolbar-btn-ordered-list"
        className="toolbar-btn-list"
        onClick={() => onList("ordered")}
        title="Numbered List"
      >
        <ListOrdered
          id="toolbar-icon-ordered-list"
          className="toolbar-icon-list"
          size={14}
        />
      </button>

      <button
        id="toolbar-btn-image"
        className="toolbar-btn-image"
        onClick={onImageUpload}
        title="Insert Image"
      >
        <ImagePlus
          id="toolbar-icon-image"
          className="toolbar-icon-image"
          size={14}
        />
      </button>
    </div>
  );
};
