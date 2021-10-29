"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// const io = require("socket.io-client");
const Heat_1 = require("./Heat");
module.exports = function (nodecg) {
    var _a;
    // let client: TwitchApiServiceClient | null = null;
    let channel = nodecg.Replicant("channel", {
        defaultValue: "47019739",
        persistent: true,
    }); //648196501 - bot 47019739 - Main Channel
    if ((_a = nodecg.bundleConfig) === null || _a === void 0 ? void 0 : _a.channel)
        channel.value = nodecg.bundleConfig.channel;
    else {
        nodecg.log.info(`No channel specified, using previous value or default: ${channel.value}`);
    }
    if (!channel.value || typeof channel.value !== "string") {
        channel.value = "47019739";
    }
    var heat;
    heat = new Heat_1.Heat(channel.value, nodecg);
    heat.on("click", async (data) => {
        const clickData = {
            x: data.x,
            y: data.y,
            id: data.id,
            user: await heat.getUserById(data.id),
        };
        // Finally, use the click coordinates to create your experience.
        nodecg.log.info("Someone fucking clicked the stream: ", clickData.x, clickData.y);
        nodecg.sendMessage("click", clickData);
    });
    nodecg.listenFor("restartHeat", heatReset);
    nodecg.log.info("heat bundle started.");
    function heatReset() {
        heat.channelId = channel.value;
        heat.refreshConnection();
    }
};
//# sourceMappingURL=index.js.map