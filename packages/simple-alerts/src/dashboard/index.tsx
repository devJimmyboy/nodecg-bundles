///<reference types="nodecg-types/types/browser"/>
import Iconify from "@iconify/iconify";
import React from "react";
import { createRoot } from "react-dom/client";

import { Alerts } from "../../global";
import App from "./components/App";

Iconify.scan()

const sound = nodecg.Replicant<Alerts.Asset[]>('assets:media-sounds')

// NodeCG.waitForReplicants( sound).then(() =>
//   $(() => {
//     // alerts.value.forEach(showPanels)
//     // alertSelect.trigger("change")

//     jscolor.install()
//     // $(".chosen-select")
//     //   .addClass("bg-primary").select2({
//     //     placeholder: "Choose Media to play",
//     //     closeOnSelect: false,
//     //     theme: "bootstrap4",
//     //     multiple: true
//     //   })
//   })
// )

createRoot(document.getElementById('root')).render(<App />)

// const div = $("#alerts-wrap")
// const alertSelect = $("#alertSelect").on("change", (e) =>
//   console.log($(this).find("option:selected").val())
// ) as JQuery<HTMLSelectElement>

// let activeAlertWrap: JQuery<HTMLDivElement>

// function showPanels(value: Alerts.Alert, index: number, array: Alerts.Alert[]) {

//   var alertHide = $("<option/>")
//   alertHide.attr("id", "alertHide" + index).attr("value", `${index}`)
//   var alertHideLabel = document.createTextNode(value.name)
//   alertHide.append(alertHideLabel)

//   var alertWrap = $("<div/>")
//   alertWrap.css("display", "none")
//   alertWrap.attr("id", "alertWrap" + index)

//   var alreadyExists = $("#alert" + index)
//   if (alreadyExists.length > 0) {
//     return
//   }

//   var form = $('<form class="grid-flow-row grid-cols-6 gap-4 form-control"/>')
//   form.attr("id", "alert" + index)

//   var name = $("<label/>")
//   name.attr("for", "alert" + index + "Name")
//   var nameLabel = document.createTextNode("Alert Name: ")
//   name.append(nameLabel)
//   var nameInput = $("<input/>")
//   nameInput.attr("id", "alert" + index + "Name")
//   name.append(nameInput).addClass("col-span-4")
//   // var messageTemplate = $("<label/>")
//   // messageTemplate.attr("for", "alert" + index + "MsgTemplate")
//   // var messageTemplateLabel = document.createTextNode("Message Template: ")
//   // messageTemplate.append(messageTemplateLabel)
//   // var messageTemplateInput = $("<input/>")
//   // messageTemplateInput.attr("id", "alert" + index + "MsgTemplate")
//   var alertButtons = $("<div/>")
//   alertButtons.addClass("col-span-6 flex flex-row justify-center gap-4")
//   var alertSubmit = $("<button/>")
//   alertSubmit.attr("type", "submit")
//   alertSubmit.attr("id", "submitBtn" + index)
//   var buttonLabel = document.createTextNode("Submit")
//   alertSubmit.append(buttonLabel)
//   var alertDelete = $('<button class="btn btn-error"/>')
//   var deleteWrap = $("<div/>")
//   alertDelete.attr("id", "deleteBtn" + index)
//   var deleteLabel = document.createTextNode("DELETE")
//   alertDelete.append(deleteLabel)
//   alertButtons.append(alertSubmit, alertDelete)

//   var durationLabel = $("<label/>")
//   durationLabel.attr("for", "duration" + index)
//   durationLabel.append(document.createTextNode("Duration of Alert in seconds: "))
//   var duration = $("<input/>")
//   duration.attr("size", "4")
//   duration.attr("id", "duration" + index)
//   durationLabel.append(duration).addClass("col-span-3")

//   var keywordColourLabel = $("<label/>")
//   keywordColourLabel.attr("for", "keywordColour" + index)
//   keywordColourLabel.append(document.createTextNode("Primary Color: "))
//   var keywordColour = $("<input/>")
//   keywordColour.attr("id", "keywordColour" + index)
//   keywordColour.attr("data-jscolor", '{preset:"dark large"}')
//   keywordColour.attr("size", "4")
//   keywordColourLabel.append(keywordColour).addClass("col-span-3")

//   var fontColourLabel = $("<label/>")
//   fontColourLabel.attr("for", "fontColour" + index)
//   fontColourLabel.append(document.createTextNode("Font Color: "))
//   var fontColour = $("<input/>")
//   fontColour.attr("id", "fontColour" + index)
//   fontColour.attr("data-jscolor", '{preset:"dark large"}')
//   fontColour.attr("size", "6")
//   fontColourLabel.append(fontColour).addClass("col-span-3")

