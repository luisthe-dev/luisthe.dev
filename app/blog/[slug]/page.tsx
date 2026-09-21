import React from "react";
import { notFound } from "next/navigation";
import SingleBlogIntroCard from "@/components/blog/intro";
import SingleBlogOutroCard from "@/components/blog/outro";
import ArticleBody from "@/components/blog/article-body";
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
    title: `${post.title} | Alex Thompson`,
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
    <div className="w-full py-12 md:py-16">
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Article Header */}
        <SingleBlogIntroCard article={post} />

        {/* Article Body Container */}
        <div className="w-full">
          <ArticleBody content={post.content} />
        </div>

        {/* Author Footer & Navigation */}
        <SingleBlogOutroCard previousPost={previous} nextPost={next} />
      </article>
    </div>
  );
}