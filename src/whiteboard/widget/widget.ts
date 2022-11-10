class Widget {
  public sprite: any
  public x: number = 0
  public y: number = 0

  constructor() {}

  move(dx: number, dy: number) {
    this.sprite.x = this.x + dx
    this.sprite.y = this.y + dy
  }

  rotate(angle: number) {
    this.sprite.angle = angle
  }

  scale(scale: number) {
    this.sprite.scale.x = scale
    this.sprite.scale.y = scale
  }
}

export default Widget
