"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  Quote,
  Code,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Eye,
  Edit3,
  Columns,
  Loader2,
} from "lucide-react";
import ArticleBody from "@/components/blog/article-body";
import { toast } from "@/components/ui/toast";
import Modal from "@/components/ui/modal";

interface RichEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichEditor({
  value,
  onChange,
  placeholder = "Write your article in Markdown or HTML (pressing Enter creates line breaks)...",
}: RichEditorProps) {
  const [viewMode, setViewMode] = useState<"edit" | "split" | "preview">("split");
  const [isUploading, setIsUploading] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageCaption, setImageCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const insertText = (before: string, after = "", defaultText = "") => {
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
      toast.success("Image uploaded successfully!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to upload image";
      toast.error(msg);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const insertImageTag = () => {
    if (!imageUrl) return;
    const figureMarkdown = imageCaption
      ? `\n\n![${imageCaption}](${imageUrl})\n*${imageCaption}*\n\n`
      : `\n\n![Article image](${imageUrl})\n\n`;

    insertText(figureMarkdown);
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
            onClick={() => insertText("**", "**", "bold text")}
            className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            title="Bold (**text**)"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertText("*", "*", "italic text")}
            className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            title="Italic (*text*)"
          >
            <Italic className="w-4 h-4" />
          </button>

          <div className="h-4 w-[1px] bg-border mx-1" />

          <button
            type="button"
            onClick={() => insertText("\n## ", "\n", "Heading 2")}
            className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            title="Heading 2 (## text)"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertText("\n### ", "\n", "Heading 3")}
            className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            title="Heading 3 (### text)"
          >
            <Heading3 className="w-4 h-4" />
          </button>

          <div className="h-4 w-[1px] bg-border mx-1" />

          <button
            type="button"
            onClick={() => insertText("\n> ", "\n", "Quotation")}
            className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            title="Blockquote (> text)"
          >
            <Quote className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() =>
              insertText(
                "\n```typescript\n",
                "\n```\n",
                "// code block"
              )
            }
            className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            title="Code Block (```lang)"
          >
            <Code className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertText("\n- ", "\n", "List item")}
            className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            title="Unordered List (- item)"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertText("\n1. ", "\n", "First item")}
            className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            title="Numbered List (1. item)"
          >
            <ListOrdered className="w-4 h-4" />
          </button>

          <div className="h-4 w-[1px] bg-border mx-1" />

          <button
            type="button"
            onClick={() => insertText("[", "](https://example.com)", "link title")}
            className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            title="Insert Link ([title](url))"
          >
            <LinkIcon className="w-4 h-4" />
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground cursor-pointer transition-colors flex items-center gap-1"
            title="Upload Image"
          >
            {isUploading ? (
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
            ) : (
              <ImageIcon className="w-4 h-4" />
            )}
            <span className="text-xs font-medium hidden sm:inline">Image</span>
          </button>
        </div>

        {/* View Mode Toggle: Edit / Split / Preview */}
        <div className="flex items-center gap-1 bg-background p-1 rounded-xl border border-border">
          <button
            type="button"
            onClick={() => setViewMode("edit")}
            className={`p-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
              viewMode === "edit"
                ? "bg-primary text-primary-foreground shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Write</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("split")}
            className={`p-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer hidden md:flex items-center gap-1 ${
              viewMode === "split"
                ? "bg-primary text-primary-foreground shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Split</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("preview")}
            className={`p-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
              viewMode === "preview"
                ? "bg-primary text-primary-foreground shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Preview</span>
          </button>
        </div>
      </div>

      {/* Main Editor Body */}
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border min-h-[420px]">
        {/* Left Column: Markdown Input */}
        {(viewMode === "edit" || viewMode === "split") && (
          <div className={`p-4 flex flex-col ${viewMode === "edit" ? "md:col-span-2" : ""}`}>
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              rows={16}
              className="w-full flex-1 p-2 bg-transparent text-foreground font-mono text-sm resize-y focus:outline-hidden leading-relaxed whitespace-pre-wrap"
            />
            <div className="flex items-center justify-between pt-2 border-t border-border/50 text-[11px] text-muted-foreground">
              <span>Markdown &amp; HTML supported. Single Enter = line break.</span>
              <span>{value.length} characters</span>
            </div>
          </div>
        )}

        {/* Right Column: Live Formatted Preview */}
        {(viewMode === "preview" || viewMode === "split") && (
          <div
            className={`p-6 overflow-y-auto max-h-[600px] bg-muted/10 ${
              viewMode === "preview" ? "md:col-span-2" : ""
            }`}
          >
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70 mb-4 pb-2 border-b border-border/50">
              Live Reader Preview
            </div>
            {value.trim() ? (
              <ArticleBody content={value} />
            ) : (
              <div className="text-sm text-muted-foreground italic py-8 text-center">
                Your formatted article preview will appear here in real-time as you type...
              </div>
            )}
          </div>
        )}
      </div>

      {/* Image Caption Insertion Modal */}
      <Modal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        title="Insert Image with Caption"
        description="Provide an optional caption to display beneath the image in the article."
        maxWidth="md"
      >
        <div className="flex flex-col gap-4">
          <div className="relative w-full h-44 rounded-xl overflow-hidden bg-muted border border-border">
            <Image
              src={imageUrl}
              alt="Uploaded preview"
              fill
              className="object-cover"
              unoptimized
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
              placeholder="e.g. Systems architecture topology"
              className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs focus:outline-hidden focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
            <button
              type="button"
              onClick={() => setShowImageModal(false)}
              className="px-4 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-muted text-foreground cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={insertImageTag}
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 cursor-pointer transition-all shadow-xs"
            >
              Insert into Article
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
