import { NodeCGServer } from "nodecg/types/lib/nodecg-instance"
import { ApiClient } from "@twurple/api"
import { AuthProvider, ClientCredentialsAuthProvider, RefreshingAuthProvider } from "@twurple/auth"
import { PubSubClient, PubSubListener } from '@twurple/pubsub';
import { Alerts } from "simple-alerts/global"
import { promises as fs } from "fs"
import { join } from "path"
import { AlertData } from "../../global"
import { ReplicantBrowser, ReplicantServer } from "nodecg/types/server"
import { ChatClient, ChatCommunitySubInfo, ChatSubExtendInfo, ChatSubGiftInfo, ChatSubGiftUpgradeInfo, ChatSubInfo, ChatSubUpgradeInfo } from "@twurple/chat";
import { EventSubListener, EventSubSubscription, ReverseProxyAdapter } from "@twurple/eventsub";
import { StreamElementsEventData } from "nodecg-io-streamelements/extension/StreamElementsEvent";
import { ChatModule } from "./modules/Chat";
import { PubSubModule } from "./modules/PubSub";
import { EventSubModule } from "./modules/EventSub";
require("dotenv").config()

export type AlertType = "subscriber" | "gift-subscriber" | "tip" | "follow" | "redemption" | "cheer" | "host" | "raid"

export type TokenTwitch = {
  refreshToken: string | null
  accessToken: string
  expiresIn: number | null
  obtainmentTimestamp: number;
  scope: string[]
}

export class Twitch {

  tokens: ReplicantServer<TokenTwitch>
  botTokens: ReplicantServer<TokenTwitch>
  nodecg: NodeCGServer
  auth: RefreshingAuthProvider
  botAuth: RefreshingAuthProvider
  appAuth: ClientCredentialsAuthProvider
  api: ApiClient
  appApi: ApiClient
  pubsub: PubSubModule
  events: EventSubModule
  userId: string
  chat: ChatModule
  listeners: (EventSubSubscription<any | unknown> | PubSubListener)[] = []

  ready: boolean = false
  readyCallbacks: (() => void)[] = [() => { this.ready = true }]
  constructor(nodecg: NodeCGServer) {
    this.nodecg = nodecg
    this.tokens = nodecg.Replicant("twitchToken", {
      persistent: true,
    })
    this.botTokens = nodecg.Replicant("botTwitchToken", {
      persistent: true,
    })
    this.init()
  }

  async init() {
    await this.initAuth()
    await this.initApi()
    await this.registerModules()

    await this.registerListeners()

    await this.makeReady()
  }
  async registerModules() {
    const { default: { Chat, EventSub, PubSub } } = (await import("./modules"))

    this.chat = new Chat(this)
    this.pubsub = new PubSub(this)
    this.events = new EventSub(this)

    this.nodecg.log.info("Twitch modules registered.")
  }

  async initAuth() {
    this.auth = new RefreshingAuthProvider(
      {
        clientId: process.env.CLIENT_ID as string,
        clientSecret: process.env.CLIENT_SECRET as string,
        onRefresh: async (newTokenData) => {
          this.tokens.value = newTokenData
          this.nodecg.log.info("Token Refreshed.")
        },
      },
      this.tokens.value
    )

    this.botAuth = new RefreshingAuthProvider(
      {
        clientId: process.env.CLIENT_ID as string,
        clientSecret: process.env.CLIENT_SECRET as string,
        onRefresh: async (newTokenData) => {
          this.botTokens.value = newTokenData
          this.nodecg.log.info("Bot Token Refreshed.")
        },
      },
      this.botTokens.value
    )

    await this.auth.refresh()
    await this.botAuth.refresh()

    this.appAuth = new ClientCredentialsAuthProvider(process.env.CLIENT_ID as string, process.env.CLIENT_SECRET as string);
  }

  async initApi() {
    this.api = new ApiClient({ authProvider: this.auth })
    this.appApi = new ApiClient({ authProvider: this.appAuth })

    this.userId = (await this.api.users.getMe()).id
  }


  private async registerListeners() {
    await this.chat.registerListeners()
    await this.pubsub.registerListeners()
    await this.events.registerListeners()
  }

