"use client";

import React, { useState } from "react";
import Link from "next/link";
import FacelessCoderLottie from "@/components/ui/faceless-coder-lottie";
import { ChevronLeft, ChevronRight, Mail, CheckCircle2, Loader2 } from "lucide-react";
import { GithubIcon, TwitterIcon, LinkedinIcon, SubstackIcon } from "@/components/ui/icons";
import { toast } from "@/components/ui/toast";

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
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      toast.warning("Please enter a valid email address");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Failed to subscribe to newsletter");
      }

      setSubscribed(true);
      setEmail("");
      toast.success("Subscribed! You will receive email notifications on new posts.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Subscription failed. Please try again.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-10 mt-16 pt-10 border-t border-border/60">
      {/* Inline Newsletter Callout */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
        <div className="flex flex-col gap-1.5 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider self-center sm:self-start">
            <Mail className="w-3.5 h-3.5" />
            <span>Newsletter Dispatch</span>
          </div>
          <h3 className="text-xl font-bold text-foreground">
            Enjoyed this breakdown?
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md leading-relaxed">
            Get email notifications when new deep dives on distributed architecture and systems design are published. Zero spam, unsubscribe anytime.
          </p>
        </div>

        {subscribed ? (
          <div className="flex items-center gap-2 p-3 px-5 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs sm:text-sm font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>You&apos;re subscribed to new article alerts!</span>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row w-full sm:w-auto items-center gap-2">
            <input
              type="email"
              placeholder="your-email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full sm:w-64 px-4 py-2.5 rounded-xl bg-background border border-border text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              disabled={submitting || !email.trim()}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs sm:text-sm font-bold shadow-xs hover:opacity-90 disabled:opacity-50 transition-all cursor-pointer whitespace-nowrap"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Joining...</span>
                </>
              ) : (
                <span>Subscribe</span>
              )}
            </button>
          </form>
        )}
      </div>
      {/* Author Bio Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-card border border-border/70 flex flex-col sm:flex-row items-center sm:items-start gap-5 shadow-xs">
        <div className="shrink-0">
          <FacelessCoderLottie size="md" className="rounded-2xl" />
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
