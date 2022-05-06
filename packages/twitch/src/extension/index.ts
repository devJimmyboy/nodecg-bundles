import { requireService } from "nodecg-io-core";
import { StreamElementsServiceClient } from "nodecg-io-streamelements";
import { TwitchAddonsClient } from "nodecg-io-twitch-addons";
import { NodeCG } from "nodecg-types/types/server";
import { Twitch } from "./Twitch";
import customCSS from "./customCSS";
import NanoTimer from "nanotimer";
import StreamElements from "./StreamElements";
import Emotes from "./Emotes";
import { ApiClient } from "@twurple/api";

declare global {
  type TwitchExtension = Twitch;
}

export type CustomReward = {
  title: string;
  cost: number;
  desc: string;
  action: string;
  id: string | undefined;
};
// import { GoogleApisServiceClient } from "nodecg-io-googleapi0s"

module.exports = async function (nodecg: NodeCG) {
  const channel = "devJimmyboy";
  var channelId = "";
  const getData = async (
    type: "subs" | "rewards" | "follows" | string,
    client: ApiClient
  ) => {
    let data;
    if (type === "subs") {
      data = await client.subscriptions.getSubscriptions(channelId);
      _currentSubs.value = data.total;
    } else if (type === "rewards") {
      data = await client.channelPoints.getCustomRewards(channelId);
      data.forEach((v, i) => {
        if (customReward.value.find((val) => val.id === v.id)) {
          return;
        } else {
          customReward.value.push({
            id: v.id,
            cost: v.cost,
            desc: v.prompt,
            title: v.title,
            action: "",
          });
        }
      });
    } else if (type === "follows") {
      data = await client.users.getFollows({ followedUser: channelId });
      _followers.value = data.total;
    } else data = { error: true, message: "Invalid Type" };
    nodecg.log.debug(`Twitch data '${type}' requested`);
  };

  type Redemption = {};
  var timer = new NanoTimer(false);
  nodecg.log.info("twitch bundle started.");

  customCSS(nodecg);
  const twitch = new Twitch(nodecg);
  // Define Replicants w/ Default Values:
  const _subGoals = nodecg.Replicant("subGoals", {
    defaultValue: [],
    persistent: true,
  });
  const _currentSubs = nodecg.Replicant("currentSubs", {
    defaultValue: 0,
    persistent: true,
  });
  const _followers = nodecg.Replicant("currentFollowers", {
    defaultValue: 0,
    persistent: true,
  });
  const _redemptions = nodecg.Replicant<Redemption>("redemptions", {
    defaultValue: [],
    persistent: true,
  });
  const customReward = nodecg.Replicant<CustomReward[]>("customRewards", {
    defaultValue: [],
    persistent: true,
  });

  const streamelements = requireService<StreamElementsServiceClient>(
    nodecg,
    "streamelements"
  )!;
  StreamElements(nodecg, streamelements, twitch);
  const twitchAddons = requireService<TwitchAddonsClient>(
    nodecg,
    "twitch-addons"
  )!;
  // twitch?.onReady(() => { twitch?.chat.registerChatService(twitchChat as any) })
  // require("./TwitchAlerts")(nodecg, twitch, twitchChat)
  Emotes(nodecg, twitch, twitchAddons);
  // const youtube = requireService<GoogleApisServiceClient>(nodecg, "googleapis")

  nodecg.log.info("twitch-api service has been updated.");
  const channelInfo = await twitch.appApi.users.getMe();
  channelId = channelInfo?.id || "";
  const rewardsInfo = await twitch.appApi.channelPoints.getCustomRewards(
    channelId
  );
  timer.setInterval(getData, ["subs", twitch.appApi], "15s");
  for (let i of rewardsInfo) {
    // If one of our custom rewards is already in the database, log it.
    let cR = customReward.value.find((r) => i.title === r.title);
    if (cR) {
      cR.id = i.id;
    }
  }
  for (let r of customReward.value) {
    if (r.id) {
      let cR = await twitch.appApi.channelPoints.updateCustomReward(
        channelId,
        r.id,
        {
          isPaused: false,
          title: r.title,
          cost: r.cost,
          prompt: r.desc,
          isEnabled: true,
        }
      );
    } else {
      let cR = await twitch.appApi.channelPoints.createCustomReward(channelId, {
        title: r.title,
        cost: r.cost,
        prompt: r.desc,
        isEnabled: true,
      });
      r.id = cR.id;
    }
  }
  nodecg.listenFor("getData", (e) => getData(e, twitch.appApi));

  // youtube?.onAvailable(async (youtubeClient) => {
  //   // You can now use the youtube client here.
  // })

  // youtube?.onUnavailable(() => {
  //   nodecg.log.info("youtube has been unset.")
  // })
  return { twitch };
};
