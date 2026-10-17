"use client";

import React, { useState } from "react";
import { AlignLeft, ChevronDown } from "lucide-react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

export function extractHeadings(markdown: string): TocItem[] {
  if (!markdown) return [];
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const items: TocItem[] = [];
  let match;

  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    // Strip bold/code marks from heading text
    const text = match[2].trim().replace(/\*\*|__|[*_`]/g, "");
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

export default function TableOfContents({ content }: TableOfContentsProps) {
  const headings = extractHeadings(content);
  const [isOpen, setIsOpen] = useState(true);

  if (headings.length < 2) {
    return null;
  }

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.pushState(null, "", `#${id}`);
    }
  };

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
          {headings.map((item, index) => (
            <a
              key={`${item.id}-${index}`}
              href={`#${item.id}`}
              onClick={(e) => handleScrollTo(e, item.id)}
              className={`text-muted-foreground hover:text-foreground hover:translate-x-1 transition-all py-1 ${
                item.level === 3
                  ? "pl-5 text-xs text-muted-foreground/80"
                  : "text-xs sm:text-sm font-medium"
              }`}
            >
              {item.text}
            </a>
          ))}
        </nav>
      )}
    </div>
  );
}
