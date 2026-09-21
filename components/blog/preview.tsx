import { BlogPost } from "@/lib/types/blog";
import { Clock, Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface BlogPreviewCardProps {
  article: BlogPost;
}

const BlogPreviewCard: React.FC<BlogPreviewCardProps> = ({ article }) => {
  const formattedDate = article.publishedAt || article.createdAt
    ? new Date(article.publishedAt || article.createdAt).toLocaleDateString(
        "en-US",
        {
          month: "short",
          day: "numeric",
          year: "numeric",
        }
      )
    : "Recently";

  const isSubstack =
    article.syndicationPlatform?.toLowerCase() === "substack" ||
    article.category?.toLowerCase() === "substack";

  return (
    <article className="group flex flex-col justify-between bg-card text-card-foreground rounded-2xl border border-border/70 overflow-hidden shadow-xs hover:shadow-md hover:border-border transition-all duration-200 hover:-translate-y-1">
      <div>
        {/* Cover Image or Substack Brand Cover */}
        <Link
          href={`/blog/${article.slug}`}
          className="block relative w-full h-44 overflow-hidden bg-muted"
        >
          {isSubstack && !article.coverImage?.startsWith("/2") ? (
            <div className="w-full h-full bg-[#FF6719]/10 dark:bg-[#FF6719]/20 flex items-center justify-center p-6 text-center">
              <div className="flex flex-col items-center gap-2">
                <svg
                  className="w-10 h-10 fill-[#FF6719]"
                  viewBox="0 0 24 24"
                >
                  <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
                </svg>
                <span className="font-semibold text-sm text-[#FF6719]">
                  Substack blog
                </span>
              </div>
            </div>
          ) : article.coverImage ? (
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 380px"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-accent/40 flex items-center justify-center text-muted-foreground">
              <span>{article.category}</span>
            </div>
          )}
        </Link>

        {/* Card Content */}
        <div className="p-5 flex flex-col gap-2.5">
          {/* Category Chip */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
              {article.category}
            </span>
            {article.isSyndicated && article.syndicationPlatform && (
              <span className="text-[10px] font-medium text-muted-foreground flex items-center gap-1">
                <span>•</span>
                <span>{article.syndicationPlatform}</span>
              </span>
            )}
          </div>

          {/* Title */}
          <h2 className="font-bold text-lg leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
            <Link href={`/blog/${article.slug}`}>{article.title}</Link>
          </h2>

          {/* Excerpt */}
          <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
            {article.excerpt}
          </p>
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-5 py-3.5 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          <span>{formattedDate}</span>
        </div>

        <div className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          <span>{article.readTime || "4 min read"}</span>
        </div>
      </div>
    </article>
  );
};

export default BlogPreviewCard;
