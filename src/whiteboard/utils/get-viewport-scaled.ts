/**
 * 获取当前试图缩放比例
 * @returns {number}
 */
const getViewportScaled = (): number => {
  const WD = (window as any).WD

  return WD.viewport.scaled
}

export default getViewportScaled
