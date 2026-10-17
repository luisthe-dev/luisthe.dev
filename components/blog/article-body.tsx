"use client";

import React, { useEffect, useMemo } from "react";
import { marked } from "marked";
import DOMPurify from "isomorphic-dompurify";

interface ArticleBodyProps {
  content: string;
}

// Configure marked with GitHub Flavored Markdown and line breaks
marked.setOptions({
  gfm: true,
  breaks: true, // Preserves ENTER (newlines) as distinct line breaks / paragraphs
});

// Configure custom renderer for headings with smooth anchor navigation
const renderer = new marked.Renderer();
renderer.heading = ({ text, depth }: { text: string; depth: number }) => {
  const plainText = text.replace(/<[^>]*>/g, "").trim();
  const id = plainText
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

  return `<h${depth} id="${id}" class="scroll-mt-24 group flex items-baseline gap-2">
    <a href="#${id}" class="anchor-link text-sm font-normal text-muted-foreground/40 hover:text-primary transition-colors" aria-label="Direct link to ${plainText}">#</a>
    <span>${text}</span>
  </h${depth}>`;
};

marked.use({ renderer });

export default function ArticleBody({ content }: ArticleBodyProps) {
  // Convert Markdown to sanitized HTML
  const sanitizedHtml = useMemo(() => {
    if (!content) return "";
    try {
      const rawHtml = marked.parse(content) as string;
      return DOMPurify.sanitize(rawHtml, {
        ADD_ATTR: ["target", "rel", "class", "id", "href", "aria-label"],
      });
    } catch (e) {
      console.error("Markdown parsing error:", e);
      return DOMPurify.sanitize(content);
    }
  }, [content]);

  // Add copy button directly inside code blocks after mounting without reparenting DOM nodes
  useEffect(() => {
    const codeBlocks = document.querySelectorAll<HTMLPreElement>(".article-content pre");
    codeBlocks.forEach((block) => {
      if (block.querySelector(".copy-code-button")) return;

      block.style.position = "relative";
      const code = block.querySelector("code");
      const textToCopy = code ? code.innerText : block.innerText;

      const button = document.createElement("button");
      button.className =
        "copy-code-button absolute top-3 right-3 p-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity text-xs flex items-center gap-1 cursor-pointer";
      button.setAttribute("aria-label", "Copy code");
      button.innerHTML = `
        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
        </svg>
      `;

      button.onclick = (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(textToCopy);
        button.innerHTML = `
          <svg class="w-3.5 h-3.5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        `;
        setTimeout(() => {
          button.innerHTML = `
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
            </svg>
          `;
        }, 2000);
      };

      block.classList.add("group");
      block.appendChild(button);
    });
  }, [sanitizedHtml]);

  return (
    <div
      className="article-content w-full"
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
}
