import {Viewport} from 'pixi-viewport'
import {Application, Point} from 'pixi.js'
import Box from '../box/box'
import Whiteboard from '../whiteboard'
import getBoundPoints from '../utils/get-bound-points'
import isPointInPolygon from '../utils/isPointInPolygon'
import Selection from '../selection/selection'

interface IPoint {
  x: number
  y: number
}

/**
 * 控制层，大量逻辑处理都在当前层处理
 */
class Control {
  private WD?: Whiteboard
  private app?: Application
  private viewport?: Viewport

  public selection?: Selection

  constructor(whiteboard: Whiteboard) {
    this.WD = whiteboard
    this.app = this.WD.app
    this.viewport = this.WD.viewport
  }

  pointerdown(x: number, y: number) {
    const boxs = this.WD?.boxs
    let selectedBox: any = null

    boxs?.forEach((element: Box) => {
      const isPointInElementFlag = this.isPointInElement({x, y}, element)

      // 点是否在元素范围内
      // NOTE: 元素如果重叠，选取顶层，也就是最后一个元素，所以不作break跳出
      if (isPointInElementFlag) {
        selectedBox = element
      }
    })

    if (selectedBox) {
      if (!this.isSameSelection(selectedBox)) {
        if (this.selection) {
          this.destroySelection()
        }

        this.selection = new Selection([selectedBox])
      }
    } else {
      if (this.selection) {
        this.destroySelection()
      }
    }
  }

  pointerup() {}

  pointermove() {}

  /**
   * selection选中元素是否相同
   */
  isSameSelection(selectedBox: Box): boolean {
    if (this.selection) {
      if (this.selection.boxs[0].id === selectedBox.id) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }

  destroySelection() {
    this.selection?.destroy()
    this.selection = undefined
  }

  /**
   * 点是否在元素范围内
   */
  isPointInElement(point: IPoint, element: Box) {
    const {x, y, w, h, a} = element.widget
    const boundPoints: IPoint[] = getBoundPoints(x, y, w, h, a)

    return isPointInPolygon(point, boundPoints)
  }
}

export default Control
