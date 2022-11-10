import {Viewport} from 'pixi-viewport'
import {Application} from 'pixi.js'
import Whiteboard from '../whiteboard'

class Tool {
  private WD?: Whiteboard
  private app?: Application
  private viewport?: Viewport

  public toolType: string = 'pointer'

  constructor(whiteboard: Whiteboard) {
    this.WD = whiteboard
    this.app = this.WD.app
    this.viewport = this.WD.viewport
  }

  updateToolType(toolType: string) {
    if (toolType) {
      this.toolType = toolType
    }
  }
}

export default Tool
