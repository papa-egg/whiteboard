import {Viewport} from 'pixi-viewport'
import {Application} from 'pixi.js'
import Whiteboard from '../whiteboard'

/**
 * 控制层，大量逻辑处理都在当前层处理
 */
class Control {
  private WD?: Whiteboard
  private app?: Application
  private viewport?: Viewport

  constructor(whiteboard: Whiteboard) {
    this.WD = whiteboard
    this.app = this.WD.app
    this.viewport = this.WD.viewport
  }
}

export default Control
