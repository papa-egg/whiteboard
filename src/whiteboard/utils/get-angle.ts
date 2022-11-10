interface IPoint {
  x: number
  y: number
}

/**
 * 获取两点之间角度值
 * @param {Point} start
 * @param {Point} end
 * @returns {number} angle
 */
const getAngle = (start: IPoint, end: IPoint): number => {
  const diff_x: number = end.x - start.x
  const diff_y: number = end.y - start.y

  return (Math.atan2(diff_y, diff_x) * 180) / Math.PI
}

export default getAngle
