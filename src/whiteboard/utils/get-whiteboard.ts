/**
 * 获取白板
 * @returns {PIXI-Viewport}
 */
const getWhiteboard = (): any => {
  const WD = (window as any).WD

  return WD
}

export default getWhiteboard
