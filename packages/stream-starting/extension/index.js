"use strict";

var _nanotimer = _interopRequireDefault(require("nanotimer"));

var _api = require("@twurple/api");

var _auth = require("@twurple/auth");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (nodecg) {
  if (nodecg.extensions["twitch"]) console.log("Twitch Extension properties:", JSON.stringify(Object.keys(nodecg.extensions["twitch"])));
  var playing = false;
  const currentState = nodecg.Replicant("streamStartCurrentState", {
    defaultValue: "starting",
    persistent: false
  });
  const progress = nodecg.Replicant("streamStartProgress", {
    defaultValue: 0,
    persistent: false
  });
  const timeLeft = nodecg.Replicant("streamStartTime", {
    defaultValue: new Date(),
    persistent: true
  });
  const states = nodecg.Replicant("streamStartStates", {
    defaultValue: {
      starting: {
        length: 5,
        loadingText: "loading",
        video: ""
      },
      brb: {
        length: 5,
        loadingText: "loading",
        video: ""
      },
      ending: {
        length: 5,
        loadingText: "loading",
        video: ""
      },
      custom: {
        length: 5,
        loadingText: "loading",
        video: ""
      }
    },
    persistent: true
  });
  const pp = process;
  const cId = pp.env.CLIENT_ID;
  const cSec = pp.env.CLIENT_SECRET;
  const tAuth = new _auth.ClientCredentialsAuthProvider(cId, cSec);
  const twitch = new _api.ApiClient({
    authProvider: tAuth
  });
  let config = states.value[currentState.value];
  progress.value = 0;
  nodecg.listenFor("getUserAvatar", async (data, cb) => {
    const user = await twitch.users.getUserByName(data);

    if (!user) {
      cb(new Error("User not found"));
      return;
    }

    if (cb && !cb.handled && cb.handled == false) {
      cb(null, user.profilePictureUrl);
    }
  });
  let msPerPercent = (config.length * 600).toString() + "m";
  var timer = new _nanotimer.default();

  function loadingIncrement() {
    if (progress.value >= 1) {
      timer.clearInterval();
      progress.value = 1;
    } else progress.value += 0.01;
  }

  function changeState(state) {
    if (state === currentState.value || !["starting", "brb", "ending", "custom"].includes(state)) return;else {
      currentState.value = state;
      nodecg.log.info("State changed to " + state, states.value[state]);
    }
  }

  progress.on("change", function (newVal, oldVal) {
    if (oldVal == 1 && newVal != 1) {
      progress.value = newVal;
      timer.clearInterval();
      timer.setInterval(loadingIncrement, [], msPerPercent);
    } else if (oldVal !== void 0 && oldVal != 1 && newVal == 1) {
      timer.clearInterval();
    }
  });

  function onNewState(newVal, oldVal) {
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
  nodecg.listenFor("changeState", state => {
    changeState(state);
  });
  nodecg.listenFor("start", () => {
    if (config.length > 0 && !playing) {
      timer.setInterval(loadingIncrement, [], msPerPercent);
      playing = true;
    }
  });
  nodecg.listenFor("stream-started", () => {
    if (config.length > 0) {
      timer.clearInterval();
      progress.value = 0;
      playing = false;
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