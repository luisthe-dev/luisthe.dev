import React from 'react'

type Props = {
    articles: any[];
}

const PostNetworkComponent = ({articles}: Props) => {
  return (
    <div>
        <div>
            <p> Network Across With My Rants </p>
            <div>
                {
                    articles.map(article => (
                        <div>
                            <p> title </p>
                            <p> 2 months ago </p>
                        </div>
                    ))
                }
            </div>
        </div>
    </div>
  )
}

export default PostNetworkComponent