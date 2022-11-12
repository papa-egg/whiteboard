import getWorldPointerPoint from './get-world-pointer-point'

interface IPoint {
  x: number
  y: number
}

/**
 * 获取当前鼠标窗口坐标
 * @returns {IPoint}
 */
const getScreenPointerPoint = (): IPoint => {
  const WD = (window as any).WD
  const worldPointer = getWorldPointerPoint()
  return WD.viewport.toScreen(worldPointer)
}

export default getScreenPointerPoint
