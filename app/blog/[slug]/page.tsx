import React from "react";
import { notFound } from "next/navigation";
import SingleBlogIntroCard from "@/components/blog/intro";
import SingleBlogOutroCard from "@/components/blog/outro";
import ArticleBody from "@/components/blog/article-body";
import ReadingProgress from "@/components/blog/reading-progress";
import TableOfContents from "@/components/blog/table-of-contents";
import { getPostBySlug, getAdjacentPosts } from "@/lib/db/posts";
import type { Metadata } from "next";

export const revalidate = 60;

interface SingleBlogPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: SingleBlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) {
    return { title: "Post Not Found" };
  }
  return {
    title: `${post.title} | Divine Adesiyan`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage || "/24.jpg"],
    },
  };
}

export default async function SingleBlogPage({ params }: SingleBlogPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post || post.status !== "published") {
    notFound();
  }

  const { previous, next } = await getAdjacentPosts(post.createdAt);

  return (
    <>
      {/* Scroll-driven Reading Progress Bar */}
      <ReadingProgress />

      <div className="w-full py-10 md:py-14">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Article Header (Breadcrumbs, Cover, Title, Metadata, Share) */}
          <SingleBlogIntroCard article={post} />

          {/* Interactive Table of Contents (for articles with multiple headings) */}
          <TableOfContents content={post.content} />

          {/* Article Body Container with Enhanced Typography & Blockquotes */}
          <div className="w-full">
            <ArticleBody content={post.content} />
          </div>

          {/* Newsletter Callout, Author Bio & Adjacent Navigation */}
          <SingleBlogOutroCard previousPost={previous} nextPost={next} />
        </article>
      </div>
    </>
  );
}