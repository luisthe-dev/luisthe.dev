"use client";

import React, { useEffect, useState } from "react";

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const currentScroll = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const percentage = Math.min(100, Math.max(0, (currentScroll / scrollHeight) * 100));
        setProgress(percentage);
      }
    };

    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    updateScrollProgress();

    return () => window.removeEventListener("scroll", updateScrollProgress);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-0.5 sm:h-1 bg-transparent z-50 pointer-events-none"
    >
      <div
        className="h-full bg-primary transition-all duration-75 ease-out shadow-xs"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
