import Box from '../box/box'
import Range from '../range/range'
import getAngle from '../utils/get-angle'
import getBoundPoints from '../utils/get-bound-points'
import getJoinPoint from '../utils/get-join-point'
import getStraightDistance from '../utils/get-straight-distance'

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
    this.rangeData = this.getRangeData(this.boxs)
    this.adapter = this.getAdapter(this.boxs)

    this.range = new Range({
      boxs: this.boxs,
      selection: this,
      rangeData: this.rangeData,
      adapter: this.adapter,
    })
  }

  transform(options: any) {
    if (!this.rangeData || !this.range) return
    const {rangeStatus, dx, dy, rangeData, pathPoints} = options
    const startRangeData = this.rangeData

    switch (rangeStatus) {
      case 'move': {
        this.range?.update(rangeData)

        const dx = rangeData.x - startRangeData.x
        const dy = rangeData.y - startRangeData.y

        this.boxs.forEach((box: Box) => {
          const {x, y, w, h, a, s} = box.widget
          box.widget.move(dx, dy)

          this.range?.updateBoxRange(box.id, {
            x: x + dx,
            y: y + dy,
            w,
            h,
            a,
            s,
          })
        })

        break
      }

      case 'moveEnd': {
        this.rangeData = Object.assign({}, this.range.rangeData)

        this.boxs.forEach((box: Box) => {
          box.widget.moveEnd()

          if (this.adapter.dragType === 'point' && this.range) {
            this.range.pathBasicPoints = JSON.parse(JSON.stringify(box.widget.pathPoints))
          }
        })

        break
      }

      case 'rotate': {
        this.boxs.forEach((box: Box) => {
          const distance = getStraightDistance({x: startRangeData.x, y: startRangeData.y}, {x: box.widget.x, y: box.widget.y})
          const angle = getAngle({x: startRangeData.x, y: startRangeData.y}, {x: box.widget.x, y: box.widget.y}) + rangeData.a - startRangeData.a
          const rotatedPoint = getJoinPoint(distance, angle, {x: rangeData.x, y: rangeData.y})

          box.widget.rotate({
            x: rotatedPoint.x,
            y: rotatedPoint.y,
            a: rangeData.a - startRangeData.a + box.widget.a,
            rotatePoint: {
              x: rangeData.x,
              y: rangeData.y,
            },
          })

          if (box.adapter.dragType === 'point') {
            const {x, y, w, h, a, s} = box.widget
            this.range?.updateBoxRange(box.id, {
              x,
              y,
              w,
              h,
              a: 0,
              s: 1,
            })
          } else {
            const {x, y, w, h, a, s} = box.widget
            this.range?.updateBoxRange(box.id, {
              x: rotatedPoint.x,
              y: rotatedPoint.y,
              w,
              h,
              a: rangeData.a - startRangeData.a + box.widget.a,
              s,
            })
          }
        })

        this.range?.update(rangeData)

        break
      }

      case 'rotateEnd': {
        this.rangeData = Object.assign({}, this.range.rangeData)

        this.boxs.forEach((box: Box) => {
          box.widget.rotateEnd()

          if (this.adapter.dragType === 'point' && this.range) {
            this.range.pathBasicPoints = JSON.parse(JSON.stringify(box.widget.pathPoints))
          }
        })

        break
      }

      case 'drag': {
        if (this.adapter.dragType === 'scale') {
          // ???????????????
          const scaled = rangeData.w / startRangeData.w

          this.boxs.forEach((box: Box) => {
            const distance = getStraightDistance({x: startRangeData.x, y: startRangeData.y}, {x: box.widget.x, y: box.widget.y}) * scaled
            const angle = getAngle({x: startRangeData.x, y: startRangeData.y}, {x: box.widget.x, y: box.widget.y})
            const dragedPoint = getJoinPoint(distance, angle, {x: rangeData.x, y: rangeData.y})

            box.widget.drag({
              dragType: 'scale',
              x: dragedPoint.x,
              y: dragedPoint.y,
              w: box.widget.w * scaled,
              h: box.widget.h * scaled,
            })

            const {x, y, w, h, a, s} = box.widget
            this.range?.updateBoxRange(box.id, {
              x: dragedPoint.x,
              y: dragedPoint.y,
              w: box.widget.w * scaled,
              h: box.widget.h * scaled,
              a,
              s,
            })
          })
        } else if (this.adapter.dragType === 'free') {
          // ????????????
          this.boxs.forEach((box: Box) => {
            box.widget.drag({
              dragType: 'free',
              x: rangeData.x,
              y: rangeData.y,
              w: rangeData.w,
              h: rangeData.h,
            })

            const {x, y, w, h, a, s} = box.widget
            this.range?.updateBoxRange(box.id, {
              x: rangeData.x,
              y: rangeData.y,
              w: rangeData.w,
              h: rangeData.h,
              a,
              s,
            })
          })
        } else if (this.adapter.dragType === 'point') {
          this.boxs.forEach((box: Box) => {
            box.widget.drag({
              dragType: 'point',
              x: rangeData.x,
              y: rangeData.y,
              w: rangeData.w,
              h: rangeData.h,
              pathPoints: pathPoints,
            })

            const {x, y, w, h, a, s} = box.widget
            this.range?.updateBoxRange(box.id, {
              x: rangeData.x,
              y: rangeData.y,
              w: rangeData.w,
              h: rangeData.h,
              a,
              s,
            })
          })
        }

        this.range?.update(rangeData)

        break
      }

      case 'dragEnd': {
        this.rangeData = Object.assign({}, this.range.rangeData)

        this.boxs.forEach((box: Box) => {
          box.widget.dragEnd()

          if (this.adapter.dragType === 'point' && this.range) {
            this.range.pathBasicPoints = JSON.parse(JSON.stringify(box.widget.pathPoints))
          }
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
   * ???????????????
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

    // ??????????????????????????????????????????x,y?????????
    if (boxs.length <= 1) {
      const {x, y, w, h, a, s} = boxs[0].widget

      rangeData.x = x
      rangeData.y = y
      rangeData.w = w
      rangeData.h = h
      rangeData.a = a
      rangeData.s = s
    } else {
      // ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
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

      rangeData.x = minX + (maxX - minX) / 2
      rangeData.y = minY + (maxY - minY) / 2
      rangeData.w = maxX - minX
      rangeData.h = maxY - minY
      rangeData.a = 0
      rangeData.s = 1
    }

    return rangeData
  }

  /**
   * ???????????????????????????
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

        dragType = 'scale'
        canRotate = true
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
