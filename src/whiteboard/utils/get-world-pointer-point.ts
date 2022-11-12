interface IPoint {
  x: number
  y: number
}

/**
 * 获取当前鼠标世界坐标
 * @returns {IPoint}
 */
const getWorldPointerPoint = (): IPoint => {
  const WD = (window as any).WD
  const {worldX, worldY} = WD

  return {
    x: worldX,
    y: worldY,
  }
}

export default getWorldPointerPoint
