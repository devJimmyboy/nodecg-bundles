/// <reference path="../../../../types/browser.d.ts" />

import $ from "jquery"
import _ from "lodash"
let progress, currentState, states, videos, tVideos, config
const eProgress = $("#progress")
const eLength = $("#length")
const eProgressValue = $("#progressValue")
const eLengthValue = $("#lengthValue")
const eCustomMessage = $("#customMessage")
const eStateButtons = $('input[name="state"]')
const eVideoSelect = $("#videoSelect")
const eTimeLeftValue = $("#timeLeft")
const eVideoPreview = $(`<video id="video" hidden loop width="100%"><source id="webm" type="video/webm"/></video>`)
const timeLeft = { min: 5, sec: 0, ms: 0 }
$("form").on("submit", function (e) {
  e.preventDefault()
})
const eStartStream = $("#startStream")
const eTVideoSelect = $("#tVideoSelect")

eCustomMessage.on("blur", (e) => e.preventDefault())

const dProgressUpdate = _.throttle(function (e) {
  // Update Replicant Value
  progress.value = parseFloat($(this).val())
}, 250)

const dConfigUpdate = _.debounce(function (e) {
  switch (e.currentTarget.id) {
    case "length":
      states.value[currentState.value].length = $("#length").val()
      break
    case "customMessage":
      states.value[currentState.value].loadingText = $("#customMessage").val()
      break
  }
}, 250)

$(() => {
  eVideoPreview.appendTo("#videoContainer")

  progress = nodecg.Replicant("streamStartProgress")
  videos = nodecg.Replicant("assets:starting-videos")
  tVideos = nodecg.Replicant("assets:transition-videos")
  states = nodecg.Replicant("streamStartStates")
  currentState = nodecg.Replicant("streamStartCurrentState")

  NodeCG.waitForReplicants(tVideos, videos, states, currentState).then(() => {
    config = states.value[currentState.value]

    console.log(
      eStateButtons
        .filter((i, v) => v.id === currentState.value)
        ?.prop("checked", true)
        ?.prop("id")
    )
    videos.value.forEach((video) => {
      eVideoSelect.append(
        $("<option>", {
          value: video.name,
          text: video.name,
        })
      )
    })
    if (tVideos.value.length > 0) {
      tVideos.value.forEach((video, i) => {
        eTVideoSelect.append(
          $("<option>", {
            value: video.name,
            text: video.name,
            selected: i == 0 ? true : false,
          })
        )
      })
    } else {
      eTVideoSelect.append(
        $("<option>", {
          text: "Add Videos in the Assets tab above!",
          selected: true,
          disabled: true,
        })
      )
    }
    eStartStream.on("click", () => {
      console.log(eTVideoSelect.val())
      nodecg.sendMessage("beginStream", eTVideoSelect.val())
    })

    eVideoSelect.on("change", (e) => loadVideo(videos.value.find((v) => v.name === e.target.value).url))
    $("#saveVideoButton").on("click", (e) => {
      e.preventDefault()
      console.log("bg video changed to %c%s", "color: cyan;", eVideoSelect.val())
      config.video = eVideoSelect.val()
    })
  })

  NodeCG.waitForReplicants(progress, states, currentState, videos).then(() => {
    config = states.value[currentState.value]
    setTime(parseInt(config.length))

    eLength
      .val(config.length || 1)
      .on("change", dConfigUpdate)
      .on("input change", (e) => {
        eLengthValue.text(eLength.val())
      })
    eLengthValue.text(eLength.val())
    eCustomMessage.val(config.loadingText).on("input", dConfigUpdate)
    eProgress
      .val(progress.value)
      .on("input change", dProgressUpdate)
      .on("input change load", (e) => {
        eProgressValue.text(new String(Math.round(eProgress.val() * 100)))
      })

    progress.on("change", function (newVal, oldVal) {
      console.debug("progress changed: %c%d", "color: red;", Math.round(newVal * 100))
      eProgress.val(newVal)
      eProgressValue.text(Math.round(newVal * 100))
      eTimeLeftValue.text(`${timeLeft?.min}m ${timeLeft?.sec}s ${timeLeft?.ms}ms`)
    })
    currentState.on("change", function (newVal, oldVal) {
      config = states.value[newVal]
      eLength.val(config.length)
      eLengthValue.text(eLength.val())
      eCustomMessage.val(config.loadingText)
      timeLeft
    })
  })

  eStateButtons.on("click", function (e) {
    const checked = $(this)
    if (checked.is(":checked")) {
      nodecg.sendMessage("changeState", checked.siblings("span").text().toLowerCase())
    }
  })
})

function loadVideo(src) {
  /**
   * @type {HTMLVideoElement}
   */
  var video = document.getElementById("video")
  var webmSrc = document.getElementById("webm")

  webmSrc.src = src
  video.load()
  video.volume = 0
  video.hidden = false
  video.play()
}

var timerInt = 0
function startTimer() {
  if (timerInt == 0)
    timerInt = setInterval(function () {
      timeLeft.ms -= 100
      if (timeLeft.ms <= 0) {
        timeLeft.ms = 1000
        timeLeft.sec--
        if (timeLeft.sec <= 0) {
          timeLeft.sec = 60
          timeLeft.min--
        }
      }
      if (timeLeft.min <= 0) {
        clearInterval(timerInt)
        timerInt = 0
      }
    }, 100)
}

function setTime(mins) {
  timeLeft.min = mins
  timeLeft.sec = 0
  timeLeft.ms = 0
}
