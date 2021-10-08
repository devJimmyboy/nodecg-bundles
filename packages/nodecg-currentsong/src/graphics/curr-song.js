import $ from "jquery"
import fitty from "fitty"

import tlLoad, { anims, gsap } from "./anim"

var init = true

var showing
var lastfmUser = ""
var prevSong = ""
var duration = 5

/** @type {{rainbowRate: String}} */
var { rainbowChance: rainbowRate } = nodecg.bundleConfig.secrets
rainbowRate = rainbowRate.split("/")
rainbowRate = parseFloat(rainbowRate[0]) / parseFloat(rainbowRate[1])

// Gsap timelines
var tl

/** Rate of the api in seconds */
var apiRate = nodecg.bundleConfig.apiRate
if (apiRate == undefined) apiRate = 5

// jQuery Elements
var albumImg = $("#musicalbum")
var albumCover = albumImg.find("img.coverimg")
albumCover.css("opacity", "0").on("load", function () {
  loadingEl.css("opacity", "0")
  albumCover.css("opacity", "1")
  tl.play(0)
})
var loadingEl = $("#spinner")
var eContainer = $(".popoutWrapper")
var rYPos = nodecg.Replicant("popoutTop")
NodeCG.waitForReplicants(rYPos).then(() => {
  rYPos.on("change", (newVal) => {
    console.log(newVal)
    if (typeof newVal === "number") {
      eContainer.css("top", `${newVal}%`)
    }
    eContainer.css("top", newVal)
  })
})

$(async function () {
  const fitties = fitty("#songTitle", {
    minSize: 12,
    maxSize: 32,
  })

  gsap.set(".popoutWrapper", { xPercent: 100 })
  // Add our icons to the correct elements before anything else
  //   $("#musicIcon").html(renderIcon(musicIcon, "icon musicIcon"))
  //   loadingEl.append(renderIcon(spinnerIcon, "icon spinnerIcon"))

  showing = nodecg.Replicant("isShowing")
  showing.on("change", function (newV, oldV) {
    if (newV == oldV) return
    if (tl && showing.value) tl.play("songShow")
  })

  var config = nodecg.Replicant("configInfo")
  config.on("change", function (newVal) {
    updateMusic(newVal)
    if (!tl) {
      tl = tlLoad(newVal.duration)
      window.tl = tl
    }
  })
  var canPlay = false
  NodeCG.waitForReplicants(config, showing).then(() => {
    canPlay = true
  })

  var currSong = nodecg.Replicant("currentSong")

  currSong.on("change", function (data) {
    // console.log(data.recenttracks.track[0])

    if (canPlay) {
      $(".init").removeClass("init")

      updateTitle(data)
    }
  })

  function updateMusic(data) {
    lastfmUser = data.lastfm
    duration = data.duration
    var msg = data.msg
    if (msg) {
      $("#songMessage").text(msg)
    }
  }

  function updateTitle(info) {
    console.debug("Updated Title...", { ...info, prevSong })
    // rainbowChance()

    $("#songTitle").text(info.title)
    $("#songArtist").text(info.artist)
    if (info.albumArt === "" || info.albumArt.match(/2a96cbd8b46e442fc41c2b86b821562f\.png/g)) {
      albumImg.css("opacity", "0")
      albumCover.removeAttr("src")
      tl.play(0)
    } else {
      albumImg.css("opacity", "1")
      albumCover.css("opacity", "0")
      loadingEl.css("opacity", "1")
      albumCover.attr("src", info.albumArt)
    }
    fitties.forEach((f) => f.fit())
  }
})

// function rainbowChance() {
//   var rainbowNum = Math.random() * 1000
//   if (rainbowNum / 1000 < rainbowRate) {
//     $(".songInfo").css()
//   }
// }
