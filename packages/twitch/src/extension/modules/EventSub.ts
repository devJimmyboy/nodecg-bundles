import { ApiClient } from "@twurple/api";
import { AuthProvider } from "@twurple/auth";
import { EventSubListener, EventSubMiddleware, ReverseProxyAdapter } from "@twurple/eventsub";
import { NodeCG } from "nodecg/types/server";
import Twitch, { TwitchModule } from "../Twitch";
import express from "express"
export default class EventSub implements TwitchModule {
  private EVENTSUB_SECRET = process.env.EVENTSUB_SECRET as string
  events: EventSubListener
  eventsub: EventSubListener
  private done: Promise<void>

  nodecg: NodeCG;
  auth: AuthProvider;
  api: ApiClient;
  twitch: Twitch
  constructor(twitch: Twitch) {
    this.nodecg = twitch.nodecg
    this.auth = twitch.appAuth
    this.api = twitch.appApi
    this.twitch = twitch
    this.done = this.init()


  }

  private async init() {
    // this.router.get("/penisboy", (req, res) => {
    //   res.status(200).send("penisboy")
    // })

    this.eventsub = new EventSubListener({ apiClient: this.api, adapter: new ReverseProxyAdapter({ hostName: "eventsub.jimmyboy.dev", port: 9091 }), secret: this.EVENTSUB_SECRET })

    // const middleware = new EventSubMiddleware({
    //   apiClient: this.api, hostName: "nodecg.jimmyboy.dev",
    //   pathPrefix: '/eventsub', secret: this.EVENTSUB_SECRET
    // })
    // this.middleware = middleware
    this.eventsub.onVerify((success, subscription) => {
      console.log("EVENTSUB IS", success ? "VERIFIED" : "NOT VERIFIED", subscription.id);

    })


    this.done = this.eventsub.listen().then(() => this.nodecg.log.info("Twitch EventSub listener registered. (I think)"));
  }

  public async registerListeners() {
    const success = await this.done.catch((e) => { console.log(e); return false }).then(() => true);
    if (success) {
      this.twitch.listeners.push(await this.eventsub.subscribeToChannelFollowEvents(this.twitch.userId, (e) => {
        this.nodecg.log.info("Follow Event Received: ", e)
        this.twitch.sendAlert("follow", `(${e.userDisplayName}) just became a (true) (g) (a) (m) (e) (r)`)
      }))
      this.twitch.listeners.push(await this.eventsub.subscribeToChannelHypeTrainBeginEvents(this.twitch.userId, (e) => {
        this.nodecg.log.info("Hype Train STARTED! - ", e)

      }))
      this.twitch.listeners.push(await this.eventsub.subscribeToStreamOfflineEvents(this.twitch.userId, (e) => {
        this.nodecg.log.info("Jimmy Went offline :( - ", e)

      }))
      this.twitch.listeners.push(await this.eventsub.subscribeToStreamOnlineEvents(this.twitch.userId, (e) => {
        this.nodecg.log.info("Jimmy Went online! - ", e)

      }))
    }

  }

}
export type EventSubModule = EventSub