import { requireService } from "nodecg-io-core"
import { StreamElementsServiceClient } from "nodecg-io-streamelements"
import { TwitchAddonsClient } from "nodecg-io-twitch-addons"
import { TwitchApiServiceClient } from "nodecg-io-twitch-api"
import { TwitchChatServiceClient } from "nodecg-io-twitch-chat"
import { TwitchPubSubServiceClient } from "nodecg-io-twitch-pubsub"
import { NodeCGServer } from "nodecg/types/lib/nodecg-instance"
import { AlertHandler } from "./AlertHandle"
// import { GoogleApisServiceClient } from "nodecg-io-googleapi0s"
const channel = "devJimmyboy"
var channelId = ""
type CustomReward = { title: string; cost: number; desc: string; action: () => any; id: string | undefined }
type Redemption = {}
module.exports = function (nodecg: NodeCGServer) {
  nodecg.log.info("twitch bundle started.")
  const alertHandler = new AlertHandler(nodecg)

  nodecg.Replicant("subGoals", { defaultValue: [], persistent: true })

  const customReward = nodecg.Replicant<CustomReward[]>("customRewards", { defaultValue: [], persistent: true })
  const redemptions = nodecg.Replicant<Redemption>("redemptions", { defaultValue: [], persistent: true })

  const streamelements = requireService<StreamElementsServiceClient>(nodecg, "streamelements")
  require("./StreamElements")(nodecg, streamelements, alertHandler)
  const twitchAddons = requireService<TwitchAddonsClient>(nodecg, "twitch-addons")
  const twitchApi = requireService<TwitchApiServiceClient>(nodecg, "twitch-api")
  const twitchChat = requireService<TwitchChatServiceClient>(nodecg, "twitch-chat")
  const twitchPubsub = requireService<TwitchPubSubServiceClient>(nodecg, "twitch-pubsub")
  // const youtube = requireService<GoogleApisServiceClient>(nodecg, "googleapis")

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
      const channelInfo = await twitchApiClient.helix.users.getMe()
      channelId = channelInfo?.id || ""
      const rewardsInfo = await twitchApiClient.helix.channelPoints.getCustomRewards(channelId)
      for (let i of rewardsInfo) {
        // If one of our custom rewards is already in the database, log it.
        let cR = customReward.value.find((r) => i.title === r.title)
        if (cR) {
          cR.id = i.id
        }
      }
      for (let r of customReward.value) {
        if (r.id) {
          let cR = await twitchApiClient.helix.channelPoints.updateCustomReward(channelId, r.id, {
            isPaused: false,
            title: r.title,
            cost: r.cost,
            prompt: r.desc,
            isEnabled: true,
          })
        } else {
          let cR = await twitchApiClient.helix.channelPoints.createCustomReward(channelId, {
            title: r.title,
            cost: r.cost,
            prompt: r.desc,
            isEnabled: true,
          })
          r.id = cR.id
        }
      }
      nodecg.listenFor("getData", async (type: string) => {
        let data
        if (type === "subs") {
          data = await twitchApiClient.helix.subscriptions.getSubscriptions(channelId)
        } else if (type === "rewards") {
          data = await twitchApiClient.helix.channelPoints.getCustomRewards(channelId)
        } else if (type === "follows") {
          data = await twitchApiClient.helix.users.getFollows({ followedUser: channelId })
        } else data = { error: true, message: "Invalid Type" }
        return data
      })
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
