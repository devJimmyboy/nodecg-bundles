"use strict";
var LastFm = require("@toplast/lastfm");
var events = require("events");
function _interopDefaultLegacy(e) {
  return e && typeof e === "object" && "default" in e ? e : { "default": e };
}
var LastFm__default = /* @__PURE__ */ _interopDefaultLegacy(LastFm);
var LastFMNowPlaying = (config) => new LastFMNowPlaying$1(config);
class LastFMNowPlaying$1 extends events.EventEmitter {
  constructor(config) {
    super();
    this.setMaxListeners(25);
    let { api_key, user, poll_time, nowplaying_only, user_agent } = config;
    this.api_key = api_key;
    this.lastFm = new LastFm__default["default"](api_key);
    this.user = user;
    this.poll_time = poll_time ? poll_time : 1e4;
    this.nowplaying_only = nowplaying_only ? nowplaying_only : false;
    this.user_agent = user_agent ? user_agent : "BarryCarlyon/1.0.0 https://github.com/BarryCarlyon/LastFMNowPlaying";
    this.start();
  }
  tock() {
    this.lastFm.user.getRecentTracks({ user: this.user, limit: 1 }).then((resp) => {
      this.emit("always", resp);
      try {
        var { recenttracks } = resp;
        var track = recenttracks.track[0];
        var is_playing = false;
        if (track["@attr"] && track["@attr"].nowplaying) {
          is_playing = true;
        }
        if (!is_playing && this.nowplaying_only) {
          this.emit("nochange");
          return;
        }
        var song = track.name;
        if (this.lasttrack != song) {
          this.lasttrack = song;
          this.emit("song", track);
        } else {
          this.emit("nochange");
        }
      } catch (err) {
        this.emit("error", err);
      }
    }).catch((err) => {
      this.emit("error", err);
    });
  }
  start() {
    this.stop();
    this.tick = setInterval(() => {
      this.tock();
    }, this.poll_time);
    this.tock();
  }
  stop() {
    clearInterval(this.tick);
  }
}
module.exports = function(nodecg) {
  const log = nodecg.log;
  log.info("current song bundle started.");
  const config = nodecg.bundleConfig;
  var last = LastFMNowPlaying({
    api_key: config.apikey,
    user: config.music.lastfmUser,
    user_agent: config.user_agent
  });
  var currentSong = nodecg.Replicant("currentSong", {
    defaultValue: { title: "Loading...", artist: "Overlay by devJimmyboy", albumArt: "" },
    persistent: true,
    persistenceInterval: 500
  });
  nodecg.Replicant("popoutTop", { defaultValue: "5%", persistent: true });
  last.on("error", function(e) {
    console.error(e);
  }).on("warning", function(e) {
    console.error("Got a", e.code, e.body);
  }).on("song", (res) => {
    log.debug("Successfully received data from Last.fm:\n", JSON.stringify(res));
    var data = { artist: res.artist["#text"], title: res.name, albumArt: res.image[3]["#text"] };
    if (currentSong.value.title !== res.title && currentSong.value.artist !== res.artist) {
      currentSong.value = data;
    }
  });
};
