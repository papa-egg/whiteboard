import intersects from './intersects'

interface IPoint {
  x: number
  y: number
}

/**
 * 判断多边形和线段是否相交
 * @param {IPoint[]} polygon
 * @param {IPoint[]} pathPoints
 * @param {number} strokeWidth
 * @returns {boolean}
 */
const isPolygonLineIntersect = (polygon: IPoint[], pathPoints: IPoint[], strokeWidth: number): boolean => {
  let isIntersectsflag = false

  pathPoints.forEach((point: IPoint, index: number) => {
    if (index > 0) {
      const startPoint: IPoint = pathPoints[index - 1]
      const endPoint: IPoint = pathPoints[index]
      const polygonArr: number[] = []

      polygon.forEach((point: IPoint) => {
        polygonArr.push(point.x, point.y)
      })

      if (intersects.polygonLine(polygonArr, startPoint.x, startPoint.y, endPoint.x, endPoint.y, strokeWidth)) {
        isIntersectsflag = true
      }
    }
  })

  return isIntersectsflag
}

export default isPolygonLineIntersect
