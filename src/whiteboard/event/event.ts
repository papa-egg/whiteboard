import {Viewport} from 'pixi-viewport'
import {Application} from 'pixi.js'
import Whiteboard from '../whiteboard'

/**
 * 事件层，所有事件都在当前进行监听触发
 */
class Event {
  private WD?: Whiteboard
  private app?: Application
  private viewport?: Viewport

  constructor(whiteboard: Whiteboard) {
    this.WD = whiteboard
    this.app = this.WD.app
    this.viewport = this.WD.viewport

    this.listenViewportDown()
    this.listenViewportUp()
    this.listenViewportClick()
    this.listenViewportMove()
    this.listenWindowResize()
    this.listenViewportWheel()
  }

  /**
   * 指针——按下
   */
  listenViewportDown() {
    this.viewport?.on('pointerdown', (e: any) => {
      const which = e.data.originalEvent.which

      if (this.WD) {
        const worldX = this.WD?.worldX
        const worldY = this.WD?.worldY

        // 鼠标左键
        if (which == 1) {
          this.WD?.control?.pointerdown(worldX, worldY)
        }

        if (this.WD?.control?.selection) {
          this.WD?.control?.selection.range?.pointerdown()
        }
      }
    })
  }

  /**
   * 指针——抬起
   */
  listenViewportUp() {
    this.viewport?.on('pointerup', (e: any) => {
      if (this.WD?.control?.selection) {
        this.WD?.control?.selection.range?.pointerup()
      }
    })
  }

  /**
   * 指针——点击
   */
  listenViewportClick() {
    this.viewport?.on('clicked', () => {
      // console.log('click')
    })
  }

  /**
   * 指针——移动中
   */
  listenViewportMove() {
    this.viewport?.on('pointermove', () => {
      this.WD?.updatePosition()

      if (this.WD?.control?.selection) {
        this.WD?.control?.selection.range?.pointermove()
      }
    })
  }

  /**
   * 监听浏览器窗口拉伸
   */
  listenWindowResize() {
    window.onresize = () => {
      if (this.app) {
        // 更新视图大小、更新背景网格
        this.app.renderer.resize(window.innerWidth, window.innerHeight)
        this.viewport?.resize()
        this.WD?.updateGridBgSize()
        this.WD?.updateGridBgTexture()

        // range框响应窗口变化
        if (this.WD?.control?.selection) {
          this.WD?.control?.selection.range?.draw()
        }
      }
    }
  }

  /**
   * viewport滚轮事件：（缩放、平移）操作
   */
  listenViewportWheel() {
    if (this.viewport) {
      this.viewport.on('moved', () => {
        this.WD?.updatePosition()
        this.WD?.updateGridBgTexture()

        // range框响应窗口变化
        if (this.WD?.control?.selection) {
          this.WD?.control?.selection.range?.draw()
        }
      })
    }
  }
}

export default Event
