import Content from "../content/Content"
import Tool from "../tool/Tool"
import User from "../user/User"
import "./whiteboard.scss"

const Whiteboard = () => {
  return (
    <div className="whiteboard">
      <Content />
      <Tool />
      <User />
    </div>
  )
}

export default Whiteboard
