import { requireService } from "nodecg-io-core"
import { NodeCG } from "nodecg/types/server"
import { StreamElementsServiceClient } from "nodecg-io-streamelements"
import { TwitchAddonsClient } from "nodecg-io-twitch-addons"
import { TwitchApiServiceClient } from "nodecg-io-twitch-api"
import { TwitchChatServiceClient } from "nodecg-io-twitch-chat"
import { TwitchPubSubServiceClient } from "nodecg-io-twitch-pubsub"
import { GoogleApisServiceClient } from "nodecg-io-googleapis"

module.exports = function (nodecg: NodeCG) {
  nodecg.log.info("twitch bundle started.")

  const streamelements = requireService<StreamElementsServiceClient>(nodecg, "streamelements")
  const twitchAddons = requireService<TwitchAddonsClient>(nodecg, "twitch-addons")
  const twitchApi = requireService<TwitchApiServiceClient>(nodecg, "twitch-api")
  const twitchChat = requireService<TwitchChatServiceClient>(nodecg, "twitch-chat")
  const twitchPubsub = requireService<TwitchPubSubServiceClient>(nodecg, "twitch-pubsub")
  const youtube = requireService<GoogleApisServiceClient>(nodecg, "googleapis")

  streamelements?.onAvailable(async (streamelementsClient) => {
    nodecg.log.info("streamelements service has been updated.")
    // You can now use the streamelements client here.
  })

  streamelements?.onUnavailable(() => {
    nodecg.log.info("streamelements has been unset.")
  })

  twitchAddons?.onAvailable(async (twitchAddonsClient) => {
    nodecg.log.info("twitch-addons service has been updated.")
    // You can now use the twitch-addons client here.
  })

  twitchAddons?.onUnavailable(() => {
    nodecg.log.info("twitch-addons has been unset.")
  })

  twitchApi?.onAvailable(async (twitchApiClient) => {
    nodecg.log.info("twitch-api service has been updated.")
    // You can now use the twitch-api client here.
  })

  twitchApi?.onUnavailable(() => {
    nodecg.log.info("twitch-api has been unset.")
  })

  twitchChat?.onAvailable(async (twitchChatClient) => {
    nodecg.log.info("twitch-chat service has been updated.")
    // You can now use the twitch-chat client here.
  })

  twitchChat?.onUnavailable(() => {
    nodecg.log.info("twitch-chat has been unset.")
  })

  twitchPubsub?.onAvailable(async (twitchPubsubClient) => {
    nodecg.log.info("twitch-pubsub service has been updated.")
    // You can now use the twitch-pubsub client here.
  })

  twitchPubsub?.onUnavailable(() => {
    nodecg.log.info("twitch-pubsub has been unset.")
  })

  youtube?.onAvailable(async (youtubeClient) => {
    // You can now use the youtube client here.
  })

  youtube?.onUnavailable(() => {
    nodecg.log.info("youtube has been unset.")
  })
}
