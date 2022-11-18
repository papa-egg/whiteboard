import {Viewport} from 'pixi-viewport'
import {Application} from 'pixi.js'
import Box from '../box/box'
import Whiteboard from '../whiteboard'
import {nanoid} from 'nanoid'

class Tool {
  private WD?: Whiteboard
  private app?: Application
  private viewport?: Viewport

  public toolType: string = 'pointer'
  public toolBox?: Box

  constructor(whiteboard: Whiteboard) {
    this.WD = whiteboard
    this.app = this.WD.app
    this.viewport = this.WD.viewport
  }

  pointerdown(x: number, y: number) {
    let boxInfo: any = null

    switch (this.toolType) {
      // 创建画笔
      case 'pencil': {
        boxInfo = {
          id: nanoid(),
          type: 'pencil',
          layer: 0,
          locked: false,
          widget: {
            x: 0,
            y: 0,
            w: 0,
            h: 0,
            a: 0,
            s: 1,
            pathPoints: [{x: x, y: y}],
            strokeWidth: 2,
            strokeColor: 0x000000,
          },
        }

        break
      }
    }

    const box = new Box(boxInfo)
    box.createWidget(boxInfo.widget)
    this.viewport?.addChild(box.widget.sprite)
    this.WD?.boxs?.push(box)
    this.toolBox = box
  }

  pointermove(x: number, y: number) {
    if (!this.toolBox) return

    switch (this.toolType) {
      // 创建画笔
      case 'pencil': {
        this.toolBox?.widget.addPoint({x, y})

        break
      }
    }
  }

  pointerup(x: number, y: number) {
    if (this.toolBox) {
      this.toolBox = undefined
    }
  }

  updateToolType(toolType: string) {
    if (toolType) {
      this.toolType = toolType
    }
  }
}

export default Tool
