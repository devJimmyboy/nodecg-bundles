/// <reference path="../../node_modules/nodecg-types/types/browser.d.ts"/>

import * as PIXI from "pixi.js"
import * as $ from "jquery"
import { ReplicantBrowser } from "nodecg-types/types/browser"
import { gsap } from "gsap"
import { CSSRulePlugin } from "gsap/CSSRulePlugin"
import { PixiPlugin } from "gsap/PixiPlugin"
import { TextPlugin } from "gsap/TextPlugin"
PixiPlugin.registerPIXI(PIXI)
gsap.registerPlugin(CSSRulePlugin, PixiPlugin, TextPlugin)

declare global {
  interface Window {
    __PIXI_INSPECTOR_GLOBAL_HOOK__: { register: Function }
  }
}

window.__PIXI_INSPECTOR_GLOBAL_HOOK__ && window.__PIXI_INSPECTOR_GLOBAL_HOOK__.register({ PIXI: PIXI })
interface Asset {
  // Generated by https://quicktype.io
  sum: string
  base: string
  ext: string
  name: string
  namespace: string
  category: string
  url: string
}

let config: StreamStartingState
const appRoot = document.getElementById("canvas") as HTMLElement
const appWidth = appRoot.clientWidth
const appHeight = appRoot.clientHeight
let app = new PIXI.Application({
  width: appWidth,
  height: appHeight,
  antialias: true,
  backgroundAlpha: 0,
  resolution: 1,
})
appRoot.appendChild(app.view)
let progressBarBorder = new PIXI.Graphics()
let progressBar = new PIXI.Graphics()
const xPos = appWidth / 2 // X Position of lower third
const yPos = appHeight / 2 // Initial Y position (out of frame)
const rWidth = 1200
const rHeight = 175
var playPromise: Promise<void>

const currentScene = nodecg.Replicant<string>("currentScene", "obs")

interface StreamStartingState {
  loadingText: string
  video: string
  length: number
}
interface States {
  starting: StreamStartingState
  brb: StreamStartingState
  ending: StreamStartingState
  custom: StreamStartingState
}
const reps = {
  progress: nodecg.Replicant<number>("streamStartProgress"),
  states: nodecg.Replicant<States>("streamStartStates"),
  currentState: nodecg.Replicant<string>("streamStartCurrentState"),
}

const videos = nodecg.Replicant<Asset[]>("assets:starting-videos")
const tVideos = nodecg.Replicant<Asset[]>("assets:transition-videos")

const eVideoPreview = $(`<video id="video" loop width="100%"></video>`).appendTo("#videoContainer")

let loadText = new PIXI.Text("Loading", {
    dropShadow: true,
    dropShadowDistance: 2,
    dropShadowAngle: 45,
    dropShadowBlur: 1,
    fontFamily: "Roboto",
    fill: 0xffffff,
    fontSize: "10em",
    fontWeight: "bold",
  }),
  myFont,
  incInterval
let msPerPercent = 5000,
  easing = 0.05,
  ellipses = new PIXI.Text("", loadText.style),
  currWidth = 0,
  targetWidth = 0,
  doneLoading = false,
  frameCount = 0,
  progressBarContainer = new PIXI.Container()
function preload() {}

PIXI.Loader.shared.load(setup)
function setup() {
  drawLoading()

  // Set up the canvas
  setInterval(updateEllipses, 500) // Update the ellipses every 500ms
  progressBarContainer.addChild(progressBarBorder, progressBar)

  app.stage.addChild(progressBarContainer, loadText)
  app.ticker.add(draw)
}
let targetAlpha = 1,
  currAlpha = 1
let elapsed = 0
function draw(deltaTime: number) {
  elapsed += deltaTime
  let dW = targetWidth - currWidth
  currWidth += dW * easing
  progressBar.scale.set(currWidth, 1)

  let dA = targetAlpha - currAlpha
  currAlpha += dA * easing
  progressBarContainer.alpha = currAlpha
}
// This function is called when the video loads
function loadVideo(source: string) {
  const video = document.getElementById("video") as HTMLVideoElement
  console.log("loading video %d", source)
  if (video.src === source) return
  video.src = source
  playPromise = video.play()
  if (playPromise !== undefined) {
    playPromise
      .then((_) => {
        console.log("Video %c%d playing", "color: #00ff00;", source)
        // Video playback started ;)
      })
      .catch((e) => {
        console.error("Video %d failed playing: %d", source, e)
        // Video playback failed ;(
      })
  }
  return playPromise
}

// Draw the loading bar
function drawLoading() {
  progressBarContainer.position.set(xPos - rWidth / 2, yPos - rHeight / 2)
  progressBarBorder.lineStyle(10, 0xffffff)
  progressBarBorder.drawRoundedRect(0, 0, rWidth, rHeight, 6)

  progressBar
    .beginFill(0xffffff, 1)
    .drawRect(
      0,
      0,
      rWidth, // Size to text
      rHeight
    )
    .endFill()
  progressBar.scale.set(0, 1)
  //   progressBar.mask = new PIXI.Graphics().drawRect(xPos - rWidth / 2, yPos - rHeight / 2, rWidth, rHeight)

  loadText.anchor.set(0.5)
  loadText.setTransform(xPos, yPos - rHeight - 100, 1, 1).addChild(ellipses)
  ellipses.anchor.set(0, 0.5)
  ellipses.position.set(loadText.width / 2 + 40, 0)
}

function updateEllipses() {
  if (ellipses.text.length === 3) ellipses.text = ""
  else ellipses.text += "."
}

function endLoading() {
  targetAlpha = 0
  doneLoading = true
  gsap.to(loadText, { pixi: { y: yPos, colorize: "red" }, duration: 1, ease: "power2.inOut" })
}

function beginStream(video: string) {
  console.log("beginning stream")
  gsap.to("canvas, video", {
    autoAlpha: 0,
    duration: 1,
    onComplete: () => {
      $("#video")
        .removeAttr("loop")
        .on("ended", () => nodecg.sendMessageToBundle("switchScene", "obs", "Full Cam"))

      loadVideo(tVideos.value.find((v) => v.name === video).url).then(() => gsap.set("video", { autoAlpha: 1 }))
    },
    ease: "power2",
  })
}
nodecg.listenFor("beginStream", beginStream)

NodeCG.waitForReplicants(reps.currentState, reps.progress, reps.states, videos, tVideos).then(() => {
  config = reps.states.value[reps.currentState.value]

  var prog = reps.progress.value
  if (config.video && config.video !== "") {
    const video = videos.value.find((v) => v.name === config.video) || videos.value[0]
    console.log(video)
    loadVideo(video.url)
  }
  // Var instatiations

  loadText.text = config.loadingText

  reps.progress.on("change", (newVal) => {
    let progress = Math.round(newVal * 100) / 100
    console.log("progress changed to ", progress, "%")
    if (progress < 1) {
      targetWidth = progress
    } else {
      targetWidth = 1
      endLoading()
    }
  })

  function stateChange(newVal, oldVal) {
    config = reps.states.value[reps.currentState.value]
    if (config?.loadingText) {
      loadText.text = config.loadingText
      ellipses.x = loadText.width / 2
    }
    msPerPercent = config.length * 6000

    if (config.video && config.video !== "") {
      const video = videos.value.find((v) => v.name === config.video) || videos.value[0]
      console.log(video)
      loadVideo(video.url)
    }
  }
  reps.states.on("change", stateChange)
  reps.currentState.on("change", stateChange)
})
