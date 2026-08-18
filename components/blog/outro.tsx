import React from "react";

type Props = {
  articles: any[];
};

const SingleBlogOutroCard = ({ articles }: Props) => {
  return (
    <div>
      <div>
        <div>
          <p> john doe </p>
          <p> X </p>
          <p> Github </p>
          <p> Linkedin </p>
          <p> personal </p>
        </div>
        <p> quick note on author </p>
      </div>
      <div>
        {articles.map((article) => (
          <div>
            <p> title </p>
            <p> short note </p>
            <p> Jun 12, 2024 </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SingleBlogOutroCard;
