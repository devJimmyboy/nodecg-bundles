import { NodeCGServer } from "nodecg/types/lib/nodecg-instance"
import AlertHandler from "./AlertHandle"
import { DirectConnectionAdapter, EventSubListener, ReverseProxyAdapter } from "@twurple/eventsub"
import { ServiceProvider } from "nodecg-io-core"
import { TwitchChatServiceClient } from "nodecg-io-twitch-chat"
import { AlertData, Alerts } from "../global"
import { ChatSubExtendInfo, ChatSubInfo, UserNotice } from "@twurple/chat"

const giftCounts = new Map<string | undefined, number>()
const listeners = []

const clientId = process.env.TWITCH_CLIENT_ID
const clientSecret = process.env.TWITCH_CLIENT_SECRET

module.exports = function (
  nodecg: NodeCGServer,
  alertHandler: AlertHandler,
  chatProvider: ServiceProvider<TwitchChatServiceClient>
) {
  let chatClient = chatProvider.getClient()
  chatProvider.onAvailable((c) => {
    listeners.push(chatClient?.onSub((channel, user, subInfo, msg) => onSubHandler(channel, user, subInfo, msg)))

    listeners.push(chatClient?.onCommunityPayForward(onSubHandler))

    listeners.push(chatClient?.onResub((channel, user, subInfo, msg) => onSubHandler(channel, user, subInfo, msg)))

    // Resubscribe
    listeners.push(
      chatClient?.onSubExtend((channel, user, subInfo, msg) => onSubHandler(channel, user, subInfo, msg, "subExtend"))
    )

    // Community Subs
    listeners.push(
      chatClient?.onCommunitySub((channel, user, subInfo) => {
        let alert: AlertData = {
          displayName: subInfo.gifterDisplayName || "anonymous",
          gifted: true,
          tier: subInfo.plan as "1000" | "2000" | "3000",
          sender: subInfo.gifterDisplayName,
          amount: subInfo.gifterGiftCount || 0,
          avatar: "",
          items: [],
          message: "",
          username: subInfo.gifter || "",
          quantity: subInfo.gifterGiftCount,
        }
        const previousGiftCount = giftCounts.get(user) ?? 0
        giftCounts.set(user, previousGiftCount + subInfo.count)
        //send Alert
        alertHandler.sendAlert("subscriber", alert)
      })
    )

    listeners.push(
      chatClient?.onSubGift((channel, recipient, subInfo) => {
        const user = subInfo.gifter
        const previousGiftCount = giftCounts.get(user) ?? 0
        if (previousGiftCount > 0) {
          giftCounts.set(user, previousGiftCount - 1)
        } else {
          let alert: AlertData = {
            displayName: subInfo.displayName,
            gifted: true,
            tier: subInfo.isPrime ? "prime" : (subInfo.plan as "1000" | "2000" | "3000"),
            sender: subInfo.gifterDisplayName,
            amount: subInfo.giftDuration,
            avatar: "",
            items: [],
            message: subInfo.message || "",
            username: subInfo.displayName.toLowerCase(),
            streak: subInfo.streak,
            quantity: subInfo.gifterGiftCount,
          }
          alertHandler.sendAlert("subscriber", alert)
        }
      })
    )
  })
  chatProvider.onUnavailable(() => (chatClient = undefined))

  const onSubHandler = (
    channel: string,
    user: string,
    subInfo: ChatSubInfo | any,
    msg: UserNotice | any,
    type = "sub"
  ) => {
    let alert: AlertData
    switch (type) {
      case "subExtend":
        alert = {
          displayName: subInfo.displayName,
          gifted: false,
          tier: subInfo.plan as "1000" | "2000" | "3000" | "prime",
          amount: subInfo.months,
          avatar: "",
          items: [],
          message: subInfo.message || "",
          username: subInfo.displayName.toLowerCase(),
          streak: subInfo.streak,
        }
        break
      case "sub":
      default:
        alert = {
          displayName: subInfo.displayName,
          gifted: false,
          tier: subInfo.isPrime ? "prime" : (subInfo.plan as "1000" | "2000" | "3000"),
          amount: subInfo.months,
          avatar: "",
          items: [],
          message: subInfo.message || "",
          username: subInfo.displayName.toLowerCase(),
          streak: subInfo.streak,
        }
        break
    }
    alertHandler.sendAlert("subscriber", alert)
  }

  // const eventSub = new EventSubListener({
  //   apiClient: alertHandler.getApi(),
  //   adapter: new ReverseProxyAdapter({ hostName: "nodecg.jimmyboy.dev" }),
  //   secret: "cocknball",
  // })
}
