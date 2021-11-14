import $ from "jquery"
import gsap from "gsap"
import { CssObject, PositionConfig } from "../../global"

var LogoSrc = nodecg.Replicant<any>("assets:logo")
var currScene = nodecg.Replicant<string>("currentScene")
var position = nodecg.Replicant<PositionConfig>("posLogo")

var posMap: { [scene: string]: CssObject; default: CssObject } = {
  "Starting/Ending": {
    width: window.innerWidth / 2,
    height: window.innerHeight / 2,
    x: window.innerWidth / 2 - window.innerWidth / 4,
    y: (window.innerHeight * 3) / 4 - window.innerHeight / 4,
  },
  default: {
    width: "20%",
    height: "20%",
    x: -20 + 24,
    y: -60 + 24,
  },
}
var logo = $("#logo").length > 0 ? $("#logo") : $("<video id='logo'/>")
logo
  .attr("loop", "loop")
  .attr("autoplay", "autoplay")
  .attr("muted", "muted")
  .attr("playsinline", "playsinline")
  .attr("preload", "auto")
  .appendTo("body")

const onScene = (newVal: string) => {
  let css: CssObject = posMap[newVal] || (posMap.default as CssObject)
  gsap.set(logo, { autoAlpha: 1 })

  gsap.to(logo, { ...css, duration: 0.5, ease: "power2.out" })
}
currScene.on("change", onScene)

NodeCG.waitForReplicants(LogoSrc, currScene, position).then(function () {
  logo.attr("src", LogoSrc.value[0].url)
  onScene(currScene.value as string)
  position.on("change", (newVal) => {
    posMap.default.x =
      (newVal[1] == 1
        ? window.innerWidth - (logo.innerWidth() || 0)
        : newVal[1] == 0.5
        ? window.innerWidth / 2 - (logo.innerWidth() || 0) / 2
        : 24) + -20
    posMap.default.y = (newVal[0] == 1 ? window.innerHeight - (logo.innerHeight() || 0) : 24) + -60
    onScene(currScene.value as string)
  })
})

nodecg.listenFor("beginStream", "stream-starting", hideVideo)
function hideVideo() {
  gsap.to(logo, { autoAlpha: 0, duration: 0.5, ease: "power2.out" })
}