  public sendAlert(type: AlertType, message = "", userMsg = "", event: any = {}) {
    console.log("received alert of type ", type, " with data:", event)
    var alert: Alerts.Alert = { name: type, message, attachMsg: userMsg, event }
    // switch (type) {
    //   case "follow":
    //     alert.message = `(${data.displayName}) just followed!`
    //     break
    //   case "cheer":
    //     alert.message = `(${data.displayName}) just wired me (${data.amount} bitties)!`
    //     alert.attachMsg = data.message || ""
    //     break
    //   case "host":
    //     alert.message = `(${data.displayName}) just hosted me with (${data.amount}) lil fuckers!`
    //     this.nodecg.sendMessage("host", data.displayName)
    //     break
    //   case "raid":
    //     alert.message = `(${data.displayName}) just raided with (${data.amount}) PogChampions 😎`
    //     break
    //   case "subscriber":
    //     if (data.gifted) alert.name = "gift-subscriber"
    //     let tier = `Tier `
    //     if (data.tier && data.tier.toLowerCase() !== "prime") tier += (parseInt(data.tier as string) / 1000).toString()
    //     else if (data.tier === "prime") tier = "Prime"
    //     alert.message = data.gifted
    //       ? `${data.quantity !== undefined && data.quantity > 1
    //         ? `(${data.sender}) just gifted ${data.quantity} (${tier}) subs! My gamer <3`
    //         : `(${data.sender}) just gifted a (${tier}) sub to (${data.displayName})!`
    //       }`
    //       : `${`(${data.displayName}) just (${tier}) subbed to the channel! It's their ` +
    //       (data.streak === undefined
    //         ? ` (first)`
    //         : ` (${data.streak && data.streak % 10 < 4 ? (data.streak % 10 == 2 ? "2nd" : "3rd") : `${data.streak}th`
    //         })`) +
    //       " month!"
    //       }`
    //     if (data.message) alert.attachMsg = data.message
    //     break
    //   case "tip":
    //     alert.message = `(${data.displayName || data.username || "anonymous"}) gave me ${data.currency || ""}${data.amount || "money"
    //       }! Holy shit! Thanks!`
    //     alert.attachMsg = data.message
    //     break
    // }
    this.nodecg.sendMessage("alert", alert)
  }
  getAuth() {
    return this.auth
  }

  getApi() {
    return this.api
  }

  public static parseTier(plan: string) {
    let tier = `Tier `
    if (plan.toLowerCase() !== "prime") tier += (parseInt(plan) / 1000).toString()
    else if (plan.toLowerCase() === "prime") tier = "Prime"

    return tier
  }

  // static normalizeSubAlert(type: [boolean, "pay-forward-community" | "pay-forward" | "normal" | "community" | "gift-upgrade" | "prime-upgrade" | "extend"], alert: ChatSubGiftInfo | ChatSubExtendInfo | ChatSubGiftUpgradeInfo | ChatSubInfo | ChatSubUpgradeInfo | ChatCommunitySubInfo) {
  //   let data: Optional<AlertData> = {};
  //   if (type[0]) {
  //     alert = alert as ChatSubGiftInfo | ChatSubGiftUpgradeInfo | ChatCommunitySubInfo
  //     data.gifted = true;
  //     switch (type[1]) {
  //       case "community":
  //       case "normal":
  //       case "gift-upgrade":
  //       case "pay-forward":

  //       case "pay-forward-community":
  //         data.sender =
  //           data.displayName = alert.displayName;
  //         break;
  //     }
  //   } else {
  //     data.gifted = false
  //     data = {
  //       amount: alert.months ?? undefined,
  //       quantity: alert.count || undefined,
  //       streak: alert.streak || undefined,
  //       tier: alert.plan.toLowerCase() as "prime" | "1000" | "2000" | "3000",
  //       displayName: alert.userDisplayName,
  //       message: alert.message?.message || '',
  //       avatar: '',
  //       username: alert.userName,
  //       items: [],

  //     }
  //   }



  // }

  public onReady(callback: () => void) {
    if (this.ready) callback.bind(this)()
    else
      this.readyCallbacks.unshift(callback)
  }

  private async makeReady() {
    for (const callback of this.readyCallbacks) {
      callback.bind(this)()
    }
  }
}

export type Optional<T> = { [P in keyof T]?: T[P] }

export interface TwitchModule {
  nodecg: NodeCGServer
  auth: AuthProvider
  api: ApiClient
  registerListeners: () => void

}

export default Twitch
