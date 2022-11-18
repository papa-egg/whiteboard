import intersects from './intersects'

interface IPoint {
  x: number
  y: number
}

/**
 * 判断点是否在线段内
 * @param {point} point
 * @param {points[]} pathPoints
 * @param {number} strokeWidth
 * @returns {boolean}
 */
const isPointInLine = (point: IPoint, pathPoints: IPoint[], strokeWidth: number): boolean => {
  let isIntersectsflag = false

  pathPoints.forEach((endPoint: IPoint, index: number) => {
    if (index > 0) {
      const startPoint: IPoint = pathPoints[index - 1]

      if (intersects.pointLine(point.x, point.y, startPoint.x, startPoint.y, endPoint.x, endPoint.y)) {
        isIntersectsflag = true
      }
      // if (intersects.circleLine(point.x, point.y, strokeWidth + 10, startPoint.x, startPoint.y, endPoint.x, endPoint.y)) {
      //   isIntersectsflag = true
      // }
    }
  })

  return isIntersectsflag
}

export default isPointInLine
