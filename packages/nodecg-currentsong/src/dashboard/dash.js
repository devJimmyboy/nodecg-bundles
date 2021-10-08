import "materialize-css/dist/js/materialize.min.js"
import "./dash.css"

import $ from "jquery"
var showBtn = $("#songShow")
var hideBtn = $("#songHide")
var updateBtn = $("#configUpdate")

updateBtn.on("click", function () {
  bReplicants.configInfo.value = getConfigValues()
})
showBtn.on("click", function () {
  bReplicants.isShowing.value = true
})
hideBtn.on("click", function () {
  bReplicants.isShowing.value = false
})

var bReplicants = {
  configInfo: nodecg.Replicant("configInfo", {
    defaultValue: getConfigValues(),
  }),
  isShowing: nodecg.Replicant("isShowing", { defaultValue: false }),
}
bReplicants.isShowing.on("change", function (newVal) {
  showBtn.prop("disabled", newVal)
  hideBtn.prop("disabled", !newVal)
})
bReplicants.configInfo.on("change", function (newV, oldV) {
  $("#lastfmInfo").val(newV.lastfm)
  $("#songMessage").val(newV.msg)
  $("#configDuration").val(newV.duration)
  window.M.updateTextFields()
  console.log(`myRep changed from ${oldV} to ${JSON.stringify(newV)}`)
})

function getConfigValues() {
  return {
    lastfm: $("#lastfmInfo").val() || nodecg.bundleConfig.music.lastfm || "",
    msg: $("#songMessage").val() || nodecg.bundleConfig.music.message || "",
    duration: parseInt($("#configDuration").val()) || nodecg.bundleConfig.music.duration || 0,
  }
}
