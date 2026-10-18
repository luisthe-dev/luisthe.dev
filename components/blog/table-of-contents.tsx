"use client";

import React, { useState, useEffect } from "react";
import { AlignLeft, ChevronDown } from "lucide-react";

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
  variant?: "inline" | "sticky-sidebar";
}

export function extractHeadings(markdown: string): TocItem[] {
  if (!markdown) return [];
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const items: TocItem[] = [];
  let match;

  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    // Strip bold, code, markdown link formatting
    const rawText = match[2].trim();
    const text = rawText
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1")
      .replace(/\*\*|__|[*_`]/g, "")
      .trim();

    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

    if (id && text) {
      items.push({ id, text, level });
    }
  }

  return items;
}

export default function TableOfContents({
  content,
  variant = "inline",
}: TableOfContentsProps) {
  const headings = extractHeadings(content);
  const [isOpen, setIsOpen] = useState(true);
  const [activeId, setActiveId] = useState<string>("");

  // Track active heading as user scrolls
  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0px 0px -65% 0px", threshold: 0 }
    );

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) {
    return null;
  }

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.pushState(null, "", `#${id}`);
      setActiveId(id);
    }
  };

  // Sticky Sidebar Variant (Desktop)
  if (variant === "sticky-sidebar") {
    return (
      <div className="flex flex-col gap-3 py-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground">
          <AlignLeft className="w-3.5 h-3.5 text-primary" />
          <span>On this page</span>
        </div>

        <nav className="flex flex-col border-l border-border/80 pl-3 gap-2">
          {headings.map((item, index) => {
            const isActive = activeId === item.id;
            return (
              <a
                key={`${item.id}-${index}`}
                href={`#${item.id}`}
                onClick={(e) => handleScrollTo(e, item.id)}
                className={`text-xs transition-all leading-snug py-0.5 block ${
                  item.level === 3 ? "pl-3 text-[11px]" : ""
                } ${
                  isActive
                    ? "font-bold text-primary -ml-[13px] pl-3 border-l-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.text}
              </a>
            );
          })}
        </nav>
      </div>
    );
  }

  // Inline Collapsible Variant (Mobile & Tablet)
  return (
    <div className="my-8 rounded-2xl bg-card border border-border/80 overflow-hidden shadow-xs">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 px-5 bg-muted/30 hover:bg-muted/50 transition-colors text-left cursor-pointer"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          <AlignLeft className="w-4 h-4 text-primary" />
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-foreground">
            Table of Contents
          </span>
          <span className="text-[11px] font-medium text-muted-foreground">
            ({headings.length} sections)
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <nav className="p-4 px-5 flex flex-col gap-1.5 border-t border-border/50 max-h-80 overflow-y-auto">
          {headings.map((item, index) => {
            const isActive = activeId === item.id;
            return (
              <a
                key={`${item.id}-${index}`}
                href={`#${item.id}`}
                onClick={(e) => handleScrollTo(e, item.id)}
                className={`transition-all py-1 ${
                  item.level === 3
                    ? "pl-5 text-xs text-muted-foreground/80"
                    : "text-xs sm:text-sm font-medium"
                } ${
                  isActive
                    ? "text-primary font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.text}
              </a>
            );
          })}
        </nav>
      )}
    </div>
  );
}
