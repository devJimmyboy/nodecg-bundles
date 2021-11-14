"use strict"
import LastFm from "@toplast/lastfm"

import { EventEmitter } from "events"
import * as util from "util"

export type ConfigLastFM = {
  api_key: string
  user: string
  poll_time?: number
  nowplaying_only?: boolean
  user_agent?: string
}

export default (config: ConfigLastFM) => new LastFMNowPlaying(config)

// EventEmitter.defaultMaxListeners = 45
export class LastFMNowPlaying extends EventEmitter {
  lastFm: LastFm
  api_key: string
  user: string
  poll_time: number
  nowplaying_only: boolean
  user_agent: string
  tick: NodeJS.Timer
  lasttrack: string

  constructor(config: ConfigLastFM) {
    super()
    this.setMaxListeners(25)

    let { api_key, user, poll_time, nowplaying_only, user_agent } = config

    this.api_key = api_key
    this.lastFm = new LastFm(api_key)
    this.user = user
    this.poll_time = poll_time ? poll_time : 10000
    this.nowplaying_only = nowplaying_only ? nowplaying_only : false
    this.user_agent = user_agent ? user_agent : "BarryCarlyon/1.0.0 https://github.com/BarryCarlyon/LastFMNowPlaying"

    this.start()
  }

  tock() {
    this.lastFm.user
      .getRecentTracks({ user: this.user, limit: 1 })
      .then((resp) => {
        this.emit("always", resp)

        try {
          var { recenttracks } = resp
          var track = recenttracks.track[0]

          var is_playing = false
          if (track["@attr"] && track["@attr"].nowplaying) {
            is_playing = true
          }

          if (!is_playing && this.nowplaying_only) {
            // not playing
            this.emit("nochange")
            return
          }
          var song = track.name
          if (this.lasttrack != song) {
            this.lasttrack = song
            this.emit("song", track)
          } else {
            // no change
            this.emit("nochange")
          }
        } catch (err) {
          this.emit("error", err)
        }
      })
      .catch((err) => {
        this.emit("error", err)
      })
  }

  start() {
    this.stop()

    this.tick = setInterval(() => {
      this.tock()
    }, this.poll_time)

    this.tock()
  }
  stop() {
    clearInterval(this.tick)
  }
}
