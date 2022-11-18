import {Viewport} from 'pixi-viewport'
import {Application} from 'pixi.js'
import Box from '../box/box'
import Whiteboard from '../whiteboard'
import {nanoid} from 'nanoid'
import getBoundByPoints from '../utils/get-bound-by-points'

interface IPoint {
  x: number
  y: number
}
class Tool {
  private whiteboard?: Whiteboard
  private app?: Application
  private viewport?: Viewport

  public toolType: string = 'pointer'
  public toolBox?: Box

  startPoint: IPoint = {x: 0, y: 0}

  constructor(whiteboard: Whiteboard) {
    this.whiteboard = whiteboard
    this.app = this.whiteboard.app
    this.viewport = this.whiteboard.viewport
  }

  pointerdown(x: number, y: number) {
    let boxInfo: any = null
    this.startPoint = {x, y}

    switch (this.toolType) {
      // 创建画笔
      case 'pencil': {
        this.toolBox = this.whiteboard?.factory?.createBox({
          type: 'pencil',
          widget: {
            pathPoints: [{x, y}],
          },
        })

        break
      }

      // 创建圆形
      case 'circle': {
        this.toolBox = this.whiteboard?.factory?.createBox({
          type: 'circle',
          widget: {
            x: x,
            y: y,
            w: 0,
            h: 0,
          },
        })

        break
      }

      // 创建矩型
      case 'rectangle': {
        this.toolBox = this.whiteboard?.factory?.createBox({
          type: 'rectangle',
          widget: {
            x: x,
            y: y,
            w: 0,
            h: 0,
          },
        })

        break
      }

      // 创建圆角矩型
      case 'rounded-rectangle': {
        this.toolBox = this.whiteboard?.factory?.createBox({
          type: 'rounded-rectangle',
          widget: {
            x: x,
            y: y,
            w: 0,
            h: 0,
          },
        })

        break
      }

      // 创建三角形
      case 'triangle': {
        this.toolBox = this.whiteboard?.factory?.createBox({
          type: 'triangle',
          widget: {
            x: x,
            y: y,
            w: 0,
            h: 0,
          },
        })

        break
      }

      // 创建便签
      case 'note': {
        this.toolBox = this.whiteboard?.factory?.createBox({
          type: 'note',
          widget: {
            x: x,
            y: y,
            w: 0,
            h: 0,
          },
        })

        break
      }
    }

    console.log('this.toolBox', this.toolBox)
  }

  pointermove(x: number, y: number) {
    if (!this.toolBox) return

    switch (this.toolType) {
      // 绘制画笔
      case 'pencil': {
        this.toolBox?.widget.addPoint({x, y})

        break
      }

      // 绘制圆形
      case 'circle': {
        const bound = getBoundByPoints([this.startPoint, {x, y}])

        this.toolBox?.widget.update({
          x: bound.x,
          y: bound.y,
          w: bound.w,
          h: bound.h,
        })

        break
      }

      // 绘制矩型
      case 'rectangle': {
        const bound = getBoundByPoints([this.startPoint, {x, y}])

        this.toolBox?.widget.update({
          x: bound.x,
          y: bound.y,
          w: bound.w,
          h: bound.h,
        })

        break
      }

      // 绘制圆角矩型
      case 'rounded-rectangle': {
        const bound = getBoundByPoints([this.startPoint, {x, y}])

        this.toolBox?.widget.update({
          x: bound.x,
          y: bound.y,
          w: bound.w,
          h: bound.h,
        })

        break
      }

      // 绘制三角形
      case 'triangle': {
        const bound = getBoundByPoints([this.startPoint, {x, y}])

        this.toolBox?.widget.update({
          x: bound.x,
          y: bound.y,
          w: bound.w,
          h: bound.h,
        })

        break
      }

      // 绘制便签
      case 'note': {
        const sumOffset: number = x - this.startPoint.x + (y - this.startPoint.y)
        const finalPoint: IPoint = {
          x: this.startPoint.x + sumOffset * 0.5,
          y: this.startPoint.y + sumOffset * 0.5,
        }
        const bound = getBoundByPoints([this.startPoint, finalPoint])

        this.toolBox?.widget.update({
          x: bound.x,
          y: bound.y,
          w: bound.w,
          h: bound.h,
        })

        break
      }
    }
  }

  pointerup(x: number, y: number) {
    if (this.toolBox) {
      // 如果元素宽高为0,则为单击click事件，将元素销毁
      if (this.toolBox.widget.w === 0 || this.toolBox.widget.h === 0) {
        this.whiteboard?.factory?.destroyBox(this.toolBox.id)
      }

      this.toolBox = undefined
      this.startPoint = {x: 0, y: 0}
    }
  }

  pointerclick(x: number, y: number, which: number) {
    if (which === 1) {
      // 左击创建元素

      this.whiteboard?.factory?.createBox({
        type: this.toolType,
        widget: {
          x: x,
          y: y,
        },
      })
    } else if (which === 3) {
      // TODO: 右击toolType重置为pointer, 后续考虑rxjs进行同步
      // this.toolType = 'pointer'
    }
  }

  updateToolType(toolType: string) {
    if (toolType) {
      this.toolType = toolType
    }
  }
}

export default Tool
