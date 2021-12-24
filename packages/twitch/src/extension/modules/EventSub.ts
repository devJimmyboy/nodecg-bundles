import { ApiClient } from "@twurple/api";
import { AuthProvider } from "@twurple/auth";
import { EventSubListener, ReverseProxyAdapter } from "@twurple/eventsub";
import { NodeCG } from "nodecg/types/server";
import Twitch, { TwitchModule } from "../Twitch";
export default class EventSub implements TwitchModule {
  private EVENTSUB_SECRET = process.env.EVENTSUB_SECRET as string
  events: EventSubListener
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
    this.init()

  }

  private async init() {
    this.events = new EventSubListener({
      apiClient: this.api,
      adapter: new ReverseProxyAdapter({
        hostName: 'jimmyboy.dev', pathPrefix: "eventsub"
        // The host name the server is available from,
      }),
      secret: process.env.EVENTSUB_SECRET as string,
    });
    this.done = this.events.listen().then(() => this.nodecg.log.info("Twitch EventSub listener registered."))
  }

  public async registerListeners() {
    const success = await this.done.catch((e) => { console.log(e); return false }).then(() => true);
    if (success)
      this.twitch.listeners.push(await this.events.subscribeToChannelFollowEvents(this.twitch.userId, (e) => {
        this.nodecg.log.info("Follow Event Received: ", e)
        this.twitch.sendAlert("follow", `(${e.userDisplayName}) just became a (true) (g) (a) (m) (e) (r)`)
      }))
  }

}
export type EventSubModule = EventSub