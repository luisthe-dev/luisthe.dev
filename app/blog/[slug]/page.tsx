import React from "react";
import { notFound } from "next/navigation";
import SingleBlogIntroCard from "@/components/blog/intro";
import SingleBlogOutroCard from "@/components/blog/outro";
import ArticleBody from "@/components/blog/article-body";
import ReadingProgress from "@/components/blog/reading-progress";
import TableOfContents from "@/components/blog/table-of-contents";
import { getPostBySlug, getAdjacentPosts, getPosts, getSiteSettings, getSocialLinks } from "@/lib/db/posts";
import type { Metadata } from "next";

export const revalidate = 60;

interface SingleBlogPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const { posts } = await getPosts({ status: "published", limit: 100 });
    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error("Failed to generate static params for posts:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: SingleBlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug).catch(() => null);
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

  const [post, siteSettings, socialLinks] = await Promise.all([
    getPostBySlug(slug).catch(() => null),
    getSiteSettings().catch(() => ({} as Record<string, string>)),
    getSocialLinks(true).catch(() => []),
  ]);

  if (!post || post.status !== "published") {
    notFound();
  }

  const { previous, next } = await getAdjacentPosts(post.createdAt).catch(() => ({
    previous: null,
    next: null,
  }));

  // Safely serialize adjacent posts to plain objects for the Client Component
  const previousSafe = previous
    ? { slug: previous.slug, title: previous.title }
    : null;
  const nextSafe = next
    ? { slug: next.slug, title: next.title }
    : null;

  const settings = siteSettings as Record<string, string>;
  const authorName = settings.author_name || "Divine Adesiyan";
  const authorRole = settings.author_role || "Systems Architect & Writer";
  const authorBio =
    settings.author_bio ||
    settings.about_bio ||
    settings.about_headline ||
    "Full Stack Engineer & Technical Writer with 8+ years building high-throughput microservices, fintech engines, and cloud platforms.";

  return (
    <>
      {/* Scroll-driven Reading Progress Bar */}
      <ReadingProgress />

      <div className="w-full py-10 md:py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] xl:grid-cols-[1fr_260px] gap-8 xl:gap-12 items-start">
            {/* Main Article Column */}
            <article className="max-w-3xl w-full mx-auto lg:mx-0 min-w-0">
              {/* Article Header (Breadcrumbs, Cover, Title, Metadata, Share, Dynamic Author) */}
              <SingleBlogIntroCard
                article={post}
                authorName={authorName}
                authorRole={authorRole}
              />

              {/* Mobile / Tablet Inline Table of Contents */}
              <div className="lg:hidden">
                <TableOfContents content={post.content} variant="inline" />
              </div>

              {/* Article Body Container with Enhanced Typography & Blockquotes */}
              <div className="w-full">
                <ArticleBody content={post.content} />
              </div>

              {/* Newsletter Callout, Dynamic Author Bio & Adjacent Navigation */}
              <SingleBlogOutroCard
                previousPost={previousSafe}
                nextPost={nextSafe}
                authorName={authorName}
                authorRole={authorRole}
                authorBio={authorBio}
                socialLinks={socialLinks}
              />
            </article>

            {/* Desktop Sticky Table of Contents Sidebar (sticks on screen without blocking article) */}
            <aside className="hidden lg:block w-full sticky top-28 self-start max-h-[calc(100vh-8rem)] overflow-y-auto pr-2 pb-8">
              <TableOfContents content={post.content} variant="sticky-sidebar" />
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}