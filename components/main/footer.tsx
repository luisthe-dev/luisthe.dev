import Link from "next/link";
import React from "react";
import { Rss, Mail } from "lucide-react";
import {
  GithubIcon,
  TwitterIcon,
  LinkedinIcon,
  SubstackIcon,
  MediumIcon,
} from "@/components/ui/icons";

const FooterComponent = () => {
  return (
    <footer className="w-full border-t border-border/60 bg-card/40 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Left Column: Brand & Copyright */}
          <div className="md:col-span-5 flex flex-col items-start gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs">
                D
              </div>
              <span className="font-bold text-base tracking-tight text-foreground">
                Divine Adesiyan
              </span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
              Full Stack Engineer &amp; Technical Writer with 8+ years building high-throughput
              fintech, edtech, and enterprise applications with Golang, PHP, Node.js, and React.
            </p>
            <p className="text-xs text-muted-foreground/80 mt-2">
              &copy; {new Date().getFullYear()} Divine Adesiyan (LuisThe.Dev). All rights reserved.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2 text-muted-foreground">
              <a
                href="https://github.com/luisthe-dev"
                target="_blank"
                rel="noreferrer"
                className="hover:text-foreground transition-colors p-1"
                aria-label="GitHub Profile"
                title="GitHub"
              >
                <GithubIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://linkedin.com/in/divinegiftadesiyan"
                target="_blank"
                rel="noreferrer"
                className="hover:text-foreground transition-colors p-1"
                aria-label="LinkedIn Profile"
                title="LinkedIn"
              >
                <LinkedinIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://x.com/luisthe___dev"
                target="_blank"
                rel="noreferrer"
                className="hover:text-foreground transition-colors p-1"
                aria-label="Twitter / X Profile"
                title="X"
              >
                <TwitterIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://substack.com/@luisthedev"
                target="_blank"
                rel="noreferrer"
                className="hover:text-foreground transition-colors p-1"
                aria-label="Substack"
                title="Substack"
              >
                <SubstackIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://medium.com/@luisthedev"
                target="_blank"
                rel="noreferrer"
                className="hover:text-foreground transition-colors p-1"
                aria-label="Medium"
                title="Medium"
              >
                <MediumIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href="mailto:divinegiftadesiyan@gmail.com"
                className="hover:text-foreground transition-colors p-1"
                aria-label="Email"
                title="divinegiftadesiyan@gmail.com"
              >
                <Mail className="w-3.5 h-3.5" />
              </a>
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
              <a
                href="https://github.com/luisthe-dev"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                GitHub Profile
              </a>
              <a
                href="https://linkedin.com/in/divinegiftadesiyan"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                LinkedIn
              </a>
              <a
                href="https://x.com/luisthe___dev"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                X (@luisthe___dev)
              </a>
              <a
                href="mailto:divinegiftadesiyan@gmail.com"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Email Me
              </a>
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
              <Link
                href="/admin"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Admin Studio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;
