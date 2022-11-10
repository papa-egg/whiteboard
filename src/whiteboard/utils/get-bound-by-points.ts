interface IPoint {
  x: number
  y: number
}

interface IBound {
  x: number
  y: number
  w: number
  h: number
}

/**
 * 传入任意点，返回包含所有点的矩型框
 * @param {IPoint[]} points
 * @returns {IBound}
 */
const getBoundByPoints = (points: IPoint[]): IBound => {
  const xArr: number[] = []
  const yArr: number[] = []

  points.forEach((point: IPoint) => {
    xArr.push(point.x)
    yArr.push(point.y)
  })

  const minX = Math.min(...xArr)
  const minY = Math.min(...yArr)
  const maxX = Math.max(...xArr)
  const maxY = Math.max(...yArr)

  return {
    x: (minX + maxX) / 2,
    y: (minY + maxY) / 2,
    w: maxX - minX,
    h: maxY - minY,
  }
}

export default getBoundByPoints
