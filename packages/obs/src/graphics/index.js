"use strict";
///<reference types="nodecg-types/types/browser"/>
Object.defineProperty(exports, "__esModule", { value: true });
require("jquery");
var LogoSrc = nodecg.Replicant("assets:logo");
var currScene = nodecg.Replicant("currentScene");
var offsets = { x: 10, y: 55 };
var posMap = {
    "Starting/Ending": {
        width: (window.innerWidth / 3) * 2,
        height: (window.innerHeight / 3) * 2,
        x: window.innerWidth / 2 - ((window.innerWidth / 3) * 2) / 2,
        y: (window.innerHeight * 2) / 3 - ((window.innerHeight / 3) * 2) / 2,
    },
    default: {
        width: "25%",
        height: "25%",
        x: `24px`,
        y: `24px`,
    },
};
var logo = $("#logo").length > 0 ? $("#logo") : $("<video id='logo'/>");
logo
    .attr("loop", "loop")
    .attr("autoplay", "autoplay")
    .attr("muted", "muted")
    .attr("playsinline", "playsinline")
    .attr("preload", "auto")
    .appendTo("body");
NodeCG.waitForReplicants(LogoSrc).then(function () {
    logo.attr("src", LogoSrc.value[0].url);
});
currScene.on("change", (newVal) => {
    let css = posMap[newVal] || posMap.default;
    logo.css(css);
});
//# sourceMappingURL=index.js.map