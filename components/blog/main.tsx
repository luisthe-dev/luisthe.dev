import React from "react";
import BlogPreviewCard from "./preview";

type Props = {
  articles: any[];
  shouldOverflow?: boolean;
};

const BlogMainLayoutComponent = ({
  articles,
  shouldOverflow = false,
}: Props) => {
  return (
    <div className="w-full flex items-center justify-center p-2">
      <div
        className={`flex max-md:flex-col ${shouldOverflow ? "flex-nowrap overflow-x-scroll pb-3 items-center justify-start" : "flex-wrap"} w-full gap-3`}
      >
        {articles.map((article, articleKey) => (
          <BlogPreviewCard article={article} key={articleKey} />
        ))}
      </div>
    </div>
  );
};

export default BlogMainLayoutComponent;
