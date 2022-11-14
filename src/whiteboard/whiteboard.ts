import * as PIXI from 'pixi.js'
import {Texture, Graphics, Application, TilingSprite, Container} from 'pixi.js'
import {Viewport} from 'pixi-viewport'

import Event from './event/event'
import Control from './control/control'
import Box from './box/box'
import Tool from './tool/tool'

class Whiteboard {
  public viewId: string = 'whiteboard-viewport'
  public app?: Application
  public viewport?: Viewport
  public boxs?: any[]

  public minScale: number = 0.2 // 最小缩放系数
  public maxScale: number = 40 // 最大缩放系数
  public screenX: number = 0
  public screenY: number = 0
  public worldX: number = 0
  public worldY: number = 0

  private gridBgSprite?: TilingSprite // 网格背景精灵，占位，可忽略

  public event?: Event // 事件层
  public control?: Control // 控制层
  public tool?: Tool // 工具栏

  init() {
    this.initApp()
    this.initGridBg()
    this.initViewport()
    this.updateGridBgSize()
    this.updateGridBgTexture()

    this.event = new Event()
    this.control = new Control(this)
    this.tool = new Tool(this)

    this.viewport?.moveCenter(0, 0)

    this.drawElements()
  }

  drawElements() {
    const elementInfoList = [
      {
        id: '111',
        type: 'note',
        layer: 0,
        locked: false,
        widget: {
          x: 50,
          y: 50,
          w: 100,
          h: 100,
          a: 0,
          s: 1,
          noteColor: 0xff00ff,
        },
      },
    ]

    this.boxs = elementInfoList.map((elementInfo: any) => {
      const element = new Box(elementInfo)

      element.createWidget(elementInfo.widget)
      this.viewport?.addChild(element.widget.sprite)

      return element
    })

    console.log(this.boxs)
  }

  /**
   * 初始化app
   */
  initApp() {
    const app: Application = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0xf0f0f0,
      antialias: true,
    })

    ;(document.getElementById(this.viewId) as HTMLElement).appendChild(app.view)

    this.app = app

    // this.app.renderer.plugins.interaction.cursorStyles.default = 'help'
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

      viewport
        .drag({
          mouseButtons: 'middle-right',
        })
        .pinch()
        .wheel()
        .decelerate()
        .clampZoom({
          minScale: this.minScale,
          maxScale: this.maxScale,
        })

      this.app.stage.addChild(viewport)
      this.viewport = viewport

      this.viewport?.moveCenter(0, 0)
    }
  }

  /**
   * 初始化网格背景
   */
  initGridBg() {
    if (this.app) {
      // 先赋予空白纹理占位
      const gridBgSprite: TilingSprite = new PIXI.TilingSprite(Texture.WHITE, 0, 0)

      this.app.stage.addChild(gridBgSprite)
      this.gridBgSprite = gridBgSprite
    }
  }

  /**
   * 更新网格背景大小
   */
  updateGridBgSize() {
    if (this.app && this.gridBgSprite) {
      this.gridBgSprite.width = this.app.screen.width
      this.gridBgSprite.height = this.app.screen.height
    }
  }

  /**
   * 更新网格背景纹理
   * NOTE: 网格背景其实是左边和上边线条进行重复平铺，如果是完整矩形，网格线宽会达到2px
   */
  updateGridBgTexture() {
    if (this.viewport && this.app && this.gridBgSprite) {
      const {left, top, scaled} = this.viewport
      const gridSprite: Graphics = new PIXI.Graphics()

      gridSprite.lineStyle(1, 0xd9dade, 1)
      gridSprite.moveTo(1, 1)
      gridSprite.lineTo(100 * scaled, 1)
      gridSprite.moveTo(1, 1)
      gridSprite.lineTo(1, 100 * scaled)
      gridSprite.endFill()

      const gridBgTexture: Texture = this.app.renderer.generateTexture(gridSprite)

      // 先销毁，之后赋值新纹理
      this.gridBgSprite.texture.destroy()
      this.gridBgSprite.texture = gridBgTexture
      this.gridBgSprite.tilePosition.x = -left * scaled
      this.gridBgSprite.tilePosition.y = -top * scaled
    }
  }

  /**
   * 更新鼠标当前坐标——窗口&世界坐标
   */
  updatePosition() {
    if (this.viewport) {
      const screenPosition = this.app?.renderer.plugins.interaction.mouse.global
      const worldPosition = this.viewport?.toWorld(screenPosition)

      this.screenX = screenPosition.x
      this.screenY = screenPosition.y
      this.worldX = worldPosition?.x || 0
      this.worldY = worldPosition?.y || 0
    }
  }
}

export default Whiteboard
