"use strict"
import { NodeCG } from "nodecg-types/types/server"
import e from "express"

module.exports = function (nodecg: NodeCG) {
  require("./SEconnector")(nodecg)
  // An array of alerts and their settings
  nodecg.Replicant<Alerts.Alert[]>("alerts", {
    defaultValue: [
      {
        name: "Default Alert",
        message: "",
        duration: 5000,
        media: "none",
        sound: "none",
        layout: "banner",
        volume: "80",
        keywordColour: "#4FE639",
        fontColour: "#FFFFFF",
        customCSS: "",
        font: '"Palanquin"',
        fontWeight: "800",
        fontSize: "64",
      },
    ],
  })
  // The currently active aleart, changed via the API
  nodecg.Replicant<number | undefined>("activeAlert", { defaultValue: 0, persistent: false })
  // Will use an array to queue up alerts
  nodecg.Replicant<Alerts.Alert[]>("alertQueue", { defaultValue: [], persistent: false })
  // Will use this to prevent alerts overlapping
  nodecg.Replicant<boolean>("isAlertPlaying", { defaultValue: false, persistent: false })
  // Current alert message is stored here
  nodecg.Replicant<Alerts.ActivateAlert>("activateAlert", {
    defaultValue: { activate: false, message: "", alert: 0 },
    persistent: false,
  })

  const router = nodecg.Router()
  const alerts = nodecg.Replicant<Alerts.Alert[]>("alerts")
  const alertQueue = nodecg.Replicant<Alerts.Alert[]>("alertQueue")
  const activeAlert = nodecg.Replicant<number | undefined>("activeAlert")
  const isAlertPlaying = nodecg.Replicant<boolean>("isAlertPlaying")

  router.post("/alert", (req: { body: any }, res) => {
    const alertName = req.body.name as string
    const message = req.body.message as string
    alerts.value.forEach(findAlert)
    res.send("Alert will be added to queue")
    function findAlert(value: Alerts.Alert, index: number, array: Alerts.Alert[]) {
      if (value.name === alertName) {
        console.log(value.message)
        // Add message to Queue
        if (typeof req.body.attachMsg != "undefined") {
          alertQueue.value.push({ message: message, attachedMsg: req.body.attachMsg as string, alert: index })
        } else {
          alertQueue.value.push({ message: message, alert: index })
        }
      }
    }
  })

  nodecg.mount("/simple-alerts", router) // The route '/simple-alerts/{routerRoute}` is now available

  function activateAlert(message: Alerts.Alert) {
    const activate = nodecg.Replicant<Alerts.ActivateAlert>("activateAlert")
    const activeAlert = nodecg.Replicant<number | undefined>("activeAlert")
    var change = false
    // Bool alway's changes, in case message's are the same.
    if (activate.value.activate == true) {
      change = false
    } else {
      change = true
    }
    activeAlert.value = message.alert
    if (typeof message.attachedMsg != "undefined") {
      activate.value = {
        message: message.message,
        attachedMsg: message.attachedMsg,
        alert: message.alert,
        activate: change,
      }
    } else {
      activate.value = { message: message.message, alert: message.alert, activate: change }
    }
  }

  alertQueue.on("change", (value) => {
    console.log(alertQueue.value)
    if (isAlertPlaying.value == false && alertQueue.value.length > 0) {
      activateAlert(alertQueue.value[0])
      //The graphics module sets this back to false when it is finished.
    }
  })
}
