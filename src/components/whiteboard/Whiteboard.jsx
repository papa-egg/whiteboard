import React, { useEffect } from 'react'

import Content from "../content/Content"
import Tool from "../tool/Tool"
import User from "../user/User"
import "./whiteboard.scss"

import Whiteboard from "../../whiteboard/whiteboard"

export default () => {

  useEffect(() => {
    const whiteboard = new Whiteboard();
  })

  return (
    <div className="whiteboard">
      <Content />
      <Tool />
      <User />
    </div>
  )
}
