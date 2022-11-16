import {IBox} from '../../interface/box'
import Note from '../widget/note/note'
import getAdapter from '../adapter/adapter'
import Circle from '../widget/circle/circle'
import Rectangle from '../widget/rectangle/rectangle'
import RoundedRectangle from '../widget/rounded-rectangle/rounded-rectangle'
import Triangle from '../widget/triangle/triangle'
import Pencil from '../widget/pencil/pencil'

/**
 * 元素实例
 */
class Box {
  public id: string = ''
  public type: string = ''
  public layer: number = 0 // 层级大小
  public locked: boolean = false // 是否锁定

  public instance: any // 图形元素实例
  public widget: any // 图形元素
  public adapter: any // 适配器属性，供range调用

  constructor(boxOptions: IBox) {
    const {id, type, layer, locked} = boxOptions

    this.id = id
    this.type = type
    this.layer = layer
    this.locked = locked

    this.instance = this.getInstanceByType(this.type)
    this.adapter = getAdapter(type)
  }

  /**
   * 创建图形元素，并将元素渲染到容器
   * @param {any} widgetOptions
   */
  createWidget(widgetOptions: any) {
    this.widget = new this.instance(widgetOptions)

    return this.widget
  }

  /**
   * 通过type类型，判断当前采用哪个图形实例
   * @param {string} type
   * @return {any} widgetInstance
   */
  getInstanceByType(type: string): any {
    let instance = null

    switch (type) {
      case 'note': {
        instance = Note

        break
      }

      case 'circle': {
        instance = Circle

        break
      }

      case 'rectangle': {
        instance = Rectangle

        break
      }

      case 'rounded-rectangle': {
        instance = RoundedRectangle

        break
      }

      case 'triangle': {
        instance = Triangle

        break
      }

      case 'pencil': {
        instance = Pencil

        break
      }
    }

    if (instance) {
      return instance
    } else {
      // 实例获取失败直接抛出错误，不做进一步处理
      throw new Error('Failed to get the widget instance, and the current type value is: ' + type)
    }
  }
}

export default Box