//   var fontLabel = $("<label/>")
//   fontLabel.attr("for", "font")
//   fontLabel.append(document.createTextNode("Font: ")).addClass("col-span-2")
//   var font = $("<select/>")
//   font.attr("id", "font" + index).addClass("max-w-8")
//   fonts.forEach(populateFontList)
//   fontLabel.append(font)

//   var fontSizeLabel = $("<label/>")
//   fontSizeLabel.attr("for", "fontSize")
//   fontSizeLabel.append(document.createTextNode("Font Size: ")).addClass("col-span-2")
//   var fontSize = $("<input/>")
//   fontSize.attr("size", "4")
//   fontSize.attr("id", "fontSize" + index)
//   fontSizeLabel.append(fontSize)

//   var fontWeightLabel = $("<label/>")
//   fontWeightLabel.attr("for", "fontWeight")
//   fontWeightLabel.append(document.createTextNode("Font Weight: "))
//   var fontWeight = $("<input/>")
//   fontWeight.attr("size", "4")
//   fontWeight.attr("id", "fontWeight" + index)
//   fontWeightLabel.append(fontWeight).addClass("col-span-2")

//   var customCSSLabel = $("<label/>")
//   customCSSLabel.attr("for", "customCSS" + index)
//   customCSSLabel.append(document.createTextNode("Custom CSS: "))
//   var customCSS = $("<textarea/>")
//   customCSS.attr("id", "customCSS" + index)
//   customCSSLabel.append(customCSS).addClass("col-span-6 row-span-2").css("width", "100%")

//   // None Option for drop down menu's
//   var noneOption = $("<option/>")
//   noneOption.attr("value", "none")
//   var noneLabel = document.createTextNode("None")
//   noneOption.append(noneLabel)

//   // Menu for graphics
//   var select = $("<select/>")
//   select
//     .attr("id", "select" + index)
//     .attr("multiple", "")
//     .addClass("chosen-select")
//   var selectLabel = $("<label/>")
//   selectLabel.attr("for", "select" + index)
//   selectLabel.append(document.createTextNode("Media: ")).append(select).addClass("col-span-6 row-span-2")
//   art.on("change", (v) => {
//     removeAllChildren(select)
//     v.forEach(populateList)
//     if ($(document.body).has("#" + select.attr("id"))) {
//       $("#select" + index)
//         .find("option")
//         .each((i, e) => {
//           if ((value.media as string[]).includes($(e).val() as string)) $(e).prop("selected", true)
//         })
//     }
//     select.trigger("change")
//   })

//   // Menu for sounds
//   var selectSound = $("<select/>")
//   selectSound.attr("id", "select-sound" + index)
//   var selectSoundLabel = $("<label/>")
//   selectSoundLabel.attr("for", "select-sound" + index)
//   selectSoundLabel.append(document.createTextNode("Sound: "))
//   selectSound.append(noneOption.clone(true)).addClass("w-full")
//   sound.on("change", (v) => {
//     removeAllChildren(selectSound)
//     selectSound.append(noneOption.clone(true))
//     v.forEach(populateSoundList)
//     if ($(document.body).has(selectSound.attr("id"))) {
//       $("#select-sound" + index).val(value.sound)
//     }
//   })
//   selectSoundLabel.append(selectSound).addClass("col-span-4")

//   var volumeLabel = $("<label/>")
//   volumeLabel.attr("for", "volume" + index)
//   volumeLabel.append(document.createTextNode("/100 (Volume)"))
//   var volume = $("<input/>")
//   volume.attr("size", "4")
//   volume.attr("id", "volume" + index)
//   volumeLabel.append(volume).addClass("col-span-2")

//   // Menu for layouts
//   var selectLayout = $("<select/>")
//   selectLayout.attr("id", "selectLayout" + index)
//   var selectLayoutLabel = $("<label/>").addClass("col-span-3")
//   selectLayoutLabel.attr("for", "selectLayout" + index)
//   selectLayoutLabel.append(document.createTextNode("Layout: "))
//   selectLayoutLabel.append(selectLayout)

//   // Layout options
//   var layoutOption = $("<option/>")
//   layoutOption.attr("value", "banner")
//   var layoutOptionLabel = document.createTextNode("banner")
//   layoutOption.append(layoutOptionLabel)
//   selectLayout.append(layoutOption)

