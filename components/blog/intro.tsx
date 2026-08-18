import React from "react";

type Props = {
  article: any;
  categories: any;
};

const SingleBlogIntroCard = ({ article, categories }: Props) => {
  return (
    <div>
      <div>
        <p> title </p>
        <div>
          <div>
            <p> published on Feb 12, 2020 </p>
            <p> updated on Feb 29, 2028 </p>
          </div>
          <div>
            <p> read time </p>
            <p> 5 minutes </p>
          </div>
          <div>
            <text> category </text>
          </div>
        </div>
        <p> by LuisThe.Dev </p>
      </div>
    </div>
  );
};

export default SingleBlogIntroCard;
