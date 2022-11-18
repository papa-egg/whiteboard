import getViewport from '../utils/get-viewport'
import {nanoid} from 'nanoid'
import Box from '../box/box'
import {Viewport} from 'pixi-viewport'

/**
 * 元素工厂
 */
class Factory {
  public viewport: Viewport
  public boxs: Box[] = []

  constructor() {
    this.viewport = getViewport()
  }

  // 创建元素
  createBox(boxInfo: any) {
    const {type} = boxInfo
    const widgetdefaultInfo = this.getWidgetDefaultInfo(type)
    boxInfo.widget = Object.assign(widgetdefaultInfo, boxInfo.widget)
    const finalBoxInfo = Object.assign(
      {
        id: nanoid(),
        layer: 0,
        locked: false,
      },
      boxInfo
    )

    const box = new Box(finalBoxInfo)
    box.createWidget(finalBoxInfo.widget)
    this.viewport?.addChild(box.widget.sprite)
    this.boxs.push(box)

    return box
  }

  // 删除元素
  destroyBox(id: string) {
    let delBox: any = undefined
    let delBoxIndex: number = -1

    this.boxs.forEach((box: Box, index: number) => {
      if (box.id === id) {
        delBox = box
        delBoxIndex = index
      }
    })

    if (delBox && delBoxIndex > -1) {
      this.boxs.splice(delBoxIndex, 1)
      this.viewport?.removeChild(delBox?.widget.sprite)
    }
  }

  // 获取widget默认配置
  getWidgetDefaultInfo(type: string) {
    const defaultInfo: any = {
      x: 0,
      y: 0,
      w: 0,
      h: 0,
      a: 0,
      s: 1,
    }

    switch (type) {
      case 'note': {
        defaultInfo.w = 200
        defaultInfo.h = 200
        defaultInfo.noteColor = 0xf1a869

        break
      }

      case 'circle': {
        defaultInfo.w = 100
        defaultInfo.h = 100
        defaultInfo.borderColor = 0x000000
        defaultInfo.borderWidth = 2
        defaultInfo.backgroundColor = 'transparent'

        break
      }

      case 'rectangle': {
        defaultInfo.w = 100
        defaultInfo.h = 100
        defaultInfo.borderColor = 0x000000
        defaultInfo.borderWidth = 2
        defaultInfo.backgroundColor = 'transparent'

        break
      }

      case 'rounded-rectangle': {
        defaultInfo.w = 100
        defaultInfo.h = 100
        defaultInfo.borderColor = 0x000000
        defaultInfo.borderWidth = 2
        defaultInfo.backgroundColor = 'transparent'

        break
      }

      case 'triangle': {
        defaultInfo.w = 100
        defaultInfo.h = 100
        defaultInfo.borderColor = 0x000000
        defaultInfo.borderWidth = 2
        defaultInfo.backgroundColor = 'transparent'

        break
      }

      case 'pencil': {
        defaultInfo.strokeColor = 0x000000
        defaultInfo.strokeWidth = 2
        defaultInfo.pathPoints = []

        break
      }
    }

    return defaultInfo
  }
}

export default Factory
