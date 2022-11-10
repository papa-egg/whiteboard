import Box from '../box/box'
import Range from '../range/range'
import getBoundPoints from '../utils/get-bound-points'

interface IRangeData {
  x: number
  y: number
  w: number
  h: number
  a: number
  s: number
}

interface IPoint {
  x: number
  y: number
}

class Selection {
  range?: Range
  rangeData?: IRangeData
  boxs: Box[] = []
  adapter: any

  constructor(boxs: Box[]) {
    this.boxs = boxs
    const rangeData = this.getRangeData(this.boxs)
    this.rangeData = rangeData

    this.adapter = this.getAdapter(this.boxs)

    this.range = new Range({
      selection: this,
      rangeData: rangeData,
      adapter: this.adapter,
    })
  }

  transform(options: any) {
    if (!this.rangeData || !this.range) return

    const {rangeStatus, dx, dy, rangeData} = options
    const startRangeData = this.rangeData

    console.log(rangeStatus)

    switch (rangeStatus) {
      case 'move': {
        this.range?.update(rangeData)

        const dx = rangeData.x - startRangeData.x
        const dy = rangeData.y - startRangeData.y

        this.boxs.forEach((box: Box) => {
          box.widget.move(dx, dy)
        })

        break
      }

      case 'moveEnd': {
        this.rangeData = Object.assign({}, this.range.rangeData)

        this.boxs.forEach((box: Box) => {
          box.widget.moveEnd()
        })

        break
      }

      case 'drag': {
        this.range?.update(rangeData)

        if (this.adapter.dragType === 'scale') {
          // 等比例拖拽

          const scaled = rangeData.w / startRangeData.w

          console.log('rangeData', rangeData)

          this.boxs.forEach((box: Box) => {
            box.widget.drag({
              dragType: 'scale',
              x: rangeData.x - rangeData.w / 2 + Math.abs((box.widget.x - startRangeData.x - startRangeData.w / 2) * scaled),
              y: rangeData.y - rangeData.h / 2 + Math.abs((box.widget.y - startRangeData.y - startRangeData.h / 2) * scaled),
              w: box.widget.w * scaled,
              h: box.widget.h * scaled,
              scaled,
            })
          })
        } else if (this.adapter.dragType === 'free') {
          // 自由拖拽
        }
        break
      }

      case 'dragEnd': {
        this.rangeData = Object.assign({}, this.range.rangeData)

        this.boxs.forEach((box: Box) => {
          box.widget.dragEnd()
        })

        break
      }
    }
  }

  destroy() {
    this.range?.destroy()
    this.rangeData = undefined
    this.range = undefined
  }

  /**
   * 获取外轮廓
   */
  getRangeData(boxs: Box[]): IRangeData {
    const rangeData: IRangeData = {
      x: 0,
      y: 0,
      w: 0,
      h: 0,
      a: 0,
      s: 1,
    }

    // 选中单个元素，只需取元素本身x,y等数值
    if (boxs.length <= 1) {
      const {x, y, w, h, a, s} = boxs[0].widget

      rangeData.x = x
      rangeData.y = y
      rangeData.w = w
      rangeData.h = h
      rangeData.a = a
      rangeData.s = s
    } else {
      // 框选多个元素，通过将所有元素外轮廓点进行整合，求出其中最大最小值，求出最外围轮廓
      const boxsBoundPoints: IPoint[] = []
      const xArr: number[] = []
      const yArr: number[] = []

      boxs.forEach((box: Box) => {
        const {x, y, w, h, a, s} = box.widget
        const boundPoints: IPoint[] = getBoundPoints(x, y, w, h, a)

        boxsBoundPoints.push(...boundPoints)
      })

      boxsBoundPoints.forEach((point: IPoint) => {
        xArr.push(point.x)
        yArr.push(point.y)
      })

      const minX = Math.min(...xArr)
      const minY = Math.min(...yArr)
      const maxX = Math.max(...xArr)
      const maxY = Math.max(...yArr)

      rangeData.x = minX
      rangeData.y = minY
      rangeData.w = maxX - minX
      rangeData.h = maxY - minY
      rangeData.a = 0
      rangeData.s = 1
    }

    return rangeData
  }

  /**
   * 获取元素适配器属性
   */
  getAdapter(boxs: Box[]): {dragType: string; canRotate: boolean; canLink: boolean} {
    let dragType: string = 'free'
    let canRotate: boolean = true
    let canLink: boolean = true

    if (boxs.length <= 1) {
      boxs.forEach((box: Box) => {
        const adapter = box.adapter

        dragType = adapter.dragType
        canRotate = adapter.canRotate
        canLink = adapter.canLink
      })
    } else {
      boxs.forEach((box: Box) => {
        const adapter = box.adapter

        if (adapter.dragType === 'scale') {
          dragType = 'scale'
        }

        if (!adapter.canRotate) {
          canRotate = false
        }
      })

      canLink = false
    }

    return {
      dragType,
      canRotate,
      canLink,
    }
  }
}

export default Selection
