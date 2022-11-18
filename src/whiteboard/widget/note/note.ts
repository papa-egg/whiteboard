import {Container, Graphics, Sprite} from 'pixi.js'
import Widget from '../widget'

interface INote {
  x: number
  y: number
  w: number
  h: number
  a: number
  s: number
  noteColor: number
}

/**
 * 便签
 */
class Note extends Widget {
  public x: number = 0
  public y: number = 0
  public w: number = 0
  public h: number = 0
  public a: number = 0
  public s: number = 1
  public noteColor: number = 0xffffff

  public sprite: any

  constructor(noteOptions: INote) {
    super()

    const {noteColor, x, y, w, h, a, s} = noteOptions

    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.a = a
    this.s = s
    this.noteColor = noteColor

    this.sprite = new Container()
    this.sprite.addChild(new Graphics())
    this.sprite.addChild(new Container())
    this.sprite.children[1].addChild(Sprite.from('http://teamind-static-oss.teamind.co/v2/static/note-shadow.png'))

    this.draw()
  }

  draw() {
    const {noteColor, w, h, x, y, a} = this

    // 背景框
    const noteBgSprite = this.sprite.children[0]
    noteBgSprite.clear()
    noteBgSprite.beginFill(noteColor)
    noteBgSprite.drawRect(0, 0, w, h)
    noteBgSprite.endFill()

    // 底部阴影
    const scale = w / 400
    const shadowSprite = this.sprite.children[1]
    shadowSprite.scale.set(scale, scale)
    shadowSprite.x = 0
    shadowSprite.y = h

    this.sprite.angle = a
    this.sprite.x = x
    this.sprite.y = y
    this.sprite.pivot.x = w / 2
    this.sprite.pivot.y = h / 2
  }

  drag(dragOptions: any) {
    const {dragType, x, y, w, h} = dragOptions

    if (dragType === 'scale') {
      const ratio: number = this.sprite.width / this.sprite.height
      this.sprite.x = x
      this.sprite.y = y
      this.sprite.width = w
      this.sprite.height = h / ratio
    }
  }

  dragEnd() {
    const ratio: number = this.sprite.width / this.sprite.height
    this.x = this.sprite.x
    this.y = this.sprite.y
    this.w = this.sprite.width
    this.h = this.sprite.height * ratio

    this.sprite.scale.set(1, 1)
    this.draw()
  }
}

export default Note
