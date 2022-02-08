/// <reference types="nodecg-types/types/browser" />

import * as PIXI from "pixi.js"
// import { PrivateMessage } from "@twurple/chat"
import { gsap } from "gsap"
import CSSRulePlugin from "gsap/CSSRulePlugin"
import PixiPlugin from "gsap/PixiPlugin"
import TextPlugin from "gsap/TextPlugin"
PixiPlugin.registerPIXI(PIXI)
gsap.registerPlugin(CSSRulePlugin, PixiPlugin, TextPlugin)

declare global {
  interface Window {
    __PIXI_INSPECTOR_GLOBAL_HOOK__: { register: Function }
  }
}

// window.__PIXI_INSPECTOR_GLOBAL_HOOK__ && window.__PIXI_INSPECTOR_GLOBAL_HOOK__.register({ PIXI: P })

// Aliases
const Application = PIXI.Application,
  Container = PIXI.Container,
  Text = PIXI.Text,
  loader = PIXI.Loader.shared,
  resources = PIXI.Loader.shared.resources,
  Sprite = PIXI.Sprite

declare global {
  interface Window {
    q: string[]
  }
}

const options = nodecg.Replicant<OptionsValue>("options")
var q = []
window.q = q

// The application will create a renderer using WebGL, if possible,0
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container
const app = new Application({
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundAlpha: 0,
  antialias: true,
  resolution: 1,
})

// The application will create a canvas element for you that you
// can then insert into the DOM
document.body.appendChild(app.view)
// NodeCG.waitForReplicants().then(() => {
//   peepoURL = peepo.value.find((v) => v.ext === ".json").url
//   PIXI.Loader.shared.add(peepoURL).load(setup)
// })

function setup() {

  // Add peepo & text to stage
  // app.stage.addChild(peepoSprite, talkingText)
  app.ticker.minFPS = 10
  app.ticker.maxFPS = 60


  app.ticker.add(draw) //.add(textFadeOut);

  NodeCG.waitForReplicants(options).then(() => {
    onOptionsChanged(options.value)
  })

}

let elapsed = 0.0
function draw(deltaTime: number) {
  elapsed += deltaTime
}


window.addEventListener("click", function (event) {
  q.push("That Tickles, bitch!")
})

interface OptionsValue {
  peepoSize: number
  filters: RegExp[]
  tts: boolean
  position: {
    x: number | undefined
    y: number | undefined
  }
}
const onOptionsChanged = (msg: OptionsValue) => {

}

options.on("change", onOptionsChanged)


let prevPos = []
const peepoTl = gsap.timeline({})
const heatClick = (clickData: {
  x: string; y: string; id: string; user: {
    display_name: string;
  } | undefined
}) => {
  console.debug("clickData: ", clickData)
  let winX = parseFloat(clickData.x) * window.innerWidth
  let winY = parseFloat(clickData.y) * window.innerHeight

}
nodecg.listenFor("click", "heat", heatClick)