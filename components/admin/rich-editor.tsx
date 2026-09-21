"use client";

import React, { useState, useRef } from "react";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Code,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Upload,
  Eye,
  Edit3,
  Columns,
  Loader2,
} from "lucide-react";
import ArticleBody from "@/components/blog/article-body";

interface RichEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichEditor({
  value,
  onChange,
  placeholder = "Write your article content here...",
}: RichEditorProps) {
  const [viewMode, setViewMode] = useState<"edit" | "split" | "preview">("split");
  const [isUploading, setIsUploading] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageCaption, setImageCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const insertText = (before: string, after: string = "", defaultText: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end) || defaultText;

    const replacement = before + selectedText + after;
    const newValue =
      textarea.value.substring(0, start) +
      replacement +
      textarea.value.substring(end);

    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      );
    }, 0);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Image upload failed");
      const data = await res.json();

      setImageUrl(data.url);
      setShowImageModal(true);
    } catch (err: any) {
      alert(err.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const insertImageTag = () => {
    if (!imageUrl) return;
    const figureHtml = `
<figure>
  <img src="${imageUrl}" alt="${imageCaption || "Article image"}" class="rounded-xl w-full object-cover max-h-96 shadow-md my-4" />
  ${imageCaption ? `<figcaption class="text-xs text-muted-foreground text-center mt-2">${imageCaption}</figcaption>` : ""}
</figure>
`.trim();

    insertText(figureHtml + "\n\n");
    setImageUrl("");
    setImageCaption("");
    setShowImageModal(false);
  };

  return (
    <div className="w-full flex flex-col rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
      {/* Formatting Toolbar */}
      <div className="flex flex-wrap items-center justify-between p-2.5 bg-muted/40 border-b border-border/70 gap-2">
        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={() => insertText("<strong>", "</strong>", "bold text")}
            className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertText("<em>", "</em>", "italic text")}
            className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>

          <div className="h-4 w-[1px] bg-border mx-1" />

          <button
            type="button"
            onClick={() => insertText("<h2>", "</h2>", "Heading 2")}
            className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            title="Heading 2"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertText("<h3>", "</h3>", "Heading 3")}
            className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            title="Heading 3"
          >
            <Heading3 className="w-4 h-4" />
          </button>

          <div className="h-4 w-[1px] bg-border mx-1" />

          <button
            type="button"
            onClick={() =>
              insertText(
                "<blockquote>\n  \"",
                "\"\n</blockquote>",
                "Add your pull quote here..."
              )
            }
            className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            title="Pull Quote"
          >
            <Quote className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() =>
              insertText(
                '<pre><code class="language-typescript">\n',
                "\n</code></pre>",
                "// write code snippet here"
              )
            }
            className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            title="Code Block"
          >
            <Code className="w-4 h-4" />
          </button>

          <div className="h-4 w-[1px] bg-border mx-1" />

          <button
            type="button"
            onClick={() =>
              insertText("<ul>\n  <li>", "</li>\n  <li>Item 2</li>\n</ul>", "Item 1")
            }
            className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() =>
              insertText("<ol>\n  <li>", "</li>\n  <li>Item 2</li>\n</ol>", "Step 1")
            }
            className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>

          <div className="h-4 w-[1px] bg-border mx-1" />

          <button
            type="button"
            onClick={() => {
              const url = prompt("Enter link URL:", "https://");
              if (url) insertText(`<a href="${url}" target="_blank" rel="noreferrer">`, "</a>", "link text");
            }}
            className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            title="Insert Link"
          >
            <LinkIcon className="w-4 h-4" />
          </button>

          {/* Upload Image Button */}
          <label className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground cursor-pointer transition-colors flex items-center gap-1.5 text-xs">
            {isUploading ? (
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
            ) : (
              <ImageIcon className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">Image</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
          </label>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-background p-1 rounded-xl border border-border text-xs">
          <button
            type="button"
            onClick={() => setViewMode("edit")}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1 ${
              viewMode === "edit"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Editor</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("split")}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1 ${
              viewMode === "split"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Split</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("preview")}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1 ${
              viewMode === "preview"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Preview</span>
          </button>
        </div>
      </div>

      {/* Editor & Preview Area */}
      <div className="min-h-[520px] grid grid-cols-1 md:grid-cols-12">
        {/* Editor Pane */}
        {(viewMode === "edit" || viewMode === "split") && (
          <div
            className={`h-full flex flex-col ${
              viewMode === "split"
                ? "md:col-span-6 border-b md:border-b-0 md:border-r border-border/70"
                : "md:col-span-12"
            }`}
          >
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="w-full h-full min-h-[520px] p-5 font-mono text-xs sm:text-sm bg-transparent text-foreground placeholder-muted-foreground outline-hidden resize-y leading-relaxed"
            />
          </div>
        )}

        {/* Live Preview Pane */}
        {(viewMode === "preview" || viewMode === "split") && (
          <div
            className={`p-6 sm:p-8 overflow-y-auto bg-card ${
              viewMode === "split" ? "md:col-span-6" : "md:col-span-12"
            }`}
          >
            <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-4 pb-2 border-b border-border/40 flex items-center justify-between">
              <span>Live Article Preview</span>
              <span className="text-xs font-normal lowercase">
                Exact render styling
              </span>
            </div>
            {value.trim() ? (
              <ArticleBody content={value} />
            ) : (
              <div className="text-sm text-muted-foreground italic py-12 text-center">
                Start typing or using the toolbar above to preview formatted content here.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Image Caption Insertion Modal */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-xl flex flex-col gap-4">
            <h3 className="font-bold text-base text-foreground">
              Insert Image with Caption
            </h3>
            <div className="relative w-full h-40 rounded-xl overflow-hidden bg-muted border border-border">
              <img
                src={imageUrl}
                alt="Uploaded preview"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground">
                Optional Caption:
              </label>
              <input
                type="text"
                value={imageCaption}
                onChange={(e) => setImageCaption(e.target.value)}
                placeholder="e.g. Systems architecture diagram showing bounded contexts"
                className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm focus:outline-hidden focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="px-4 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-accent"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={insertImageTag}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 cursor-pointer"
              >
                Insert into Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
