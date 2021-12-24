import { StreamElementsServiceClient } from "nodecg-io-streamelements/extension/StreamElements"
import { StreamElementsEvent } from "nodecg-io-streamelements/extension/StreamElementsEvent"
// import axios from "axios"
import { NodeCGServer } from "nodecg/types/lib/nodecg-instance"
import { ServiceProvider } from "nodecg-io-core"
import { Twitch } from "./Twitch"

// const alert = axios.create({ baseURL: "/alerts" })

module.exports = function (
  nodecg: NodeCGServer,
  streamelements: ServiceProvider<StreamElementsServiceClient>,
  alertHandler: Twitch
) {
  // nodecg.listenFor("alert", (data: Alerts.Alert) => alert.post("/alerts", data))

  streamelements?.onAvailable(async function (client) {
    // You can now use the streamelements client here.
    nodecg.log.info("SE client has been updated, registering handlers now.")

    client.onTest((data: any) => {
      let types = data.listener?.split("-")
      let msg = types?.[1]
      let event: undefined | StreamElementsEvent["data"]
      let type: undefined | "follow" | "subscriber" | "tip" | "cheer" | "host" | "raid"

      let message = ""
      if (msg !== undefined && msg !== "latest") return
      try {
        event = {
          type: data.event.type || types[0],
          displayName: data.event.displayName || data.event.name,
          username: data.event.name?.toLowerCase() || data.event.sender,
          message: data.event.message,
          tier: data.event.tier,
          sender: data.event.sender,
          gifted: data.event.gifted,
          amount: data.event.amount,
          count: data.event.count,
          quantity: data.event.amount,
          items: data.event.items,
          streak: data.event.gifted ? undefined : data.event.streak,
          avatar: data.event.avatar,
        }
        if (types?.[0] === "follower") data.event.type = types[0] = "follow"
        type = data.event.type || (types[0] as "follow" | "subscriber" | "tip" | "cheer" | "host" | "raid")
        nodecg.log.info(JSON.stringify(data))
        if (event.type === "bulk") type = event.type = data.type

        switch (type) {
          case "follow":
            message = `(${event.displayName}) followed!`
            break
          case "subscriber":
            message = `(${event.displayName}) subscribed!`
            break
          case "cheer":
            message = `(${event.displayName}) cheered ${event.amount}!`
            break
          case "host":
            message = `(${event.displayName}) is now hosting!`
            break
          case "raid":
            message = `(${event.displayName}) raided ${event.count} viewers!`
            break
          default:
            message = `(${event.displayName}) is (cool)`
        }
      } catch (e) {
        console.log(e)
      }
      if (type && event) alertHandler.sendAlert(type, message)
    })

    // client.onCheer((data) => alertHandler.sendAlert(data.type, `(${data.data.displayName}) just wired (${data.data.amount} bitties) to my bank account!`))

    // client.onFollow((data) => alertHandler.sendAlert(data.type, `(${data.data.displayName}) just became a (true g a m e r)`))

    // client.onSubscriber((data) => alertHandler.sendAlert(data.type, data.data))

    // client.onGift((data) => alertHandler.sendAlert(data.type, data.data))

    client.onHost((data) => alertHandler.sendAlert(data.type, `(${data.data.displayName}) just hosted lil' old me with (${data.data.amount} cool kids)!`))

    client.onRaid((data) => alertHandler.sendAlert(data.type, `(${data.data.displayName}) just raided lil' old me with (${data.data.amount} cool kids)!`))

    client.onTip((data) => alertHandler.sendAlert(data.type, `(${data.data.displayName}) just SENT ME MONEY!!!!! - (${data.data.currency}${data.data.amount} Pog Dollars)`, data.data.message))

    nodecg.log.info("StreamElements Event Names:" + client.eventNames())
  })

  streamelements?.onUnavailable(() => {
    nodecg.log.info("streamelements not initialized yet.")
  })
}
