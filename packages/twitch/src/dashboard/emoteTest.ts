import $ from 'jquery'
import debounce from "lodash.debounce"
import { EmoteCollection, FFZEmoteSet } from "nodecg-io-twitch-addons"
import { ParseEmotesParams } from "../extension/Emotes"
var emoteOut = $("#emote-output")
var chatMsgToggle = $(`#chat-msg-mode`)
var chatMsgMode = false
var emoteImg = $(`<img src="" />`).appendTo(emoteOut)
var emoteInput = $("#emote-input")

if (localStorage.getItem("chatMsgMode") === "true") {
  toggleChatMessageMode(null)
}


emoteInput.on("input", debounce(async function (e) {
  let emote = emoteInput.val()
  console.log(emote);
  if (!chatMsgMode) {
    nodecg.sendMessage("getEmote", emote).then(function (data) {
      console.log(data);
      if (data)
        emoteImg.attr("src", data)
    })
  }
  else {
    let options: ParseEmotesParams = { message: emote as string, options: { classListEmoteImg: ["emote"], classListEmoteSpan: [], classListWords: ["msg-words"] } }
    nodecg.sendMessage("parseEmotes", options).then(async function (data) {
      console.log(data);
      emoteOut.children("*:not(img)").remove()
      if (data)
        $(`<div class="msg-wrapper"><div class="msg"></div></div>`).appendTo(emoteOut).prepend(await getUserNameDiv()).children(".msg").html(data)
    })
  }

}, 500)).trigger("input")

var emoteList = $(`#emote-list`).appendTo($("body"))

let emotes = nodecg.Replicant<EmoteCollection | undefined>("emotes")

emotes.on("change", (newVal, oldVal) => { if (newVal) updateList(newVal) })

function updateList(emotes: EmoteCollection) {
  emoteList.empty()
  for (let prov in emotes) {
    let emoteSet = emotes[prov]
    let emoteSetDiv = $(`<div class="emote-set collapse-close"><div class="collapse-title">${prov}</div></div>`).appendTo(emoteList).on("click", (e) => {
      if (emoteSetDiv.hasClass("collapse-open")) {
        emoteSetDiv.removeClass("collapse-open")
        emoteSetDiv.addClass("collapse-close")
      }
      else {
        emoteSetDiv.removeClass("collapse-close")
        emoteSetDiv.addClass("collapse-open")
      }
    })
    let emoteSetList = $(`<div class="collapse-content"></div>`).appendTo(emoteSetDiv)
    if (prov.includes("ffz"))
      emoteSet.forEach((emoteSetffz: FFZEmoteSet, i) => {
        emoteSetffz.emoticons.forEach((emote, i) => {
          let emoteName = emote.name
          let emoteDiv = $(`<div class="emote-item">${emoteName}</div>`).appendTo(emoteSetList)
          emoteDiv.on("click", function () {
            emoteInput.val(chatMsgMode ? emoteInput.val().toString().trim() + " " + emoteName : emoteName).trigger("input")
          })
        })
      })
    else
      emoteSet.forEach((emote, i) => {
        let emoteName = emote.code || emote.name
        let emoteDiv = $(`<div class="emote-item">${emoteName}</div>`).appendTo(emoteSetList)
        emoteDiv.on("click", function (e) {
          e.stopPropagation()
          emoteInput.val(chatMsgMode ? emoteInput.val().toString().trim() + " " + emoteName : emoteName).trigger("input")
        })
      })
  }
}

function toggleChatMessageMode(e: JQuery.Event) {

  chatMsgMode = !chatMsgMode
  localStorage.setItem("chatMsgMode", chatMsgMode.toString())
  console.log("Msg mode: " + chatMsgMode);
  chatMsgToggle.toggleClass(["btn-success", "btn-error"])
  emoteOut.toggleClass("items-center max-w-full w-50 w-20".split(" "))
}

chatMsgToggle.on("click", toggleChatMessageMode)

let badgeMap = new Map<string, string[]>()

async function getUserNameDiv() {
  let displayName = "devJimmyboy"
  let nameDiv = $(`<div class="msg-user" ></div>`)
  let displayNameSpan = `<span class="display-name" style="color: ${randomColor()};">${displayName}</span><span>:</span>`
  let badges = badgeMap.get(displayName) || []
  if (!badgeMap.has(displayName)) {
    badges = await nodecg.sendMessage("getBadges", displayName)
    badgeMap.set(displayName.toLowerCase(), badges)
  }
  $(`<div class="badge-list">${badges.map(badge => `<img src="${badge}" />`).join(" ")}</div>`).appendTo(nameDiv)
  $(displayNameSpan).appendTo(nameDiv)
  return nameDiv






}

function randomColor() {
  return '#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substring(1, 6)
}