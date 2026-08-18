import BlogMainLayoutComponent from "@/components/blog/main";
import React from "react";

type Props = {};

const BlogPage = (props: Props) => {
  const categories = [{ title: "title" }];

  const articles = [
    {
      image: "image.png",
      title: "title",
      short: "short",
      created_at: "created",
      category: "tech",
    },
    {
      image: "image.png",
      title: "title",
      short: "short",
      created_at: "created",
      category: "tech",
    },
    {
      image: "image.png",
      title: "title",
      short: "short",
      created_at: "created",
      category: "tech",
    },
  ];

  return (
    <div>
      <p> Some Articles </p>
      <p> articles quick knowledge or search comment </p>
      <div>
        <div>
          <input placeholder="search text" />
          <button> find </button>
        </div>
        <div>
          {categories.map((category) => (
            <p> category </p>
          ))}
        </div>
      </div>
      <BlogMainLayoutComponent articles={articles} />
    </div>
  );
};

export default BlogPage;
