import getBoundByPoints from './get-bound-by-points'

interface IPoint {
  x: number
  y: number
}

interface IRangeData {
  x: number
  y: number
  w: number
  h: number
  a: number
  s: number
}

interface ITransformOptions {
  rangeStatus: string // move drag scale
  startPoint: IPoint
  endPoint: IPoint
  startRangeData: IRangeData
  pointerIndex?: number
  dragType?: string
}

/**
 * 获取对角点
 */
const getOppositePoint = (pointerIndex: number, rangeData: IRangeData) => {
  let oppositePoint: IPoint = {x: 0, y: 0}
  const {x, y, w, h, a, s} = rangeData
  const rangePoints: IPoint[] = [
    {
      x: x - w / 2,
      y: y - h / 2,
    },
    {
      x: x + w / 2,
      y: y - h / 2,
    },
    {
      x: x + w / 2,
      y: y + h / 2,
    },
    {
      x: x - w / 2,
      y: y + h / 2,
    },
  ]

  switch (pointerIndex) {
    case 1: {
      oppositePoint = rangePoints[2]
      break
    }
    case 2: {
      oppositePoint = rangePoints[3]
      break
    }
    case 3: {
      oppositePoint = rangePoints[0]
      break
    }
    case 4: {
      oppositePoint = rangePoints[1]
      break
    }
  }

  return oppositePoint
}

/**
 * 变换计算
 */
const getTransformRangeData = (transformOptions: ITransformOptions) => {
  console.log(transformOptions)

  const {rangeStatus, startPoint, endPoint, startRangeData, pointerIndex, dragType} = transformOptions
  const endRangeData = Object.assign({}, startRangeData)
  const {x, y, w, h, a, s} = startRangeData

  // 宽高比
  const ratioX = w / (w + h)
  const ratioY = 1 - ratioX

  console.log(ratioX)
  console.log(ratioY)

  // 平移
  if (rangeStatus === 'move') {
    endRangeData.x += endPoint.x - startPoint.x
    endRangeData.y += endPoint.y - startPoint.y
  }

  // 拖拽辅助点
  if (rangeStatus === 'drag' && pointerIndex && dragType) {
    const oppositePoint: IPoint = getOppositePoint(pointerIndex, startRangeData)

    // 等比例拉伸
    if (dragType === 'scale') {
      // 偏移量总和
      let sumOffset: number = 0
      let dragPoint: IPoint = {x: 0, y: 0}

      if (pointerIndex === 1 || pointerIndex === 3) {
        sumOffset = endPoint.x - startPoint.x + (endPoint.y - startPoint.y)
        dragPoint = {
          x: startPoint.x + sumOffset * 0.5,
          y: startPoint.y + sumOffset * 0.5,
        }
      } else {
        sumOffset = endPoint.x - startPoint.x - (endPoint.y - startPoint.y)
        dragPoint = {
          x: startPoint.x + sumOffset * 0.5,
          y: startPoint.y - sumOffset * 0.5,
        }
      }

      console.log('dragPoint', dragPoint)

      const {x, y, w, h} = getBoundByPoints([dragPoint, oppositePoint])

      endRangeData.x = x
      endRangeData.y = y
      endRangeData.w = w
      endRangeData.h = h

      console.log(endRangeData)
    }
  }

  return endRangeData
}

export default getTransformRangeData
