import {
  ApiClient,
  HelixClip,
  HelixPaginatedResult,
  HelixUser,
} from "@twurple/api";
import { AuthProvider } from "@twurple/auth";
import { ChatClient, ChatUser, PrivateMessage } from "@twurple/chat";
import { connect } from "http2";
import { requireService, ServiceProvider } from "nodecg-io-core";
import { TwitchChatServiceClient } from "nodecg-io-twitch-chat";
import { NodeCG as NodeCGServer } from "nodecg-types/types/server";
import { ReplicantServer } from "nodecg-types/types/server";
import Twitch, { TwitchModule } from "../Twitch";
import moment from "moment";
import _ from "lodash";

interface RepConfig {
  projectResponses: {
    name: string;
    active: boolean;
    response: string;
  }[];
}

type RepObject<T> = {
  [key in keyof T]: ReplicantServer<T[key]>;
};

export default class Chat implements TwitchModule {
  afk: string[] = [];
  giftCounts: Map<string | undefined, number>;
  reps: RepObject<RepConfig>;
  client: ChatClient;
  channel: string = "devjimmyboy";
  // chatService: ServiceProvider<TwitchChatServiceClient> | undefined;
  connected: Promise<boolean>;
  nodecg: NodeCGServer;
  auth: AuthProvider;
  api: ApiClient;
  twitch: Twitch;
  constructor(twitch: Twitch) {
    this.nodecg = twitch.nodecg as NodeCGServer;
    this.auth = twitch.botAuth;
    this.api = twitch.api;
    this.twitch = twitch;
    this.connected = this.connect();
    this.giftCounts = new Map<string | undefined, number>();
    //Init Replicants
    this.reps = {} as any;
    this.reps.projectResponses = this.nodecg.Replicant("projectResponses", {
      defaultValue: [
        {
          name: "none",
          active: true,
          response: "Jimmy isn't working on anything at the moment :)",
        },
      ],
      persistent: true,
    });
  }
  private async connect() {
    this.channel = `#${(await this.api.users.getMe()).name}`;
    this.client = new ChatClient({ authProvider: this.auth });
    try {
      await this.client.connect();
      await new Promise((resolve, _reject) => {
        this.client.onRegister(() => resolve(undefined));
      });
    } catch (e) {
      return false;
    }
    return true;
  }

