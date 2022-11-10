import intersects from './intersects'

interface IPoint {
  x: number
  y: number
}

/**
 * 判断点是否在多边形内
 * @param {point} point
 * @param {points[]} points
 * @returns {boolean}
 */
const isPointInPolygon = (point: IPoint, points: IPoint[]): boolean => {
  const polygon: number[] = []
  points.forEach((point: {x: number; y: number}) => {
    polygon.push(point.x, point.y)
  })

  return isPointInPoly(point, points)

  // return intersects.polygonPoint(polygon, point.x, point.y)

  // TODO：intersects组件库判断有误差
  function isPointInPoly(pt: IPoint, poly: IPoint[]) {
    for (var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
      ((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y)) &&
        pt.x < ((poly[j].x - poly[i].x) * (pt.y - poly[i].y)) / (poly[j].y - poly[i].y) + poly[i].x &&
        (c = !c)
    return c
  }
}

export default isPointInPolygon
