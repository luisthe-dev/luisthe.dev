import React from 'react'

type Props = {}

const MyIntroComponent = (props: Props) => {
  return (
    <div>
        <div>
            <div>
                <p> name </p>
                <p> long bio, maybe html encoded for linking </p>
            </div>
            <div>
                <p> quick facts </p>
            </div>
        </div>
    </div>
  )
}

export default MyIntroComponent