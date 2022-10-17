import * as PIXI from 'pixi.js'
import { Viewport } from 'pixi-viewport'

class Whiteboard {


  constructor () {

  }

  init () {
    this.initViewport('whiteboard-viewport');
  }

  initViewport (viewportElementId: string) {
    const app = new PIXI.Application();
    (document.getElementById(viewportElementId) as HTMLElement).appendChild(app.view)

    // create viewport
    const viewport = new Viewport({
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      worldWidth: 1000,
      worldHeight: 1000,
      interaction: app.renderer.plugins.interaction
    })

    // add the viewport to the stage
    app.stage.addChild(viewport)

    // activate plugins
    viewport
      .drag()
      .pinch()
      .wheel()
      .decelerate()
  }
}

export default Whiteboard;
