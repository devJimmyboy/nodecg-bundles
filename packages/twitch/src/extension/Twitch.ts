import { ApiClient } from "@twurple/api";
import {
  AuthProvider,
  ClientCredentialsAuthProvider,
  RefreshingAuthProvider,
} from "@twurple/auth";
import { EventSubSubscription } from "@twurple/eventsub";
import { PubSubListener } from "@twurple/pubsub";
import {
  NodeCG as NodeCGServer,
  Replicant,
  ReplicantServer,
} from "nodecg-types/types/server";
import { Alerts } from "simple-alerts/global";
import chalk from "chalk";

import { ChatModule } from "./modules/Chat";
import { EventSubModule } from "./modules/EventSub";
import { PubSubModule } from "./modules/PubSub";
import { rawDataSymbol } from "@twurple/common";
import {
  HandledListenForCb,
  ListenForCb,
} from "nodecg-types/types/lib/nodecg-instance";

require("dotenv").config();

export type AlertType =
  | "subscriber"
  | "gift-subscriber"
  | "tip"
  | "follow"
  | "redemption"
  | "cheer"
  | "host"
  | "raid"
  | "shoutout";

export type TokenTwitch = {
  refreshToken: string | null;
  accessToken: string;
  expiresIn: number | null;
  obtainmentTimestamp: number;
  scope: string[];
};

export class Twitch {
  tokens: ReplicantServer<TokenTwitch>;
  botTokens: ReplicantServer<TokenTwitch>;
  nodecg: NodeCGServer;
  auth: RefreshingAuthProvider;
  botAuth: RefreshingAuthProvider;
  appAuth: ClientCredentialsAuthProvider;
  api: ApiClient;
  appApi: ApiClient;
  pubsub: PubSubModule;
  events: EventSubModule;
  userId: string;
  chat: ChatModule;
  listeners: (EventSubSubscription<any | unknown> | PubSubListener)[] = [];

  dataReplicant: Replicant<any>;

  ready: boolean = false;
  readyCallbacks: (() => void)[] = [
    () => {
      this.ready = true;
    },
  ];
  constructor(nodecg: NodeCGServer) {
    this.nodecg = nodecg;
    this.dataReplicant = nodecg.Replicant("twitchData", {
      persistent: false,
      defaultValue: {},
    });
    this.tokens = nodecg.Replicant("twitchToken", {
      persistent: true,
    });
    this.botTokens = nodecg.Replicant("botTwitchToken", {
      persistent: true,
    });
    this.init();
    process.on("beforeExit", (code) => {
      console.log(
        "beforeExit:",
        `code ${code} received.`,
        "Unsubscribing from events..."
      );
    });
  }

  async init() {
    await this.initAuth();
    await this.initApi();
    await this.registerModules();

    await this.registerListeners();

    await this.makeReady();
  }
  async registerModules() {
    const { Chat, EventSub, PubSub } = await import("./modules");

    this.chat = new Chat(this);
    this.pubsub = new PubSub(this);
    this.events = new EventSub(this);

    this.nodecg.log.info("Twitch modules registered.");
  }

  async initAuth() {
    this.auth = new RefreshingAuthProvider(
      {
        clientId: import.meta.env.VITE_CLIENT_ID!,
        clientSecret: import.meta.env.VITE_CLIENT_SECRET!,
        onRefresh: async (newTokenData) => {
          this.tokens.value = newTokenData;
          this.nodecg.log.info("Token Refreshed.");
        },
      },
      this.tokens.value
    );
    console.log(
      chalk.green("Initializing Auth..."),
      chalk.red(
        "current Creds:",
        JSON.stringify({
          clientId: import.meta.env.VITE_CLIENT_ID!,
          clientSecret: import.meta.env.VITE_CLIENT_SECRET!,
        })
      )
    );
    this.botAuth = new RefreshingAuthProvider(
      {
        clientId: import.meta.env.VITE_CLIENT_ID!,
        clientSecret: import.meta.env.VITE_CLIENT_SECRET!,
        onRefresh: async (newTokenData) => {
          this.botTokens.value = newTokenData;
          this.nodecg.log.info("Bot Token Refreshed.");
        },
      },
      this.botTokens.value
    );

    await this.auth.refresh();
    await this.botAuth.refresh();

    this.appAuth = new ClientCredentialsAuthProvider(
      import.meta.env.VITE_CLIENT_ID as string,
      import.meta.env.VITE_CLIENT_SECRET as string
    );
  }

  async initApi() {
    this.api = new ApiClient({ authProvider: this.auth });
    this.appApi = new ApiClient({ authProvider: this.appAuth });

    this.userId = (await this.api.users.getMe()).id;
    this.nodecg.listenFor("getUser", async (userName: string, ack) => {
      this.nodecg.log.info(`Getting user ${userName}`);
      const user = await this.api.users
        .getUserByName(userName)
        .catch(async (e) => {
          this.nodecg.log.error(e);
          return await this.api.users.getUserById(userName);
        });
      // @ts-ignore
      if (!user && ack.handled == false) {
        this.nodecg.log.error(
          `User ${userName} not found. user is`,
          user?.[rawDataSymbol] || user
        );
        ack(new Error("User not found."));
        return;
      }
      if (!!user && ack && !ack.handled) {
        this.nodecg.log.error(
          `User ${userName} successfully found. User is`,
          user[rawDataSymbol]
        );
        // @ts-ignore
        ack(null, user[rawDataSymbol]);
      }
      // ack(new Error("Unknown error."));
    });
  }

  private async registerListeners() {
    await this.chat.registerListeners();
    await this.pubsub.registerListeners();
    await this.events.registerListeners();
  }

  public sendAlert(
    type: AlertType,
    message = "",
    userMsg = "",
    event: any = {}
  ) {
    console.log("received alert of type ", type, " with data:", event);
    var alert: Alerts.Alert = {
      name: type,
      message,
      attachMsg: userMsg,
      event,
    };
    // Broadcast it for our Alert Bundle to pick up.
    this.nodecg.sendMessage("alert", alert);
  }
  getAuth() {
    return this.auth;
  }

  getApi() {
    return this.api;
  }

  public static parseTier(plan: string) {
    let tier = `Tier `;
    if (plan.toLowerCase() !== "prime")
      tier += (parseInt(plan) / 1000).toString();
    else if (plan.toLowerCase() === "prime") tier = "Prime";

    return tier;
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
    if (this.ready) callback.bind(this)();
    else this.readyCallbacks.unshift(callback);
  }

  private async makeReady() {
    for (const callback of this.readyCallbacks) {
      callback.bind(this)();
    }
  }
}

export type Optional<T> = { [P in keyof T]?: T[P] };

export interface TwitchModule {
  nodecg: NodeCGServer;
  auth: AuthProvider;
  api: ApiClient;
  registerListeners: () => void;
}

export default Twitch;
