import React from "react";
import BlogPreviewCard from "./preview";

type Props = {
    articles: any[];
};

const BlogMainLayoutComponent = ({articles}: Props) => {
  return (
    <div>
      <div>
        <div>
          {articles.map((article) => (
            <BlogPreviewCard article={article} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogMainLayoutComponent;
