import { requireService } from "nodecg-io-core"
import { StreamElementsServiceClient } from "nodecg-io-streamelements"
import { TwitchAddonsClient } from "nodecg-io-twitch-addons"
import { TwitchApiServiceClient } from "nodecg-io-twitch-api"
import { TwitchChatServiceClient } from "nodecg-io-twitch-chat"
import { TwitchPubSubServiceClient } from "nodecg-io-twitch-pubsub"
import { NodeCG } from "nodecg-types/types/server"
import { Twitch } from "./Twitch"
import customCSS from "./customCSS"
import NanoTimer = require("nanotimer")

// import { GoogleApisServiceClient } from "nodecg-io-googleapi0s"
const channel = "devJimmyboy"
var channelId = ""
export type CustomReward = {
  title: string
  cost: number
  desc: string
  action: string
  id: string | undefined
}
type Redemption = {}
var timer = new NanoTimer(false)
module.exports = function (nodecg: NodeCG) {
  nodecg.log.info("twitch bundle started.")

  customCSS(nodecg)
  let twitch: Twitch | undefined = new Twitch(nodecg)
  // Define Replicants w/ Default Values:
  const _subGoals = nodecg.Replicant("subGoals", { defaultValue: [], persistent: true })
  const _currentSubs = nodecg.Replicant("currentSubs", { defaultValue: 0, persistent: true })
  const _followers = nodecg.Replicant("currentFollowers", { defaultValue: 0, persistent: true })
  const _redemptions = nodecg.Replicant<Redemption>("redemptions", { defaultValue: [], persistent: true })
  const customReward = nodecg.Replicant<CustomReward[]>("customRewards", { defaultValue: [], persistent: true })

  const streamelements = requireService<StreamElementsServiceClient>(nodecg, "streamelements")
  require("./StreamElements")(nodecg, streamelements, twitch)
  const twitchAddons = requireService<TwitchAddonsClient>(nodecg, "twitch-addons")
  const twitchApi = requireService<TwitchApiServiceClient>(nodecg, "twitch-api")
  const twitchChat = requireService<TwitchChatServiceClient>(nodecg, "twitch-chat")
  const twitchPubsub = requireService<TwitchPubSubServiceClient>(nodecg, "twitch-pubsub")
  // twitch?.onReady(() => { twitch?.chat.registerChatService(twitchChat as any) })
  // require("./TwitchAlerts")(nodecg, twitch, twitchChat)
  require("./Emotes")(nodecg, twitch, twitchAddons)
  // const youtube = requireService<GoogleApisServiceClient>(nodecg, "googleapis")

  twitchApi?.onAvailable(
    async (twitchApiClient) => {
      nodecg.log.info("twitch-api service has been updated.")
      const channelInfo = await twitchApiClient.users.getMe()
      channelId = channelInfo?.id || ""
      const rewardsInfo = await twitchApiClient.channelPoints.getCustomRewards(channelId)
      timer.setInterval(getData, ["subs", twitchApiClient], "15s")
      for (let i of rewardsInfo) {
        // If one of our custom rewards is already in the database, log it.
        let cR = customReward.value.find((r) => i.title === r.title)
        if (cR) {
          cR.id = i.id
        }
      }
      for (let r of customReward.value) {
        if (r.id) {
          let cR = await twitchApiClient.channelPoints.updateCustomReward(channelId, r.id, {
            isPaused: false,
            title: r.title,
            cost: r.cost,
            prompt: r.desc,
            isEnabled: true,
          })
        } else {
          let cR = await twitchApiClient.channelPoints.createCustomReward(channelId, {
            title: r.title,
            cost: r.cost,
            prompt: r.desc,
            isEnabled: true,
          })
          r.id = cR.id
        }
      }
      nodecg.listenFor("getData", (e) => getData(e, twitchApiClient))
    } // You can now use the twitch-api client here.
  )

  twitchApi?.onUnavailable(() => {
    timer.clearInterval()
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
  const getData = async (type: "subs" | "rewards" | "follows" | string, client: TwitchApiServiceClient) => {
    let data
    if (type === "subs") {
      data = await client.subscriptions.getSubscriptions(channelId)
      _currentSubs.value = data.total
    } else if (type === "rewards") {
      data = await client.channelPoints.getCustomRewards(channelId)
      data.forEach((v, i) => {
        if (customReward.value.find((val) => val.id === v.id)) {
          return
        } else {
          customReward.value.push({ id: v.id, cost: v.cost, desc: v.prompt, title: v.title, action: "" })
        }
      })
    } else if (type === "follows") {
      data = await client.users.getFollows({ followedUser: channelId })
      _followers.value = data.total
    } else data = { error: true, message: "Invalid Type" }
    nodecg.log.debug(`Twitch data '${type}' requested`)
  }
}
