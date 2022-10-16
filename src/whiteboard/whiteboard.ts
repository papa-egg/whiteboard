import * as PIXI from 'pixi.js'
import {Sprite, Texture} from 'pixi.js'
import {Viewport} from 'pixi-viewport'

import '../assets/images/222.jpeg'

class Whiteboard {
  viewportId: string
  public app: any
  public viewport: any

  constructor() {
    this.viewportId = 'whiteboard-viewport'
  }

  init() {
    this.initView()
  }

  initView() {
    this.createApp()
    this.createBackgroundGrid()
    this.createViewport()
    this.listenWindowResize()

    let rectangle = new PIXI.Graphics()
    rectangle.lineStyle(4, 0xff3300, 1)
    rectangle.beginFill(0x66ccff)
    rectangle.drawRect(0, 0, 64, 64)
    rectangle.endFill()
    rectangle.x = 170
    rectangle.y = 170

    this.viewport.addChild(rectangle)
  }

  createApp() {
    const app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0xf0f0f0,
    })

    ;(document.getElementById(this.viewportId) as HTMLElement).appendChild(app.view)

    this.app = app
  }

  createBackgroundGrid() {
    let gridSprite = new PIXI.Graphics()
    gridSprite.lineStyle(1, 0xe8e8e8, 1)
    gridSprite.drawRect(-0, -0, 100, 100)
    gridSprite.endFill()

    const gridSpriteTexture = this.app.renderer.generateTexture(gridSprite)
    const gridTilingSprite = new PIXI.TilingSprite(gridSpriteTexture, this.app.screen.width, this.app.screen.height)

    this.app.stage.addChild(gridTilingSprite)
  }

  createViewport() {
    // create viewport
    const viewport = new Viewport({
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      worldWidth: window.innerWidth,
      worldHeight: window.innerHeight,
      interaction: this.app.renderer.plugins.interaction,
      passiveWheel: false,
    })

    // activate plugins
    viewport.drag().pinch().wheel().decelerate()

    // add the viewport to the stage
    this.app.stage.addChild(viewport)

    this.viewport = viewport
  }

  listenWindowResize() {
    window.onresize = () => {
      this.app.renderer.resize(window.innerWidth, window.innerHeight)
    }
  }
}

export default Whiteboard
