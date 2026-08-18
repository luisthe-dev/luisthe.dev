import MyIntroComponent from '@/components/me/intro'
import MyTimelineComponent from '@/components/me/timeline'
import MyWorkspaceComponent from '@/components/me/workspace'
import React from 'react'

type Props = {}

const MePage = (props: Props) => {
  return (
    <div>
        <MyIntroComponent />
        <MyTimelineComponent />
        {/* <MyWorkspaceComponent /> */}
    </div>
  )
}

export default MePage