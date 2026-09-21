"use client";

import React, { useEffect } from "react";

interface ArticleBodyProps {
  content: string;
}

export default function ArticleBody({ content }: ArticleBodyProps) {
  // Add copy button functionality to code blocks after mounting
  useEffect(() => {
    const codeBlocks = document.querySelectorAll("pre");
    codeBlocks.forEach((block) => {
      if (block.querySelector(".copy-code-button")) return;

      const code = block.querySelector("code");
      const textToCopy = code ? code.innerText : block.innerText;

      const container = document.createElement("div");
      container.className = "relative group";

      // Wrap pre in relative container if not already wrapped
      block.parentNode?.insertBefore(container, block);
      container.appendChild(block);

      const button = document.createElement("button");
      button.className =
        "copy-code-button absolute top-3 right-3 p-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity text-xs flex items-center gap-1 cursor-pointer";
      button.innerHTML = `
        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
        </svg>
      `;

      button.onclick = () => {
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

      container.appendChild(button);
    });
  }, [content]);

  return (
    <div
      className="prose prose-neutral dark:prose-invert max-w-none text-foreground
        prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground
        prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
        prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
        prose-p:leading-relaxed prose-p:text-foreground/90 prose-p:my-5
        prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-5 prose-blockquote:italic prose-blockquote:text-lg prose-blockquote:font-serif prose-blockquote:my-8 prose-blockquote:text-foreground/90
        prose-pre:bg-zinc-950 prose-pre:text-zinc-100 prose-pre:border prose-pre:border-zinc-800 prose-pre:rounded-2xl prose-pre:p-5 prose-pre:my-8 prose-pre:shadow-md
        prose-code:font-mono prose-code:text-sm prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:text-foreground
        prose-figure:my-10 prose-img:rounded-2xl prose-img:shadow-md
        prose-figcaption:text-xs prose-figcaption:text-muted-foreground prose-figcaption:text-center prose-figcaption:mt-2.5
        prose-ul:my-5 prose-li:my-1.5"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
