import React, { useEffect } from 'react'

import ViewComponent from "../view/ViewComponent"
import ToolComponent from "../tool/ToolComponent"
import UserComponnet from "../user/UserComponnet"
import "./whiteboardComponent.scss"

import Whiteboard from "../../whiteboard/whiteboard"

const WhiteboardComponent = () => {
  
  const whiteboard = new Whiteboard();

  // TODO 先将公告方法绑定于window, 后续改为redux
  window.whiteboard = whiteboard;

  return (
    <div className="whiteboard">
      <ViewComponent />
      <ToolComponent />
      <UserComponnet />
    </div>
  )
}

export default WhiteboardComponent;
