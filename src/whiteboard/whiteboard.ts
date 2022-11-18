import * as PIXI from 'pixi.js'
import {Texture, Graphics, Application, TilingSprite, Container} from 'pixi.js'
import {Viewport} from 'pixi-viewport'

import Event from './event/event'
import Control from './control/control'
import Box from './box/box'
import Tool from './tool/tool'
import Factory from './factory/factory'

class Whiteboard {
  public viewId: string = 'whiteboard-viewport'
  public app?: Application
  public viewport?: Viewport

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
  public factory?: Factory // 元素工厂

  init() {
    this.initApp()
    this.initGridBg()
    this.initViewport()
    this.updateGridBgSize()
    this.updateGridBgTexture()

    this.event = new Event()
    this.control = new Control(this)
    this.tool = new Tool(this)
    this.factory = new Factory()

    this.viewport?.moveCenter(0, 0)

    this.drawElements()
  }

  drawElements() {
    const boxInfoList = [
      {
        id: '222',
        type: 'note',
        layer: 0,
        locked: false,
        widget: {
          x: 100,
          y: 100,
          w: 200,
          h: 200,
          a: 30,
          s: 1,
          noteColor: 0xffff00,
        },
      },
      {
        id: '333',
        type: 'circle',
        layer: 0,
        locked: false,
        widget: {
          x: 0,
          y: 0,
          w: 300,
          h: 100,
          a: 0,
          s: 1,
          borderColor: 0x000000,
          borderWidth: 5,
          backgroundColor: 'transparent',
        },
      },
      {
        id: '444',
        type: 'rectangle',
        layer: 0,
        locked: false,
        widget: {
          x: 0,
          y: 0,
          w: 200,
          h: 200,
          a: 0,
          s: 1,
          borderColor: 0x000000,
          borderWidth: 5,
          backgroundColor: 'transparent',
        },
      },
      {
        id: '555',
        type: 'rounded-rectangle',
        layer: 0,
        locked: false,
        widget: {
          x: -200,
          y: -200,
          w: 200,
          h: 200,
          a: 0,
          s: 1,
          borderColor: 0x000000,
          borderWidth: 5,
          backgroundColor: 'transparent',
        },
      },
      {
        id: '666',
        type: 'triangle',
        layer: 0,
        locked: false,
        widget: {
          x: 200,
          y: -200,
          w: 200,
          h: 200,
          a: 0,
          s: 1,
          borderColor: 0x000000,
          borderWidth: 5,
          backgroundColor: 'transparent',
        },
      },
      {
        id: '777',
        type: 'pencil',
        layer: 0,
        locked: false,
        widget: {
          x: 100,
          y: 31,
          w: 200,
          h: 65,
          a: 0,
          s: 1,
          pathPoints: [
            {x: 0, y: 0},
            {x: 100, y: 100},
            {x: 300, y: 0},
          ],
          strokeWidth: 2,
          strokeColor: 0x0000ff,
          locationType: 'auto',
        },
      },
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
      {
        id: '9999',
        type: 'line',
        layer: 0,
        locked: false,
        widget: {
          pathPoints: [
            {
              x: 0,
              y: 0,
            },
            {
              x: 400,
              y: -400,
            },
          ],
        },
      },
    ]

    boxInfoList.forEach((boxInfo: any) => {
      this.factory?.createBox(boxInfo)
    })
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
      const texture: any = Texture.WHITE
      const gridBgSprite: TilingSprite = new PIXI.TilingSprite(texture, 0, 0)

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

      const gridBgTexture: any = this.app.renderer.generateTexture(gridSprite)

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
