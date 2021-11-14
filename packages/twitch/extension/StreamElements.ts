import { StreamElementsServiceClient } from "../../../../nodecg/nodecg-io/node_modules/nodecg-io-streamelements/extension/StreamElements"
import { StreamElementsEvent } from "../../../../nodecg/nodecg-io/node_modules/nodecg-io-streamelements/extension/StreamElementsEvent"
// import axios from "axios"
import { NodeCGServer } from "nodecg/types/lib/nodecg-instance"
import { ServiceProvider } from "../../../../nodecg/nodecg-io/node_modules/nodecg-io-core"
import { AlertHandler } from "./AlertHandle"

// const alert = axios.create({ baseURL: "/alerts" })

module.exports = function (
  nodecg: NodeCGServer,
  streamelements: ServiceProvider<StreamElementsServiceClient>,
  alertHandler: AlertHandler
) {
  // nodecg.listenFor("alert", (data: Alerts.Alert) => alert.post("/alerts", data))

  streamelements?.onAvailable(async function (client) {
    // You can now use the streamelements client here.
    nodecg.log.info("SE client has been updated, registering handlers now.")

    client.onTest((data: any) => {
      let types = data.listener?.split("-")
      let msg = types?.[1]
      if (msg !== undefined && msg !== "latest") return

      let event = {
        type: data.event.type || types[0],
        displayName: data.event.name,
        username: data.event.name.toLowerCase(),
        message: data.event.message,
        tier: data.event.tier,
        sender: data.event.sender,
        gifted: data.event.gifted,
        amount: data.event.amount,
        count: data.event.count,
        items: data.event.items,
        streak: data.event.streak || data.event.amount,
        avatar: "",
      } as StreamElementsEvent["data"]
      if (data.event.type === "follower") data.event.type = "follow"
      let type = data.event.type || (types[0] as "follow" | "subscriber" | "tip" | "cheer" | "host" | "raid")
      nodecg.log.info(JSON.stringify(data))
      alertHandler.sendAlert(type, event)
    })

    client.onCheer((data) => alertHandler.sendAlert(data.type, data.data))

    client.onFollow((data) => alertHandler.sendAlert(data.type, data.data))

    client.onSubscriber((data) => alertHandler.sendAlert(data.type, data.data))

    client.onGift((data) => alertHandler.sendAlert(data.type, data.data))

    client.onHost((data) => alertHandler.sendAlert(data.type, data.data))

    client.onRaid((data) => alertHandler.sendAlert(data.type, data.data))

    client.onTip((data) => alertHandler.sendAlert(data.type, data.data))

    nodecg.log.info("StreamElements Event Names:" + client.eventNames())
  })

  streamelements?.onUnavailable(() => {
    nodecg.log.info("streamelements not initialized yet.")
  })
}
