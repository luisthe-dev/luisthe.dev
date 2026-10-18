import Link from "next/link";
import React from "react";
import { Rss, Mail, Globe } from "lucide-react";
import {
  GithubIcon,
  TwitterIcon,
  LinkedinIcon,
  SubstackIcon,
  MediumIcon,
} from "@/components/ui/icons";
import { SiteSettingsMap, SocialLink } from "@/lib/types/blog";

interface FooterProps {
  settings?: SiteSettingsMap;
  socialLinks?: SocialLink[];
}

function renderSocialIcon(platform: string, className = "w-3.5 h-3.5") {
  const p = platform.toLowerCase();
  switch (p) {
    case "github":
      return <GithubIcon className={className} />;
    case "linkedin":
      return <LinkedinIcon className={className} />;
    case "x":
    case "twitter":
      return <TwitterIcon className={className} />;
    case "substack":
      return <SubstackIcon className={className} />;
    case "medium":
      return <MediumIcon className={className} />;
    case "email":
    case "mail":
      return <Mail className={className} />;
    default:
      return <Globe className={className} />;
  }
}

const defaultSocialLinks: Partial<SocialLink>[] = [
  { platform: "github", label: "GitHub", url: "https://github.com/luisthe-dev" },
  { platform: "linkedin", label: "LinkedIn", url: "https://linkedin.com/in/divinegiftadesiyan" },
  { platform: "x", label: "X", url: "https://x.com/luisthe___dev" },
  { platform: "substack", label: "Substack", url: "https://substack.com/@luisthedev" },
  { platform: "medium", label: "Medium", url: "https://medium.com/@luisthedev" },
  { platform: "email", label: "Email", url: "mailto:divinegiftadesiyan@gmail.com" },
];

const FooterComponent = ({ settings, socialLinks }: FooterProps = {}) => {
  const authorName = settings?.author_name || "Divine Adesiyan";
  const initial = authorName.charAt(0) || "D";
  const bio =
    settings?.hero_bio ||
    (settings?.about_bio ? `${settings.about_bio.slice(0, 160)}...` : null) ||
    "Full Stack Engineer & Technical Writer with 8+ years building high-throughput fintech, edtech, and enterprise applications with Golang, PHP, Node.js, and React.";

  const activeLinks =
    socialLinks && socialLinks.length > 0
      ? socialLinks.filter((l) => l.isEnabled)
      : defaultSocialLinks;

  return (
    <footer className="w-full border-t border-border/60 bg-card/40 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Left Column: Brand & Copyright */}
          <div className="md:col-span-5 flex flex-col items-start gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs">
                {initial}
              </div>
              <span className="font-bold text-base tracking-tight text-foreground">
                {authorName}
              </span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
              {bio}
            </p>
            <p className="text-xs text-muted-foreground/80 mt-2">
              &copy; {new Date().getFullYear()} {authorName} (LuisThe.Dev). All rights reserved.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2 text-muted-foreground">
              {activeLinks.map((link, idx) => (
                <a
                  key={link.id || `${link.platform}-${idx}`}
                  href={link.url}
                  target={link.url?.startsWith("mailto:") ? undefined : "_blank"}
                  rel={link.url?.startsWith("mailto:") ? undefined : "noreferrer"}
                  className="hover:text-foreground transition-colors p-1"
                  aria-label={link.label}
                  title={link.label}
                >
                  {renderSocialIcon(link.icon || link.platform || "")}
                </a>
              ))}
              <Link
                href="/api/posts"
                className="hover:text-foreground transition-colors p-1"
                aria-label="RSS Feed"
                title="RSS Feed"
              >
                <Rss className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Columns: Multi-column Nav */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div className="flex flex-col gap-2.5">
              <h4 className="font-semibold text-xs uppercase tracking-wider text-foreground">
                Writing
              </h4>
              <Link
                href="/blog?category=Tech"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Fintech &amp; Golang
              </Link>
              <Link
                href="/blog?category=Architecture"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Architecture &amp; Redis
              </Link>
              <a
                href="https://substack.com/@luisthedev"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Substack Newsletter
              </a>
              <a
                href="https://medium.com/@luisthedev"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Medium Publications
              </a>
            </div>

            <div className="flex flex-col gap-2.5">
              <h4 className="font-semibold text-xs uppercase tracking-wider text-foreground">
                Connect
              </h4>
              {activeLinks.slice(0, 5).map((link, idx) => (
                <a
                  key={link.id || `connect-${link.platform}-${idx}`}
                  href={link.url}
                  target={link.url?.startsWith("mailto:") ? undefined : "_blank"}
                  rel={link.url?.startsWith("mailto:") ? undefined : "noreferrer"}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="flex flex-col gap-2.5">
              <h4 className="font-semibold text-xs uppercase tracking-wider text-foreground">
                Navigation
              </h4>
              <Link
                href="/"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Home
              </Link>
              <Link
                href="/blog"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Blog Index
              </Link>
              <Link
                href="/about"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                About &amp; Resume
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;
