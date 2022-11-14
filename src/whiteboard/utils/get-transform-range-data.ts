import getBoundByPoints from './get-bound-by-points'
import getAngle from './get-angle'

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

// 获取旋转角度值
const getRotateAngle = (px: number, py: number, mx: number, my: number): number => {
  const x: number = Math.abs(px - mx)
  const y: number = Math.abs(py - my)
  const z: number = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
  const cos: number = y / z
  const radina: number = Math.acos(cos)
  let angle: number = Math.floor(180 / (Math.PI / radina))

  if (mx > px && my > py) {
    angle = 180 - angle
  }

  if (mx == px && my > py) {
    angle = 180
  }

  if (mx > px && my == py) {
    angle = 90
  }

  if (mx < px && my > py) {
    angle = 180 + angle
  }

  if (mx < px && my == py) {
    angle = 270
  }

  if (mx < px && my < py) {
    angle = 360 - angle
  }

  return angle
}

// 获取辅助点坐标
const getAuxPoint = (pointerIndex: number, rangeData: IRangeData) => {
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

  return rangePoints[pointerIndex - 1]
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
  const {rangeStatus, startPoint, endPoint, startRangeData, pointerIndex, dragType} = transformOptions
  const endRangeData = Object.assign({}, startRangeData)
  const {x, y, w, h, a, s} = startRangeData

  // 宽高比
  const ratioX = w / (w + h)
  const ratioY = 1 - ratioX

  // 平移
  if (rangeStatus === 'move') {
    endRangeData.x += endPoint.x - startPoint.x
    endRangeData.y += endPoint.y - startPoint.y
  }

  // 旋转
  if (rangeStatus === 'rotate') {
    const angle = getRotateAngle(endPoint.x, endPoint.y, x, y) || 0

    endRangeData.a = angle
  }

  // 拖拽辅助点
  if (rangeStatus === 'drag' && pointerIndex && dragType) {
    const oppositePoint: IPoint = getOppositePoint(pointerIndex, startRangeData)

    // 等比例拉伸
    if (dragType === 'scale') {
      // 偏移量总和
      const auxPoint = getAuxPoint(pointerIndex, startRangeData)
      let sumOffset: number = 0
      let dragPoint: IPoint = {x: 0, y: 0}

      if (pointerIndex === 1 || pointerIndex === 3) {
        sumOffset = endPoint.x - startPoint.x + (endPoint.y - startPoint.y)
        dragPoint = {
          x: auxPoint.x + sumOffset * ratioX,
          y: auxPoint.y + sumOffset * ratioY,
        }
      } else {
        sumOffset = endPoint.x - startPoint.x - (endPoint.y - startPoint.y)
        dragPoint = {
          x: auxPoint.x + sumOffset * ratioX,
          y: auxPoint.y - sumOffset * ratioY,
        }
      }

      const {x, y, w, h} = getBoundByPoints([dragPoint, oppositePoint])
      endRangeData.x = x
      endRangeData.y = y
      endRangeData.w = w
      endRangeData.h = h
    }
  }

  return endRangeData
}

export default getTransformRangeData
