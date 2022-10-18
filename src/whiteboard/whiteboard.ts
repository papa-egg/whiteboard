import * as PIXI from 'pixi.js'
import {Texture, Graphics, Application, TilingSprite, ObservablePoint} from 'pixi.js'
import {Viewport} from 'pixi-viewport'

class Whiteboard {
  public viewportId: string = 'whiteboard-viewport'
  public app?: Application
  public viewport?: Viewport

  private minScale: number = 0.1
  private maxSclae: number = 10
  private gridBgTilingSprite?: TilingSprite

  init() {
    this.initApp()
    this.initGridBackground()
    this.initViewport()
    this.listenViewportResize()
    this.listenViewportMove();

    this.foo();
  }

  foo() {
    let rectangle: Graphics = new PIXI.Graphics()
    rectangle.beginFill(0x66ccff)
    rectangle.drawRect(0, 0, 500, 500)
    rectangle.beginHole();
    rectangle.arc(250, 250, 100, 0, Math.PI * 2, false)
  
    rectangle.endHole();
    rectangle.endFill()

    if (this.viewport) {
      this.viewport.addChild(rectangle)
    }
  }

  /**
   * 初始化app
   */
  initApp() {
    const app: Application = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0xf0f0f0,
    })

    ;(document.getElementById(this.viewportId) as HTMLElement).appendChild(app.view)

    this.app = app
  }

  /**
   * 生成网格背景
   */
  initGridBackground() {
    let gridSprite: Graphics = new PIXI.Graphics()
    gridSprite.lineStyle(1, 0xe7e7e7, 1)
    gridSprite.moveTo(0, 0);
    gridSprite.lineTo(100.5, 0);
    gridSprite.moveTo(0, 0);
    gridSprite.lineTo(0, 100.5);
    gridSprite.endFill()

    if (this.app) {
      const gridBgTexture: Texture = this.app.renderer.generateTexture(gridSprite)
      const gridBgTilingSprite: TilingSprite = new PIXI.TilingSprite(gridBgTexture, this.app.screen.width, this.app.screen.height)

      this.app.stage.addChild(gridBgTilingSprite)
      this.gridBgTilingSprite = gridBgTilingSprite;
    }
  }

  /**
   * 初始化pixi-viewport视图
   */
  initViewport() {
    if (this.app) {
      const viewport: Viewport = new Viewport({
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        worldWidth: window.innerWidth,
        worldHeight: window.innerHeight,
        interaction: this.app.renderer.plugins.interaction,
        passiveWheel: false,
      })

      viewport.animate({
        callbackOnComplete: () => {
          console.log('arguments');
          
        }
      }).drag().pinch().wheel().decelerate().clampZoom({
        minScale: this.minScale,
        maxScale: this.maxSclae,
      })
      this.app.stage.addChild(viewport)

      this.viewport = viewport
    }
  }

  /**
   * 当浏览器窗口发生变化，更新viewport视图
   */
   listenViewportResize() {
    window.onresize = () => {
      if (this.app) {
        this.app.renderer.resize(window.innerWidth, window.innerHeight)
      }
    }
  }

  /**
   * 监听视图变化事件：（缩放、平移）操作
   */
  listenViewportMove() {
    if (this.viewport) {
      this.viewport.on('moved', () => {
        this.resizeGirdBgTiling();
        
      })
    }
  }

  /**
   * 调整背景网格
   */
  resizeGirdBgTiling() {
    if (this.viewport && this.gridBgTilingSprite) {
      const {left, right, top, bottom, scaled} = this.viewport;

      this.gridBgTilingSprite.tilePosition.x = -left;
      this.gridBgTilingSprite.tilePosition.y = -top;
    }
  }
}

export default Whiteboard
