import prisma from "@/lib/prisma";
import {
  BlogPost,
  TimelineEvent,
  WorkspaceItem,
  Competency,
  SocialLink,
  SiteSettingsMap,
  NewsletterSubscriber,
} from "@/lib/types/blog";
import { Prisma } from "@prisma/client";
import { calculateReadTime } from "@/lib/utils";

// ==========================================
// 1. POSTS
// ==========================================

export async function getPosts(options?: {
  search?: string;
  category?: string;
  status?: "published" | "draft" | "all";
  featured?: boolean;
  limit?: number;
  offset?: number;
}) {
  try {
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
      posts: JSON.parse(JSON.stringify(items)) as BlogPost[],
      total,
    };
  } catch (error) {
    console.error("Database query error in getPosts:", error);
    return {
      posts: [],
      total: 0,
    };
  }
}

export async function getFeaturedPosts(): Promise<BlogPost[]> {
  try {
    const posts = await prisma.post.findMany({
      where: { status: "published", featured: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    });
    return JSON.parse(JSON.stringify(posts)) as BlogPost[];
  } catch (error) {
    console.error("Failed to load featured posts:", error);
    return [];
  }
}

export async function getSyndicatedPosts(): Promise<BlogPost[]> {
  try {
    const posts = await prisma.post.findMany({
      where: { status: "published", isSyndicated: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    });
    return JSON.parse(JSON.stringify(posts)) as BlogPost[];
  } catch (error) {
    console.error("Failed to load syndicated posts:", error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const post = await prisma.post.findUnique({
      where: { slug },
    });
    return post ? (JSON.parse(JSON.stringify(post)) as BlogPost) : null;
  } catch (error) {
    console.error(`Failed to load post by slug (${slug}):`, error);
    return null;
  }
}

export async function getPostById(id: string): Promise<BlogPost | null> {
  try {
    const post = await prisma.post.findUnique({
      where: { id },
    });
    return post ? (JSON.parse(JSON.stringify(post)) as BlogPost) : null;
  } catch (error) {
    console.error(`Failed to load post by id (${id}):`, error);
    return null;
  }
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
      readTime: data.readTime?.trim() || calculateReadTime(data.content || ""),
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
    readTime:
      data.readTime !== undefined
        ? data.readTime.trim() || (data.content ? calculateReadTime(data.content) : undefined)
        : data.content
        ? calculateReadTime(data.content)
        : undefined,
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

// ==========================================
// 2. TIMELINE EVENTS (Experience & Schooling)
// ==========================================

export async function getTimelineEvents(category?: string): Promise<TimelineEvent[]> {
  try {
    const where: Prisma.TimelineEventWhereInput = {};
    if (category && category !== "all") {
      where.category = category;
    }

    const events = await prisma.timelineEvent.findMany({
      where,
      orderBy: [{ year: "desc" }, { order: "asc" }],
    });
    return events as unknown as TimelineEvent[];
  } catch (error) {
    console.error("Failed to load timeline events:", error);
    return [];
  }
}

export async function createTimelineEvent(
  data: Partial<TimelineEvent>
): Promise<TimelineEvent> {
  const event = await prisma.timelineEvent.create({
    data: {
      year: data.year || new Date().getFullYear(),
      period: data.period || null,
      category: data.category || "experience",
      title: data.title || "Role / Milestone",
      organization: data.organization || null,
      location: data.location || null,
      description: data.description || "",
      link: data.link || null,
      order: data.order ?? 0,
    },
  });
  return event as unknown as TimelineEvent;
}

export async function updateTimelineEvent(
  id: string,
  data: Partial<TimelineEvent>
): Promise<TimelineEvent> {
  const updated = await prisma.timelineEvent.update({
    where: { id },
    data: {
      year: data.year,
      period: data.period,
      category: data.category,
      title: data.title,
      organization: data.organization,
      location: data.location,
      description: data.description,
      link: data.link,
      order: data.order,
    },
  });
  return updated as unknown as TimelineEvent;
}

export async function deleteTimelineEvent(id: string): Promise<boolean> {
  await prisma.timelineEvent.delete({ where: { id } });
  return true;
}

// ==========================================
// 3. WORKSPACE ITEMS
// ==========================================

export async function getWorkspaceItems(category?: string): Promise<WorkspaceItem[]> {
  try {
    const where: Prisma.WorkspaceItemWhereInput = {};
    if (category && category !== "all") {
      where.category = category;
    }

    const items = await prisma.workspaceItem.findMany({
      where,
      orderBy: [{ category: "asc" }, { order: "asc" }],
    });
    return items as unknown as WorkspaceItem[];
  } catch (error) {
    console.error("Failed to load workspace items:", error);
    return [];
  }
}

export async function createWorkspaceItem(
  data: Partial<WorkspaceItem>
): Promise<WorkspaceItem> {
  const item = await prisma.workspaceItem.create({
    data: {
      category: data.category || "hardware",
      name: data.name || "Tool",
      description: data.description || null,
      url: data.url || null,
      icon: data.icon || null,
      order: data.order ?? 0,
    },
  });
  return item as unknown as WorkspaceItem;
}

export async function updateWorkspaceItem(
  id: string,
  data: Partial<WorkspaceItem>
): Promise<WorkspaceItem> {
  const updated = await prisma.workspaceItem.update({
    where: { id },
    data: {
      category: data.category,
      name: data.name,
      description: data.description,
      url: data.url,
      icon: data.icon,
      order: data.order,
    },
  });
  return updated as unknown as WorkspaceItem;
}

export async function deleteWorkspaceItem(id: string): Promise<boolean> {
  await prisma.workspaceItem.delete({ where: { id } });
  return true;
}

// ==========================================
// 4. COMPETENCIES / SKILLS
// ==========================================

export async function getCompetencies(): Promise<Competency[]> {
  try {
    const items = await prisma.competency.findMany({
      orderBy: { order: "asc" },
    });
    return items as unknown as Competency[];
  } catch (error) {
    console.error("Failed to load competencies:", error);
    return [];
  }
}

export async function createCompetency(
  data: Partial<Competency>
): Promise<Competency> {
  const item = await prisma.competency.create({
    data: {
      category: data.category || "General",
      skills: data.skills || [],
      order: data.order ?? 0,
    },
  });
  return item as unknown as Competency;
}

export async function updateCompetency(
  id: string,
  data: Partial<Competency>
): Promise<Competency> {
  const updated = await prisma.competency.update({
    where: { id },
    data: {
      category: data.category,
      skills: data.skills,
      order: data.order,
    },
  });
  return updated as unknown as Competency;
}

export async function deleteCompetency(id: string): Promise<boolean> {
  await prisma.competency.delete({ where: { id } });
  return true;
}

// ==========================================
// 5. SOCIAL LINKS
// ==========================================

export async function getSocialLinks(onlyEnabled = false): Promise<SocialLink[]> {
  try {
    const where: Prisma.SocialLinkWhereInput = {};
    if (onlyEnabled) {
      where.isEnabled = true;
    }

    const links = await prisma.socialLink.findMany({
      where,
      orderBy: { order: "asc" },
    });
    return links as unknown as SocialLink[];
  } catch (error) {
    console.error("Failed to load social links:", error);
    return [];
  }
}

export async function createSocialLink(
  data: Partial<SocialLink>
): Promise<SocialLink> {
  const link = await prisma.socialLink.create({
    data: {
      platform: data.platform || "other",
      label: data.label || "Link",
      url: data.url || "#",
      icon: data.icon || data.platform || null,
      order: data.order ?? 0,
      isEnabled: data.isEnabled ?? true,
    },
  });
  return link as unknown as SocialLink;
}

export async function updateSocialLink(
  id: string,
  data: Partial<SocialLink>
): Promise<SocialLink> {
  const updated = await prisma.socialLink.update({
    where: { id },
    data: {
      platform: data.platform,
      label: data.label,
      url: data.url,
      icon: data.icon,
      order: data.order,
      isEnabled: data.isEnabled,
    },
  });
  return updated as unknown as SocialLink;
}

export async function deleteSocialLink(id: string): Promise<boolean> {
  await prisma.socialLink.delete({ where: { id } });
  return true;
}

// ==========================================
// 6. SITE SETTINGS
// ==========================================

export async function getSiteSettings(): Promise<SiteSettingsMap> {
  try {
    const settings = await prisma.siteSetting.findMany();
    const map: SiteSettingsMap = {};
    for (const s of settings) {
      (map as Record<string, string>)[s.key] = s.value;
    }
    return map;
  } catch (error) {
    console.error("Failed to load site settings:", error);
    return {};
  }
}

export async function updateSiteSettings(
  settings: Partial<SiteSettingsMap>
): Promise<SiteSettingsMap> {
  const entries = Object.entries(settings);
  for (const [key, value] of entries) {
    if (value !== undefined) {
      await prisma.siteSetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      });
    }
  }
  return getSiteSettings();
}

// ==========================================
// 7. NEWSLETTER SUBSCRIBERS
// ==========================================

export async function getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
  try {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: { createdAt: "desc" },
    });
    return subscribers as unknown as NewsletterSubscriber[];
  } catch (error) {
    console.error("Failed to load newsletter subscribers:", error);
    return [];
  }
}

export async function deleteNewsletterSubscriber(id: string): Promise<boolean> {
  await prisma.newsletterSubscriber.delete({ where: { id } });
  return true;
}
