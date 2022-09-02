import { NodeCGServer } from "nodecg-types/types/lib/nodecg-instance";
import NanoTimer from "nanotimer";
import { ApiClient } from "@twurple/api";
import { ClientCredentialsAuthProvider } from "@twurple/auth";

/**
 * @param  {NodeCGServer} nodecg
 */
module.exports = function (nodecg: NodeCGServer) {
  if (nodecg.extensions["twitch"])
    console.log(
      "Twitch Extension properties:",
      JSON.stringify(Object.keys(nodecg.extensions["twitch"]))
    );
  var playing = false;
  const currentState = nodecg.Replicant<States>("streamStartCurrentState", {
    defaultValue: "starting",
    persistent: false,
  });

  const progress = nodecg.Replicant<number>("streamStartProgress", {
    defaultValue: 0,
    persistent: false,
  });

  const timeLeft = nodecg.Replicant<Date>("streamStartTime", {
    defaultValue: new Date(),
    persistent: true,
  });

  const states = nodecg.Replicant<StateConfig>("streamStartStates", {
    defaultValue: {
      starting: { length: 5, loadingText: "loading", video: "" },
      brb: { length: 5, loadingText: "loading", video: "" },
      ending: { length: 5, loadingText: "loading", video: "" },
      custom: { length: 5, loadingText: "loading", video: "" },
    },
    persistent: true,
  });
  // const twitchToken = nodecg.Replicant<string>("twitchToken", "twitch");
  const pp = process;
  const cId = pp.env.CLIENT_ID;
  const cSec = pp.env.CLIENT_SECRET;
  const tAuth = new ClientCredentialsAuthProvider(cId, cSec);
  const twitch = new ApiClient({ authProvider: tAuth });

  let config = states.value[currentState.value];
  progress.value = 0;
  nodecg.listenFor("getUserAvatar", async (data: string, cb) => {
    const user = await twitch.users.getUserByName(data);
    if (!user) {
      // @ts-ignore
      cb(new Error("User not found"));
      return;
    }
    if (cb && !cb.handled && cb.handled == false) {
      cb(null, user.profilePictureUrl);
    }
  });

  let msPerPercent = (config.length * 600).toString() + "m";
  var timer = new NanoTimer();

  function loadingIncrement() {
    if (progress.value >= 1) {
      timer.clearInterval();
      progress.value = 1;
    } else progress.value += 0.01;
  }

  function changeState(state: States) {
    if (
      state === currentState.value ||
      !["starting", "brb", "ending", "custom"].includes(state)
    )
      return;
    else {
      currentState.value = state;
      nodecg.log.info("State changed to " + state, states.value[state]);
    }
  }

  progress.on("change", function (newVal, oldVal) {
    if (oldVal == 1 && newVal != 1) {
      progress.value = newVal;
      timer.clearInterval();
      timer.setInterval(loadingIncrement, [], msPerPercent);
    } else if (oldVal !== undefined && oldVal != 1 && newVal == 1) {
      timer.clearInterval();
    }
  });

  function onNewState(
    newVal: StateConfig | States,
    oldVal: StateConfig | States | undefined
  ) {
    config = states.value[currentState.value];
    if (config.length > 0) {
      msPerPercent = (config.length * 600).toString() + "m";

      timer.clearInterval();
      if (playing) timer.setInterval(loadingIncrement, [], msPerPercent);
    }
    if (typeof newVal === "string") progress.value = 0;
  }
  currentState.on("change", onNewState);
  states.on("change", onNewState);

  // Listen for events

  nodecg.listenFor("changeState", (state) => {
    changeState(state);
  });

  nodecg.listenFor("start", () => {
    if (config.length > 0 && !playing) {
      timer.setInterval(loadingIncrement, [], msPerPercent); // Update the progress by config time}

      playing = true;
    }
  });

  nodecg.listenFor("restart", () => {
    progress.value = 0;
  });

  nodecg.listenFor("stop", () => {
    if (playing) {
      timer.clearInterval();
      playing = false;
    }
  });
};

export type Config = {
  length: number;
  loadingText: string;
  video: string;
};

export type States = "starting" | "brb" | "ending" | "custom";

export type StateConfig = { [key in States]: Config };
