import {Container, Graphics, Sprite, utils, Texture} from 'pixi.js'
import Box from '../box/box'
import getBoundPoints from '../utils/get-bound-points'
import getTransformRangeData from '../utils/get-transform-range-data'
import isPointInPolygon from '../utils/isPointInPolygon'
import getWorldPointerPoint from '../utils/get-world-pointer-point'
import getScreenPointerPoint from '../utils/get-screen-pointer-point'
import getViewportScaled from '../utils/get-viewport-scaled'
import getViewport from '../utils/get-viewport'
import getWhiteboard from '../utils/get-whiteboard'
import getRotatedPoint from '../utils/get-roteted-point'

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

  public boxs: Box[] = []
  public boxRanges: any[] = []

  public adapter: any
  public rangeSprite: any
  public auxLineSprite: any
  public auxPointLeftTopSprite: any // 左上
  public auxPointRightTopSprite: any // 右上
  public auxPointRightBottomSprite: any // 右下
  public auxPointLeftBottomSprite: any // 左下
  public rotateSprite: any // 旋转按钮
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
    const {rangeData, selection, adapter, boxs} = rangeOptions

    this.boxs = boxs
    this.selection = selection
    this.rangeData = rangeData
    this.adapter = adapter

    // 绘制元素外框和辅助点、辅助线
    this.createBoxRanges()
    this.drawBoxRanges()
    this.create()
    this.draw()
  }

  initMove() {
    // 初始化为平移
    const worldPoint: IPoint = getWorldPointerPoint()
    this.rangeStatus = 'move'
    this.startPoint.x = worldPoint.x
    this.startPoint.y = worldPoint.y
    this.startRangeData = Object.assign({}, this.rangeData)
  }

  pointerdown() {
    // NOTE：换算成窗口坐标进行计算，判断鼠标当前选中range哪个操作元素
    const worldPoint: IPoint = getWorldPointerPoint()
    const screenPoint = getScreenPointerPoint()
    const {x, y, w, h, a, s} = this.toScreenRangeData(this.rangeData)
    const auxPoints = getBoundPoints(x, y, w, h, a)
    let selectFlag: boolean = false

    // 是否在辅助点上
    auxPoints.forEach((point: IPoint, index: number) => {
      const dx = Math.abs(screenPoint.x - point.x)
      const dy = Math.abs(screenPoint.y - point.y)

      if (Math.sqrt(dx * dx + dy * dy) <= 5) {
        selectFlag = true

        this.rangeStatus = 'drag'
        this.pointerIndex = index + 1
        this.startPoint = worldPoint
        this.startRangeData = Object.assign({}, this.rangeData)
      }
    })

    // 是否在旋转点上
    const rotatedPoint = getRotatedPoint({x, y}, {x, y: y + h / 2 + 20}, a)
    const rotateDx = Math.abs(screenPoint.x - rotatedPoint.x)
    const rotateDy = Math.abs(screenPoint.y - rotatedPoint.y)

    if (Math.sqrt(rotateDx * rotateDx + rotateDy * rotateDy) < 10) {
      selectFlag = true

      this.rangeStatus = 'rotate'
      this.startPoint = worldPoint
      this.startRangeData = Object.assign({}, this.rangeData)
    }

    // 是否在辅助线框内
    if (!selectFlag) {
      const boundPoints = getBoundPoints(x, y, w, h, a)

      if (isPointInPolygon(screenPoint, boundPoints)) {
        selectFlag = true

        this.rangeStatus = 'move'
        this.startPoint = worldPoint
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

    if (this.rangeStatus === 'rotate') {
      this.transform({
        rangeStatus: 'rotateEnd',
      })
    }

    if (this.rangeStatus === 'drag') {
      this.transform({
        rangeStatus: 'dragEnd',
      })
    }

    this.setRangeVisible(true)
    this.rangeStatus = ''
  }

  pointermove() {
    if (!this.rangeStatus) return

    const endPoint: IPoint = getWorldPointerPoint()
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
    if (this.rangeStatus === 'move' || this.rangeStatus === 'drag') {
      this.setRangeVisible(false)
    }
  }

  setRangeVisible(visible: boolean) {
    if (visible) {
      this.rangeSprite.children[1].alpha = 1
      this.rangeSprite.children[2].alpha = 1
      this.rangeSprite.children[3].alpha = 1
      this.rangeSprite.children[4].alpha = 1
      this.rangeSprite.children[5].alpha = 1
    } else {
      this.rangeSprite.children[1].alpha = 0
      this.rangeSprite.children[2].alpha = 0
      this.rangeSprite.children[3].alpha = 0
      this.rangeSprite.children[4].alpha = 0
      this.rangeSprite.children[5].alpha = 0
    }
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

    // 旋转图标
    this.rotateSprite = new Container()
    const rotateBgSprite = new Graphics()
    rotateBgSprite.beginFill(0xffffff)
    rotateBgSprite.drawCircle(8, 8, 10)
    rotateBgSprite.endFill()
    this.rotateSprite.addChild(rotateBgSprite)
    const rotateTexture: any = Texture.from('./rotate.png')
    const rotateImagesprite = new Sprite(rotateTexture)
    rotateImagesprite.width = 16
    rotateImagesprite.height = 16
    this.rotateSprite.addChild(rotateImagesprite)
    this.rotateSprite.pivot.x = 10
    this.rotateSprite.pivot.y = 10
    this.rangeSprite.addChild(this.rotateSprite)

    // NOTE: 不随viewport进行缩放，所以渲染到stage画布
    const whiteboard = getWhiteboard()
    whiteboard.app.stage.addChild(this.rangeSprite)
  }

  /**
   * 辅助点统一样式
   */
  createPointSprite() {
    const pointSprite = new Graphics()

    pointSprite.lineStyle(1, 0x4eabcf)
    pointSprite.beginFill(0xffffff)
    pointSprite.drawCircle(0, 0, 5)
    pointSprite.endFill()

    return pointSprite
  }

  /**
   * 开始绘制
   */
  draw() {
    const {x, y, w, h, a, s} = this.toScreenRangeData(this.rangeData)

    this.rangeSprite.x = x
    this.rangeSprite.y = y

    // 辅助线
    this.auxLineSprite.clear()
    this.auxLineSprite.lineStyle(1, 0x4eabcf, 1)
    this.auxLineSprite.drawRect(-w / 2, -h / 2, w, h)

    // 辅助点
    this.auxPointLeftTopSprite.position.set(-w / 2, -h / 2)
    this.auxPointRightTopSprite.position.set(w / 2, -h / 2)
    this.auxPointRightBottomSprite.position.set(w / 2, h / 2)
    this.auxPointLeftBottomSprite.position.set(-w / 2, h / 2)

    // 旋转点
    this.rotateSprite.position.set(0, h / 2 + 20)
    this.rangeSprite.angle = a
  }

  // 绘制元素子项边框
  drawBoxRanges() {
    this.boxRanges.forEach((boxRange: any) => {
      const {x, y, w, h, a, s} = this.toScreenRangeData({
        x: boxRange.x,
        y: boxRange.y,
        w: boxRange.w,
        h: boxRange.h,
        a: boxRange.a,
        s: boxRange.s,
      })

      const boundSprite = boxRange.sprite
      boundSprite.clear()
      boundSprite.lineStyle(1, 0x4eabcf, 1)
      boundSprite.drawRect(-w / 2, -h / 2, w, h)
      boundSprite.x = x
      boundSprite.y = y
      boundSprite.angle = a
    })
  }

  // 创建元素子项边框
  createBoxRanges() {
    this.boxRanges = this.boxs.map((box: Box) => {
      const {x, y, w, h, a, s} = this.toScreenRangeData({
        x: box.widget.x,
        y: box.widget.y,
        w: box.widget.w,
        h: box.widget.h,
        a: box.widget.a,
        s: box.widget.s,
      })

      const boundSprite = new Graphics()
      const whiteboard = getWhiteboard()
      whiteboard.app.stage.addChild(boundSprite)

      return {
        id: box.id,
        sprite: boundSprite,
        x: box.widget.x,
        y: box.widget.y,
        w: box.widget.w,
        h: box.widget.h,
        a: box.widget.a,
        s: box.widget.s,
      }
    })
  }

  updateBoxRange(id: string, rangeData: IRangeData) {
    this.boxRanges.forEach((boxRange: any) => {
      if (boxRange.id === id) {
        const {x, y, w, h, a, s} = this.toScreenRangeData(rangeData)
        boxRange.x = rangeData.x
        boxRange.y = rangeData.y
        boxRange.w = rangeData.w
        boxRange.h = rangeData.h
        boxRange.a = rangeData.a
        boxRange.s = rangeData.s

        const boundSprite = boxRange.sprite
        boundSprite.clear()
        boundSprite.lineStyle(1, 0x4eabcf, 1)
        boundSprite.drawRect(-w / 2, -h / 2, w, h)
        boundSprite.x = x
        boundSprite.y = y
        boundSprite.angle = a
      }
    })
  }

  destroy() {
    this.rangeSprite.destroy()

    this.boxRanges.forEach((boxRange: any) => {
      const sprite = boxRange.sprite

      const whiteboard = getWhiteboard()
      whiteboard.app.stage.removeChild(sprite)
    })
  }

  /**
   * rangeData转化为屏幕坐标
   */
  toScreenRangeData(rangeData: IRangeData): IRangeData {
    const {x, y, w, h, a, s} = rangeData
    const viewport = getViewport()
    const sPoint = viewport.toScreen(x, y)
    const scaled = getViewportScaled()

    return {
      x: sPoint.x,
      y: sPoint.y,
      w: w * scaled,
      h: h * scaled,
      a: a,
      s: s,
    }
  }
}

export default Range
