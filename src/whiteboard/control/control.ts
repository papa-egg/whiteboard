import {Viewport} from 'pixi-viewport'
import {Application, Point} from 'pixi.js'
import Box from '../box/box'
import Whiteboard from '../whiteboard'
import getBoundPoints from '../utils/get-bound-points'
import isPointInPolygon from '../utils/isPointInPolygon'
import Selection from '../selection/selection'
import SelectBox from '../select-box/select-box'
import isPolygonIntersect from '../utils/isPolygonIntersect'
import isPolygonLineIntersect from '../utils/isPolygonLineIntersect'
import isPointInLine from '../utils/isPointInLine'

interface IPoint {
  x: number
  y: number
}

/**
 * 控制层，大量逻辑处理都在当前层处理
 */
class Control {
  private whiteboard?: Whiteboard
  private app?: Application
  private viewport?: Viewport

  public selection?: Selection
  public selectFlag: boolean = false // 是否开启选框
  public selectBox?: SelectBox // 选框实例

  constructor(whiteboard: Whiteboard) {
    this.whiteboard = whiteboard
    this.app = this.whiteboard.app
    this.viewport = this.whiteboard.viewport
  }

  pointerdown(x: number, y: number) {
    // 工具栏是否有选中元素
    if (this.whiteboard?.tool?.toolType !== 'pointer') {
      // 由tool模块接管
      this.whiteboard?.tool?.pointerdown(x, y)
    } else {
      // 工具栏属性为 pointer 的情况时
      const boxs = this.whiteboard?.factory?.boxs
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
        // 如果命中元素
        if (!this.isSameSelection(selectedBox)) {
          if (this.selection) {
            this.destroySelection()
          }

          this.selection = new Selection([selectedBox])
          this.selection?.range?.initMove()
        }
      } else {
        // 点击selection以外内容，清除selection
        if (this.selection) {
          this.destroySelection()
        }

        // 如果未命中元素. 创建选框
        this.selectFlag = true
        this.selectBox = new SelectBox({x, y})
      }
    }
  }

  pointerup(x: number, y: number) {
    // 工具栏是否有选中元素
    if (this.whiteboard?.tool?.toolType !== 'pointer') {
      // 由tool模块接管
      this.whiteboard?.tool?.pointerup(x, y)
    } else {
      // 选框选中
      if (this.selectFlag) {
        this.selectFlag = false

        if (this.selectBox) {
          const firstPolygon: IPoint[] = this.selectBox.getBoundPoints()
          const boxs = this.whiteboard?.factory?.boxs
          const selectBoxs =
            boxs?.filter((box) => {
              const {x, y, w, h, a} = box.widget
              const secondPolygon = getBoundPoints(x, y, w, h, a)
              if (firstPolygon.length <= 0) return false

              // 如果是线段，判断多边形和线段是否相交
              // 边框选中区域延伸5像素，方便选中
              if (box.type === 'line') {
                if (isPolygonLineIntersect(firstPolygon, box.widget.pathPoints, box.widget.strokeWidth + 5)) {
                  return true
                } else {
                  return false
                }
              } else {
                if (isPolygonIntersect(firstPolygon, secondPolygon)) {
                  // 和选框相交，加入选中队列
                  return true
                } else {
                  return false
                }
              }
            }) || []

          if (selectBoxs && selectBoxs.length > 0) {
            this.selection = new Selection(selectBoxs)
          }
        }

        this.selectBox?.destroy()
        this.selectBox = undefined
      }
    }
  }

  pointermove(x: number, y: number) {
    // 工具栏是否有选中元素
    if (this.whiteboard?.tool?.toolType !== 'pointer') {
      // 由tool模块接管
      this.whiteboard?.tool?.pointermove(x, y)
    } else {
      // 绘制选框
      if (this.selectFlag) {
        this.selectBox?.update({x, y})
      }
    }
  }

  pointerclick(x: number, y: number, whitch: number) {
    // 工具栏是否有选中元素
    if (this.whiteboard?.tool?.toolType !== 'pointer') {
      // 由tool模块接管
      this.whiteboard?.tool?.pointerclick(x, y, whitch)
    }
  }

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

    if (element.type === 'line') {
      return isPointInLine(point, element.widget.pathPoints, element.widget.strokeWidth)
    } else {
      return isPointInPolygon(point, boundPoints)
    }
  }
}

export default Control
