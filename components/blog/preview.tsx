import React from 'react'

type Props = {
    article: any;
}

const BlogPreviewCard = ({article}: Props) => {
  return (
    <div>
      <div>
        <p>image</p>
      </div>
      <div>
        <p> category </p>
        <p> title </p>
        <p> short </p>
      </div>
      <div>
        <p> read more </p>
        <p> feb 11, 2020 </p>
      </div>
    </div>
  );
}

export default BlogPreviewCard