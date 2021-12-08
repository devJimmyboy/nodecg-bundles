///<reference types="nodecg-types/types/browser"/>

import * as Filter from "bad-words"
import { Alerts } from "../../global"
var filter = new Filter({ emptyList: true })
var videoInd = 0
var alertMessage = document.getElementById("alert-message")
var alertBox = document.getElementById("widget")

const activeAlert = nodecg.Replicant<number>("activeAlert")
const alerts = nodecg.Replicant<Alerts.Alert[]>("alerts")
const media = nodecg.Replicant<Alerts.Asset[]>("assets:media-graphics")
const sound = nodecg.Replicant<Alerts.Asset[]>("assets:media-sounds")
const isAlertPlaying = nodecg.Replicant<boolean>("isAlertPlaying")
const alertQueue = nodecg.Replicant<Alerts.Alert[]>("alertQueue")
const activateAlert = nodecg.Replicant<Alerts.ActivateAlert>("activateAlert")
var div = document.getElementById("widget")

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function filterInit() {
  var badWords = nodecg.Replicant<string[]>("badWords", { defaultValue: [] as string[], persistent: true })
  NodeCG.waitForReplicants(badWords).then(function () {
    filter.addWords(...badWords.value)
  })
}
filterInit()

function animateText(word) {
  var span = document.createElement("span")
  span.setAttribute("style", "color: " + getKeywordColour(activeAlert.value) + " ; position: relative;")
  for (var i = 0; i < word.length; i++) {
    var letter = document.createElement("span")
    letter.setAttribute("class", "animated-letter rubberBand")
    letter.appendChild(document.createTextNode(word.charAt(i)))
    span.appendChild(letter)
  }
  return span
}

function getMedia(ind) {
  let mediaN = alerts.value[ind].media
  // console.debug(media.value)
  // console.log(mediaN, "video index is ", videoInd)
  // console.log(mediaN[videoInd], "+", media.value[videoInd].url)
  if (mediaN.length > 0) return mediaN[videoInd]
  else return "none"
}

function getSound(ind) {
  return alerts.value[ind].sound
}

function getLayout(ind) {
  return alerts.value[ind].layout
}

function getKeywordColour(ind) {
  return alerts.value[ind].keywordColour
}

function getColour(ind) {
  return alerts.value[ind].fontColour
}

function getFont(ind) {
  return alerts.value[ind].font
}

function getFontSize(ind) {
  return alerts.value[ind].fontSize
}

function getFontWeight(ind) {
  return alerts.value[ind].fontWeight
}

function getCSS(ind) {
  return alerts.value[ind].customCSS
}

function getMediaExt(ind) {
  if (getMedia(ind) && getMedia(ind) != "none") {
    return media.value[getMedia(ind)]?.ext || "none"
  } else {
    return "none"
  }
}

function getDuration(ind) {
  return alerts.value[ind].duration
}

function getMessage(ind) {
  return activateAlert.value.message.length > 0
    ? filter.clean(activateAlert.value.message)
    : activateAlert.value.message
}

function clearMessage(ind) {
  activateAlert.value.message = ""
}

function getMediaURL(ind) {
  return media.value[getMedia(ind)].url
}

function getSoundURL(ind) {
  return sound.value[getSound(ind)].url
}

function getVolume(ind) {
  return alerts.value[ind].volume
}

var css: HTMLStyleElement

