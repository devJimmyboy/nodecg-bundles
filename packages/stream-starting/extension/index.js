"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nanotimer_1 = __importDefault(require("nanotimer"));
/**
 * @param  {NodeCGServer} nodecg
 */
module.exports = function (nodecg) {
    var playing = false;
    const currentState = nodecg.Replicant("streamStartCurrentState", { defaultValue: "starting", persistent: false });
    const progress = nodecg.Replicant("streamStartProgress", { defaultValue: 0, persistent: true });
    const timeLeft = nodecg.Replicant("streamStartTime", { defaultValue: new Date(), persistent: true });
    const states = nodecg.Replicant("streamStartStates", {
        defaultValue: {
            starting: { length: 5, loadingText: "loading", video: "" },
            brb: { length: 5, loadingText: "loading", video: "" },
            ending: { length: 5, loadingText: "loading", video: "" },
            custom: { length: 5, loadingText: "loading", video: "" },
        },
        persistent: true,
    });
    let config = states.value[currentState.value];
    progress.value = 0;
    let msPerPercent = (config.length * 600).toString() + "m";
    var timer = new nanotimer_1.default();
    function loadingIncrement() {
        if (progress.value >= 1) {
            timer.clearInterval();
            progress.value = 1;
        }
        else
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
    progress.on("change", function (newVal, oldVal) {
        if (oldVal == 1 && newVal != 1) {
            progress.value = newVal;
            timer.clearInterval();
            timer.setInterval(loadingIncrement, [], msPerPercent);
        }
        else if (oldVal !== undefined && oldVal != 1 && newVal == 1) {
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
//# sourceMappingURL=index.js.map