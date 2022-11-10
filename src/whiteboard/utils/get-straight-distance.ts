interface IPoint {
  x: number
  y: number
}

/**
 * 获取两点之间直线距离
 * @param {Point} start
 * @param {Point} end
 * @returns {number} distance
 */
const getStraightDistance = (start: IPoint, end: IPoint): number => {
  const diff_x: number = end.x - start.x
  const diff_y: number = end.y - start.y

  return Math.sqrt(diff_x * diff_x + diff_y * diff_y)
}

export default getStraightDistance
