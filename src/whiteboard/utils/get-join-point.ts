interface IPoint {
  x: number
  y: number
}

/**
 * 求出绕原某点旋转n度所得点坐标
 * @param {number} r
 * @param {number} angle
 * @param {point} pt
 * @returns {point}
 */
const getJoinPoint = (r: number, angle: number, pt: IPoint): IPoint => {
  const centrifugal = Math.atan2(r * Math.sin((angle * Math.PI) / 180), r * Math.cos((angle * Math.PI) / 180))

  return {
    x: r * Math.cos(centrifugal) + pt.x,
    y: r * Math.sin(centrifugal) + pt.y,
  }
}

export default getJoinPoint
