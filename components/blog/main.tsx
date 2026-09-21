import React from "react";
import BlogPreviewCard from "./preview";
import { BlogPost } from "@/lib/types/blog";

type Props = {
  articles: BlogPost[];
  columns?: 2 | 3;
};

const BlogMainLayoutComponent: React.FC<Props> = ({
  articles,
  columns = 3,
}) => {
  if (!articles || articles.length === 0) {
    return (
      <div className="w-full py-12 text-center text-muted-foreground text-sm">
        No articles found.
      </div>
    );
  }

  const gridCols =
    columns === 2
      ? "grid-cols-1 md:grid-cols-2"
      : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

  return (
    <div className={`grid ${gridCols} gap-6 w-full`}>
      {articles.map((article) => (
        <BlogPreviewCard article={article} key={article.id || article.slug} />
      ))}
    </div>
  );
};

export default BlogMainLayoutComponent;
