///<reference types="nodecg-types/types/browser"/>
import "./index.css"
import $ from "jquery"
import jscolor from "@eastdesire/jscolor"
import Iconify from "@iconify/iconify"
import { Alerts } from "../../global"
Iconify.scan()

const alerts = nodecg.Replicant<Alerts.Alert[]>("alerts")

const art = nodecg.Replicant<Alerts.Asset[]>("assets:media-graphics")
const sound = nodecg.Replicant<Alerts.Asset[]>("assets:media-sounds")

NodeCG.waitForReplicants(alerts, art, sound).then(() => {
  alerts.value.forEach(showPanels)
  jscolor.install()
})

function showPanels(value, index, array) {
  var fonts = [
    "Arial, sans-serif",
    "'Times New Roman', serif",
    "'Courier New', monospace",
    "'Brush Script MT', cursive",
    "Palanquin",
    "'Aclonica'",
    "'Aladin'",
    "'Amita'",
    "''Audiowide'",
    "'Balsamiq Sans'",
    "'Bebas Neue'",
    "'Fontdiner Swanky'",
    "'Lilita One'",
  ]

  var alertHide = $("button")
  alertHide.attr("id", "alertHide" + index)
  var alertHideLabel = document.createTextNode("Show/Hide Alert " + index)
  alertHide.append(alertHideLabel)

  var alertWrap = $("div")
  alertWrap.attr("style", "display: none")
  alertWrap.attr("id", "alertWrap" + index)

  var alreadyExists = $("#alert" + index)
  const div = $("#alerts-wrap")
  var form = $("<form/>")
  form.attr("id", "alert" + index)
  var name = $("<label/>")
  name.attr("for", "alert" + index + "Name")
  var nameLabel = document.createTextNode("Alert Name: ")
  name.append(nameLabel)
  var nameInput = $("<input/>")
  nameInput.attr("id", "alert" + index + "Name")
  var alertSubmit = $("<button/>")
  alertSubmit.attr("type", "submit")
  alertSubmit.attr("id", "submitBtn" + index)
  var buttonLabel = document.createTextNode("Submit")
  alertSubmit.append(buttonLabel)
  var alertDelete = $("<button/>")
  var deleteWrap = $("<div/>")
  alertDelete.attr("id", "deleteBtn" + index)
  var deleteLabel = document.createTextNode("DELETE")
  alertDelete.append(deleteLabel)
  var durationLabel = $("<label/>")
  durationLabel.attr("for", "duration" + index)
  durationLabel.append(document.createTextNode("Duration of Alert in seconds: "))
  var duration = $("<input/>")
  duration.attr("size", "4")
  duration.attr("id", "duration" + index)

  var keywordColourLabel = $("<label/>")
  keywordColourLabel.attr("for", "keywordColour" + index)
  keywordColourLabel.append(document.createTextNode("Keyword Colour: "))
  var keywordColour = $("<input/>")
  keywordColour.attr("id", "keywordColour" + index)
  keywordColour.attr("data-jscolor", '{preset:"dark large"}')
  keywordColour.attr("size", "4")

  var fontColourLabel = $("<label/>")
  fontColourLabel.attr("for", "fontColour" + index)
  fontColourLabel.append(document.createTextNode("Font Colour: "))
  var fontColour = $("<input/>")
  fontColour.attr("id", "fontColour" + index)
  fontColour.attr("data-jscolor", '{preset:"dark large"}')
  fontColour.attr("size", "6")

  var fontLabel = $("<label/>")
  fontLabel.attr("for", "font")
  fontLabel.append(document.createTextNode("Font: "))
  var font = $("<select/>")
  font.attr("id", "font" + index)
  fonts.forEach(populateFontList)

  var fontSizeLabel = $("<label/>")
  fontSizeLabel.attr("for", "fontSize")
  fontSizeLabel.append(document.createTextNode("Font Size: "))
  var fontSize = $("<input/>")
  fontSize.attr("size", "4")
  fontSize.attr("id", "fontSize" + index)

  var fontWeightLabel = $("<label/>")
  fontWeightLabel.attr("for", "fontWeight")
  fontWeightLabel.append(document.createTextNode("Font Weight: "))
  var fontWeight = $("<input/>")
  fontWeight.attr("size", "4")
  fontWeight.attr("id", "fontWeight" + index)

  var customCSSLabel = $("<label/>")
  customCSSLabel.attr("for", "customCSS" + index)
  customCSSLabel.append(document.createTextNode("Custom CSS: "))
  var customCSS = $("<textarea/>")
  customCSS.attr("id", "customCSS" + index)

  // None Option for drop down menu's
  var noneOption = $("<option/>")
  noneOption.attr("value", "none")
  var noneLabel = document.createTextNode("None")
  noneOption.append(noneLabel)

  // Menu for graphics
  var select = $("<select/>")
  select.attr("id", "select" + index)
  var selectLabel = $("<label/>")
  selectLabel.attr("for", "select" + index)
  selectLabel.append(document.createTextNode("Media: "))
  select.append(noneOption.clone(true))
  art.on("change", (v) => {
    removeAllChildren(select)
    select.append(noneOption.clone(true))
    v.forEach(populateList)
    if ($(document.body).has(select.attr("id"))) {
      $("#select" + index).val(value.media)
    }
  })

  // Menu for sounds
  var selectSound = $("<select/>")
  selectSound.attr("id", "select-sound" + index)
  var selectSoundLabel = $("<label/>")
  selectSoundLabel.attr("for", "select-sound" + index)
  selectSoundLabel.append(document.createTextNode("Sound: "))
  selectSound.append(noneOption.clone(true))
  sound.on("change", (v) => {
    removeAllChildren(selectSound)
    selectSound.append(noneOption.clone(true))
    v.forEach(populateSoundList)
    if ($(document.body).has(selectSound.attr("id"))) {
      $("#select-sound" + index).val(value.sound)
    }
  })

  var volumeLabel = $("<label/>")
  volumeLabel.attr("for", "volume" + index)
  volumeLabel.append(document.createTextNode("/100 (Volume)"))
  var volume = $("<input/>")
  volume.attr("size", "4")
  volume.attr("id", "volume" + index)

  // Menu for layouts
  var selectLayout = $("<select/>")
  selectLayout.attr("id", "selectLayout" + index)
  var selectLayoutLabel = $("<label/>")
  selectLayoutLabel.attr("for", "selectLayout" + index)
  selectLayoutLabel.append(document.createTextNode("Layout: "))

  // Layout options
  var layoutOption = $("<option/>")
  layoutOption.attr("value", "banner")
  var layoutOptionLabel = document.createTextNode("banner")
  layoutOption.append(layoutOptionLabel)
  selectLayout.append(layoutOption)

  layoutOption = $("<option/>")
  layoutOption.attr("value", "side")
  layoutOptionLabel = document.createTextNode("side")
  layoutOption.append(layoutOptionLabel)
  selectLayout.append(layoutOption)

  layoutOption = $("<option/>")
  layoutOption.attr("value", "above")
  layoutOptionLabel = document.createTextNode("above")
  layoutOption.append(layoutOptionLabel)
  selectLayout.append(layoutOption)

  // Create form for alert
  form.append(name)
  form.append(nameInput)
  form.append($("<br/>"))
  form.append(selectLabel)
  form.append(select)
  form.append($("<br/>"))
  form.append(durationLabel)
  form.append(duration)
  form.append($("<br/>"))
  form.append(selectLayoutLabel)
  form.append(selectLayout)
  form.append($("<br/>"))
  form.append(selectSoundLabel)
  form.append(selectSound)
  form.append(volume)
  form.append(volumeLabel)
  form.append($("<br/>"))
  form.append(keywordColourLabel)
  form.append(keywordColour)
  form.append(fontColourLabel)
  form.append(fontColour)
  form.append($("<br/>"))
  form.append(fontLabel)
  form.append(font)
  form.append($("<br/>"))
  form.append(fontSizeLabel)
  form.append(fontSize)
  form.append(fontWeightLabel)
  form.append(fontWeight)
  form.append($("<br/>"))
  form.append(customCSSLabel)
  form.append($("<br/>"))
  form.append(customCSS)
  form.append($("<br/>"))
  form.append(alertSubmit)
  form.append(alertDelete)

  alertWrap.append(form)
  div.append(alertHide)
  div.append(alertWrap)
  // Load the saved settings
  $("#alert" + index + "Name").val(value.name)
  $("#duration" + index).val(toSeconds(value.duration).toString())
  $("#select" + index).val(value.media)
  $("#selectLayout" + index).val(value.layout)
  $("#select-sound" + index).val(value.sound)
  $("#volume" + index).val(value.volume)
  $("#keywordColour" + index).val(value.keywordColour)
  $("#fontColour" + index).val(value.fontColour)
  $("#customCSS" + index).val(value.customCSS)
  $("#font" + index).val(value.font)
  $("#fontSize" + index).val(value.fontSize)
  $("#fontWeight" + index).val(value.fontWeight)

  // Delete alert
  $("#deleteBtn" + index).on("click", (e) => {
    alerts.value.splice(index, 1)
  })
  // show/hide alert
  $("#alertHide" + index).on("click", (e) => {
    var showHide = $("#alertWrap" + index)
    if (showHide.css("display") == "none") {
      showHide.attr("style", "display: block")
    } else {
      showHide.attr("style", "display: none")
    }
  })
  // Save changes
  $("#submitBtn" + index).on("click", (e) => {
    e.preventDefault()
    console.log("Submit alert " + index)
    value.name = $("#alert" + index + "Name").val()
    value.duration = toMS(parseInt($("#duration" + index).text()))
    value.media = $("#select" + index).val()
    value.layout = $("#selectLayout" + index).val()
    value.sound = $("#select-sound" + index).val()
    value.volume = $("#volume" + index).val()
    value.keywordColour = $("#keywordColour" + index).val()
    value.fontColour = $("#fontColour" + index).val()
    value.customCSS = $("#customCSS" + index).val()
    value.font = $("#font" + index).val()
    value.fontSize = $("#fontSize" + index).val()
    value.fontWeight = $("#fontWeight" + index).val()
  })
  // Populate the graphic asset menu

  function populateList(value, index, array) {
    var option = $("<option/>")
    option.attr("value", index)
    var optionLabel = document.createTextNode(value.base)
    option.append(optionLabel)
    select.append(option)
  }
  // I should combine this with graphic menu and make it work for all select menu's.
  // Populate the sound asset menu
  function populateSoundList(value, index, array) {
    if (value.base) {
      var option = $("<option/>")
      option.attr("value", index)
      var optionLabel = document.createTextNode(value.base)
      option.append(optionLabel)
      selectSound.append(option)
    }
  }

  // Populate the font menu
  function populateFontList(value, index, array) {
    var option = $("<option/>")
    option.attr("value", value)
    var optionLabel = document.createTextNode(value)
    option.append(optionLabel)
    font.append(option)
  }

  function removeAllChildren(parent: JQuery<HTMLElement>) {
    parent.children().remove()
  }

  // Conversions
  function toSeconds(ms: number): number {
    return ms / 1000
  }
  function toMS(seconds: number): number {
    return seconds * 1000
  }
}
// Create a new alert.
$("#newAlert").on("click", (e) => {
  alerts.value.push({
    name: "Alert1",
    message: "(name) just tipped (amount) (currency)",
    duration: 5000,
    sound: "none",
    media: "none",
    keywordColour: "#4FE639",
    fontColour: "#FFFFFF",
    layout: "banner",
    volume: 80,
    customCSS: "",
    font: "Palanquin",
    fontWeight: "800",
    fontSize: "64",
  })
})
