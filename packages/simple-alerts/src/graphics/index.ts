import Filter from "bad-words";
import gsap from "gsap";

import { Alerts } from "../../global";

///<reference types="nodecg-types/types/browser"/>
var filter = new Filter({ emptyList: true })
var videoInd = 0
var alertMessage = document.getElementById('alert-message')
var alertBox = document.getElementById('widget')

const activeAlert = nodecg.Replicant<number>('activeAlert')
const alerts = nodecg.Replicant<Alerts.Alert[]>('alerts')
const media = nodecg.Replicant<Alerts.Asset[]>('assets:media-graphics')
const sound = nodecg.Replicant<Alerts.Asset[]>('assets:media-sounds')
const isAlertPlaying = nodecg.Replicant<boolean>('isAlertPlaying')
const alertQueue = nodecg.Replicant<Alerts.Alert[]>('alertQueue')
const activateAlert = nodecg.Replicant<Alerts.ActivateAlert>('activateAlert')
var div = document.getElementById('widget')

declare global {
  interface Window {
    isAlertPlaying: typeof isAlertPlaying
    alertQueue: typeof alertQueue
    activateAlert: typeof activateAlert
  }
}

window.isAlertPlaying = isAlertPlaying
window.alertQueue = alertQueue
window.activateAlert = activateAlert