//   layoutOption = $("<option/>")
//   layoutOption.attr("value", "side")
//   layoutOptionLabel = document.createTextNode("side")
//   layoutOption.append(layoutOptionLabel)
//   selectLayout.append(layoutOption)

//   layoutOption = $("<option/>")
//   layoutOption.attr("value", "above")
//   layoutOptionLabel = document.createTextNode("above")
//   layoutOption.append(layoutOptionLabel)
//   selectLayout.append(layoutOption)

//   // Create form for alert
//   form.append(name)
//   form.append(selectLabel)
//   form.append(durationLabel)
//   form.append(selectLayoutLabel)
//   form.append(selectSoundLabel)
//   form.append(volumeLabel)
//   form.append(keywordColourLabel)
//   form.append(fontColourLabel)
//   form.append(fontLabel)
//   form.append(fontSizeLabel)
//   form.append(fontWeightLabel)
//   form.append(customCSSLabel)
//   form.append(customCSS)
//   // form.append($("<br/>"))
//   // form.append(messageTemplate)
//   // form.append(messageTemplateInput)
//   form.append($("<br/>"))
//   form.append(alertButtons)

//   alertWrap.append(form)
//   alertSelect.append(alertHide)
//   div.append(alertWrap)
//   // Load the saved settings
//   $("#alert" + index + "Name").val(value.name)
//   $("#duration" + index).val(toSeconds(value.duration).toString())
//   if (typeof value.media === "object")
//     $("#select" + index)
//       .find("option")
//       .each((i, e) => {
//         if ((value.media as string[]).includes($(e).val() as string)) {
//           $(e).prop("selected", true)
//         }
//       })
//   else $("#select" + index).val(value.media)
//   $("#selectLayout" + index).val(value.layout)
//   $("#select-sound" + index).val(value.sound)
//   $("#volume" + index).val(value.volume)
//   $("#keywordColour" + index).val(value.keywordColour)
//   $("#fontColour" + index).val(value.fontColour)
//   $("#customCSS" + index).val(value.customCSS)
//   $("#font" + index).val(value.font)
//   $("#fontSize" + index).val(value.fontSize)
//   $("#fontWeight" + index).val(value.fontWeight)

//   // Delete alert
//   $("#deleteBtn" + index).on("click", (e) => {
//     alerts.value.splice(index, 1)
//   })
//   // show/hide alert
//   alertSelect.on("change", (e) => {
//     if (alertSelect.find("option:selected").val() === index.toString()) {
//       console.log("Selected ", value.name)
//       var showHide = $("#alertWrap" + index)
//       if (activeAlertWrap) {
//         activeAlertWrap.css("display", "none")
//       }
//       activeAlertWrap = showHide.css("display", "unset") as JQuery<HTMLDivElement>
//     }
//   })
//   // Save changes
//   $("#submitBtn" + index).on("click", (e) => {
//     e.preventDefault()
//     value.name = $("#alert" + index + "Name").val() as string
//     value.duration = toMS(parseInt($("#duration" + index).val() as string))
//     value.media = $("#select" + index)
//       .find("option:selected")
//       .map((i, e) => {
//         return $(e).val() as number
//       })
//       .get()
//     value.layout = $("#selectLayout" + index).val() as string
//     value.sound = $("#select-sound" + index).val() as string
//     value.volume = $("#volume" + index).val() as number
//     value.keywordColour = $("#keywordColour" + index).val() as string
//     value.fontColour = $("#fontColour" + index).val() as string
//     value.customCSS = $("#customCSS" + index).val() as string
//     value.font = $("#font" + index).val() as string
//     value.fontSize = $("#fontSize" + index).val() as string
//     value.fontWeight = $("#fontWeight" + index).val() as string
//     // if (messageTemplateInput.val() !== "") value.message = messageTemplateInput.val() as string
//     console.log("Submitted alert ", value)
//   })
//   // Populate the graphic asset menu

//   function populateList(value, index, array) {
//     var option = $("<option/>")
//     option.attr("value", index)
//     var optionLabel = document.createTextNode(value.base)
//     option.append(optionLabel)
//     select.append(option)
//   }
//   // I should combine this with graphic menu and make it work for all select menu's.
//   // Populate the sound asset menu
//   function populateSoundList(value, index, array) {
//     if (value.base) {
//       var option = $("<option/>")
//       option.attr("value", index)
//       var optionLabel = document.createTextNode(value.base)
//       option.append(optionLabel)
//       selectSound.append(option)
//     }
//   }

