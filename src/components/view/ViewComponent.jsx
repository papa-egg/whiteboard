import React, { useEffect } from 'react'
import "./viewComponent.scss";

const ViewComponent = () => {


  useEffect(() => {
    // 初始化白板
    window.whiteboard.init();
  })

  return (
    <div className="whiteboard-content">
      <div id="whiteboard-viewport"></div>
    </div>
  )
}

export default ViewComponent;