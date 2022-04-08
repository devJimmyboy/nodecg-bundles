import { ApiClient } from "@twurple/api";
import { AuthProvider } from "@twurple/auth";
import { PubSubClient } from "@twurple/pubsub";
import { NodeCG } from "nodecg-types/types/server";

import Twitch, { TwitchModule } from "../Twitch";

export default class PubSub implements TwitchModule {
  pubsub: PubSubClient
  userId: string

  nodecg: NodeCG
  auth: AuthProvider
  api: ApiClient
  twitch: Twitch
  constructor(twitch: Twitch) {
    this.nodecg = twitch.nodecg
    this.auth = twitch.auth
    this.api = twitch.api
    this.twitch = twitch
    this.pubsub = new PubSubClient()
    this.init()
  }

  private async init() {
    this.userId = await this.pubsub.registerUserListener(this.auth)
    if (this.pubsub) {
      this.nodecg.log.info("Twitch PubSub listener registered for user w/ ID '" + this.userId + "'.")
    } else {
      this.nodecg.log.info("Twitch initialized for user w/ ID '" + this.userId + "'.")
    }
  }

  public async registerListeners() {
    // this.twitch.listeners.push(await this.pubsub.onBits(this.userId, (msg) => {
    //   this.nodecg.log.info("Bits received: " + msg.bits + " from " + msg.userName)
    //   this.twitch.sendAlert("cheer", `${msg.isAnonymous ? msg.userName : "Anonymous"} just wired ${msg.bits} bitties directly into my bloodstream!`, msg.message)
    // }))
  }
}
export type PubSubModule = PubSub