if (!window.obsstudio) {
  console.log('OBS not present, revealing Debug')

  initDebug()
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function filterInit() {
  var badWords = nodecg.Replicant<string[]>('badWords', { defaultValue: [] as string[], persistent: true })
  NodeCG.waitForReplicants(badWords).then(function () {
    filter.addWords(...badWords.value)
  })
}
filterInit()

function animateText(word: string) {
  var span = document.createElement('span')
  span.setAttribute('style', 'color: ' + getKeywordColour(activeAlert.value) + ' ; position: relative;')
  for (var i = 0; i < word.length; i++) {
    var letter = document.createElement('span')
    letter.setAttribute('class', 'animated-letter rubberBand')
    letter.appendChild(document.createTextNode(word.charAt(i)))
    span.appendChild(letter)
  }
  return span
}

function getMedia(ind) {
  if (ind === -1) return 'none'
  let mediaN = alerts.value[ind].media
  // console.debug(media.value)
  // console.log(mediaN, "video index is ", videoInd)
  // console.log(mediaN[videoInd], "+", media.value[videoInd].url)
  if (mediaN.length > 0) return mediaN[videoInd]
  else return 'none'
}

function getSound(ind) {
  return ind === -1 ? '' : alerts.value[ind].sound
}

function getLayout(ind) {
  return ind === -1 ? 'above' : alerts.value[ind].layout
}

function getKeywordColour(ind) {
  return ind === -1 ? 'cyan' : alerts.value[ind].keywordColour
}

function getColour(ind) {
  return ind === -1 ? '#f2f2f2' : alerts.value[ind].fontColour
}

function getFont(ind) {
  return ind === -1 ? "'Lilita One'" : alerts.value[ind].font
}

function getFontSize(ind) {
  return ind === -1 ? '64' : alerts.value[ind].fontSize
}

function getFontWeight(ind) {
  return ind === -1 ? '700' : alerts.value[ind].fontWeight
}

function getCSS(ind) {
  return ind === -1 ? '' : alerts.value[ind].customCSS
}

function getMediaExt(ind) {
  if (ind !== -1 && getMedia(ind) && getMedia(ind) != 'none') {
    return media.value[getMedia(ind)]?.ext || 'none'
  } else {
    return 'none'
  }
}

function getDuration(ind) {
  return ind === -1 ? 0 : alerts.value[ind].duration
}

function getMessage(ind) {
  return activateAlert.value.message.length > 0 ? filter.clean(activateAlert.value.message) : activateAlert.value.message
}

function clearMessage(ind) {
  activateAlert.value.message = ''
}

function getMediaURL(ind) {
  return ind === -1 ? activateAlert.value.event : media.value[getMedia(ind)].url
}

function getSoundURL(ind) {
  return sound.value[getSound(ind)].url
}

function getVolume(ind) {
  return ind === -1 ? 1 : alerts.value[ind].volume
}

var css: HTMLStyleElement

NodeCG.waitForReplicants(alerts, activateAlert, media, sound, alertQueue).then(() => {
  console.log('messages are fully declared and ready to use!')
  activateAlert.on('change', async (value) => {
    const animateCSS = (element: HTMLElement, animation: string, prefix = 'animate__') =>
      // We create a Promise and return it
      new Promise((resolve, reject) => {
        const animationName = `${animation}`
        const node = element
        node.classList.add(`${prefix}animated`, animationName, 'animate__slow')

        // When the animation ends, we clean the classes and resolve the Promise
        function handleAnimationEnd(event: AnimationEvent) {
          event.stopPropagation()
          node.classList.remove(`${prefix}animated`, animationName, 'animate__slow')
          resolve('Animation ended')
        }
        node.addEventListener('animationend', handleAnimationEnd, { once: true })
      })

    if (alertQueue.value.length > 0) {
      isAlertPlaying.value = true
      var isShoutout = activeAlert.value === -1
      videoInd = isShoutout ? -1 : Math.floor(Math.random() * alerts.value[activeAlert.value].media.length)
      console.log('video index is ', videoInd, 'num of medias is ', alerts.value[activeAlert.value].media.length)
      // Should add a isAlertPlaying function to queue alerts.
      if (div.style.display === 'none') {
        div.style.display = 'block'
      }

      css = document.getElementById('customCSS') as HTMLStyleElement
      var userCSS = document.createTextNode(getCSS(activeAlert.value))
      css.appendChild(userCSS)

      alertBox.setAttribute('data-layout', getLayout(activeAlert.value))
      var message = getMessage(activeAlert.value)
      console.log(activateAlert.value)

      // Handle media
      if ((isShoutout && typeof activateAlert.value.event === 'string') || getMediaExt(activeAlert.value) === '.webm') {
        console.log('Alert is Video')
        var video = $(`<video class="transition-all"/>`) as JQuery<HTMLVideoElement>
        var src = $<HTMLSourceElement>(`<source id='webm' type='video/${isShoutout ? 'mp4' : 'webm'}'/>`).appendTo(video)
        video.attr('id', 'webm-video').attr('autoplay', 'autoplay').attr('preload', 'auto')
        //video.setAttribute("class", "animate__animated animate__fadeIn animate__slow");

        src.attr('src', getMediaURL(activeAlert.value))
        $('#alert-image').append(video)
        // $(video).fadeIn()
        video.get(0).load()
        var videoLoaded = video.get(0).play()
        videoLoaded
          .then(() => gsap.fromTo(video, { autoAlpha: 0, scale: 0.5 }, { autoAlpha: 1, scale: 1, duration: 1.25, ease: 'elastic.out(1.2,0.6)' }))
          .catch((e) => {
            console.error(e)
          })
      } else if (getMediaExt(activeAlert.value) === '.gif' || getMediaExt(activeAlert.value) === '.png' || getMediaExt(activeAlert.value) === '.jpg') {
        var image = document.createElement('img')
        var imageElement = document.getElementById('alert-image')
        imageElement.setAttribute('style', 'background-image: ' + 'url("' + getMediaURL(activeAlert.value) + '");')
        // animateCSS(image, "animate__fadeIn")
        //image.setAttribute("class", "animate__animated animate__fadeIn animate__slow");
        image.setAttribute('src', getMediaURL(activeAlert.value))
        document.getElementById('alert-image').appendChild(image)
      }
      let dirVal = getDuration(activeAlert.value)
      var duration = dirVal === 0 ? 10000 : dirVal
      if (videoLoaded) await videoLoaded.catch((e) => console.error(e))
      if (!video || video.get(0).error) {
        console.log('no video', video?.get(0).error)
        // $(video).fadeOut()
        // return cleanUp()
      }
      video?.on('durationchange', function (e) {
        console.log('New Duration: ', this.duration)
        duration = (this.duration || 10000) * 1000
      })

      if (duration == 0) {
        duration = (video?.get(0)?.duration ?? 10) * 1000
      }
      if (video?.attr('loop') === 'loop') video.removeAttr('loop')
      console.log(duration)
      if (video)
        video.on('ended', async (e) => {
          gsap.to(video, { autoAlpha: 0, scale: 0.25, duration: 1.25, ease: 'elastic.in(1.4,0.8)' })
          if (activateAlert.value.attachedMsg) await playSound(activeAlert.value, activateAlert.value.attachedMsg)
          gsap.to('#alert-user-message, #alert-message', { autoAlpha: 0, scale: 0.25, duration: 1.25, ease: 'elastic.in(1.4,0.8)', onComplete: () => cleanUp() })
        })
      else {
        if (activateAlert.value.attachedMsg) await playSound(activeAlert.value, activateAlert.value.attachedMsg)
        gsap.to('#alert-user-message, #alert-message', { autoAlpha: 0, scale: 0.25, duration: 1.25, ease: 'elastic.in(1.4,0.8)', onComplete: () => cleanUp() })
      }

      var re = /\(.*?\)/g
      var keywords = message.matchAll(re)
      var userMessage = document.getElementById('alert-user-message')

      userMessage.setAttribute(
        'style',
        'color: ' +
          getColour(activeAlert.value) +
          '; font-size: ' +
          getFontSize(activeAlert.value) +
          'px; font-family: ' +
          getFont(activeAlert.value) +
          ' ; font-weight: ' +
          getFontWeight(activeAlert.value) +
          ';'
      )
      animateCSS(userMessage, 'animate__tada')

      //userMessage.setAttribute("class", "animate__animated animate__fadeIn animate__slow");
      var lastKeyword = 0
      var count = 0
      for (var keyword of keywords) {
        // Check to see if a keyword is first in message.
        if (keyword.index != 0) {
          var messageElement = document.createElement('span')
          if (count != 0) {
            var messageText = document.createTextNode(message.slice(lastKeyword + 2, keyword.index))
          } else {
            var messageText = document.createTextNode(message.slice(lastKeyword, keyword.index))
          }
          messageElement.appendChild(messageText)
          userMessage.appendChild(messageElement)
        }
        console.log(message)
        keyword[0] = keyword[0].replace('(', '')
        keyword[0] = keyword[0].replace(')', '')
        userMessage.appendChild(animateText(keyword[0]))
        lastKeyword = keyword.index + keyword[0].length
        count = count + 1
      }
      // If a keyword is not last, add the rest of the message.
      if (lastKeyword < getMessage(activeAlert.value).length) {
        messageElement = document.createElement('span')
        messageText = document.createTextNode(getMessage(activeAlert.value).slice(lastKeyword + 2, message.length))
        messageElement.appendChild(messageText)
        userMessage.appendChild(messageElement)
      }
      if (typeof activateAlert.value.attachedMsg !== 'undefined') {
        var customMessage = document.getElementById('alert-message')
        var messageElement = document.createElement('span')

        let messageContent = $(`<div class="user-msg">${activateAlert.value.attachedMsg}</div>`)
        messageContent.appendTo($(messageElement))

        customMessage.appendChild(messageElement)
        animateCSS(customMessage, 'animate__tada')
      }
    }
  })
})
function removeAllChildren(parent: HTMLElement) {
  $(parent).empty()
}

// if (process.env.NODE_ENV === "development" && module.hot) {
//   module.hot.accept()
// }

async function playSound(ind: number, message: string) {
  let speak = await fetch('https://api.streamelements.com/kappa/v2/speech?voice=Brian&text=' + encodeURIComponent(message.trim()), { mode: 'cors' })

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
  const audioDone = new Promise<void>((resolve) => {
    audio.onended = (e) => resolve()
  })
  return audioDone
}

async function cleanUp() {
  div.style.display = 'none'
  var msg = document.getElementById('alert-user-message')
  var attachedMsg = document.getElementById('alert-message')
  var graphic = document.getElementById('alert-image')
  graphic.setAttribute('style', 'background-image: none;')
  removeAllChildren(msg)
  removeAllChildren(graphic)
  removeAllChildren(attachedMsg)
  if (css) css.textContent = ''
  console.log('HIDE')
  //Remove from Queue
  isAlertPlaying.value = false
  alertQueue.value = alertQueue.value.slice(1)
}

declare global {
  interface Window {
    css: HTMLStyleElement
    obsstudio?: any
  }
}

function initDebug() {
  const debug = $(`#debug`).toggleClass('hidden')
  const nextAlertBtn = $(`<button class="btn btn-primary">Next Alert</button>`)
    .on('click', () => {
      cleanUp().catch(console.error)
    })
    .appendTo(debug)
}
