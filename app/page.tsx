import BlogMainLayoutComponent from '@/components/blog/main'
import HomeHero from '@/components/main/hero'
import PostNetworkComponent from '@/components/main/network'
import NewsletterComponent from '@/components/main/newsletter'
import React from 'react'

type Props = {}

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
  ];

  return (
    <div>
      <HomeHero />
      <div>
        <p> featured writes </p>
        <p> some rants I think you'll like </p>
        <BlogMainLayoutComponent articles={articles} />
        <PostNetworkComponent articles={articles} />
        <NewsletterComponent />
      </div>
    </div>
  )
}

export default HomePage