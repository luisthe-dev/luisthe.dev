"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Save,
  CheckCircle,
  Upload,
  Sparkles,
  Loader2,
  RefreshCw,
} from "lucide-react";
import RichEditor from "./rich-editor";
import { BlogPost } from "@/lib/types/blog";
import { toast } from "@/components/ui/toast";
import { calculateReadTime, calculateWordCount } from "@/lib/utils";

interface PostFormProps {
  initialData?: Partial<BlogPost>;
  isEditing?: boolean;
}

const CATEGORIES = ["Tech", "Writing", "Architecture", "Substack", "Personal"];

export default function PostForm({
  initialData,
  isEditing = false,
}: PostFormProps) {
  const router = useRouter();

  // Form states
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [slugModified, setSlugModified] = useState(Boolean(initialData?.slug));
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || "/24.jpg");
  const [category, setCategory] = useState(initialData?.category || "Tech");
  const [tags, setTags] = useState<string[]>(initialData?.tags || ["Engineering"]);
  const [tagInput, setTagInput] = useState("");
  const [readTime, setReadTime] = useState(
    initialData?.readTime || calculateReadTime(initialData?.content || "")
  );
  const [readTimeModified, setReadTimeModified] = useState(Boolean(initialData?.readTime));
  const [featured, setFeatured] = useState(initialData?.featured || false);
  const [status, setStatus] = useState<"published" | "draft">(
    initialData?.status || "published"
  );
  const [notifySubscribers, setNotifySubscribers] = useState(true);

  // Syndication states
  const [isSyndicated, setIsSyndicated] = useState(initialData?.isSyndicated || false);
  const [syndicationPlatform, setSyndicationPlatform] = useState(
    initialData?.syndicationPlatform || "Substack"
  );
  const [syndicationUrl, setSyndicationUrl] = useState(
    initialData?.syndicationUrl || ""
  );
  const [syndicatedTime, setSyndicatedTime] = useState(
    initialData?.syndicatedTime || "Just now"
  );

  // Status & loading
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Auto-generate slug from title
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slugModified) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setSlug(generated);
    }
  };

  // Add tag
  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const cleaned = tagInput.trim().replace(/,/g, "");
      if (cleaned && !tags.includes(cleaned)) {
        setTags([...tags, cleaned]);
        setTagInput("");
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // Upload cover image
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingCover(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setCoverImage(data.url);
      toast.success("Cover image uploaded successfully!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to upload image";
      toast.error(msg);
    } finally {
      setIsUploadingCover(false);
    }
  };

  // Save / Publish
  const handleSave = async (newStatus?: "published" | "draft") => {
    if (!title.trim()) {
      toast.warning("Please provide an article title");
      return;
    }

    const targetStatus = newStatus || status;
    setIsSaving(true);
    setFeedback(null);

    const postPayload = {
      title,
      slug: slug || `post-${Date.now()}`,
      excerpt,
      content,
      coverImage,
      category,
      tags,
      readTime,
      featured,
      status: targetStatus,
      notifySubscribers: targetStatus === "published" ? notifySubscribers : false,
      isSyndicated,
      syndicationPlatform: isSyndicated ? syndicationPlatform : null,
      syndicationUrl: isSyndicated ? syndicationUrl : null,
      syndicatedTime: isSyndicated ? syndicatedTime : null,
    };

    try {
      const url = isEditing && initialData?.id
        ? `/api/posts/${initialData.id}`
        : `/api/posts`;
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postPayload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save article");
      }

      const successMsg =
        targetStatus === "published"
          ? "Article published successfully!"
          : "Draft saved successfully!";

      setFeedback(successMsg);
      toast.success(successMsg);

      setTimeout(() => {
        router.push("/admin");
        router.refresh();
      }, 800);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save article";
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-20">
      {/* Top action header */}
      <div className="flex flex-wrap items-center justify-between gap-4 sticky top-16 z-30 py-3 bg-muted/20 backdrop-blur-xs border-b border-border/40">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="p-2 rounded-xl border border-border bg-card hover:bg-accent text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-foreground">
              {isEditing ? "Edit Article" : "Compose New Article"}
            </h1>
            <p className="text-xs text-muted-foreground">
              {isEditing ? `Editing /${slug}` : "Draft or publish a rich post"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {feedback && (
            <span className="text-xs font-semibold text-emerald-500 flex items-center gap-1 mr-2 animate-in fade-in">
              <CheckCircle className="w-4 h-4" />
              <span>{feedback}</span>
            </span>
          )}

          <button
            type="button"
            onClick={() => handleSave("draft")}
            disabled={isSaving}
            className="px-4 py-2 rounded-xl border border-border bg-card hover:bg-accent text-foreground text-xs font-semibold cursor-pointer transition-colors disabled:opacity-60 flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave("published")}
            disabled={isSaving}
            className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 cursor-pointer transition-all disabled:opacity-60 flex items-center gap-1.5 shadow-xs"
          >
            {isSaving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            <span>{isEditing ? "Update Article" : "Publish Live"}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Editor & Metadata Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Content Column */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Article Title Input */}
          <div className="flex flex-col gap-1.5">
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Article Title (e.g. Distributed Systems Architecture in Practice)"
              className="w-full text-2xl sm:text-3xl font-extrabold tracking-tight bg-transparent text-foreground placeholder-muted-foreground/60 border-b border-border/80 pb-3 focus:outline-hidden focus:border-primary transition-colors"
            />
          </div>

          {/* Excerpt */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-foreground uppercase tracking-wider">
              Short Excerpt / Synopsis
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              placeholder="A brief 1-2 sentence description summarizing the article for previews and search engine snippets..."
              className="w-full px-4 py-3 rounded-2xl bg-card border border-border text-foreground text-xs leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Rich Text Editor */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-foreground uppercase tracking-wider">
              Article Content &amp; Rich Formatting
            </label>
            <RichEditor
              value={content}
              onChange={(val) => {
                setContent(val);
                if (!readTimeModified) {
                  setReadTime(calculateReadTime(val));
                }
              }}
            />
          </div>
        </div>

        {/* Sidebar Column: Settings, Cover & Syndication */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Publishing Settings Card */}
          <div className="p-5 rounded-2xl bg-card border border-border shadow-2xs flex flex-col gap-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-foreground pb-2 border-b border-border/60">
              Publication Settings
            </h3>

            {/* Slug */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">
                URL Slug
              </label>
              <div className="flex items-center rounded-xl bg-background border border-border px-3 py-2 text-xs">
                <span className="text-muted-foreground">/blog/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value);
                    setSlugModified(true);
                  }}
                  className="w-full bg-transparent font-mono text-foreground focus:outline-hidden ml-0.5"
                />
              </div>
            </div>

            {/* Category */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-hidden focus:ring-2 focus:ring-primary"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Read Time with Auto-Calculation */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-muted-foreground">
                  Read Time (Auto-calculated)
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const auto = calculateReadTime(content);
                    setReadTime(auto);
                    setReadTimeModified(false);
                  }}
                  className="text-[11px] text-primary hover:underline cursor-pointer flex items-center gap-1 font-semibold"
                  title="Recalculate read time from content"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Sync from words</span>
                </button>
              </div>
              <input
                type="text"
                value={readTime}
                onChange={(e) => {
                  setReadTime(e.target.value);
                  setReadTimeModified(true);
                }}
                placeholder="e.g. 5 min read"
                className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-hidden"
              />
              <span className="text-[11px] text-muted-foreground">
                Auto-estimated at ~200 wpm ({calculateWordCount(content).toLocaleString()} words)
              </span>
            </div>

            {/* Featured Switch */}
            <label className="flex items-center gap-3 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-primary border-border focus:ring-primary"
              />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-foreground">
                  Featured Writing
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Feature in top 3 showcase on the Home Page
                </span>
              </div>
            </label>

            {/* Notify Subscribers Switch */}
            <label className="flex items-center gap-3 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={notifySubscribers}
                onChange={(e) => setNotifySubscribers(e.target.checked)}
                className="w-4 h-4 rounded text-primary border-border focus:ring-primary"
              />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-foreground">
                  Notify Subscribers
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Send email dispatch to newsletter audience upon publishing
                </span>
              </div>
            </label>

            {/* Status */}
            <div className="flex flex-col gap-1 pt-1">
              <label className="text-xs font-medium text-muted-foreground">
                Current Status
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setStatus("published")}
                  className={`py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    status === "published"
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Published
                </button>
                <button
                  type="button"
                  onClick={() => setStatus("draft")}
                  className={`py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    status === "draft"
                      ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Draft
                </button>
              </div>
            </div>
          </div>

          {/* Cover Image Card */}
          <div className="p-5 rounded-2xl bg-card border border-border shadow-2xs flex flex-col gap-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-foreground pb-2 border-b border-border/60">
              Cover Image
            </h3>

            <div className="relative w-full h-40 rounded-xl overflow-hidden bg-muted border border-border">
              {coverImage ? (
                <Image
                  src={coverImage}
                  alt="Cover Preview"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                  No cover image
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="w-full py-2 px-3 rounded-xl border border-border bg-background hover:bg-accent text-foreground text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors">
                {isUploadingCover ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Upload className="w-3.5 h-3.5" />
                )}
                <span>Upload New Cover Image</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleCoverUpload}
                  disabled={isUploadingCover}
                />
              </label>

              <div className="flex flex-col gap-1">
                <span className="text-[11px] text-muted-foreground">
                  Or use relative path / URL:
                </span>
                <input
                  type="text"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="/24.jpg or https://..."
                  className="w-full px-3 py-1.5 rounded-xl bg-background border border-border text-foreground text-xs font-mono focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Tags Card */}
          <div className="p-5 rounded-2xl bg-card border border-border shadow-2xs flex flex-col gap-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-foreground pb-2 border-b border-border/60">
              Tags &amp; Keywords
            </h3>

            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-rose-500 cursor-pointer text-xs"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>

            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Type tag and press Enter..."
              className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-hidden focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Syndication Card */}
          <div className="p-5 rounded-2xl bg-card border border-border shadow-2xs flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <h3 className="font-bold text-xs uppercase tracking-wider text-foreground">
                Syndication Stream
              </h3>
              <input
                type="checkbox"
                checked={isSyndicated}
                onChange={(e) => setIsSyndicated(e.target.checked)}
                className="w-4 h-4 rounded text-primary border-border focus:ring-primary cursor-pointer"
              />
            </div>

            {isSyndicated && (
              <div className="flex flex-col gap-3 animate-in fade-in">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    Syndication Platform
                  </label>
                  <select
                    value={syndicationPlatform}
                    onChange={(e) => setSyndicationPlatform(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-hidden"
                  >
                    <option value="Substack">Substack</option>
                    <option value="Medium">Medium</option>
                    <option value="Personal Blog">Personal Blog</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    Original URL
                  </label>
                  <input
                    type="url"
                    value={syndicationUrl}
                    onChange={(e) => setSyndicationUrl(e.target.value)}
                    placeholder="https://substack.com/@luisthedev/..."
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-hidden"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    Syndicated Label / Time
                  </label>
                  <input
                    type="text"
                    value={syndicatedTime}
                    onChange={(e) => setSyndicatedTime(e.target.value)}
                    placeholder="e.g. 3 minutes ago"
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-hidden"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
