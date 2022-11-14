import getAngle from './get-angle'
import getStraightDistance from './get-straight-distance'
import getJoinPoint from './get-join-point'

interface IPoint {
  x: number
  y: number
}

/**
 * 已知两点，和角度求出旋转后的坐标值
 * @param {number} r
 * @param {number} angle
 * @param {point} pt
 * @returns {point}
 */
const getRotatedPoint = (startPoint: IPoint, endPoint: IPoint, angle: number): IPoint => {
  const distance = getStraightDistance(startPoint, endPoint)
  const a = angle + getAngle(startPoint, endPoint)
  return getJoinPoint(distance, a, startPoint)
}

export default getRotatedPoint
