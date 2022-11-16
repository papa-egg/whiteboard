import {Container, Graphics} from 'pixi.js'
import Widget from '../widget'

interface IRoundedRectangle {
  x: number
  y: number
  w: number
  h: number
  a: number
  s: number
  borderColor: number | 'transparent'
  borderWidth: number
  backgroundColor: number | 'transparent'
}

/**
 * 圆形
 */
class RoundedRectangle extends Widget {
  public x: number = 0
  public y: number = 0
  public w: number = 0
  public h: number = 0
  public a: number = 0
  public s: number = 1
  public borderColor: number | 'transparent' = 0xffffff
  public borderWidth: number = 2
  public backgroundColor: number | 'transparent' = 'transparent'

  public sprite: any

  constructor(roundedRectangleOptions: IRoundedRectangle) {
    super()

    const {borderColor, borderWidth, backgroundColor, x, y, w, h, a, s} = roundedRectangleOptions

    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.a = a
    this.s = s
    this.borderColor = borderColor
    this.borderWidth = borderWidth
    this.backgroundColor = backgroundColor

    this.sprite = new Container()
    this.sprite.addChild(new Graphics())

    this.draw()
  }

  draw() {
    const {borderColor, borderWidth, backgroundColor, x, y, w, h, a, s} = this
    const roundedRectangleSprite = this.sprite.children[0]
    roundedRectangleSprite.clear()

    if (borderColor !== 'transparent') {
      roundedRectangleSprite.lineStyle(borderWidth, borderColor, 1, 0)
    }

    if (backgroundColor !== 'transparent') {
      roundedRectangleSprite.beginFill(backgroundColor)
    }

    roundedRectangleSprite.drawRoundedRect(-w / 2, -h / 2, w, h, Math.min(w, h) * 0.2)
    roundedRectangleSprite.endFill()

    this.sprite.angle = a
    this.sprite.x = x
    this.sprite.y = y
  }

  drag(dragOptions: any) {
    const {borderWidth} = this
    const {dragType, x, y, w, h} = dragOptions

    if (dragType === 'scale') {
      this.sprite.x = x
      this.sprite.y = y
      this.sprite.width = w
      this.sprite.height = h
      const scaled = this.sprite.scale.x
      const roundedRectangleSprite = this.sprite.children[0]
      roundedRectangleSprite.geometry.graphicsData[0].lineStyle.width = borderWidth / scaled
      roundedRectangleSprite.geometry.invalidate()
    } else if (dragType === 'free') {
      this.x = x
      this.y = y
      this.w = w
      this.h = h
      this.draw()
    }
  }

  dragEnd() {
    this.x = this.sprite.x
    this.y = this.sprite.y
    this.w = this.sprite.width
    this.h = this.sprite.height
    this.sprite.scale.set(1, 1)
    this.draw()
  }
}

export default RoundedRectangle
