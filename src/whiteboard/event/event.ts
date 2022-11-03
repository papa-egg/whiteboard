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
    this.listenViewportMove()
    this.listenWindowResize()
    this.listenViewportWheel()
  }

  /**
   * 画布——按下
   */
  listenViewportDown() {
    this.viewport?.on('pointerdown', () => {
      console.log('down')
    })
  }

  /**
   * 画布——抬起
   */
  listenViewportUp() {
    this.viewport?.on('pointerup', (e: any) => {
      // console.log('up', e.data.originalEvent.which)
    })
  }

  /**
   * 画布——移动中
   */
  listenViewportMove() {
    this.viewport?.on('pointermove', () => {
      this.WD?.updatePosition()
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
      })
    }
  }
}

export default Event
