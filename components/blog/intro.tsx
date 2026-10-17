import React from "react";
import Image from "next/image";
import FacelessCoderLottie from "@/components/ui/faceless-coder-lottie";
import { BlogPost } from "@/lib/types/blog";
import { Calendar, Clock, ExternalLink, BookOpen } from "lucide-react";
import ShareBar from "./share-bar";

interface SingleBlogIntroCardProps {
  article: BlogPost;
}

const SingleBlogIntroCard: React.FC<SingleBlogIntroCardProps> = ({ article }) => {
  const formattedDate = article.publishedAt || article.createdAt
    ? new Date(article.publishedAt || article.createdAt).toLocaleDateString(
        "en-US",
        {
          month: "long",
          day: "numeric",
          year: "numeric",
        }
      )
    : "Recently";

  // Calculate approximate word count
  const wordCount = article.content
    ? article.content.trim().split(/\s+/).filter(Boolean).length
    : 0;

  return (
    <div className="w-full flex flex-col gap-6 pb-6">
      {/* Top Navigation & Share Bar */}
      <ShareBar
        title={article.title}
        slug={article.slug}
        category={article.category}
      />

      {/* Category and Tags Pills */}
      <div className="flex flex-wrap items-center gap-2 pt-2">
        <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-primary text-primary-foreground shadow-2xs">
          {article.category}
        </span>
        {article.tags?.map((tag) => (
          <span
            key={tag}
            className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground border border-border/50"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Article H1 Title */}
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground leading-[1.12]">
        {article.title}
      </h1>

      {/* Metadata & Author Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-2 border-y border-border/60">
        <div className="flex items-center gap-3">
          <div className="shrink-0">
            <FacelessCoderLottie size="sm" className="rounded-full w-10 h-10 p-1" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-foreground">Divine Adesiyan</span>
            <span className="text-xs text-muted-foreground">Systems Architect &amp; Writer</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
          <div className="flex items-center gap-1.5" title="Publication Date">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-1.5" title="Reading Time">
            <Clock className="w-3.5 h-3.5 text-primary" />
            <span>{article.readTime || "5 min read"}</span>
          </div>
          {wordCount > 0 && (
            <div className="flex items-center gap-1.5" title="Word Count">
              <BookOpen className="w-3.5 h-3.5 text-primary" />
              <span>{wordCount.toLocaleString()} words</span>
            </div>
          )}
        </div>
      </div>

      {/* Hero Cover Image (if available) */}
      {article.coverImage && (
        <div className="w-full overflow-hidden rounded-3xl border border-border/80 bg-muted/20 shadow-md my-2">
          <div className="relative w-full aspect-[16/9] max-h-[460px]">
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 800px, 800px"
            />
          </div>
        </div>
      )}

      {/* Syndication Callout Banner */}
      {article.isSyndicated && (
        <div className="p-3.5 px-4 rounded-2xl bg-accent/50 border border-border flex items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-foreground font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF6719] animate-pulse shrink-0" />
            <span>
              Originally syndicated on{" "}
              <strong className="font-semibold text-foreground">
                {article.syndicationPlatform || "Substack"}
              </strong>
            </span>
          </div>
          {article.syndicationUrl && (
            <a
              href={article.syndicationUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-primary hover:underline shrink-0"
            >
              <span>View Original</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default SingleBlogIntroCard;
