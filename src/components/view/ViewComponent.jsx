import React, {useEffect} from 'react'
import './viewComponent.css'

const ViewComponent = () => {
  useEffect(() => {
    // 初始化白板
    window.WD.init()

    console.log(window.WD)
  })

  return (
    <div className="whiteboard-content">
      <div id="whiteboard-viewport"></div>
    </div>
  )
}

export default ViewComponent
