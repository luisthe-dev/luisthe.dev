import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GithubIcon, TwitterIcon, LinkedinIcon, SubstackIcon } from "@/components/ui/icons";

interface AdjacentPost {
  slug: string;
  title: string;
  createdAt: Date | string;
}

interface SingleBlogOutroCardProps {
  previousPost?: AdjacentPost | null;
  nextPost?: AdjacentPost | null;
}

const SingleBlogOutroCard: React.FC<SingleBlogOutroCardProps> = ({
  previousPost,
  nextPost,
}) => {
  return (
    <div className="w-full flex flex-col gap-10 mt-16 pt-10 border-t border-border/60">
      {/* Author Bio Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-card border border-border/70 flex flex-col sm:flex-row items-center sm:items-start gap-5 shadow-xs">
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-muted shrink-0 border border-border">
          <Image
            src="/avatar.jpg"
            alt="Divine Adesiyan"
            fill
            className="object-cover"
          />
        </div>

        <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-2">
          <div className="flex flex-wrap items-center justify-between w-full gap-2">
            <div>
              <h3 className="font-bold text-lg text-foreground">
                Divine Adesiyan
              </h3>
              <p className="text-xs text-primary font-medium">
                Senior Backend Engineer @ Konga | LuisThe___Dev
              </p>
            </div>
            {/* Social Links */}
            <div className="flex items-center gap-3 text-muted-foreground">
              <a
                href="https://github.com/luisthe-dev"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="hover:text-foreground transition-colors p-1"
                title="GitHub"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com/in/divinegiftadesiyan"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="hover:text-foreground transition-colors p-1"
                title="LinkedIn"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
              <a
                href="https://x.com/luisthe___dev"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                className="hover:text-foreground transition-colors p-1"
                title="Twitter"
              >
                <TwitterIcon className="w-4 h-4" />
              </a>
              <a
                href="https://substack.com/@luisthedev"
                target="_blank"
                rel="noreferrer"
                aria-label="Substack"
                className="hover:text-foreground transition-colors p-1"
                title="Substack"
              >
                <SubstackIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed mt-1">
            Full Stack Engineer with 8+ years building high-throughput microservices,
            fintech engines, and cloud platforms. Writing about distributed architecture,
            Redis caching strategies, and developer craftsmanship.
          </p>
        </div>
      </div>

      {/* Next & Previous Article Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {previousPost ? (
          <Link
            href={`/blog/${previousPost.slug}`}
            className="group flex flex-col items-start p-4 px-5 rounded-xl border border-border/70 bg-card hover:bg-accent/40 hover:border-border transition-all shadow-2xs"
          >
            <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground group-hover:text-foreground mb-1">
              <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>Previous Article</span>
            </div>
            <span className="font-bold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {previousPost.title}
            </span>
          </Link>
        ) : (
          <div className="hidden sm:block" />
        )}

        {nextPost ? (
          <Link
            href={`/blog/${nextPost.slug}`}
            className="group flex flex-col items-end text-right p-4 px-5 rounded-xl border border-border/70 bg-card hover:bg-accent/40 hover:border-border transition-all shadow-2xs"
          >
            <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground group-hover:text-foreground mb-1">
              <span>Next Article</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
            <span className="font-bold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {nextPost.title}
            </span>
          </Link>
        ) : (
          <div className="hidden sm:block" />
        )}
      </div>
    </div>
  );
};

export default SingleBlogOutroCard;
