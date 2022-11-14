class Widget {
  public sprite: any
  public x: number = 0
  public y: number = 0
  public a: number = 0

  constructor() {}

  move(dx: number, dy: number) {
    this.sprite.x = this.x + dx
    this.sprite.y = this.y + dy
  }

  moveEnd() {
    this.x = this.sprite.x
    this.y = this.sprite.y
  }

  rotate(rotateOptions: {x: number; y: number; a: number}) {
    const {x, y, a} = rotateOptions

    this.sprite.x = x
    this.sprite.y = y
    this.sprite.angle = a
  }

  rotateEnd() {
    this.x = this.sprite.x
    this.y = this.sprite.y
    this.a = this.sprite.angle
  }
}

export default Widget
