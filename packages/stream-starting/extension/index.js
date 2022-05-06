"use strict";
var api = require("@twurple/api");
var auth = require("@twurple/auth");
function NanoTimer(log) {
  var version = process.version;
  var major = version.split(".")[0];
  major = major.split("v")[1];
  var minor = version.split(".")[1];
  if (major == 0 && minor < 10) {
    console.log("Error: Please update to the latest version of node! This library requires 0.10.x or later");
    process.exit(0);
  }
  this.intervalT1 = null;
  this.timeOutT1 = null;
  this.intervalCount = 1;
  this.deferredInterval = false;
  this.deferredTimeout = false;
  this.deferredTimeoutRef = null;
  this.deferredIntervalRef = null;
  this.timeoutCallbackRef = null;
  this.intervalCallbackRef = null;
  this.timeoutImmediateRef = null;
  this.intervalImmediateRef = null;
  this.intervalErrorChecked = false;
  this.intervalType = "";
  this.timeoutTriggered = false;
  if (log) {
    this.logging = true;
  }
}
NanoTimer.prototype.time = function(task, args, format, callback) {
  if (callback) {
    var t1 = process.hrtime();
    if (args) {
      args.push(function() {
        var time = process.hrtime(t1);
        if (format == "s") {
          callback(time[0] + time[1] / 1e9);
        } else if (format == "m") {
          callback(time[0] * 1e3 + time[1] / 1e6);
        } else if (format == "u") {
          callback(time[0] * 1e6 + time[1] / 1e3);
        } else if (format == "n") {
          callback(time[0] * 1e9 + time[1]);
        } else {
          callback(time);
        }
      });
      task.apply(null, args);
    } else {
      task(function() {
        var time = process.hrtime(t1);
        if (format == "s") {
          callback(time[0] + time[1] / 1e9);
        } else if (format == "m") {
          callback(time[0] * 1e3 + time[1] / 1e6);
        } else if (format == "u") {
          callback(time[0] * 1e6 + time[1] / 1e3);
        } else if (format == "n") {
          callback(time[0] * 1e9 + time[1]);
        } else {
          callback(time);
        }
      });
    }
  } else {
    var t1 = process.hrtime();
    if (args) {
      task.apply(null, args);
    } else {
      task();
    }
    var t2 = process.hrtime(t1);
    if (format == "s") {
      return t2[0] + t2[1] / 1e9;
    } else if (format == "m") {
      return t2[0] * 1e3 + t2[1] / 1e6;
    } else if (format == "u") {
      return t2[0] * 1e6 + t2[1] / 1e3;
    } else if (format == "n") {
      return t2[0] * 1e9 + t2[1];
    } else {
      return process.hrtime(t1);
    }
  }
};
NanoTimer.prototype.setInterval = function(task, args, interval, callback) {
  if (!this.intervalErrorChecked) {
    if (!task) {
      console.log("A task function must be specified to setInterval");
      process.exit(1);
    } else {
      if (typeof task != "function") {
        console.log("Task argument to setInterval must be a function reference");
        process.exit(1);
      }
    }
    if (!interval) {
      console.log("An interval argument must be specified");
      process.exit(1);
    } else {
      if (typeof interval != "string") {
        console.log("Interval argument to setInterval must be a string specified as an integer followed by 's' for seconds, 'm' for milli, 'u' for micro, and 'n' for nanoseconds. Ex. 2u");
        process.exit(1);
      }
    }
    if (callback) {
      if (typeof callback != "function") {
        console.log("Callback argument to setInterval must be a function reference");
        process.exit(1);
      } else {
        this.intervalCallbackRef = callback;
      }
    }
    this.intervalType = interval[interval.length - 1];
    if (this.intervalType == "s") {
      this.intervalTime = interval.slice(0, interval.length - 1) * 1e9;
    } else if (this.intervalType == "m") {
      this.intervalTime = interval.slice(0, interval.length - 1) * 1e6;
    } else if (this.intervalType == "u") {
      this.intervalTime = interval.slice(0, interval.length - 1) * 1e3;
    } else if (this.intervalType == "n") {
      this.intervalTime = interval.slice(0, interval.length - 1);
    } else {
      console.log("Error with argument: " + interval + ': Incorrect interval format. Format is an integer followed by "s" for seconds, "m" for milli, "u" for micro, and "n" for nanoseconds. Ex. 2u');
      process.exit(1);
    }
    this.intervalErrorChecked = true;
  }
  var thisTimer = this;
  if (this.intervalTime > 0) {
    if (this.intervalT1 == null) {
      this.intervalT1 = process.hrtime();
    }
    if (this.intervalTime * this.intervalCount > 8e15) {
      this.intervalT1 = process.hrtime();
      this.intervalCount = 1;
    }
    this.difArray = process.hrtime(this.intervalT1);
    this.difTime = this.difArray[0] * 1e9 + this.difArray[1];
    if (this.difTime < this.intervalTime * this.intervalCount) {
      if (this.intervalTime > 25e6) {
        if (this.deferredInterval == false) {
          this.deferredInterval = true;
          var msDelay = (this.intervalTime - 25e6) / 1e6;
          this.deferredIntervalRef = setTimeout(function() {
            thisTimer.setInterval(task, args, interval, callback);
          }, msDelay);
        } else {
          this.deferredIntervalRef = null;
          this.intervalImmediateRef = setImmediate(function() {
            thisTimer.setInterval(task, args, interval, callback);
          });
        }
      } else {
        this.intervalImmediateRef = setImmediate(function() {
          thisTimer.setInterval(task, args, interval, callback);
        });
      }
    } else {
      this.intervalImmediateRef = null;
      if (this.logging) {
        console.log("nanotimer log: cycle time at - " + this.difTime);
      }
      if (args) {
        task.apply(null, args);
      } else {
        task();
      }
      if (this.intervalT1) {
        this.intervalCount++;
        this.deferredInterval = false;
        this.intervalImmediateRef = setImmediate(function() {
          thisTimer.setInterval(task, args, interval, callback);
        });
      }
    }
  } else {
    if (this.intervalT1 == null) {
      this.intervalT1 = process.hrtime();
    }
    if (args) {
      task.apply(null, args);
    } else {
      task();
    }
    if (this.intervalT1) {
      this.intervalImmediateRef = setImmediate(function() {
        thisTimer.setInterval(task, args, interval, callback);
      });
    }
  }
};
NanoTimer.prototype.setTimeout = function(task, args, delay, callback) {
  if (!task) {
    console.log("A task function must be specified to setTimeout");
    process.exit(1);
  } else {
    if (typeof task != "function") {
      console.log("Task argument to setTimeout must be a function reference");
      process.exit(1);
    }
  }
  if (!delay) {
    console.log("A delay argument must be specified");
    process.exit(1);
  } else {
    if (typeof delay != "string") {
      console.log("Delay argument to setTimeout must be a string specified as an integer followed by 's' for seconds, 'm' for milli, 'u' for micro, and 'n' for nanoseconds. Ex. 2u");
      process.exit(1);
    }
  }
  if (callback) {
    if (typeof callback != "function") {
      console.log("Callback argument to setTimeout must be a function reference");
      process.exit(1);
    } else {
      this.timeoutCallbackRef = callback;
    }
  }
  var thisTimer = this;
  if (this.timeoutTriggered) {
    this.timeoutTriggered = false;
  }
  var delayType = delay[delay.length - 1];
  if (delayType == "s") {
    var delayTime = delay.slice(0, delay.length - 1) * 1e9;
  } else if (delayType == "m") {
    var delayTime = delay.slice(0, delay.length - 1) * 1e6;
  } else if (delayType == "u") {
    var delayTime = delay.slice(0, delay.length - 1) * 1e3;
  } else if (delayType == "n") {
    var delayTime = delay.slice(0, delay.length - 1);
  } else {
    console.log("Error with argument: " + delay + ': Incorrect delay format. Format is an integer followed by "s" for seconds, "m" for milli, "u" for micro, and "n" for nanoseconds. Ex. 2u');
    process.exit(1);
  }
  if (this.timeOutT1 == null) {
    this.timeOutT1 = process.hrtime();
  }
  var difArray = process.hrtime(this.timeOutT1);
  var difTime = difArray[0] * 1e9 + difArray[1];
  if (difTime < delayTime) {
    if (delayTime > 25e6) {
      if (this.deferredTimeout == false) {
        this.deferredTimeout = true;
        var msDelay = (delayTime - 25e6) / 1e6;
        this.deferredTimeoutRef = setTimeout(function() {
          thisTimer.setTimeout(task, args, delay, callback);
        }, msDelay);
      } else {
        this.deferredTimeoutRef = null;
        this.timeoutImmediateRef = setImmediate(function() {
          thisTimer.setTimeout(task, args, delay, callback);
        });
      }
    } else {
      this.timeoutImmediateRef = setImmediate(function() {
        thisTimer.setTimeout(task, args, delay, callback);
      });
    }
  } else {
    this.timeoutTriggered = true;
    this.timeoutImmediateRef = null;
    this.timeOutT1 = null;
    this.deferredTimeout = false;
    if (this.logging == true) {
      console.log("nanotimer log: actual wait - " + difTime);
    }
    if (args) {
      task.apply(null, args);
    } else {
      task();
    }
    if (callback) {
      var data = { "waitTime": difTime };
      callback(data);
    }
  }
};
NanoTimer.prototype.clearInterval = function() {
  if (this.deferredIntervalRef) {
    clearTimeout(this.deferredIntervalRef);
    this.deferredInterval = false;
  }
  if (this.intervalImmediateRef) {
    clearImmediate(this.intervalImmediateRef);
  }
  this.intervalT1 = null;
  this.intervalCount = 1;
  this.intervalErrorChecked = false;
  if (this.intervalCallbackRef) {
    this.intervalCallbackRef();
  }
};
NanoTimer.prototype.clearTimeout = function() {
  if (this.timeoutTriggered == false) {
    if (this.deferredTimeoutRef) {
      clearTimeout(this.deferredTimeoutRef);
      if (this.timeOutT1) {
        var difArray = process.hrtime(this.timeOutT1);
        var difTime = difArray[0] * 1e9 + difArray[1];
      }
      this.deferredTimeout = false;
    }
    if (this.timeoutImmediateRef) {
      clearImmediate(this.timeoutImmediateRef);
    }
    this.timeOutT1 = null;
    if (this.timeoutCallbackRef) {
      var data = { "waitTime": difTime };
      this.timeoutCallbackRef(data);
    }
  }
};
NanoTimer.prototype.hasTimeout = function() {
  return this.timeOutT1 != null;
};
var nanotimer = NanoTimer;
module.exports = function(nodecg) {
  console.log("Twitch Extension properties:", JSON.stringify(Object.keys(nodecg.extensions["twitch"])));
  var playing = false;
  const currentState = nodecg.Replicant("streamStartCurrentState", {
    defaultValue: "starting",
    persistent: false
  });
  const progress = nodecg.Replicant("streamStartProgress", {
    defaultValue: 0,
    persistent: false
  });
  nodecg.Replicant("streamStartTime", {
    defaultValue: new Date(),
    persistent: true
  });
  const states = nodecg.Replicant("streamStartStates", {
    defaultValue: {
      starting: { length: 5, loadingText: "loading", video: "" },
      brb: { length: 5, loadingText: "loading", video: "" },
      ending: { length: 5, loadingText: "loading", video: "" },
      custom: { length: 5, loadingText: "loading", video: "" }
    },
    persistent: true
  });
  const pp = process;
  const cId = pp.env.CLIENT_ID;
  const cSec = pp.env.CLIENT_SECRET;
  const tAuth = new auth.ClientCredentialsAuthProvider(cId, cSec);
  const twitch = new api.ApiClient({ authProvider: tAuth });
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
  var timer = new nanotimer();
  function loadingIncrement() {
    if (progress.value >= 1) {
      timer.clearInterval();
      progress.value = 1;
    } else
      progress.value += 0.01;
  }
  function changeState(state) {
    if (state === currentState.value || !["starting", "brb", "ending", "custom"].includes(state))
      return;
    else {
      currentState.value = state;
      nodecg.log.info("State changed to " + state, states.value[state]);
    }
  }
  progress.on("change", function(newVal, oldVal) {
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
      if (playing)
        timer.setInterval(loadingIncrement, [], msPerPercent);
    }
    if (typeof newVal === "string")
      progress.value = 0;
  }
  currentState.on("change", onNewState);
  states.on("change", onNewState);
  nodecg.listenFor("changeState", (state) => {
    changeState(state);
  });
  nodecg.listenFor("start", () => {
    if (config.length > 0 && !playing) {
      timer.setInterval(loadingIncrement, [], msPerPercent);
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
