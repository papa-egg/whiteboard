import getBoundByPoints from './get-bound-by-points'
import getAngle from './get-angle'
import getStraightDistance from './get-straight-distance'
import getJoinPoint from './get-join-point'
import getRotatedPoint from './get-roteted-point'
import getBoundPoints from './get-bound-points'

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
  handlerPoints?: IPoint[]
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
  const rangePoints: IPoint[] = getBoundPoints(x, y, w, h, a)

  return rangePoints[pointerIndex - 1]
}

/**
 * 转换成旋转角度为0时坐标
 */
const toBeforeRotatedPoint = (startPoint: IPoint, centerPoint: IPoint, a: number) => {
  const distance = getStraightDistance(startPoint, centerPoint)
  const angle = getAngle(centerPoint, startPoint) - a
  return getJoinPoint(distance, angle, centerPoint)
}

/**
 * 获取对角点
 */
const getOppositePoint = (pointerIndex: number, rangeData: IRangeData) => {
  let oppositePoint: IPoint = {x: 0, y: 0}
  const {x, y, w, h, a, s} = rangeData
  const rangePoints: IPoint[] = getBoundPoints(x, y, w, h, a)

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
  const {rangeStatus, startPoint, endPoint, startRangeData, pointerIndex, dragType, handlerPoints = []} = transformOptions
  const endRangeData = Object.assign({}, startRangeData)
  const {x, y, w, h, a, s} = startRangeData
  const pathPoints: IPoint[] = JSON.parse(JSON.stringify(handlerPoints))

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
  if (rangeStatus === 'drag' && pointerIndex !== undefined && dragType) {
    const oppositePoint: IPoint = getOppositePoint(pointerIndex, startRangeData)
    const auxPoint = getAuxPoint(pointerIndex, startRangeData)

    // 等比例拖拽
    if (dragType === 'scale') {
      const centerPoint = {x: startRangeData.x, y: startRangeData.y}
      const auxBeforeRotatedPoint = toBeforeRotatedPoint(auxPoint, centerPoint, startRangeData.a)
      const oppositeBeforeRotatedPoint = toBeforeRotatedPoint(oppositePoint, centerPoint, startRangeData.a)
      const endBeforeRotatedPoint = toBeforeRotatedPoint(endPoint, centerPoint, startRangeData.a)
      const startBeforeRotatedPoint = toBeforeRotatedPoint(startPoint, centerPoint, startRangeData.a)
      let sumOffset: number = 0 // 偏移量总和
      let dragPoint: IPoint = {x: 0, y: 0}

      if (pointerIndex === 1 || pointerIndex === 3) {
        sumOffset = endBeforeRotatedPoint.x - startBeforeRotatedPoint.x + (endBeforeRotatedPoint.y - startBeforeRotatedPoint.y)
        dragPoint = {
          x: auxBeforeRotatedPoint.x + sumOffset * ratioX,
          y: auxBeforeRotatedPoint.y + sumOffset * ratioY,
        }
      } else {
        sumOffset = endBeforeRotatedPoint.x - startBeforeRotatedPoint.x - (endBeforeRotatedPoint.y - startBeforeRotatedPoint.y)
        dragPoint = {
          x: auxBeforeRotatedPoint.x + sumOffset * ratioX,
          y: auxBeforeRotatedPoint.y - sumOffset * ratioY,
        }
      }

      const {x, y, w, h} = getBoundByPoints([dragPoint, oppositeBeforeRotatedPoint])
      const boundPoints: IPoint[] = getBoundPoints(x, y, w, h, startRangeData.a)
      const isOpposite: boolean = endBeforeRotatedPoint.x > oppositeBeforeRotatedPoint.x
      let comparePoint: IPoint = {x: 0, y: 0}

      switch (pointerIndex) {
        case 1: {
          comparePoint = isOpposite ? boundPoints[0] : boundPoints[2]
          break
        }
        case 2: {
          comparePoint = !isOpposite ? boundPoints[1] : boundPoints[3]
          break
        }
        case 3: {
          comparePoint = isOpposite ? boundPoints[0] : boundPoints[2]
          break
        }
        case 4: {
          comparePoint = isOpposite ? boundPoints[3] : boundPoints[1]
          break
        }
      }

      endRangeData.x = x + oppositePoint.x - comparePoint.x
      endRangeData.y = y + oppositePoint.y - comparePoint.y
      endRangeData.w = w
      endRangeData.h = h

      // 自由拖拽
    } else if (dragType === 'free') {
      const endDragPoint: IPoint = {
        x: auxPoint.x + endPoint.x - startPoint.x,
        y: auxPoint.y + endPoint.y - startPoint.y,
      }

      const centerPoint = {
        x: (endDragPoint.x + oppositePoint.x) / 2,
        y: (endDragPoint.y + oppositePoint.y) / 2,
      }

      endRangeData.x = (endDragPoint.x + oppositePoint.x) / 2
      endRangeData.y = (endDragPoint.y + oppositePoint.y) / 2

      const endDragBeforeRotatedPoint: IPoint = toBeforeRotatedPoint(endDragPoint, centerPoint, startRangeData.a)
      const oppositeBeforeRotatedPoint: IPoint = toBeforeRotatedPoint(oppositePoint, centerPoint, startRangeData.a)

      const {w, h} = getBoundByPoints([endDragBeforeRotatedPoint, oppositeBeforeRotatedPoint])

      endRangeData.w = w
      endRangeData.h = h
    } else if (dragType === 'point') {
      // 拖拽端点——线段
      const dx = endPoint.x - startPoint.x
      const dy = endPoint.y - startPoint.y

      pathPoints[pointerIndex].x += dx
      pathPoints[pointerIndex].y += dy

      const {x, y, w, h} = getBoundByPoints(pathPoints)

      endRangeData.x = x
      endRangeData.y = y
      endRangeData.w = w
      endRangeData.h = h
    }
  }

  return {
    endRangeData: endRangeData,
    pathPoints: pathPoints,
  }
}

export default getTransformRangeData
