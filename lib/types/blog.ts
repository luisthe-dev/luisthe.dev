export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string[];
  readTime: string;
  status: "published" | "draft";
  featured: boolean;
  isSyndicated: boolean;
  syndicationPlatform?: string | null;
  syndicationUrl?: string | null;
  syndicatedTime?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  publishedAt?: Date | string | null;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  createdAt: Date | string;
}

export interface TimelineEvent {
  id: string;
  year: number;
  category: "milestone" | "project" | "achievement";
  title: string;
  description: string;
  link?: string | null;
  order: number;
}

export interface WorkspaceItem {
  id: string;
  category:
    | "daily_hardware"
    | "daily_software"
    | "favorite_tools"
    | "software"
    | "github"
    | "resources";
  name: string;
  description?: string | null;
  icon?: string | null;
  order: number;
}
