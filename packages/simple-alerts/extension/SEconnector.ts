import { NodeCG } from "nodecg-types/types/server"
import { requireService } from "nodecg-io-core"
import { StreamElementsServiceClient } from "nodecg-io-streamelements/extension/StreamElements"
import { StreamElementsEvent } from "nodecg-io-streamelements/extension/types"
import axios from "axios"
import { Alerts } from "../global"

const alert = axios.create({ baseURL: "bundles/simple-alerts" })

module.exports = function (nodecg: NodeCG) {
  // nodecg.listenFor("alert", (data: Alerts.Alert) => alert.post("/alerts", data))

  const streamelements = requireService<StreamElementsServiceClient>(nodecg, "streamelements")

  streamelements?.onAvailable(async function (client) {
    // You can now use the streamelements client here.
    nodecg.log.info("SE client has been updated, registering handlers now.")

    client.onEvent((data) => {
      // nodecg.sendMessage("alert", data)
      nodecg.log.info(data)
    })

    client.onCheer((data) => sendAlert(data.type, data.data))

    client.onFollow((data) => sendAlert(data.type, data.data))

    client.onSubscriber((data) => sendAlert(data.type, data.data))

    client.onGift((data) => sendAlert(data.type, data.data))

    client.onHost((data) => sendAlert(data.type, data.data))

    client.onRaid((data) => sendAlert(data.type, data.data))

    client.onTip((data) => sendAlert(data.type, data.data))
    nodecg.log.info("StreamElements Event Names:" + client.eventNames())
  })

  streamelements?.onUnavailable(() => {
    nodecg.log.info("streamelements not initialized yet.")
  })

  function sendAlert(type: StreamElementsEvent["type"], data: StreamElementsEvent["data"]) {
    var alert: Alerts.Alert = { name: type, message: "", event: data }
    switch (type) {
      case "follow":
        alert.message = `${data.displayName} just followed!`
        break
      case "cheer":
        alert.message = `${data.displayName} just wired me ${data.amount} bitties!`
        alert.attachedMsg = data.message || ""
        break
      case "host":
        alert.message = `${data.displayName} just hosted me with ${data.amount} lil fuckers!`
        nodecg.sendMessage("host", data.displayName)
        break
      case "raid":
        alert.message = `${data.displayName} just raided with ${data.amount} PogChampions 😎`
        break
      case "subscriber":
        alert.message =
          (data.gifted
            ? `${data.sender} just gifted a Tier ${
                data.tier && (parseInt(data.tier as string) / 1000).toString()
              } sub to ${data.displayName}!`
            : `${data.displayName} just subscribed to the channel! `) +
          (data.streak == 1 ? `It's their first sub to the channel!` : `They have a streak of ${data.streak} months!`)
        if (data.message) alert.attachedMsg = data.message
        break
      case "tip":
        alert.message = `${data.displayName || data.username || "anonymous"} gave me ${data.currency || ""}${
          data.amount || "money"
        }! Holy shit! Thanks!`
        alert.attachedMsg = data.message
        break
    }
    nodecg.sendMessage("alert", alert)
  }
}
