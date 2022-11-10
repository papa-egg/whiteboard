import {Container, Graphics} from 'pixi.js'
import Box from '../box/box'
import getBoundPoints from '../utils/get-bound-points'
import getTransformRangeData from '../utils/get-transform-range-data'

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
    console.log(1111)
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

    this.rangeStatus = ''
  }

  pointermove() {}

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
   * 监听控制元素
   */
  listen() {
    this.auxLineSprite.on('mousedown', (e: any) => {
      console.log('down')

      const WD = (window as any).WD
      const {worldX, worldY} = WD

      this.rangeStatus = 'move'

      this.startPoint.x = worldX
      this.startPoint.y = worldY

      this.startRangeData = Object.assign({}, this.rangeData)
    })

    this.auxLineSprite.on('pointermove', (e: any) => {
      console.log('move')

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
        // this.hide()
      }
    })

    this.auxLineSprite.on('pointerup', (e: any) => {
      this.show()

      if (this.rangeStatus === 'move') {
        this.transform({
          rangeStatus: 'moveEnd',
        })
      }

      console.log(this.rangeStatus)

      if (this.rangeStatus === 'drag') {
        this.transform({
          rangeStatus: 'dragEnd',
        })
      }

      this.rangeStatus = ''
    })

    this.auxLineSprite.on('pointerupoutside', (e: any) => {
      this.show()

      if (this.rangeStatus === 'move') {
        this.transform({
          rangeStatus: 'moveEnd',
        })
      }

      console.log(this.rangeStatus)

      if (this.rangeStatus === 'drag') {
        this.transform({
          rangeStatus: 'dragEnd',
        })
      }

      this.rangeStatus = ''
    })

    /**************************************** auxPoint ********************************************/

    const auxPointDown = (e: any, pointerIndex: number) => {
      console.log('down', pointerIndex)

      this.pointerIndex = pointerIndex

      const WD = (window as any).WD
      const {worldX, worldY} = WD

      this.rangeStatus = 'drag'

      this.startPoint.x = worldX
      this.startPoint.y = worldY

      this.startRangeData = Object.assign({}, this.rangeData)
    }

    const auxPointUp = (e: any, pointerIndex: number) => {
      if (this.rangeStatus === 'drag') {
        this.transform({
          rangeStatus: 'dragEnd',
        })
      }
      this.rangeStatus = ''
    }

    this.auxPointLeftTopSprite.on('pointerdown', (e: any) => {
      auxPointDown(e, 1)
    })

    this.auxPointLeftTopSprite.on('pointerup', (e: any) => {
      auxPointUp(e, 1)
    })

    this.auxPointRightTopSprite.on('pointerdown', (e: any) => {
      auxPointDown(e, 2)
    })

    this.auxPointRightTopSprite.on('pointerup', (e: any) => {
      auxPointUp(e, 2)
    })

    this.auxPointRightBottomSprite.on('pointerdown', (e: any) => {
      auxPointDown(e, 3)
    })

    this.auxPointRightBottomSprite.on('pointerup', (e: any) => {
      auxPointUp(e, 3)
    })

    this.auxPointRightBottomSprite.on('pointerup', (e: any) => {
      auxPointUp(e, 3)
    })

    this.auxPointRightBottomSprite.on('pointerup', (e: any) => {
      auxPointUp(e, 3)
    })

    this.auxPointLeftBottomSprite.on('pointerupoutside', (e: any) => {
      auxPointDown(e, 4)
    })

    this.auxPointLeftBottomSprite.on('pointerup', (e: any) => {
      auxPointUp(e, 4)
    })
  }

  /**
   * 绘图元素创建、占位
   */
  create() {
    // 辅助线
    this.rangeSprite = new Container()
    // this.rangeSprite.interactive = true
    this.auxLineSprite = new Graphics()
    // this.auxLineSprite.interactive = true
    this.rangeSprite.addChild(this.auxLineSprite)

    // 辅助点
    this.auxPointLeftTopSprite = this.createPointSprite()
    this.auxPointRightTopSprite = this.createPointSprite()
    this.auxPointRightBottomSprite = this.createPointSprite()
    this.auxPointLeftBottomSprite = this.createPointSprite()
    // 只有对精灵interactive赋值为true,才能进行事件绑定监听
    // this.auxPointLeftTopSprite.interactive = true
    // this.auxPointRightTopSprite.interactive = true
    // this.auxPointRightBottomSprite.interactive = true
    // this.auxPointLeftBottomSprite.interactive = true

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
    // pointSprite.drawRect(0, 0, 10, 10)
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
