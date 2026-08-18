import SingleBlogIntroCard from '@/components/blog/intro'
import SingleBlogOutroCard from '@/components/blog/outro'
import React from 'react'

type Props = {}

const SingleBlogPage = (props: Props) => {
  return (
    <div>
      <SingleBlogIntroCard article={""} categories={[]} />
      <p>article content</p>
      <SingleBlogOutroCard articles={[]} />
    </div>
  );
}

export default SingleBlogPage