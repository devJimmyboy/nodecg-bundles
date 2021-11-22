"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
// const io = require("socket.io-client");
var Heat_1 = require("./Heat");
module.exports = function (nodecg) {
    var _this = this;
    var _a;
    // let client: TwitchApiServiceClient | null = null;
    var channel = nodecg.Replicant("channel", {
        defaultValue: "47019739",
        persistent: true,
    }); //648196501 - bot 47019739 - Main Channel
    if ((_a = nodecg.bundleConfig) === null || _a === void 0 ? void 0 : _a.channel)
        channel.value = nodecg.bundleConfig.channel;
    else {
        nodecg.log.info("No channel specified, using previous value or default: " + channel.value);
    }
    if (!channel.value || typeof channel.value !== "string") {
        channel.value = "47019739";
    }
    var heat;
    heat = new Heat_1.Heat(channel.value, nodecg);
    heat.on("click", function (data) { return (0, tslib_1.__awaiter)(_this, void 0, void 0, function () {
        var clickData;
        var _a;
        return (0, tslib_1.__generator)(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = {
                        x: data.x,
                        y: data.y,
                        id: data.id
                    };
                    return [4 /*yield*/, heat.getUserById(data.id)];
                case 1:
                    clickData = (_a.user = _b.sent(),
                        _a);
                    // Finally, use the click coordinates to create your experience.
                    nodecg.log.info("Someone fucking clicked the stream: ", clickData.x, clickData.y);
                    nodecg.sendMessage("click", clickData);
                    return [2 /*return*/];
            }
        });
    }); });
    nodecg.listenFor("restartHeat", heatReset);
    nodecg.log.info("heat bundle started.");
    function heatReset() {
        heat.channelId = channel.value;
        heat.refreshConnection();
    }
};
//# sourceMappingURL=index.js.map