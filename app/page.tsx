import BlogMainLayoutComponent from "@/components/blog/main";
import HomeHero from "@/components/main/hero";
import PostNetworkComponent from "@/components/main/network";
import NewsletterComponent from "@/components/main/newsletter";
import React from "react";

type Props = {};

const HomePage = (props: Props) => {
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
    <div className="flex flex-col items-center justify-start w-full">
      <HomeHero />
      <div className="w-full md:w-3/4 py-12 px-3 md:px-10 gap-1 flex flex-col">
        <p className="font-bold text-5xl"> featured writes </p>
        <p className="font-medium text-xl text-muted-foreground mb-3">
          some rants I think you'll like
        </p>
        <BlogMainLayoutComponent articles={articles} shouldOverflow />
        <PostNetworkComponent articles={articles} />
        <NewsletterComponent />
      </div>
    </div>
  );
};

export default HomePage;
