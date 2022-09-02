"use strict";
import LastFm from "lastfm-typed";

import EventEmitter from "eventemitter3";
import TypedEmitter from "typed-emitter";
import * as util from "util";
import { getRecentTracks } from "lastfm-typed/dist/interfaces/userInterface";

type MessageEvents = {
  always: (message: getRecentTracks) => void;
  nochange: () => void;
  song: (message: getRecentTracks["tracks"][0]) => void;
  error: (message: any) => void;
};

export type ConfigLastFM = {
  api_key: string;
  user: string;
  poll_time?: number;
  nowplaying_only?: boolean;
  user_agent?: string;
};

export default (config: ConfigLastFM) => new LastFMNowPlaying(config);

// EventEmitter.defaultMaxListeners = 45
export class LastFMNowPlaying extends EventEmitter<MessageEvents> {
  lastFm: LastFm;
  api_key: string;
  user: string;
  poll_time: number;
  nowplaying_only: boolean;
  user_agent: string;
  tick: NodeJS.Timer;
  lasttrack: string;

  constructor(config: ConfigLastFM) {
    super();

    let { api_key, user, poll_time, nowplaying_only, user_agent } = config;

    this.api_key = api_key;
    this.lastFm = new LastFm(api_key);
    this.user = user;
    this.poll_time = poll_time ? poll_time : 10000;
    this.nowplaying_only = nowplaying_only ? nowplaying_only : false;
    this.user_agent = user_agent
      ? user_agent
      : "BarryCarlyon/1.0.0 https://github.com/BarryCarlyon/LastFMNowPlaying";

    this.start();
  }

  tock() {
    this.lastFm.user
      .getRecentTracks({ username: this.user, limit: 1 })
      .then((resp) => {
        this.emit("always", resp);

        try {
          var { tracks } = resp;
          var track = tracks[0];

          var is_playing = false;
          if (track.nowplaying) {
            is_playing = true;
          }

          if (!is_playing && this.nowplaying_only) {
            // not playing
            this.emit("nochange");
            return;
          }
          var song = track.name;
          if (this.lasttrack != song) {
            this.lasttrack = song;
            this.emit("song", track);
          } else {
            // no change
            this.emit("nochange");
          }
        } catch (err) {
          this.emit("error", err);
        }
      })
      .catch((err) => {
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
