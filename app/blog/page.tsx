import React from "react";
import BlogListClient from "@/components/blog/blog-list-client";
import { getPosts } from "@/lib/db/posts";

export const revalidate = 60;

interface BlogPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const resolvedParams = await searchParams;
  const initialCategory =
    typeof resolvedParams?.category === "string"
      ? resolvedParams.category
      : "All";

  const { posts } = await getPosts({
    status: "published",
    limit: 50,
  });

  return (
    <div className="w-full py-12 md:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-10 flex flex-col items-center gap-3">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            All Posts
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground font-normal leading-relaxed">
            Here&apos;s a curated list of my writings on software engineering, distributed systems,
            architecture, and lessons learned along the journey.
          </p>
        </div>

        {/* Interactive Search, Filter, and Grid */}
        <BlogListClient
          initialPosts={posts}
          initialCategory={initialCategory}
        />
      </div>
    </div>
  );
}
