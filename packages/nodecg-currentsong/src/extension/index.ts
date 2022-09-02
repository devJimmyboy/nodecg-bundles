import LastFMNowPlaying from "./LastFMNowPlaying";
import { NodeCG } from "nodecg-types/types/server";
module.exports = function (nodecg: NodeCG) {
  const log = nodecg.log;
  log.info("current song bundle started.");
  const config = nodecg.bundleConfig;

  var last = LastFMNowPlaying({
    api_key: config.apikey,
    user: config.music.lastfmUser,
    user_agent: config.user_agent,
  });
  var currentSong = nodecg.Replicant("currentSong", {
    defaultValue: {
      title: "Loading...",
      artist: "Overlay by devJimmyboy",
      albumArt: "",
    },
    persistent: true,
    persistenceInterval: 500,
  });
  var rYPos = nodecg.Replicant("popoutTop", {
    defaultValue: "5%",
    persistent: true,
  });
  last
    .on("error", function (e) {
      console.error(e);
    })
    .on("song", (res) => {
      log.debug(
        "Successfully received data from Last.fm:\n",
        res.name,
        "by",
        res.artist.name,
        "from",
        res.album.name,
        "\n",
        res.image[0].url
      );
      var data = {
        artist: res.artist.name,
        title: res.name,
        albumArt: res.image.reduceRight((best, img) =>
          img.size >= best.size ? img : best
        ).url,
      };
      if (
        currentSong.value.title !== res.name &&
        currentSong.value.artist !== res.artist.name
      ) {
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
