"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Share2, Check, Copy } from "lucide-react";
import { TwitterIcon, LinkedinIcon } from "@/components/ui/icons";
import { toast } from "@/components/ui/toast";

interface ShareBarProps {
  title: string;
  slug: string;
  category?: string;
}

export default function ShareBar({ title, slug, category }: ShareBarProps) {
  const [copied, setCopied] = useState(false);

  const getCanonicalUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/blog/${slug}`;
    }
    return `https://luisthe.dev/blog/${slug}`;
  };

  const handleCopy = async () => {
    try {
      const url = getCanonicalUrl();
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Article link copied to clipboard!");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const shareOnTwitter = () => {
    const url = encodeURIComponent(getCanonicalUrl());
    const text = encodeURIComponent(`"${title}" by @luisthe___dev\n\n`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank", "noopener,noreferrer");
  };

  const shareOnLinkedin = () => {
    const url = encodeURIComponent(getCanonicalUrl());
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/50">
      {/* Back to Blog & Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 font-semibold text-foreground hover:text-primary transition-colors py-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Articles</span>
        </Link>
        {category && (
          <>
            <span className="text-border">/</span>
            <span className="text-muted-foreground font-medium">{category}</span>
          </>
        )}
      </div>

      {/* Share Actions */}
      <div className="flex items-center gap-2 self-start sm:self-auto">
        <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1 mr-1">
          <Share2 className="w-3 h-3" />
          <span>Share:</span>
        </span>

        {/* Copy Link Button */}
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border border-border text-xs font-medium text-foreground hover:bg-muted hover:border-primary/50 transition-all cursor-pointer"
          title="Copy link to article"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-emerald-500 font-semibold">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Copy Link</span>
            </>
          )}
        </button>

        {/* Twitter / X */}
        <button
          type="button"
          onClick={shareOnTwitter}
          className="p-2 rounded-xl bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted hover:border-primary/50 transition-all cursor-pointer"
          title="Share on X / Twitter"
          aria-label="Share on X"
        >
          <TwitterIcon className="w-3.5 h-3.5" />
        </button>

        {/* LinkedIn */}
        <button
          type="button"
          onClick={shareOnLinkedin}
          className="p-2 rounded-xl bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted hover:border-primary/50 transition-all cursor-pointer"
          title="Share on LinkedIn"
          aria-label="Share on LinkedIn"
        >
          <LinkedinIcon className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
