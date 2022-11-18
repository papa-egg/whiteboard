import * as PIXI from 'pixi.js'
import {Container, Graphics} from 'pixi.js'
import Widget from '../widget'

interface IPoint {
  x: number
  y: number
}

interface IPencil {
  x: number
  y: number
  w: number
  h: number
  a: number
  s: number
  strokeColor: number
  strokeWidth: number
  pathPoints: IPoint[]
}

/**
 * 便签
 */
class Pencil extends Widget {
  public x: number = 0
  public y: number = 0
  public w: number = 0
  public h: number = 0
  public a: number = 0
  public s: number = 1
  public strokeColor: number = 0x000000
  public strokeWidth: number = 2
  public pathPoints: IPoint[] = []

  public sprite: any

  constructor(pencilOptions: IPencil) {
    super()

    const {strokeColor, strokeWidth, pathPoints, x, y, w, h, a, s} = pencilOptions

    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.a = a
    this.s = s

    this.strokeColor = strokeColor
    this.strokeWidth = strokeWidth
    this.pathPoints = pathPoints

    this.sprite = new Container()
    this.sprite.addChild(new Graphics())

    if (w === 0 && h === 0) {
      this.draw(true)
    } else {
      this.draw(false)
    }
  }

  addPoint(point: IPoint) {
    this.pathPoints.push(point)

    this.draw(true)
  }

  draw(isdrawing: boolean = false) {
    const {strokeColor, strokeWidth, pathPoints, w, h, x, y, a} = this
    const pencilSprite = this.sprite.children[0]
    const path = this.pointsToPath(pathPoints)

    pencilSprite.clear()
    pencilSprite.lineStyle({
      width: strokeWidth,
      color: strokeColor,
      cap: PIXI.LINE_CAP.ROUND,
      join: PIXI.LINE_JOIN.ROUND,
      alignment: 0.5,
    })

    path.forEach((pathItems: any[]) => {
      if (pathItems[0] === 'M') {
        pencilSprite.moveTo(pathItems[1].x, pathItems[1].y)
      } else if (pathItems[0] === 'Q') {
        pencilSprite.bezierCurveTo(pathItems[1].x, pathItems[1].y, pathItems[2].x, pathItems[2].y, pathItems[3].x, pathItems[3].y)
      } else if (pathItems[0] === 'L') {
        pencilSprite.lineTo(pathItems[1].x, pathItems[1].y)
      }
    })

    pencilSprite.endFill()

    const bound = this.sprite.getLocalBounds()

    this.sprite.x = bound.x + bound.width / 2
    this.sprite.y = bound.y + bound.height / 2
    this.sprite.pivot.x = bound.x + bound.width / 2
    this.sprite.pivot.y = bound.y + bound.height / 2
    this.sprite.a = a

    if (isdrawing) {
      this.x = bound.x + bound.width / 2
      this.y = bound.y + bound.height / 2
      this.w = bound.width
      this.h = bound.height
    } else {
      this.sprite.x = this.x
      this.sprite.y = this.y
      this.sprite.width = this.w
      this.sprite.height = this.h
    }
  }

  drag(dragOptions: any) {
    const {strokeWidth} = this
    const {dragType, x, y, w, h} = dragOptions

    if (dragType === 'scale') {
      this.sprite.x = x
      this.sprite.y = y
      this.sprite.width = w
      this.sprite.height = h

      const pencilSprite = this.sprite.children[0]
      const scaled = this.sprite.scale.x
      pencilSprite.geometry.graphicsData[0].lineStyle.width = strokeWidth / scaled
      pencilSprite.geometry.invalidate()
    }
  }

  dragEnd() {
    this.x = this.sprite.x
    this.y = this.sprite.y
    this.w = this.sprite.width
    this.h = this.sprite.height
  }
  // 点数组转换为贝塞尔曲线路径
  pointsToPath(points: IPoint[]) {
    const path: any[] = []
    let beignPoint: IPoint = {x: 0, y: 0}

    points.forEach((point: IPoint, index: number) => {
      if (index === 0) {
        path.push(['M', point])
        beignPoint = point
      } else {
        if (index - 2 > -1) {
          const controlPoint: IPoint = points[index - 1]
          const endPoint: IPoint = {
            x: (controlPoint.x + point.x) / 2,
            y: (controlPoint.y + point.y) / 2,
          }
          path.push(['Q', beignPoint, controlPoint, endPoint])

          beignPoint = endPoint
        }
      }
    })

    return path
  }
}

export default Pencil
