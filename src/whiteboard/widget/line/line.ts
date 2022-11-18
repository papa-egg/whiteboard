import getAngle from '../../utils/get-angle'
import getJoinPoint from '../..//utils/get-join-point'
import getStraightDistance from '../../utils/get-straight-distance'
import {Container, Graphics} from 'pixi.js'
import Widget from '../widget'

interface IPoint {
  x: number
  y: number
}

interface ILine {
  x: number
  y: number
  w: number
  h: number
  a: number
  s: number
  pathPoints: IPoint[]
  strokeColor: number | 'transparent'
  strokeWidth: number
}

/**
 * 线段
 */
class Line extends Widget {
  public x: number = 0
  public y: number = 0
  public w: number = 0
  public h: number = 0
  public a: number = 0
  public s: number = 1

  public basicPathPoints: IPoint[] = []
  public pathPoints: IPoint[] = []
  public strokeWidth: number = 2
  public strokeColor: number | 'transparent' = 0x000000

  public sprite: any

  constructor(lineOptions: ILine) {
    super()

    const {pathPoints, strokeWidth, strokeColor, x, y, w, h, a, s} = lineOptions

    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.a = a
    this.s = s

    this.basicPathPoints = JSON.parse(JSON.stringify(pathPoints))
    this.pathPoints = JSON.parse(JSON.stringify(pathPoints))
    this.strokeWidth = strokeWidth
    this.strokeColor = strokeColor

    this.sprite = new Container()
    this.sprite.addChild(new Graphics())

    this.draw()
  }

  update(options: any) {
    super.update(options)

    this.basicPathPoints = JSON.parse(JSON.stringify(this.pathPoints))
  }

  draw() {
    const {pathPoints, strokeWidth, strokeColor} = this
    const lineSprite = this.sprite.children[0]
    lineSprite.clear()
    lineSprite.lineStyle(strokeWidth, strokeColor, 1)

    pathPoints.forEach((point: IPoint, index: number) => {
      if (index === 0) {
        lineSprite.moveTo(point.x, point.y)
      } else {
        lineSprite.lineTo(point.x, point.y)
      }
    })

    lineSprite.endFill()

    const bound = this.sprite.getLocalBounds()

    this.sprite.x = bound.x + bound.width / 2
    this.sprite.y = bound.y + bound.height / 2
    this.sprite.pivot.x = bound.x + bound.width / 2
    this.sprite.pivot.y = bound.y + bound.height / 2

    this.x = bound.x + bound.width / 2
    this.y = bound.y + bound.height / 2
    this.w = bound.width
    this.h = bound.height
  }

  move(dx: number, dy: number) {
    this.pathPoints.forEach((point: IPoint, index: number) => {
      const basicPoint: IPoint = this.basicPathPoints[index]

      point.x = basicPoint.x + dx
      point.y = basicPoint.y + dy
    })

    super.move(dx, dy)
  }

  moveEnd() {
    this.basicPathPoints = JSON.parse(JSON.stringify(this.pathPoints))

    this.draw()
  }

  drag(dragOptions: any) {
    const {dragType, x, y, w, h, pathPoints} = dragOptions
    const {strokeWidth} = this

    if (dragType === 'scale') {
      this.sprite.x = x
      this.sprite.y = y
      this.sprite.width = w
      this.sprite.height = h
      const scaled = w / this.w
      const lineSprite = this.sprite.children[0]
      lineSprite.geometry.graphicsData[0].lineStyle.width = strokeWidth / scaled
      lineSprite.geometry.invalidate()
    } else if (dragType === 'point') {
      this.pathPoints = JSON.parse(JSON.stringify(pathPoints))
      this.basicPathPoints = JSON.parse(JSON.stringify(pathPoints))
      this.draw()
    }
  }

  dragEnd() {
    const centerBasicPoint: IPoint = {x: this.x, y: this.y}
    const centerPoint: IPoint = {x: this.sprite.x, y: this.sprite.y}
    const scaled = this.w / this.sprite.width

    this.pathPoints = this.pathPoints.map((point: IPoint) => {
      const distance = getStraightDistance(point, centerBasicPoint)
      const angle = getAngle(centerBasicPoint, point)
      const endPoint = getJoinPoint(distance / scaled, angle, centerPoint)

      return endPoint
    })

    this.basicPathPoints = JSON.parse(JSON.stringify(this.pathPoints))
    this.sprite.scale.set(1, 1)

    this.draw()
  }

  rotate(rotateOptions: {x: number; y: number; a: number; rotatePoint: IPoint}) {
    const {x, y, a, rotatePoint} = rotateOptions

    this.pathPoints = this.basicPathPoints.map((point: IPoint) => {
      const distance = getStraightDistance(point, rotatePoint)
      const angle = getAngle(rotatePoint, point) + a
      const endPoint = getJoinPoint(distance, angle, rotatePoint)

      return endPoint
    })

    this.draw()
  }

  rotateEnd() {
    this.basicPathPoints = JSON.parse(JSON.stringify(this.pathPoints))
  }
}

export default Line
