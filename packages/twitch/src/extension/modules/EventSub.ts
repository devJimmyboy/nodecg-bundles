import { ApiClient } from "@twurple/api";
import { AuthProvider } from "@twurple/auth";
import { rawDataSymbol } from "@twurple/common";
import {
  EventSubChannelPollBeginEvent,
  EventSubChannelPollEndEvent,
  EventSubChannelPollProgressEvent,
  EventSubChannelPredictionBeginEvent,
  EventSubChannelPredictionEndEvent,
  EventSubChannelPredictionLockEvent,
  EventSubChannelPredictionProgressEvent,
  EventSubListener,
  EventSubSubscription,
  ReverseProxyAdapter,
} from "@twurple/eventsub";
import express from "express";
import { NodeCG as NodeCGServer, Replicant } from "nodecg-types/types/server";

import Twitch, { TwitchModule } from "../Twitch";

export type Poll =
  | EventSubChannelPollBeginEvent
  | EventSubChannelPollEndEvent
  | EventSubChannelPollProgressEvent;
export type Prediction =
  | EventSubChannelPredictionEndEvent
  | EventSubChannelPredictionBeginEvent
  | EventSubChannelPredictionLockEvent
  | EventSubChannelPredictionProgressEvent;
export default class EventSub implements TwitchModule {
  private VITE_EVENTSUB_SECRET: string;
  events: EventSubListener;
  eventsub: EventSubListener;
  private done: Promise<void>;
  listeners: EventSubSubscription<unknown>[] = [];

  nodecg: NodeCGServer;
  auth: AuthProvider;
  api: ApiClient;
  twitch: Twitch;
  router: express.Router;

  poll: Replicant<Poll | null>;
  prediction: Replicant<Prediction | null>;
  constructor(twitch: Twitch) {
    this.VITE_EVENTSUB_SECRET = import.meta.env.VITE_EVENTSUB_SECRET as string;
    this.nodecg = twitch.nodecg;
    this.auth = twitch.appAuth;
    this.api = twitch.appApi;
    this.twitch = twitch;
    this.router = this.nodecg.Router();
    this.poll = this.nodecg.Replicant<Poll | null>("poll", {
      defaultValue: null,
    });
    this.prediction = this.nodecg.Replicant<Prediction | null>("prediction", {
      defaultValue: null,
    });

    this.done = this.init();
  }

  private async init() {
    this.router.get("/eventsubs", async (req, res) => {
      const subs = await this.api.eventSub.getSubscriptions();
      const subsData = subs.data
        .filter((val) =>
          val.status.match(/(enabled|webhook_callback_verification_pending)/)
        )
        .map((val) => val[rawDataSymbol]);
      console.log(subs.data.length, "/", subs.total);
      res.status(200).json(subsData);
    });

    this.eventsub = new EventSubListener({
      apiClient: this.api,
      adapter: new ReverseProxyAdapter({
        hostName: "eventsub.jimmyboy.dev",
        port: 9091,
      }),
      strictHostCheck: true,
      secret: this.VITE_EVENTSUB_SECRET,
    });

    // const middleware = new EventSubMiddleware({
    //   apiClient: this.api, hostName: "nodecg.jimmyboy.dev",
    //   pathPrefix: '/eventsub', secret: this.VITE_EVENTSUB_SECRET
    // })
    // this.middleware = middleware
    // this.eventsub.onVerify((success, subscription) => {
    //   console.log("EVENTSUB IS", success ? "VERIFIED" : "NOT VERIFIED", subscription.id);
    // })

    this.nodecg.mount(this.router);
    this.done = this.eventsub
      .listen()
      .then(() =>
        this.nodecg.log.info("Twitch EventSub listener registered. (I think)")
      );
  }

  public async registerListeners() {
    const success = await this.done
      .catch((e) => {
        console.log(e);
        return false;
      })
      .then(() => {
        console.log("subscription Registered");
        return true;
      });
    if (success) {
      // Follow Events
      this.listeners.push(
        await this.eventsub.subscribeToChannelFollowEvents(
          this.twitch.userId,
          (e) => {
            this.nodecg.log.info("Follow Event Received: ", e);
            this.twitch.sendAlert(
              "follow",
              `(${e.userDisplayName}) just became a (true) (g) (a) (m) (e) (r)`
            );
          }
        )
      );
      // Hype Train Events
      this.listeners.push(
        await this.eventsub.subscribeToChannelHypeTrainBeginEvents(
          this.twitch.userId,
          (e) => {
            this.nodecg.log.info("Hype Train STARTED! - ", e);
          }
        )
      );
      // Stream Ended Events
      this.listeners.push(
        await this.eventsub.subscribeToStreamOfflineEvents(
          this.twitch.userId,
          (e) => {
            this.nodecg.log.info("Jimmy Went offline :( - ", e);
          }
        )
      );
      // Stream Started Events
      this.listeners.push(
        await this.eventsub.subscribeToStreamOnlineEvents(
          this.twitch.userId,
          (e) => {
            this.nodecg.log.info("Jimmy Went online! - ", e);
          }
        )
      );
      // Stream Poll Events
      this.listeners.push(
        // Poll Begin
        await this.eventsub.subscribeToChannelPollBeginEvents(
          this.twitch.userId,
          (e) => {
            this.poll.value = e;
          }
        ),
        // Poll Progress
        await this.eventsub.subscribeToChannelPollProgressEvents(
          this.twitch.userId,
          (e) => {
            this.poll.value = e;
          }
        ),
        // Poll End
        await this.eventsub.subscribeToChannelPollEndEvents(
          this.twitch.userId,
          (e) => {
            this.poll.value = e;
          }
        )
      );
      // Prediction Events
      this.listeners.push(
        // Prediction Begin
        await this.eventsub.subscribeToChannelPredictionBeginEvents(
          this.twitch.userId,
          (e) => {
            this.prediction.value = e;
          }
        ),
        // Prediction Progress
        await this.eventsub.subscribeToChannelPredictionProgressEvents(
          this.twitch.userId,
          (e) => {
            this.prediction.value = e;
          }
        ),
        // Prediction Lock
        await this.eventsub.subscribeToChannelPredictionLockEvents(
          this.twitch.userId,
          (e) => {
            this.prediction.value = e;
          }
        ),
        // Prediction End
        await this.eventsub.subscribeToChannelPredictionEndEvents(
          this.twitch.userId,
          (e) => {
            this.prediction.value = e;
          }
        )
      );

      process.on("beforeExit", (code) => {
        this.listeners.forEach((l) => {
          l.stop();
        });
      });
    }
  }
}
export type EventSubModule = EventSub;
