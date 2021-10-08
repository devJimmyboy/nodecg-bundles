import { NodeCG } from "nodecg-types/types/server"
import { requireService } from "nodecg-io-core"
import { StreamElementsServiceClient } from "nodecg-io-streamelements/extension/StreamElements"
import axios from "axios"

const alert = axios.create({ baseURL: "/simple-alerts" })

module.exports = function (nodecg: NodeCG) {
  const streamelements = requireService<StreamElementsServiceClient>(nodecg, "streamelements")

  streamelements?.onAvailable(async function (client) {
    // You can now use the streamelements client here.
    nodecg.log.info("SE client has been updated, registering handlers now.")

    client.onEvent((data) => {
      nodecg.sendMessage("alert", data)
      nodecg.log.info(data)
    })

    client.onCheer((data) => {
      const cheer = data

      nodecg.log.info(`${data.data.displayName} just cheered ${data.data.amount} bit(s). Message: ${data.data.message}`)
    })

    client.onFollow((data) => {
      nodecg.log.info(`${data.data.displayName} just followed.`)
    })

    client.onSubscriber((data) => {
      if (data.data.tier) {
        const tier = data.data.tier === "prime" ? "Twitch Prime" : "Tier " + Number.parseInt(data.data.tier) / 1000
        nodecg.log.info(`${data.data.displayName} just subscribed for ${data.data.amount} months (${tier}).`)
      }
    })

    client.onGift((data) => {
      if (data.data.tier) {
        const tier = (Number.parseInt(data.data.tier) / 1000).toString()
        if (data.data.sender) {
          nodecg.log.info(
            `${data.data.displayName} just got a tier ${tier} subscription from ${data.data.sender}! It's ${data.data.displayName}'s ${data.data.amount} month.`
          )
        } else {
          nodecg.log.info(
            `${data.data.displayName} just got a tier ${tier} subscription! It's ${data.data.displayName}'s ${data.data.amount} month.`
          )
        }
      }
    })

    client.onHost((data) => {
      nodecg.log.info(`${data.data.displayName} just hosted the stream for ${data.data.amount} viewer(s).`)
    })

    client.onRaid((data) => {
      nodecg.log.info(`${data.data.displayName} just raided the stream with ${data.data.amount} viewers.`)
    })

    client.onTip((data) => {
      if (data.data.currency) {
        nodecg.log.info(
          `${data.data.username} just donated ${data.data.amount} ${data.data.currency}. Message. ${data.data.message}`
        )
      }
    })
    nodecg.log.info("StreamElements Event Names:" + client.eventNames())
  })

  streamelements?.onUnavailable(() => {
    nodecg.log.info("streamelements not initialized yet.")
  })
}
