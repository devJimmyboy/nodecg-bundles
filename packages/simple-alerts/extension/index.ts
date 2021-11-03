"use strict"
import { NodeCG } from "nodecg-types/types/server"
import { Alerts } from "../global"

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

  const alertHandler = (req: { body: any }, res: any) => {
    const alertName = req.body.name as string
    const message = req.body.message as string
    alerts.value.forEach(findAlert)
    if (res) res.send(`Alert ${JSON.stringify(req.body)} will be added to queue`)
    function findAlert(value: Alerts.Alert, index: number, array: Alerts.Alert[]) {
      if (value.name === alertName) {
        console.log(value.message)
        // Add message to Queue
        if (typeof req.body.attachMsg != "undefined") {
          alertQueue.value.push({ message: message, attachMsg: req.body.attachMsg as string, alert: index })
        } else {
          alertQueue.value.push({ message: message, alert: index })
        }
      }
    }
  }
  router.use((req, res, next) => {
    try {
      nodecg.log.info("received alert ", req.body.name, req.body.message)
    } catch (e) {
      nodecg.log.error(e)
    }
    next()
  })
  router.post("/alert", alertHandler)
  nodecg.listenFor("alert", (data: any) => alertHandler({ body: data }, undefined))

  nodecg.mount("/alerts", router) // The route '/alerts/{routerRoute}` is now available

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
    if (typeof message.attachMsg != "undefined") {
      activate.value = {
        message: message.message,
        attachedMsg: message.attachMsg,
        alert: message.alert,
        activate: change,
      }
    } else {
      activate.value = { message: message.message, alert: message.alert, activate: change }
    }
  }

  alertQueue.on("change", (value: any) => {
    console.log(alertQueue.value)
    if (isAlertPlaying.value == false && alertQueue.value.length > 0) {
      activateAlert(alertQueue.value[0])
      //The graphics module sets this back to false when it is finished.
    }
  })
}
