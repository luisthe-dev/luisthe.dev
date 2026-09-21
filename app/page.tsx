import BlogMainLayoutComponent from "@/components/blog/main";
import HomeHero from "@/components/main/hero";
import PostNetworkComponent from "@/components/main/network";
import NewsletterComponent from "@/components/main/newsletter";
import { getFeaturedPosts, getSyndicatedPosts } from "@/lib/db/posts";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import React from "react";

export const revalidate = 60; // ISR cache revalidation

export default async function HomePage() {
  const [featuredPosts, syndicatedPosts] = await Promise.all([
    getFeaturedPosts(),
    getSyndicatedPosts(),
  ]);

  return (
    <div className="flex flex-col items-center justify-start w-full">
      {/* Bio Hero Section */}
      <HomeHero />

      {/* Main Content Sections */}
      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 flex flex-col gap-12">
        {/* Featured Writing */}
        <section className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-border/40 pb-4">
            <div>
              <h2 className="font-extrabold text-2xl sm:text-3xl tracking-tight text-foreground">
                Featured Writing
              </h2>
              <p className="font-normal text-sm text-muted-foreground mt-1">
                Top articles &amp; deep-dives on systems engineering and leadership.
              </p>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
            >
              <span>View all articles</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <BlogMainLayoutComponent articles={featuredPosts} columns={3} />
        </section>

        {/* Cross-Post & Syndication Stream */}
        <PostNetworkComponent articles={syndicatedPosts} />

        {/* High Contrast Newsletter */}
        <NewsletterComponent />
      </main>
    </div>
  );
}
