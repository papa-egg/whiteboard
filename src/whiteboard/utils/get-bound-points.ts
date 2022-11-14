import getAngle from './get-angle'
import getStraightDistance from './get-straight-distance'
import getJoinPoint from './get-join-point'

interface IPoint {
  x: number
  y: number
}

/**
 * 获取最终边框点坐标——旋转后
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 * @param {number} a
 */
const getBoundPoints = (x: number, y: number, w: number, h: number, a: number): IPoint[] => {
  const boundPoints = [
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

  if (a === 0) {
    return boundPoints
  } else {
    return boundPoints.map((point: IPoint) => {
      const centerPoint: IPoint = {x, y}
      const distance = getStraightDistance(point, centerPoint)
      const angle = a + getAngle(centerPoint, point)
      const endPoint = getJoinPoint(distance, angle, centerPoint)

      return endPoint
    })
  }
}

export default getBoundPoints