//   // Populate the font menu
//   function populateFontList(value, index, array) {
//     var option = $("<option/>")
//     option.attr("value", value)
//     var optionLabel = document.createTextNode(value)
//     option.append(optionLabel)
//     font.append(option)
//   }

//   function removeAllChildren(parent: JQuery<HTMLElement>) {
//     parent.children().remove()
//   }

//   // Conversions
//   function toSeconds(ms: number): number {
//     return ms / 1000
//   }
//   function toMS(seconds: number): number {
//     return seconds * 1000
//   }
// }

// $(function () {
//   alertSelect.trigger("change")
// })
// // Create a new alert.
// $("#newAlert").on("click", (e) => {
//   e.preventDefault()
//   e.stopPropagation()
//   alerts.value.push({
//     name: "Alert1",
//     message: "(name) just tipped (amount) (currency)",
//     duration: 5000,
//     sound: "none",
//     media: [],
//     keywordColour: "#4FE639",
//     fontColour: "#FFFFFF",
//     layout: "banner",
//     volume: 80,
//     customCSS: "",
//     font: "'Lilita One'",
//     fontWeight: "800",
//     fontSize: "64",
//   })
// })

// $("#testAlert").on("click", (e) => {
//   e.preventDefault()
//   e.stopPropagation()
//   var { name, message, attachMsg } = testAlerts()
//   console.log(
//     "sending test alert :",
//     `\n\tname: "${name}"`,
//     `\n\tmessage: "${message}"`,
//     `\n\tattachedMsg: "${attachMsg}"`
//   )

//   fetch("/alerts/alert", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       name: name,
//       message: message,
//       attachMsg: attachMsg,
//     }),
//   })
//     .then((v) => v.text())
//     .then((v) => console.log(v))
//     .catch((e) => console.log(e))
// })

// var alertTypes = ["follow", "subscriber", "gift-subscriber", "cheer", "tip", "host", "raid"]
// const testAlerts: () => Alerts.Alert = function () {
//   let name = ["Barbie", "sans", "lorem", "GalGodot", "minecraft_steve"].find((v, i, arr) => (Math.random() < 1 / arr.length) || i === arr.length - 1)
//   let alert = alertTypes[(Math.random() * alertTypes.length) | 0]
//   let attachMsg = alert.match(/(tip|cheer|subscriber|follow|gift-subscriber)/) ? "yo bro heres some money ;D Pog HYPERS" : undefined
//   let data = {
//     viewers: (Math.random() * 100) | 0,
//     amount: (Math.random() * 100) | 0,
//     currency: "$",
//     gifter: "QTCinderella",
//     tier: ["tier 1", "tier 2", "tier 3", "prime"].find((v, i, arr) => (Math.random() < 1 / arr.length) || i === arr.length - 1)
//   }
//   var randomAlert: Alerts.Alert = alertBuilder(name, alert, attachMsg, data)

//   return randomAlert
// }

// const alertBuilder = (
//   name: string,
//   type: string,
//   attachMsg: string | undefined,
//   data: { viewers: number; amount: number; currency: string; gifter: string; tier: string }
// ) => {
//   let message = ""
//   switch (type) {
//     case "follow":
//       message = `(${name}) just followed!`
//       break
//     case "cheer":
//       message = `(${name}) just cheered (${data.amount}) bitties!`
//       break
//     case "host":
//       message = `(${name}) just hosted with (${data.viewers}) viewers!`
//       break
//     case "raid":
//       message = `(${name}) just raided with (${data.viewers}) raiders!`
//       break
//     case "subscriber":
//       message = `(${name}) just subscribed as a (${data.tier})!`
//       break
//     case "gift-subscriber":
//       message = `(${data.gifter}) just gifted a (${data.tier}) subscription to (${name})! ${data.tier === "prime" ? "How the fuck did they do that?!" : ""
//         }`
//       break
//     case "tip":
//       message = `(${name}) just tipped (${data.amount}) (${data.currency})`
//       break
//   }
//   return {
//     name: type,
//     message: message,
//     attachMsg: attachMsg,
//   } as Alerts.Alert
// }
// $("#refreshAlerts").on("click", (e) => {
//   e.preventDefault()
//   div.children().remove()
//   alertSelect.children().remove()
//   alerts.value.forEach(showPanels)
//   alertSelect.trigger("change")
//   $(".chosen-select").select2({
//     placeholder: "Choose Media to play",
//     closeOnSelect: false,
//     theme: "bootstrap4",
//     dropdownCssClass: ":all:", containerCssClass: ":all:"
//   })
// })
