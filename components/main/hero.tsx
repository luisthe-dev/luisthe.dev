import Link from "next/link";
import React from "react";
import { BookOpen, Mail, Rss, Calendar } from "lucide-react";
import {
  GithubIcon,
  TwitterIcon,
  LinkedinIcon,
  SubstackIcon,
  MediumIcon,
} from "@/components/ui/icons";
import FacelessCoderLottie from "@/components/ui/faceless-coder-lottie";
import { SiteSettingsMap, SocialLink } from "@/lib/types/blog";

interface HomeHeroProps {
  settings?: SiteSettingsMap;
  socialLinks?: SocialLink[];
}

const renderSocialIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case "github":
      return <GithubIcon className="w-4 h-4" />;
    case "twitter":
    case "x":
      return <TwitterIcon className="w-4 h-4" />;
    case "linkedin":
      return <LinkedinIcon className="w-4 h-4" />;
    case "substack":
      return <SubstackIcon className="w-4 h-4" />;
    case "medium":
      return <MediumIcon className="w-4 h-4" />;
    default:
      return <Mail className="w-4 h-4" />;
  }
};

const HomeHero: React.FC<HomeHeroProps> = ({ settings, socialLinks }) => {
  const headline = settings?.hero_headline || "Divine Adesiyan";
  const badgeText =
    settings?.hero_badge_text ||
    "Co-Founder @ MyInvite • Technical Product Manager @ Fieldbase • Senior Backend Lead";
  const subheadline =
    settings?.hero_subheadline ||
    "Technical Product Manager, Systems Architect & Full Stack Engineer";
  const bio =
    settings?.hero_bio ||
    "8+ years of engineering leadership building resilient systems across high-throughput fintech, edtech, e-commerce, and enterprise SaaS. Specializing in high-throughput microservices, Redis caching topologies, and distributed architectures.";

  const enabledSocials = socialLinks?.length
    ? socialLinks.filter((s) => s.isEnabled)
    : [
        {
          id: "1",
          platform: "github",
          label: "GitHub",
          url: "https://github.com/luisthe-dev",
          order: 1,
          isEnabled: true,
        },
        {
          id: "2",
          platform: "linkedin",
          label: "LinkedIn",
          url: "https://linkedin.com/in/divinegiftadesiyan",
          order: 2,
          isEnabled: true,
        },
        {
          id: "3",
          platform: "x",
          label: "X (Twitter)",
          url: "https://x.com/luisthe___dev",
          order: 3,
          isEnabled: true,
        },
        {
          id: "4",
          platform: "substack",
          label: "Substack",
          url: "https://substack.com/@luisthedev",
          order: 4,
          isEnabled: true,
        },
        {
          id: "5",
          platform: "medium",
          label: "Medium",
          url: "https://medium.com/@luisthedev",
          order: 5,
          isEnabled: true,
        },
      ];

  return (
    <section className="w-full py-12 md:py-20 border-b border-border/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left Column: Bio copy & CTAs */}
          <div className="md:col-span-7 flex flex-col items-start gap-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary text-xs font-semibold text-secondary-foreground max-w-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="truncate">{badgeText}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
              {headline}
            </h1>

            <p className="text-lg sm:text-xl text-primary font-semibold">
              {subheadline}
            </p>

            <p className="text-sm sm:text-base text-muted-foreground font-normal leading-relaxed max-w-xl">
              {bio}
            </p>

            {/* Call to Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/blog"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-xs"
              >
                <BookOpen className="w-4 h-4" />
                <span>Read Blog</span>
              </Link>
              <a
                href={settings?.cal_link || "https://cal.com/luisthe-dev"}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 transition-all"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Consultation</span>
              </a>
              <a
                href="#newsletter"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border border-input bg-background hover:bg-accent text-foreground transition-all"
              >
                <Mail className="w-4 h-4" />
                <span>Subscribe</span>
              </a>
            </div>

            {/* Dynamic Social Icons Row */}
            <div className="flex flex-wrap items-center gap-4 pt-4 text-muted-foreground">
              {enabledSocials.map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="hover:text-foreground transition-colors p-1"
                  title={social.label}
                >
                  {renderSocialIcon(social.platform)}
                </a>
              ))}
              <Link
                href="/api/posts"
                aria-label="RSS Feed"
                className="hover:text-foreground transition-colors p-1"
                title="API / RSS Feed"
              >
                <Rss className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: Faceless Developer Animation (No Face) */}
          <div className="md:col-span-5 flex justify-center md:justify-end">
            <FacelessCoderLottie size="lg" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
