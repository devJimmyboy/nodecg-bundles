"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LastFMNowPlaying_1 = require("./LastFMNowPlaying");
module.exports = function (nodecg) {
    var log = nodecg.log;
    log.info("current song bundle started.");
    var config = nodecg.bundleConfig;
    var last = (0, LastFMNowPlaying_1.default)({
        api_key: config.apikey,
        user: config.music.lastfmUser,
        user_agent: config.user_agent,
    });
    var currentSong = nodecg.Replicant("currentSong", {
        defaultValue: { title: "Loading...", artist: "Overlay by devJimmyboy", albumArt: "" },
        persistent: true,
        persistenceInterval: 500,
    });
    var rYPos = nodecg.Replicant("popoutTop", { defaultValue: "5%", persistent: true });
    last
        .on("error", function (e) {
        console.error(e);
    })
        .on("warning", function (e) {
        console.error("Got a", e.code, e.body);
    })
        .on("song", function (res) {
        log.debug("Successfully received data from Last.fm:\n", JSON.stringify(res));
        var data = { artist: res.artist["#text"], title: res.name, albumArt: res.image[3]["#text"] };
        if (currentSong.value.title !== res.title && currentSong.value.artist !== res.artist) {
            currentSong.value = data;
        }
    });
};
/* {
          artist: data.recenttracks.track[0].artist["#text"],
          song: data.recenttracks.track[0].name,
          albumArt: data.recenttracks.track[0].image[data.recenttracks.track[0].image.length - 1]["#text"],
        }
        */
