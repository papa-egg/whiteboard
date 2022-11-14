import getViewport from '../utils/get-viewport'
import {Container, Graphics} from 'pixi.js'
import getWhiteboard from '../utils/get-whiteboard'
import getBoundByPoints from '../utils/get-bound-by-points'

interface IPoint {
  x: number
  y: number
}

/**
 * 鼠标左键选中框
 */
class SelectBox {
  startPoint?: IPoint
  endPoint?: IPoint

  selectBoxSprite?: Graphics

  constructor(startPoint: IPoint) {
    this.startPoint = startPoint

    this.create()
  }

  update(endPoint: IPoint) {
    this.endPoint = endPoint

    this.draw()
  }

  create() {
    const whiteboard = getWhiteboard()
    this.selectBoxSprite = new Graphics()
    whiteboard.app.stage.addChild(this.selectBoxSprite)
  }

  destroy() {
    const whiteboard = getWhiteboard()
    whiteboard.app.stage.removeChild(this.selectBoxSprite)
    this.selectBoxSprite = undefined
    this.startPoint = undefined
    this.endPoint = undefined
  }

  draw() {
    if (this.selectBoxSprite && this.startPoint && this.endPoint) {
      const {x, y, w, h} = getBoundByPoints([this.toScreenPoint(this.startPoint), this.toScreenPoint(this.endPoint)])

      this.selectBoxSprite.clear()

      this.selectBoxSprite.beginFill(0x4eabcf, 0.2)
      this.selectBoxSprite.drawRect(x - w / 2, y - h / 2, w, h)
      this.selectBoxSprite.endFill()
    }
  }

  getBoundPoints() {
    if (this.startPoint && this.endPoint) {
      const bound = getBoundByPoints([this.startPoint, this.endPoint])

      if (bound) {
        const {x, y, w, h} = bound

        return [
          {
            x: x - w / 2,
            y: y - h / 2,
          },
          {
            x: x + w / 2,
            y: y - h / 2,
          },
          {
            x: x + w / 2,
            y: y + h / 2,
          },
          {
            x: x - w / 2,
            y: y + h / 2,
          },
        ]
      } else {
        return []
      }
    } else {
      return []
    }
  }

  toScreenPoint(point: IPoint) {
    const viewport = getViewport()

    return viewport.toScreen(point.x, point.y)
  }
}

export default SelectBox
