import * as PIXI from 'pixi.js'
import {Texture, Graphics, Application, TilingSprite, ObservablePoint} from 'pixi.js'
import {Viewport} from 'pixi-viewport'

class Whiteboard {
  public viewportId: string = 'whiteboard-viewport'
  public app?: Application
  public viewport?: Viewport

  private minScale: number = 0.1
  private maxScale: number = 10
  private gridBgTilingSprite?: TilingSprite

  init() {
    this.initApp()
    this.initGridBg()
    this.initViewport()
    this.listenViewportResize()
    this.listenViewportMove();
    this.updateGridBgProfile();
    this.updateGridBgTexture();

    this.foo();
  }

  foo() {
    let rectangle: Graphics = new PIXI.Graphics()
    rectangle.beginFill(0x66ccff)
    rectangle.drawRect(0, 0, 100, 100)
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
      antialias: true
    })

    ;(document.getElementById(this.viewportId) as HTMLElement).appendChild(app.view)

    this.app = app
  }

  /**
   * 初始化网格背景
   */
  initGridBg() {
    if (this.app) {
      // 先赋予空白纹理占位
      const gridBgTilingSprite: TilingSprite = new PIXI.TilingSprite(Texture.WHITE, 0, 0)

      this.app.stage.addChild(gridBgTilingSprite)
      this.gridBgTilingSprite = gridBgTilingSprite;
    }
  }

  updateGridBgProfile() {
    if (this.app && this.gridBgTilingSprite) {
      this.gridBgTilingSprite.width = this.app.screen.width;
      this.gridBgTilingSprite.height = this.app.screen.height;
    }
  }

  /**
   * 更新网格背景纹理
   * NOTE: 网格背景其实是左边和上边线条进行重复平铺，如果是完整矩形，网格线宽会达到2px
   */
   updateGridBgTexture() {
    if (this.viewport && this.app && this.gridBgTilingSprite) {
      const {left, top, scaled} = this.viewport;
      const gridSprite: Graphics = new PIXI.Graphics()
      
      gridSprite.lineStyle(1, 0xd9dade, 1)
      gridSprite.moveTo(1, 1);
      gridSprite.lineTo(100 * scaled, 1);
      gridSprite.moveTo(1, 1);
      gridSprite.lineTo(1, 100 * scaled);
      gridSprite.endFill()
  
      const gridBgTexture: Texture = this.app.renderer.generateTexture(gridSprite);
      
      // 先销毁，之后赋值新纹理
      this.gridBgTilingSprite.texture.destroy();
      this.gridBgTilingSprite.texture = gridBgTexture;
      this.gridBgTilingSprite.tilePosition.x = -left * scaled;
      this.gridBgTilingSprite.tilePosition.y = -top * scaled;
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

      viewport.drag().pinch().wheel().decelerate().clampZoom({
        minScale: this.minScale,
        maxScale: this.maxScale,
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
        this.updateGridBgProfile();
        this.updateGridBgTexture();
      }
    }
  }

  /**
   * viewport监听事件：（缩放、平移）操作
   */
   listenViewportMove() {
    if (this.viewport) {
      this.viewport.on('moved', () => {
        this.updateGridBgTexture();
      })
    }
  }
}

export default Whiteboard
