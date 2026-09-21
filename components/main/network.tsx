import { ExternalLink } from "lucide-react";
import Link from "next/link";
import React from "react";
import { BlogPost } from "@/lib/types/blog";

type Props = {
  articles: BlogPost[];
};

const PostNetworkComponent = ({ articles }: Props) => {
  return (
    <section className="w-full py-12 md:py-16">
      <div className="flex flex-col gap-1 mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Cross-Post &amp; Syndication Stream
        </h2>
        <p className="text-sm text-muted-foreground">
          Recent essays and analyses cross-published across Substack, Medium, and personal channels.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {articles.map((article) => {
          const platform = article.syndicationPlatform || article.category || "Personal Blog";
          const platformColor =
            platform.toLowerCase() === "substack"
              ? "bg-[#FF6719]/10 text-[#FF6719] border-[#FF6719]/30"
              : platform.toLowerCase() === "medium"
              ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700"
              : "bg-primary/10 text-primary border-primary/20";

          const linkHref = article.syndicationUrl || `/blog/${article.slug}`;
          const isExternal = Boolean(article.syndicationUrl);

          return (
            <div
              key={article.id || article.slug}
              className="flex items-center justify-between p-4 px-5 rounded-xl bg-card border border-border/70 hover:border-border hover:shadow-xs transition-all duration-150 gap-4"
            >
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${platformColor}`}
                  >
                    {platform}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {article.syndicatedTime || "Recently"}
                  </span>
                </div>
                <h3 className="font-semibold text-sm text-foreground truncate mt-0.5">
                  <Link
                    href={linkHref}
                    target={isExternal ? "_blank" : undefined}
                    className="hover:underline"
                  >
                    {article.title}
                  </Link>
                </h3>
              </div>

              <Link
                href={linkHref}
                target={isExternal ? "_blank" : undefined}
                className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground shrink-0 px-2.5 py-1 rounded-md hover:bg-accent transition-colors"
              >
                <span>Read</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default PostNetworkComponent;