NodeCG.waitForReplicants(alerts, activateAlert, media, sound, alertQueue).then(() => {
  console.log("messages are fully declared and ready to use!")
  activateAlert.on("change", (value) => {
    const animateCSS = (element, animation, durationV = 10000, prefix = "animate__") =>
      // We create a Promise and return it
      new Promise((resolve, reject) => {
        const animationName = `${animation}`
        const node = element
        node.classList.remove(`${prefix}animated`, "animate__bounceOut", "animate__slow")
        node.classList.add(`${prefix}animated`, animationName, "animate__slow")

        // When the animation ends, we clean the classes and resolve the Promise

        function handleAnimationEnd(event) {
          event.stopPropagation()
          node.classList.remove(`${prefix}animated`, animationName, "animate__slow")
          resolve("Animation ended")
          setTimeout(function () {
            node.classList.add(`${prefix}animated`, "animate__bounceOut", "animate__slow")
          }, (duration || getDuration(activeAlert.value)) - 2000)
          setTimeout(function () {
            cleanUp()
          }, (duration || getDuration(activeAlert.value)) - 1000)
        }
        node.addEventListener("animationend", handleAnimationEnd, { once: true })
      })

    if (alertQueue.value.length > 0) {
      isAlertPlaying.value = true
      videoInd = Math.floor(Math.random() * (alerts.value[activeAlert.value].media.length || 0))
      // Should add a isAlertPlaying function to queue alerts.
      if (div.style.display === "none") {
        div.style.display = "block"
      }

      css = document.getElementById("customCSS") as HTMLStyleElement
      var userCSS = document.createTextNode(getCSS(activeAlert.value))
      css.appendChild(userCSS)

      alertBox.setAttribute("data-layout", getLayout(activeAlert.value))
      var message = getMessage(activeAlert.value)

      // Handle media
      if (getMediaExt(activeAlert.value) === ".webm") {
        console.log("Alert has media:")
        console.log("isVideo")
        var video = document.createElement("video")
        video.setAttribute("id", "webm-video")
        video.setAttribute("autoplay", "autoplay")
        video.setAttribute("loop", "loop")
        animateCSS(video, "animate__fadeIn")
        //video.setAttribute("class", "animate__animated animate__fadeIn animate__slow");
        video.setAttribute("src", getMediaURL(activeAlert.value))
        video.load()
        document.getElementById("alert-image").appendChild(video)
        var videoLoaded = video.play()
      } else if (
        getMediaExt(activeAlert.value) === ".gif" ||
        getMediaExt(activeAlert.value) === ".png" ||
        getMediaExt(activeAlert.value) === ".jpg"
      ) {
        var image = document.createElement("img")
        var imageElement = document.getElementById("alert-image")
        imageElement.setAttribute("style", "background-image: " + 'url("' + getMediaURL(activeAlert.value) + '");')
        animateCSS(image, "animate__fadeIn")
        //image.setAttribute("class", "animate__animated animate__fadeIn animate__slow");
        image.setAttribute("src", getMediaURL(activeAlert.value))
        document.getElementById("alert-image").appendChild(image)
      }

      var duration = getDuration(activeAlert.value)
      videoLoaded
        .then(function () {
          if (duration == 0) {
            duration = video.duration * 1000 || 10000
          }
          video.removeAttribute("loop")
          console.debug(duration)
          animateCSS(userMessage, "animate__tada", video.duration * 1000)
        })
        .catch((e) => console.log())

      video.addEventListener("ended", (e) => {
        $(this).fadeOut()
      })

      var re = /\(.*?\)/g
      var keywords = message.matchAll(re)
      var userMessage = document.getElementById("alert-user-message")

      userMessage.setAttribute(
        "style",
        "color: " +
          getColour(activeAlert.value) +
          "; font-size: " +
          getFontSize(activeAlert.value) +
          "px; font-family: " +
          getFont(activeAlert.value) +
          " ; font-weight: " +
          getFontWeight(activeAlert.value) +
          ";"
      )

      //userMessage.setAttribute("class", "animate__animated animate__fadeIn animate__slow");
      var lastKeyword = 0
      var count = 0
      for (var keyword of keywords) {
        // Check to see if a keyword is first in message.
        if (keyword.index != 0) {
          var messageElement = document.createElement("span")
          if (count != 0) {
            var messageText = document.createTextNode(message.slice(lastKeyword + 2, keyword.index))
          } else {
            var messageText = document.createTextNode(message.slice(lastKeyword, keyword.index))
          }
          messageElement.appendChild(messageText)
          userMessage.appendChild(messageElement)
        }
        console.log(message)
        keyword[0] = keyword[0].replace("(", "")
        keyword[0] = keyword[0].replace(")", "")
        userMessage.appendChild(animateText(keyword[0]))
        lastKeyword = keyword.index + keyword[0].length
        count = count + 1
      }
      // If a keyword is not last, add the rest of the message.
      if (lastKeyword < getMessage(activeAlert.value).length) {
        messageElement = document.createElement("span")
        messageText = document.createTextNode(getMessage(activeAlert.value).slice(lastKeyword + 2, message.length))
        messageElement.appendChild(messageText)
        userMessage.appendChild(messageElement)
      }
      if (typeof activateAlert.value.attachedMsg != "undefined") {
        var customMessage = document.getElementById("alert-message")
        var messageElement = document.createElement("span")
        var messageText = document.createTextNode(activateAlert.value.attachedMsg)
        messageElement.appendChild(messageText)
        customMessage.appendChild(messageElement)
        animateCSS(customMessage, "animate__tada")
        playSound(activeAlert.value, activateAlert.value.attachedMsg)
      }
    }
  })
})
function removeAllChildren(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild)
  }
}
if (process.env.NODE_ENV === "development" && module.hot) {
  module.hot.accept()
}

async function playSound(ind: number, message: string) {
  let speak = await fetch(
    "https://api.streamelements.com/kappa/v2/speech?voice=Brian&text=" + encodeURIComponent(message.trim()),
    { mode: "cors" }
  )

  if (speak.status != 200) {
    nodecg.log.warn(await speak.text())
    return
  }

  let mp3 = await speak.blob()
  let blobUrl = URL.createObjectURL(mp3)

  var audio = new Audio(blobUrl)
  audio.pause()
  audio.load()
  audio.volume = getVolume(ind) / 100
  audio.play()
}
function cleanUp() {
  div.style.display = "none"
  var msg = document.getElementById("alert-user-message")
  var attachedMsg = document.getElementById("alert-message")
  var graphic = document.getElementById("alert-image")
  graphic.setAttribute("style", "background-image: none;")
  removeAllChildren(msg)
  removeAllChildren(graphic)
  removeAllChildren(attachedMsg)
  css.textContent = ""
  console.log("HIDE")
  isAlertPlaying.value = false
  //Remove from Queue
  alertQueue.value.splice(0, 1)
}

declare global {
  interface Window {
    css: HTMLStyleElement
  }
}
