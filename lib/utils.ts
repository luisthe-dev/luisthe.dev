import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateWordCount(content: string): number {
  if (!content || !content.trim()) return 0;
  return content
    .replace(/```[\s\S]*?```/g, "")
    .replace(/<[^>]*>/g, "")
    .replace(/[#*`_~\[\]()>-]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

export function calculateReadTime(content: string): string {
  const words = calculateWordCount(content);
  if (words === 0) return "1 min read";
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}
