import prisma from "@/lib/prisma";
import { BlogPost, TimelineEvent, WorkspaceItem } from "@/lib/types/blog";
import { Prisma } from "@prisma/client";

export async function getPosts(options?: {
  search?: string;
  category?: string;
  status?: "published" | "draft" | "all";
  featured?: boolean;
  limit?: number;
  offset?: number;
}) {
  const {
    search,
    category,
    status = "published",
    featured,
    limit,
    offset,
  } = options || {};

  const where: Prisma.PostWhereInput = {};

  if (status && status !== "all") {
    where.status = status;
  }

  if (category && category !== "All") {
    where.category = {
      equals: category,
      mode: "insensitive",
    };
  }

  if (featured !== undefined) {
    where.featured = featured;
  }

  if (search && search.trim()) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { excerpt: { contains: search, mode: "insensitive" } },
      { content: { contains: search, mode: "insensitive" } },
      { tags: { has: search } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    }),
    prisma.post.count({ where }),
  ]);

  return {
    posts: items as unknown as BlogPost[],
    total,
  };
}

export async function getFeaturedPosts(): Promise<BlogPost[]> {
  const posts = await prisma.post.findMany({
    where: { status: "published", featured: true },
    orderBy: { createdAt: "desc" },
    take: 3,
  });
  return posts as unknown as BlogPost[];
}

export async function getSyndicatedPosts(): Promise<BlogPost[]> {
  const posts = await prisma.post.findMany({
    where: { status: "published", isSyndicated: true },
    orderBy: { createdAt: "desc" },
    take: 6,
  });
  return posts as unknown as BlogPost[];
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const post = await prisma.post.findUnique({
    where: { slug },
  });
  return (post as unknown as BlogPost) || null;
}

export async function getPostById(id: string): Promise<BlogPost | null> {
  const post = await prisma.post.findUnique({
    where: { id },
  });
  return (post as unknown as BlogPost) || null;
}

export async function getAdjacentPosts(currentPostDate: Date | string) {
  const dateObj = new Date(currentPostDate);
  const [previous, next] = await Promise.all([
    prisma.post.findFirst({
      where: {
        status: "published",
        createdAt: { lt: dateObj },
      },
      orderBy: { createdAt: "desc" },
      select: { slug: true, title: true, createdAt: true },
    }),
    prisma.post.findFirst({
      where: {
        status: "published",
        createdAt: { gt: dateObj },
      },
      orderBy: { createdAt: "asc" },
      select: { slug: true, title: true, createdAt: true },
    }),
  ]);

  return { previous, next };
}

export async function createPost(data: Partial<BlogPost>): Promise<BlogPost> {
  const newPost = await prisma.post.create({
    data: {
      slug: data.slug || `post-${Date.now()}`,
      title: data.title || "Untitled Post",
      excerpt: data.excerpt || "",
      content: data.content || "",
      coverImage: data.coverImage || "/24.jpg",
      category: data.category || "Tech",
      tags: data.tags || [],
      readTime: data.readTime || "3 min read",
      status: data.status || "draft",
      featured: data.featured || false,
      isSyndicated: data.isSyndicated || false,
      syndicationPlatform: data.syndicationPlatform || null,
      syndicationUrl: data.syndicationUrl || null,
      syndicatedTime: data.syndicatedTime || null,
      publishedAt: data.status === "published" ? new Date() : null,
    },
  });
  return newPost as unknown as BlogPost;
}

export async function updatePost(
  id: string,
  data: Partial<BlogPost>
): Promise<BlogPost> {
  const updateData: Prisma.PostUpdateInput = {
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt,
    content: data.content,
    coverImage: data.coverImage,
    category: data.category,
    tags: data.tags,
    readTime: data.readTime,
    status: data.status,
    featured: data.featured,
    isSyndicated: data.isSyndicated,
    syndicationPlatform: data.syndicationPlatform,
    syndicationUrl: data.syndicationUrl,
    syndicatedTime: data.syndicatedTime,
  };

  if (data.status === "published" && !data.publishedAt) {
    updateData.publishedAt = new Date();
  }

  const updated = await prisma.post.update({
    where: { id },
    data: updateData,
  });
  return updated as unknown as BlogPost;
}

export async function deletePost(id: string): Promise<boolean> {
  await prisma.post.delete({
    where: { id },
  });
  return true;
}

export async function getTimelineEvents(): Promise<TimelineEvent[]> {
  const events = await prisma.timelineEvent.findMany({
    orderBy: [{ year: "desc" }, { order: "asc" }],
  });
  return events as unknown as TimelineEvent[];
}

export async function getWorkspaceItems(): Promise<WorkspaceItem[]> {
  const items = await prisma.workspaceItem.findMany({
    orderBy: { order: "asc" },
  });
  return items as unknown as WorkspaceItem[];
}
