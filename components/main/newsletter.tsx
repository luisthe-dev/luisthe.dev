import React from 'react'

type Props = {}

const NewsletterComponent = (props: Props) => {
  return (
    <div>
        <div>
            <p> Newsletter Title </p>
            <p> newsletter text </p>
            <div>
                <form>
                    <input placeholder='email' />
                    <button> Join In </button>
                </form>
            </div>
        </div>
    </div>
  )
}

export default NewsletterComponent