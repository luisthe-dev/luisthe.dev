import Image from "next/image";
import Link from "next/link";
import React from "react";
import { BookOpen, Mail, Rss } from "lucide-react";
import {
  GithubIcon,
  TwitterIcon,
  LinkedinIcon,
  SubstackIcon,
  MediumIcon,
} from "@/components/ui/icons";

const HomeHero = () => {
  return (
    <section className="w-full py-12 md:py-20 border-b border-border/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left Column: Bio copy & CTAs */}
          <div className="md:col-span-7 flex flex-col items-start gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Founder @ Luis Dev Ltd • Co-founder @ MyInvite • Senior Backend @ Konga</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
              Divine Adesiyan
            </h1>

            <p className="text-lg sm:text-xl text-primary font-semibold">
              Founder, Software Architect &amp; Technical Writer
            </p>

            <p className="text-sm sm:text-base text-muted-foreground font-normal leading-relaxed max-w-xl">
              8+ years of engineering leadership building resilient systems across fintech, event ticketing,
              and enterprise commerce. Main Founder &amp; Director of Luis Dev Limited, Co-founder of MyInvite,
              and Senior Backend Engineer at Konga.
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
                href="#newsletter"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border border-input bg-background hover:bg-accent text-foreground transition-all"
              >
                <Mail className="w-4 h-4" />
                <span>Subscribe</span>
              </a>
            </div>

            {/* Social Icons Row */}
            <div className="flex items-center gap-4 pt-4 text-muted-foreground">
              <a
                href="https://github.com/luisthe-dev"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub Profile"
                className="hover:text-foreground transition-colors p-1"
                title="GitHub (luisthe-dev)"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com/in/divinegiftadesiyan"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn Profile"
                className="hover:text-foreground transition-colors p-1"
                title="LinkedIn (Divinegift Adesiyan)"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
              <a
                href="https://x.com/luisthe___dev"
                target="_blank"
                rel="noreferrer"
                aria-label="X (Twitter)"
                className="hover:text-foreground transition-colors p-1"
                title="X (@luisthe___dev)"
              >
                <TwitterIcon className="w-4 h-4" />
              </a>
              <a
                href="https://substack.com/@luisthedev"
                target="_blank"
                rel="noreferrer"
                aria-label="Substack Publication"
                className="hover:text-foreground transition-colors p-1"
                title="Substack"
              >
                <SubstackIcon className="w-4 h-4" />
              </a>
              <a
                href="https://medium.com/@luisthedev"
                target="_blank"
                rel="noreferrer"
                aria-label="Medium Publication"
                className="hover:text-foreground transition-colors p-1"
                title="Medium"
              >
                <MediumIcon className="w-4 h-4" />
              </a>
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

          {/* Right Column: Avatar Card */}
          <div className="md:col-span-5 flex justify-center md:justify-end">
            <div className="relative p-2 sm:p-3 rounded-3xl bg-gradient-to-b from-card to-accent/40 border border-border/80 shadow-lg shadow-black/5 max-w-[280px] sm:max-w-[320px] w-full aspect-square flex items-center justify-center">
              <div className="relative w-full h-full rounded-2xl overflow-hidden bg-muted flex items-center justify-center">
                <Image
                  src="/avatar.jpg"
                  alt="Divine Adesiyan"
                  fill
                  sizes="(max-width: 768px) 280px, 320px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
