"use client";

import React, { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import BlogMainLayoutComponent from "./main";
import { BlogPost } from "@/lib/types/blog";

interface BlogListClientProps {
  initialPosts: BlogPost[];
  initialCategory?: string;
}

const CATEGORIES = ["All", "Tech", "Writing", "Architecture", "Substack", "Personal"];

export default function BlogListClient({
  initialPosts,
  initialCategory = "All",
}: BlogListClientProps) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(9);

  const filteredPosts = useMemo(() => {
    return initialPosts.filter((post) => {
      // Category check
      const matchesCategory =
        selectedCategory === "All" ||
        post.category?.toLowerCase() === selectedCategory.toLowerCase() ||
        (selectedCategory.toLowerCase() === "substack" &&
          post.syndicationPlatform?.toLowerCase() === "substack");

      // Search check
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags?.some((t) => t.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [initialPosts, selectedCategory, searchQuery]);

  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPosts.length;

  return (
    <div className="w-full flex flex-col items-center gap-10">
      {/* Search & Category Filter Section */}
      <div className="w-full max-w-2xl flex flex-col items-center gap-6">
        {/* Live Search Input */}
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Live search articles, tags, or topics..."
            className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-card border border-border/80 text-foreground placeholder-muted-foreground text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-transparent transition-all shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap justify-center items-center gap-2">
          {CATEGORIES.map((category) => {
            const isSelected =
              selectedCategory.toLowerCase() === category.toLowerCase();
            return (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setVisibleCount(9); // Reset pagination on category change
                }}
                className={`px-4 py-2 rounded-full text-xs font-semibold cursor-pointer transition-all duration-150 shadow-2xs ${
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-xs scale-105"
                    : "bg-card border border-border/60 text-muted-foreground hover:text-foreground hover:border-border"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count & Grid */}
      <div className="w-full">
        <div className="text-xs text-muted-foreground mb-4">
          Showing {visiblePosts.length} of {filteredPosts.length} {filteredPosts.length === 1 ? "article" : "articles"}
          {searchQuery && ` for "${searchQuery}"`}
        </div>

        <BlogMainLayoutComponent articles={visiblePosts} columns={3} />
      </div>

      {/* Show All / Load More Button */}
      {hasMore && (
        <div className="pt-4">
          <button
            onClick={() => setVisibleCount(filteredPosts.length)}
            className="px-6 py-2.5 rounded-full border border-border bg-card hover:bg-accent text-foreground text-xs font-semibold shadow-2xs hover:shadow-xs transition-all cursor-pointer"
          >
            Show all ({filteredPosts.length})
          </button>
        </div>
      )}
    </div>
  );
}
