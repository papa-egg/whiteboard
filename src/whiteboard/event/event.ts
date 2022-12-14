import getWhiteboard from '../utils/get-whiteboard'

/**
 * 事件层，所有事件都在当前进行监听触发
 */
class Event {
  whiteboard: any
  viewport: any
  app: any

  constructor() {
    this.whiteboard = getWhiteboard()
    this.viewport = this.whiteboard.viewport
    this.app = this.whiteboard.app

    this.listenViewportPointerdown() // 按下
    this.listenViewportPointerup() // 按起
    this.listenViewportPointermove() // 平移
    this.listenViewportClick() // 单击
    this.listenWindowResize() // 窗口拉伸
    this.listenViewportWheel() // 滚轮滚动
  }

  /**
   * 指针——按下
   */
  listenViewportPointerdown() {
    this.viewport?.on('pointerdown', (e: any) => {
      const which = e.data.originalEvent.which

      if (this.whiteboard) {
        const worldX = this.whiteboard?.worldX
        const worldY = this.whiteboard?.worldY

        // 鼠标左键
        if (which == 1) {
          // 当工具栏未选中pointer时，清除原先selection选框
          if (this.whiteboard.tool.toolType !== 'pointer') {
            this.whiteboard?.control?.destroySelection()
          }

          if (this.whiteboard?.control?.selection) {
            this.whiteboard?.control?.selection.range?.pointerdown()

            // selction range模块中有元素选中，由range进行事件接管，不往下传递
            if (this.whiteboard?.control?.selection.range?.rangeStatus) {
              return
            }
          }

          this.whiteboard?.control?.pointerdown(worldX, worldY)
        }
      }
    })
  }

  /**
   * 指针——抬起
   */
  listenViewportPointerup() {
    this.viewport?.on('pointerup', () => {
      const worldX = this.whiteboard?.worldX
      const worldY = this.whiteboard?.worldY

      if (this.whiteboard?.control?.selection) {
        this.whiteboard?.control?.selection.range?.pointerup()

        if (this.whiteboard?.control?.selection.range?.rangeStatus) {
          return
        }
      }

      this.whiteboard?.control?.pointerup(worldX, worldY)
    })
  }

  /**
   * 指针——移动中
   */
  listenViewportPointermove() {
    this.viewport?.on('pointermove', () => {
      const worldX = this.whiteboard?.worldX
      const worldY = this.whiteboard?.worldY

      this.whiteboard?.updatePosition()

      if (this.whiteboard?.control?.selection) {
        this.whiteboard?.control?.selection.range?.pointermove()

        if (this.whiteboard?.control?.selection.range?.rangeStatus) {
          return
        }
      }

      this.whiteboard?.control?.pointermove(worldX, worldY)
    })
  }

  /**
   * 指针——点击
   */
  listenViewportClick() {
    this.viewport?.on('clicked', (e: any) => {
      const whitch = e.event.data.originalEvent.which
      const worldX = this.whiteboard?.worldX
      const worldY = this.whiteboard?.worldY

      this.whiteboard?.control?.pointerclick(worldX, worldY, whitch)
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
        this.whiteboard?.updateGridBgSize()
        this.whiteboard?.updateGridBgTexture()

        // range响应窗口变化
        this.updateRange()
      }
    }
  }

  /**
   * viewport滚轮事件：（缩放、平移）操作
   */
  listenViewportWheel() {
    if (this.viewport) {
      this.viewport.on('moved', () => {
        this.whiteboard?.updatePosition()
        this.whiteboard?.updateGridBgTexture()

        // range响应窗口变化
        this.updateRange()
      })
    }
  }

  /**
   * 更新range
   */
  updateRange() {
    if (this.whiteboard?.control?.selection) {
      this.whiteboard?.control?.selection.range?.draw()
      this.whiteboard?.control?.selection.range?.drawBoxRanges()
    }
  }
}

export default Event
