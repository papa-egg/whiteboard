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
    const path = [
      {x: 1.76953125, y: 4.265625},
      {x: 1.76953125, y: 4.265625},
      {x: 1.90625, y: 4.265625},
      {x: 2.30078125, y: 4.5234375},
      {x: 2.625, y: 4.84765625},
      {x: 4.04296875, y: 6.08984375},
      {x: 6.4609375, y: 8.4609375},
      {x: 8.12890625, y: 10.33203125},
      {x: 9.06640625, y: 11.34375},
      {x: 10.375, y: 12.65234375},
      {x: 12.30859375, y: 14.5859375},
      {x: 13.79296875, y: 16.0703125},
      {x: 15.046875, y: 17.8125},
      {x: 16.125, y: 19.73046875},
      {x: 17.15234375, y: 21.33984375},
      {x: 18.31640625, y: 22.859375},
      {x: 19.53125, y: 24.6796875},
      {x: 20.26171875, y: 25.8984375},
      {x: 21.2109375, y: 26.66015625},
      {x: 23.8359375, y: 29.80078125},
      {x: 24.80859375, y: 30.7734375},
      {x: 26.60546875, y: 32.36328125},
      {x: 28.03125, y: 33.6953125},
      {x: 28.91015625, y: 34.78125},
      {x: 29.921875, y: 36.12890625},
      {x: 31.4609375, y: 37.70703125},
      {x: 32.43359375, y: 38.4375},
      {x: 32.98046875, y: 39.1328125},
      {x: 34.01171875, y: 40.3515625},
      {x: 35.48046875, y: 41.6171875},
      {x: 36.87109375, y: 42.90625},
      {x: 37.75390625, y: 43.99609375},
      {x: 38.71484375, y: 45.0625},
      {x: 40.2109375, y: 46.76953125},
      {x: 41.6328125, y: 48.46484375},
      {x: 42.51953125, y: 49.41015625},
      {x: 43.90234375, y: 51.05859375},
      {x: 45.7109375, y: 53.140625},
      {x: 46.69140625, y: 54.125},
      {x: 48.01953125, y: 55.72265625},
      {x: 50.54296875, y: 58.8046875},
      {x: 53.19921875, y: 62.22265625},
      {x: 54.86328125, y: 64.546875},
      {x: 56.046875, y: 66.3984375},
      {x: 57.80078125, y: 69.41015625},
      {x: 59.7109375, y: 72.6015625},
      {x: 61.171875, y: 74.86328125},
      {x: 62.8984375, y: 77.453125},
      {x: 64.6171875, y: 80.12109375},
      {x: 65.3828125, y: 81.39453125},
      {x: 67.8515625, y: 84.75390625},
      {x: 70.82421875, y: 88.71875},
      {x: 72.63671875, y: 90.98828125},
      {x: 74.1484375, y: 92.8046875},
      {x: 76.0390625, y: 95.07421875},
      {x: 79.65625, y: 99.69921875},
      {x: 82.2578125, y: 103.5546875},
      {x: 82.87890625, y: 104.953125},
      {x: 85.140625, y: 107.796875},
      {x: 87.8828125, y: 111.31640625},
      {x: 89.140625, y: 113.58984375},
      {x: 90.046875, y: 115.3671875},
      {x: 92.7578125, y: 119.984375},
      {x: 95.609375, y: 125.30859375},
      {x: 96.44921875, y: 127.6796875},
      {x: 97.05078125, y: 129.24609375},
      {x: 98.42578125, y: 131.5},
      {x: 100.5703125, y: 134.71875},
      {x: 102.3828125, y: 137.28125},
      {x: 103.6953125, y: 138.98046875},
      {x: 104.8828125, y: 140.52734375},
      {x: 106.3828125, y: 142.2734375},
      {x: 107.875, y: 143.765625},
      {x: 109.05078125, y: 144.94140625},
      {x: 111.28515625, y: 146.58203125},
      {x: 113.99609375, y: 147.95703125},
      {x: 116.765625, y: 148.9765625},
      {x: 119.6484375, y: 150.328125},
      {x: 121.484375, y: 151.24609375},
      {x: 123.16796875, y: 152.00390625},
      {x: 124.4609375, y: 152.52734375},
      {x: 126.94140625, y: 153.578125},
      {x: 129.8828125, y: 155.1171875},
      {x: 130.85546875, y: 155.84765625},
      {x: 132.58984375, y: 156.47265625},
      {x: 135.21484375, y: 157.61328125},
      {x: 137.265625, y: 158.84375},
      {x: 140.16015625, y: 160.375},
      {x: 142.6328125, y: 161.52734375},
      {x: 143.984375, y: 162.140625},
      {x: 145.3828125, y: 162.83984375},
      {x: 146.390625, y: 163.34375},
      {x: 147.59375, y: 163.9453125},
      {x: 148.93359375, y: 164.6953125},
      {x: 149.8203125, y: 165.28515625},
      {x: 150.484375, y: 165.7265625},
      {x: 151.3046875, y: 166.08203125},
      {x: 154.15625, y: 167.41015625},
      {x: 154.8046875, y: 168.05859375},
      {x: 155.7421875, y: 169.140625},
      {x: 156.40234375, y: 169.8984375},
      {x: 157.0625, y: 170.4140625},
      {x: 157.7109375, y: 171.14453125},
      {x: 158.32421875, y: 171.94921875},
      {x: 158.66796875, y: 172.3046875},
      {x: 159.0859375, y: 172.55859375},
      {x: 159.7109375, y: 173.01953125},
      {x: 160.63671875, y: 173.64453125},
      {x: 161.52734375, y: 174.1015625},
      {x: 162.36328125, y: 174.42578125},
      {x: 163.39453125, y: 174.76953125},
      {x: 164.72265625, y: 174.9921875},
      {x: 165.29296875, y: 175.1796875},
      {x: 166.56640625, y: 175.3671875},
      {x: 167.51171875, y: 175.3671875},
      {x: 167.8125, y: 175.3671875},
      {x: 168.44140625, y: 175.3671875},
      {x: 169.46875, y: 175.3671875},
      {x: 170.22265625, y: 175.3671875},
      {x: 170.66015625, y: 175.3671875},
      {x: 171.66796875, y: 175.3671875},
      {x: 172.79296875, y: 175.49609375},
      {x: 173.29296875, y: 175.65625},
      {x: 173.68359375, y: 175.6875},
      {x: 174.16015625, y: 176.01171875},
      {x: 174.9140625, y: 176.62109375},
      {x: 175.484375, y: 177},
      {x: 176.1953125, y: 177.47265625},
      {x: 177.23828125, y: 178.16796875},
      {x: 178.19921875, y: 178.6796875},
      {x: 178.8671875, y: 178.93359375},
      {x: 179.61328125, y: 179.37109375},
      {x: 180.48046875, y: 179.8984375},
      {x: 181.19921875, y: 180.19140625},
      {x: 181.796875, y: 180.39453125},
      {x: 182.109375, y: 180.58984375},
      {x: 182.52734375, y: 180.8671875},
      {x: 182.94140625, y: 181.1171875},
      {x: 183.12109375, y: 181.2734375},
      {x: 183.3046875, y: 181.3203125},
      {x: 183.5546875, y: 181.3203125},
      {x: 183.69140625, y: 181.3203125},
      {x: 183.84765625, y: 181.45703125},
      {x: 184.12109375, y: 181.59375},
      {x: 184.37109375, y: 181.59375},
      {x: 184.5078125, y: 181.59375},
      {x: 184.6640625, y: 181.73046875},
      {x: 184.90625, y: 181.8671875},
      {x: 185.04296875, y: 181.8671875},
      {x: 185.0703125, y: 182.00390625},
      {x: 185.1953125, y: 182.140625},
      {x: 185.4296875, y: 182.23828125},
      {x: 185.57421875, y: 182.375},
      {x: 185.74609375, y: 182.546875},
      {x: 185.8828125, y: 182.80078125},
      {x: 185.984375, y: 183.04296875},
      {x: 186.12109375, y: 183.1953125},
      {x: 186.15234375, y: 183.36328125},
      {x: 186.27734375, y: 183.625},
      {x: 186.4140625, y: 183.85546875},
      {x: 186.421875, y: 184},
      {x: 186.421875, y: 184.3671875},
      {x: 186.421875, y: 184.80859375},
      {x: 186.50390625, y: 185.02734375},
      {x: 186.640625, y: 185.18359375},
      {x: 186.69140625, y: 185.37109375},
      {x: 186.80859375, y: 185.625},
      {x: 187.02734375, y: 185.76171875},
      {x: 187.1796875, y: 185.77734375},
      {x: 187.23046875, y: 185.9140625},
      {x: 187.34765625, y: 186.16796875},
      {x: 187.484375, y: 186.3828125},
      {x: 187.50390625, y: 186.5390625},
      {x: 187.50390625, y: 186.73046875},
      {x: 187.609375, y: 186.97265625},
      {x: 187.74609375, y: 187.1796875},
      {x: 187.7734375, y: 187.34375},
      {x: 187.7734375, y: 187.54296875},
      {x: 187.875, y: 187.78125},
      {x: 188.01171875, y: 187.91796875},
      {x: 188.16796875, y: 188.07421875},
      {x: 188.3046875, y: 188.2109375},
      {x: 188.3125, y: 188.35546875},
      {x: 188.44921875, y: 188.62890625},
      {x: 188.5859375, y: 188.8671875},
      {x: 188.5859375, y: 189.00390625},
      {x: 188.72265625, y: 189.171875},
      {x: 188.984375, y: 189.43359375},
      {x: 189.21484375, y: 189.6640625},
      {x: 189.359375, y: 189.80859375},
      {x: 189.3984375, y: 189.984375},
      {x: 189.51171875, y: 190.234375},
      {x: 189.6484375, y: 190.37109375},
      {x: 189.66796875, y: 190.52734375},
      {x: 189.78515625, y: 190.6640625},
      {x: 189.921875, y: 190.6640625},
      {x: 190.05859375, y: 190.6640625},
      {x: 190.1953125, y: 190.6640625},
      {x: 190.34765625, y: 190.6640625},
      {x: 190.484375, y: 190.6640625},
      {x: 190.5703125, y: 190.75},
      {x: 191.03125, y: 191.2109375},
      {x: 191.16796875, y: 191.2109375},
      {x: 191.40625, y: 191.2109375},
      {x: 191.54296875, y: 191.2109375},
      {x: 191.7109375, y: 191.34765625},
      {x: 191.9765625, y: 191.484375},
      {x: 192.21484375, y: 191.5859375},
      {x: 192.35546875, y: 191.72265625},
      {x: 192.5234375, y: 191.890625},
      {x: 192.92578125, y: 192.16015625},
      {x: 193.25, y: 192.3203125},
      {x: 193.30859375, y: 192.484375},
      {x: 193.41796875, y: 192.73046875},
      {x: 193.8515625, y: 193.1640625},
      {x: 193.98828125, y: 193.1640625},
      {x: 194.22265625, y: 193.26171875},
      {x: 194.359375, y: 193.3984375},
      {x: 194.53125, y: 193.5703125},
      {x: 194.7734375, y: 193.70703125},
      {x: 194.91015625, y: 193.70703125},
      {x: 195.07421875, y: 193.70703125},
      {x: 195.2109375, y: 193.8125},
      {x: 195.2109375, y: 193.94921875},
      {x: 195.33203125, y: 193.9765625},
    ]

    const elementInfoList = [
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

      //
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
        id: '888',
        type: 'pencil',
        layer: 0,
        locked: false,
        widget: {
          x: 0,
          y: 0,
          w: 0,
          h: 0,
          a: 0,
          s: 1,
          pathPoints: path,
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
