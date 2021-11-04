import { requireService } from "nodecg-io-core"
import { NodeCG } from "nodecg-types/types/server"
import { StreamElementsServiceClient } from "nodecg-io-streamelements"
import { TwitchAddonsClient } from "nodecg-io-twitch-addons"
import { TwitchApiServiceClient } from "nodecg-io-twitch-api"
import { TwitchChatServiceClient } from "nodecg-io-twitch-chat"
import { TwitchPubSubServiceClient } from "nodecg-io-twitch-pubsub"
// import { GoogleApisServiceClient } from "nodecg-io-googleapis"
const channel = "devJimmyboy"
type CustomReward = { title: string; cost: number; desc: string; action: () => any; id: string | undefined }
type Redemption = {}
module.exports = function (nodecg: NodeCG) {
  nodecg.log.info("twitch bundle started.")
  const customReward = nodecg.Replicant<CustomReward[]>("customRewards", { defaultValue: [], persistent: true })
  const redemptions = nodecg.Replicant<Redemption>("redemptions", { defaultValue: [], persistent: true })

  const streamelements = requireService<StreamElementsServiceClient>(nodecg, "streamelements")
  const twitchAddons = requireService<TwitchAddonsClient>(nodecg, "twitch-addons")
  const twitchApi = requireService<TwitchApiServiceClient>(nodecg, "twitch-api")
  const twitchChat = requireService<TwitchChatServiceClient>(nodecg, "twitch-chat")
  const twitchPubsub = requireService<TwitchPubSubServiceClient>(nodecg, "twitch-pubsub")
  // const youtube = requireService<GoogleApisServiceClient>(nodecg, "googleapis")

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

  twitchApi?.onAvailable(
    async (twitchApiClient) => {
      nodecg.log.info("twitch-api service has been updated.")
      const channelInfo = await twitchApiClient.helix.channels.getChannelInfo(channel)
      const rewardsInfo = await twitchApiClient.helix.channelPoints.getCustomRewards(channelInfo?.id as string)
      for (let i of rewardsInfo) {
        // If one of our custom rewards is already in the database, log it.
        let cR = customReward.value.find((r) => i.title === r.title)
        if (cR) {
          cR.id = i.id
        }
      }
      for (let r of customReward.value) {
        if (r.id) {
          let cR = await twitchApiClient.helix.channelPoints.updateCustomReward(channelInfo?.id as string, r.id, {
            isPaused: false,
            title: r.title,
            cost: r.cost,
            prompt: r.desc,
            isEnabled: true,
          })
        } else {
          let cR = await twitchApiClient.helix.channelPoints.createCustomReward(channelInfo?.id as string, {
            title: r.title,
            cost: r.cost,
            prompt: r.desc,
            isEnabled: true,
          })
          r.id = cR.id
        }
      }
    } // You can now use the twitch-api client here.
  )

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

  // youtube?.onAvailable(async (youtubeClient) => {
  //   // You can now use the youtube client here.
  // })

  // youtube?.onUnavailable(() => {
  //   nodecg.log.info("youtube has been unset.")
  // })
}
