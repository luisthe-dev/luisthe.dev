import React from "react";
import Image from "next/image";
import { BlogPost } from "@/lib/types/blog";
import { Calendar, Clock, ExternalLink } from "lucide-react";

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

  return (
    <div className="w-full flex flex-col gap-6 border-b border-border/60 pb-8 mb-10">
      {/* Category and Tags Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary text-primary-foreground">
          {article.category}
        </span>
        {article.tags?.map((tag) => (
          <span
            key={tag}
            className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Article H1 Title */}
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
        {article.title}
      </h1>

      {/* Metadata & Author Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-border bg-muted">
            <Image
              src="/avatar.jpg"
              alt="Divine Adesiyan"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-foreground">Divine Adesiyan</span>
            <span className="text-xs text-muted-foreground">Founder &amp; Software Architect</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{article.readTime || "5 min read"}</span>
          </div>
        </div>
      </div>

      {/* Syndication Callout Banner */}
      {article.isSyndicated && (
        <div className="mt-2 p-3.5 px-4 rounded-xl bg-accent/60 border border-border flex items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-foreground font-medium">
            <span className="w-2 h-2 rounded-full bg-[#FF6719] animate-pulse" />
            <span>
              Originally published on{" "}
              <strong className="font-semibold">
                {article.syndicationPlatform || "Substack"}
              </strong>
            </span>
          </div>
          {article.syndicationUrl && (
            <a
              href={article.syndicationUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
            >
              <span>Read original here</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default SingleBlogIntroCard;
