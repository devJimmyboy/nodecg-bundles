import { NodeCG } from "nodecg-types/types/server"

//@ts-check
const requireService = require("nodecg-io-core").requireService

module.exports = function (nodecg: NodeCG) {
  nodecg.log.info("twitch-chat bundle started.")

  const Chat = nodecg.Replicant("Chat", { defaultValue: {} })

  const twitchChannels = ["#devjimmyboy"]

  const twitchAddons = requireService(nodecg, "twitch-addons")
  const twitchChat = requireService(nodecg, "twitch-chat")

  twitchAddons?.onAvailable(async (client) => {
    nodecg.log.info("twitch-addons service has been updated.")
    // You can now use the twitch-addons client here.
  })

  twitchAddons?.onUnavailable(() => {
    nodecg.log.info("twitch-addons has been unset.")
  })

  const registered = []

  twitchChat?.onAvailable(
    /** @param {import("nodecg-io-twitch-chat").TwitchChatServiceClient} client*/ (client) => {
      nodecg.log.info("Twitch chat client has been updated, adding handlers for messages.")

      twitchChannels.forEach((channel) => {
        addListeners(nodecg, client, channel)
      })
    }
  )

  twitchChat?.onUnavailable(() => nodecg.log.info("Twitch chat client has been unset."))
}

/**
 *
 *
 * @param {import("nodecg/types/server").NodeCG} nodecg
 * @param {import("nodecg-io-twitch-chat").TwitchChatServiceClient} client
 * @param {string} channel
 */
function addListeners(nodecg, client, channel) {
  client
    .join(channel)
    .then(() => {
      nodecg.log.info(`Connected to twitch channel "${channel}"`)

      client.onMessage((chan, user, message, _msg) => {
        if (user === client.currentNick) return
        nodecg.sendMessage("chat-message", {
          channel: chan,
          user,
          message,
          _msg,
        })
        if (chan === channel.toLowerCase()) {
          // nodecg.log.info(_msg.parseEmotes())
          // nodecg.log.info(`Twitch chat: ${user} in ${channel}: ${message}`)
          if (message.startsWith("!pobox")) {
            client.say(channel, `Jebaited`)
          }
        }
      })
    })
    .catch((reason) => {
      nodecg.log.error(`Couldn't connect to twitch: ${reason}.`)
      nodecg.log.info("Retrying in 5 seconds.")
      setTimeout(() => addListeners(nodecg, client, channel), 5000)
    })
}
