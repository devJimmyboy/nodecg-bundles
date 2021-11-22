/// <reference types="nodecg-types/types/server" />
"use strict"

const { count } = require("console")

/**
 * @param  {NodeCGServer} nodecg
 */
module.exports = function (nodecg) {
  var playing = false
  const currentState = nodecg.Replicant("streamStartCurrentState", { defaultValue: "starting", persistent: false })

  const progress = nodecg.Replicant("streamStartProgress", { defaultValue: 0, persistent: true })

  const timeLeft = nodecg.Replicant("streamStartTime", { defaultValue: 0, persistent: true })

  const states = nodecg.Replicant("streamStartStates", {
    defaultValue: {
      starting: { length: 5, loadingText: "loading", video: "" },
      brb: { length: 5, loadingText: "loading", video: "" },
      ending: { length: 5, loadingText: "loading", video: "" },
      custom: { length: 5, loadingText: "loading", video: "" },
    },
    persistent: true,
  })

  let config = states.value[currentState.value]
  progress.value = 0

  let msPerPercent = config.length * 60000
  var incInterval
  var countdownInterval

  function loadingIncrement() {
    if (progress.value >= 1) {
      clearInterval(incInterval)
      progress.value = 1
    } else progress.value += 0.01
  }

  function changeState(state) {
    state = state.toLowerCase()
    if (state === currentState.value || !["starting", "brb", "ending", "custom"].includes(state)) return
    else {
      currentState.value = state
      nodecg.log.info("[Stream Starting] State changed to " + state, states.value[state])
    }
  }

  progress.on("change", function (newVal, oldVal) {
    if (oldVal == 1 && newVal != 1) {
      progress.value = newVal
      incInterval = setInterval(loadingIncrement, msPerPercent)
    }
  })

  function onNewState(newVal, oldVal) {
    config = states.value[currentState.value]
    if (config.length > 0) {
      msPerPercent = config.length * 600
      if (incInterval) {
        clearInterval(incInterval)
        incInterval = setInterval(loadingIncrement, msPerPercent)
      }
    }
    if (typeof newVal === "string") progress.value = 0
  }
  currentState.on("change", onNewState)
  states.on("change", onNewState)

  // Listen for events

  nodecg.listenFor("changeState", (state) => {
    changeState(state)
  })

  nodecg.listenFor("start", () => {
    if (config.length > 0 && !playing) {
      incInterval = setInterval(loadingIncrement, msPerPercent) // Update the progress by config time}

      countdownInterval = setInterval(() => {
        var now = new Date().getTime()
      }, 1000)
      playing = true
    }
  })

  nodecg.listenFor("restart", () => {
    progress.value = 0
  })

  nodecg.listenFor("stop", () => {
    if (playing) {
      clearInterval(incInterval)
      playing = false
    }
  })
}
