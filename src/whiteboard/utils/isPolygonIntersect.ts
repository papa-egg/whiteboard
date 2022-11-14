import intersects from './intersects'

interface IPoint {
  x: number
  y: number
}

/**
 * 判断两多边形是否相交
 * @param {IPoint[]} clipPolygon
 * @param {IPoint[]} subPolygon
 * @returns {boolean}
 */
const isPolygonIntersect = (clipPoints: IPoint[], subPoints: IPoint[]): boolean => {
  const clipPolygon: number[] = []
  const subPolygon: number[] = []

  clipPoints.forEach((point: IPoint) => {
    clipPolygon.push(point.x, point.y)
  })

  subPoints.forEach((point: IPoint) => {
    subPolygon.push(point.x, point.y)
  })

  return intersects.polygonPolygon(clipPolygon, subPolygon)
}

export default isPolygonIntersect
