import {useState} from 'react'
import {Tooltip} from 'antd'
import './toolComponent.scss'

const ToolComponent = () => {
  const [toolType, setToolType] = useState('')

  const toolSelect = (toolType) => {
    setToolType(toolType)

    if (window.WD) {
      window.WD.tool.updateToolType(toolType)
    }
  }

  return (
    <div className="tool-bar">
      <ul className="tool-list">
        <li
          onClick={() => {
            toolSelect('pointer')
          }}
          className={toolType === 'pointer' ? 'selected' : ''}
        >
          <Tooltip placement="right" title="选择">
            <i className="iconfont icon-xuanze"></i>
          </Tooltip>
        </li>
        <li
          onClick={() => {
            toolSelect('pencil')
          }}
          className={toolType === 'pencil' ? 'selected' : ''}
        >
          <Tooltip placement="right" title="画笔">
            <i className="iconfont icon-wenben"></i>
          </Tooltip>
        </li>
        <li
          onClick={() => {
            toolSelect('note')
          }}
          className={toolType === 'note' ? 'selected' : ''}
        >
          <Tooltip placement="right" title="便利贴">
            <i className="iconfont icon-note"></i>
          </Tooltip>
        </li>
        <li
          onClick={() => {
            toolSelect('circle')
          }}
          className={toolType === 'circle' ? 'selected' : ''}
        >
          <Tooltip placement="right" title="圆形">
            <i className="iconfont icon-yuanxingweixuanzhong"></i>
          </Tooltip>
        </li>
        <li
          onClick={() => {
            toolSelect('rectangle')
          }}
          className={toolType === 'rectangle' ? 'selected' : ''}
        >
          <Tooltip placement="right" title="矩型">
            <i className="iconfont icon-checkbox-weixuan"></i>
          </Tooltip>
        </li>
        <li
          onClick={() => {
            toolSelect('rounded-rectangle')
          }}
          className={toolType === 'rounded-rectangle' ? 'selected' : ''}
        >
          <Tooltip placement="right" title="圆角矩型">
            <i className="iconfont icon-checkbox"></i>
          </Tooltip>
        </li>
        <li
          onClick={() => {
            toolSelect('triangle')
          }}
          className={toolType === 'triangle' ? 'selected' : ''}
        >
          <Tooltip placement="right" title="等腰三角形">
            <i className="iconfont icon-xingzhuang-sanjiaoxing"></i>
          </Tooltip>
        </li>
        <li
          onClick={() => {
            toolSelect('line')
          }}
          className={toolType === 'line' ? 'selected' : ''}
        >
          <Tooltip placement="right" title="线段">
            <i className="iconfont icon-xianduan"></i>
          </Tooltip>
        </li>
        <li
          onClick={() => {
            toolSelect('frame')
          }}
          className={toolType === 'frame' ? 'selected' : ''}
        >
          <Tooltip placement="right" title="画框">
            <i className="iconfont icon-frame"></i>
          </Tooltip>
        </li>
        <li
          onClick={() => {
            toolSelect('picture')
          }}
          className={toolType === 'picture' ? 'selected' : ''}
        >
          <Tooltip placement="right" title="上传图片">
            <i className="iconfont icon-shangchuandaochu"></i>
          </Tooltip>
        </li>
      </ul>
    </div>
  )
}

export default ToolComponent