  public async registerListeners() {
    await this.connected;
    await this.client.join(this.channel).catch((e) => this.nodecg.log.error(e));

    this.client.action(this.channel, "is cumming.");

    this.client.onMessage((chan, user, message, _msg) => {
      if (user === this.client?.currentNick && !_msg.isCheer) return;

      this.nodecg.sendMessage("chat-message", {
        channel: chan,
        user,
        message,
        _msg: JSON.parse(JSON.stringify(_msg)),
      });
      if (chan !== this.channel.toLowerCase()) return;
      // nodecg.log.info(_msg.parseEmotes())
      // nodecg.log.info(`Twitch chat: ${user} in ${channel}: ${message}`)
      if (_msg.isCheer) {
        this.twitch.sendAlert(
          "cheer",
          `(${_msg.userInfo.displayName}) just wired (${_msg.bits}) (bitties) directly into my bloodstream!`,
          message.replace(/(cheer)[0-9]{1,4}/g, "")
        );
      }
      if (message.startsWith("!pobox")) {
        this.client?.say(this.channel, `Jebaited`);
      }
      // Project Command, not implemented yet
      if (message.startsWith("!setproject") && this.isMod(_msg)) {
        const projectName = message.split(" ")[1];
        this.nodecg.log.info(projectName);
        this.reps.projectResponses.value.forEach((project) => {
          if (project.name === projectName) {
            project.active = true;
          } else {
            project.active = false;
          }
        });
      }
      if (message.startsWith("!project")) {
        this.client?.say(
          this.channel,
          this.reps.projectResponses.value?.find((r) => r?.active)?.response ||
            "No active project"
        );
      }
      if (message.startsWith("!project")) {
        this.client?.say(
          this.channel,
          this.reps.projectResponses.value?.find((r) => r?.active)?.response ||
            "No active project"
        );
      }
      // Check if supposed to be AFK
      if (this.afk.includes(user) && !message.startsWith("!afk")) {
        this.client?.say(
          this.channel,
          `@${user}, you are AFK. Please stop talking you sick fuck.`
        );
        this.client?.timeout(this.channel, user, 10);
      }
      // Toggle AFK & Notify User
      if (message.startsWith("!afk")) {
        if (this.afk.includes(user)) {
          this.afk.splice(this.afk.indexOf(user), 1);
          this.client?.say(this.channel, `@${user} is no longer AFK`);
        } else {
          this.afk.push(user);
          this.client?.say(this.channel, `@${user} is now AFK`);
        }
      }
      // Shoutout Functionality
      if (
        this.isMod(_msg) &&
        (message.startsWith("!shoutout") || message.startsWith("!so"))
      ) {
        const userToShoutOut = message.split(" ")[1];
        if (userToShoutOut) {
          this.getAClip(userToShoutOut)
            .then((args) => {
              if (!args) {
                this.client.say(
                  this.channel,
                  `@${user} No clip found for ${userToShoutOut} (or they don't exist)`
                );
                return;
              }
              const { clip, userName } = args;
              this.twitch.sendAlert(
                "shoutout",
                `Shoutout to (${userName})! Here's an (epic) (clip) from them this past week.`,
                "",
                clip
              );
            })
            .catch(() =>
              this.client.say(this.channel, "No clip found for that user")
            );
        }
      }
    });
    // Event Listeners for Alerts
    this.client.onCommunitySub((channel, user, subInfo) => {
      const previousGiftCount = this.giftCounts.get(user) ?? 0;
      this.giftCounts.set(user, previousGiftCount + subInfo.count);
      const { count, plan, gifter, gifterDisplayName, gifterGiftCount } =
        subInfo;
      const type = "gift-subscriber";
      const tier = Twitch.parseTier(plan);
      const msg = `(${gifterDisplayName}) just gifted (${count} ${tier}) subs! My gamer (<3)`;
      this.twitch.sendAlert(type, msg);
    });

    this.client.onSubGift((channel, recipient, subInfo) => {
      const user = subInfo.gifter;
      const previousGiftCount = this.giftCounts.get(user) ?? 0;
      if (previousGiftCount > 0) {
        this.giftCounts.set(user, previousGiftCount - 1);
      } else {
        const {
          displayName,
          isPrime,
          months,
          plan,
          gifter,
          gifterDisplayName,
          message,
          giftDuration,
          streak,
        } = subInfo;
        const type = "gift-subscriber";
        const tier = Twitch.parseTier(plan);
        const msg = `(${
          gifterDisplayName || "Anonymous"
        }) just gifted a (${tier}) subby wubby to (${displayName})!`;
        this.twitch.sendAlert(type, msg, message);
      }
    });

    this.client.onSubExtend((channel, user, subInfo) => {
      const { displayName, months, plan, endMonth, userId } = subInfo;
      const type = "subscriber";
      const tier = Twitch.parseTier(plan);
      const msg = `(${displayName}) just extended their ${tier} sub! They've been subscribed for ${months} months!`;
      this.twitch.sendAlert(type, msg);
    });

    this.client.onResub((channel, user, subInfo) => {
      const {
        displayName,
        months,
        plan,
        isPrime,
        planName,
        message,
        streak,
        userId,
      } = subInfo;
      const type = "subscriber";
      const tier = Twitch.parseTier(plan);
      const msg = `(${displayName}) just resubscribed with ${
        isPrime ? "(Prime)" : "a " + tier + " sub"
      }!`;
      this.twitch.sendAlert(type, msg, message);
    });

    this.client.onSub((channel, user, subInfo) => {
      const {
        displayName,
        months,
        plan,
        isPrime,
        planName,
        message,
        streak,
        userId,
      } = subInfo;
      const type = "subscriber";
      const tier = Twitch.parseTier(plan);
      let msg = `(${displayName}) is now a (~${
        isPrime ? "Prime" : tier
      } Gamer~)!`;
      if (streak && months > streak)
        msg += `They've got a (${streak}) month streak out of (${months})!`;
      else
        msg += `It's their (${
          months % 10 < 4
            ? months +
              (months % 10 == 2 ? (months % 10 == 1 ? `st` : "nd") : "rd")
            : `${months}th`
        }) month!`;
      this.twitch.sendAlert(type, msg, message);
    });

    this.client.onGiftPaidUpgrade((channel, user, subInfo) => {
      const { displayName, plan, userId, gifterDisplayName } = subInfo;
      const type = "subscriber";
      const tier = Twitch.parseTier(plan);
      const msg = `(${displayName}) just upgraded their gifted sub from (${gifterDisplayName}) to a (${
        tier === "prime" ? "Prime" : tier
      })sub!`;
      this.twitch.sendAlert(type, msg);
    });

    this.client.onStandardPayForward((channel, user, subInfo) => {
      const {
        displayName,
        userId,
        recipientDisplayName,
        originalGifterDisplayName,
      } = subInfo;
      const type = "gift-subscriber";
      const msg = `(${displayName}) is passing their gifted sub from (${originalGifterDisplayName}) to ${recipientDisplayName}!`;
      this.twitch.sendAlert(type, msg);
    });

    this.client.onCommunityPayForward((channel, user, subInfo) => {
      const { displayName, userId, originalGifterDisplayName } = subInfo;
      const type = "gift-subscriber";
      const msg = `(${displayName}) is passing their gifted sub from (${originalGifterDisplayName}) to the Community!`;
      this.twitch.sendAlert(type, msg);
    });
    // Raid Alert
    this.client.onRaid(async (channel, user, raidInfo) => {
      const { displayName, viewerCount } = raidInfo;
      const AClip = await this.getAClip(displayName);
      if (!AClip) {
        this.twitch.sendAlert(
          "raid",
          `(${displayName}) is raiding with (${viewerCount}) gamers!`,
          "Nice!"
        );
      } else {
        const { clip } = AClip;

        this.twitch.sendAlert(
          "shoutout",
          `(${displayName}) is raiding with (${viewerCount}) gamers!`,
          "Nice",
          clip
        );
      }
    });
    this.client.onHosted(async (channel, byChannel, auto, viewers) => {
      if (auto) return;
      const AClip = await this.getAClip(byChannel);
      if (!AClip) {
        this.twitch.sendAlert(
          "host",
          `(${byChannel}) just hosted me with (${viewers}) gamers!`,
          "Nice!"
        );
      } else {
        const { clip, userName } = AClip;

        this.twitch.sendAlert(
          "shoutout",
          `(${userName}) just hosted me with (${viewers}) gamers!`,
          "Nice!",
          clip
        );
      }
    });
  }
  // Utility Commands
  isMod(_msg: PrivateMessage) {
    return _msg.userInfo.isMod || _msg.userInfo.isBroadcaster;
  }

  async getAClip(user: HelixUser | string) {
    if (!user) return null;
    if (typeof user === "string") {
      let u = await this.api.users.getUserByName(user);
      if (!u) return null;
      else user = u;
    }
    let clips = (
      await this.api.clips.getClipsForBroadcaster(user.id, {
        startDate: moment().subtract(7, "d").toISOString(),
      })
    ).data;
    clips.sort((a, b) => b.views - a.views);
    return {
      clip: this.getClipURL(clips[0].thumbnailUrl),
      userName: user.displayName,
    };
  }
  getClipURL(thumbURL: string) {
    return thumbURL.replace(/-preview.*/g, ".mp4");
  }
}
export type ChatModule = Chat;
