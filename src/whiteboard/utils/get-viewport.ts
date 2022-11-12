/**
 * 获取试图
 * @returns {PIXI-Viewport}
 */
const getViewport = (): any => {
  const WD = (window as any).WD

  return WD.viewport
}

export default getViewport
