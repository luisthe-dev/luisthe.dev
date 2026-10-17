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
  period?: string | null;
  category: "experience" | "schooling" | "certification" | "leadership" | "milestone";
  title: string;
  organization?: string | null;
  location?: string | null;
  description: string;
  link?: string | null;
  order: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface WorkspaceItem {
  id: string;
  category: string;
  name: string;
  description?: string | null;
  url?: string | null;
  icon?: string | null;
  order: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface Competency {
  id: string;
  category: string;
  skills: string[];
  order: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface SocialLink {
  id: string;
  platform: string;
  label: string;
  url: string;
  icon?: string | null;
  order: number;
  isEnabled: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface SiteSettingsMap {
  hero_headline?: string;
  hero_badge_text?: string;
  hero_subheadline?: string;
  hero_bio?: string;
  about_headline?: string;
  about_bio?: string;
  smtp_host?: string;
  smtp_port?: string;
  smtp_user?: string;
  smtp_pass?: string;
  smtp_from?: string;
  smtp_secure?: string;
}
