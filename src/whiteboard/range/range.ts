import {Container, Graphics} from 'pixi.js'
import Box from '../box/box'
import getBoundPoints from '../utils/get-bound-points'
import getTransformRangeData from '../utils/get-transform-range-data'
import isPointInPolygon from '../utils/isPointInPolygon'

// const WD = (window as any).WD

interface IPoint {
  x: number
  y: number
}

interface IRangeData {
  x: number
  y: number
  w: number
  h: number
  a: number
  s: number
}

/**
 * 元素选中操作外框
 */
class Range {
  public selection?: Selection

  // 外轮廓
  public rangeData: IRangeData = {
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    a: 0,
    s: 1,
  }

  public adapter: any

  public rangeSprite: any
  public auxLineSprite: any
  public auxPointLeftTopSprite: any // 左上
  public auxPointRightTopSprite: any // 右上
  public auxPointRightBottomSprite: any // 右下
  public auxPointLeftBottomSprite: any // 左下
  public pointerIndex?: number

  startPoint: IPoint = {x: 0, y: 0}
  startRangeData: IRangeData = {
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    a: 0,
    s: 1,
  }
  rangeStatus: string = ''

  constructor(rangeOptions: any) {
    const {rangeData, selection, adapter} = rangeOptions

    this.selection = selection
    this.rangeData = rangeData
    this.adapter = adapter

    // 绘制元素外框和辅助点、辅助线
    this.create()
    this.draw()
    // this.listen()

    // 初始化为平移
    const WD = (window as any).WD
    const {worldX, worldY} = WD
    this.rangeStatus = 'move'
    this.startPoint.x = worldX
    this.startPoint.y = worldY
    this.startRangeData = Object.assign({}, this.rangeData)
  }

  pointerdown() {
    const WD = (window as any).WD
    const {worldX, worldY} = WD
    const {x, y, w, h, a, s} = this.toScreenRangeData(this.rangeData)
    const currentPoint = WD.viewport.toScreen({x: worldX, y: worldY})
    const auxPoints = [
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
    let selectFlag: boolean = false

    // 是否在辅助点上
    auxPoints.forEach((point: IPoint, index: number) => {
      const dx = Math.abs(currentPoint.x - point.x)
      const dy = Math.abs(currentPoint.y - point.y)

      if (Math.sqrt(dx * dx + dy * dy) <= 5) {
        selectFlag = true

        this.rangeStatus = 'drag'
        this.pointerIndex = index + 1
        this.startPoint = {
          x: worldX,
          y: worldY,
        }

        this.startRangeData = Object.assign({}, this.rangeData)
      }
    })

    // 是否在辅助线内
    if (!selectFlag) {
      const boundPoints = getBoundPoints(x, y, w, h, a)
      if (isPointInPolygon(currentPoint, boundPoints)) {
        selectFlag = true

        this.rangeStatus = 'move'
        this.startPoint = {
          x: worldX,
          y: worldY,
        }

        this.startRangeData = Object.assign({}, this.rangeData)
      }
    }
  }

  pointerup() {
    if (this.rangeStatus === 'move') {
      this.transform({
        rangeStatus: 'moveEnd',
      })
    }

    if (this.rangeStatus === 'drag') {
      this.transform({
        rangeStatus: 'dragEnd',
      })
    }

    this.show()
    this.rangeStatus = ''
  }

  pointermove() {
    if (!this.rangeStatus) return

    const WD = (window as any).WD
    const {worldX, worldY} = WD
    const endPoint: IPoint = {x: worldX, y: worldY}
    const endRangeData = getTransformRangeData({
      rangeStatus: this.rangeStatus,
      startPoint: this.startPoint,
      endPoint: endPoint,
      startRangeData: this.startRangeData,
      pointerIndex: this.pointerIndex,
      dragType: this.adapter.dragType,
    })

    this.transform({
      rangeStatus: this.rangeStatus,
      rangeData: endRangeData,
    })

    // 元素变换过程中隐藏range框
    if (this.rangeStatus) {
      this.hide()
    }
  }

  show() {
    this.rangeSprite.alpha = 1
  }

  hide() {
    this.rangeSprite.alpha = 0
  }

  update(rangeData: IRangeData) {
    this.rangeData = rangeData
    this.draw()
  }

  /**
   *
   */
  transform(options: any) {
    if (this.selection) {
      ;(this.selection as any).transform(options)
    }
  }

  /**
   * 绘图元素创建、占位
   */
  create() {
    // 辅助线
    this.rangeSprite = new Container()
    this.auxLineSprite = new Graphics()
    this.rangeSprite.addChild(this.auxLineSprite)

    // 辅助点
    this.auxPointLeftTopSprite = this.createPointSprite()
    this.auxPointRightTopSprite = this.createPointSprite()
    this.auxPointRightBottomSprite = this.createPointSprite()
    this.auxPointLeftBottomSprite = this.createPointSprite()

    this.rangeSprite.addChild(this.auxPointLeftBottomSprite)
    this.rangeSprite.addChild(this.auxPointLeftTopSprite)
    this.rangeSprite.addChild(this.auxPointRightBottomSprite)
    this.rangeSprite.addChild(this.auxPointRightTopSprite)

    const WD = (window as any).WD
    WD.app.stage.addChild(this.rangeSprite)
  }

  /**
   * 辅助点统一样式
   */
  createPointSprite() {
    const pointSprite = new Graphics()

    pointSprite.lineStyle(1, 0x8cb8c4, 1)
    pointSprite.beginFill(0xffffff)
    pointSprite.drawCircle(0, 0, 5)
    pointSprite.endFill()

    pointSprite.pivot.x = 0
    pointSprite.pivot.y = 0

    return pointSprite
  }

  /**
   * 开始绘制
   */
  draw() {
    const WD = (window as any).WD
    const {x, y, w, h, a, s} = this.toScreenRangeData(this.rangeData)

    // 辅助线
    this.auxLineSprite.clear()
    this.auxLineSprite.lineStyle(1, 0x4076f6, 1)
    this.auxLineSprite.beginFill(0xffffff, 0.001)
    this.auxLineSprite.drawRect(x - w / 2, y - h / 2, w, h)

    // 辅助点
    this.auxPointLeftTopSprite.position.set(x - w / 2, y - h / 2)
    this.auxPointRightTopSprite.position.set(x + w / 2, y - h / 2)
    this.auxPointRightBottomSprite.position.set(x + w / 2, y + h / 2)
    this.auxPointLeftBottomSprite.position.set(x - w / 2, y + h / 2)

    this.rangeSprite.angle = a
  }

  destroy() {
    this.rangeSprite.destroy()
  }

  /**
   * 转化为屏幕坐标
   */
  toScreenRangeData(rangeData: IRangeData): IRangeData {
    const WD = (window as any).WD
    const {x, y, w, h, a, s} = rangeData

    const screenPoint = WD.viewport.toScreen(x, y)
    const scaled = WD.viewport.scaled

    return {
      x: screenPoint.x,
      y: screenPoint.y,
      w: w * scaled,
      h: h * scaled,
      a: a,
      s: a,
    }
  }
}

export default Range
