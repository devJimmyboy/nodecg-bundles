"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.LastFMNowPlaying = void 0;
var lastfm_1 = require("@toplast/lastfm");
var events_1 = require("events");
exports.default = (function (config) { return new LastFMNowPlaying(config); });
// EventEmitter.defaultMaxListeners = 45
var LastFMNowPlaying = /** @class */ (function (_super) {
    __extends(LastFMNowPlaying, _super);
    function LastFMNowPlaying(config) {
        var _this = _super.call(this) || this;
        _this.setMaxListeners(25);
        var api_key = config.api_key, user = config.user, poll_time = config.poll_time, nowplaying_only = config.nowplaying_only, user_agent = config.user_agent;
        _this.api_key = api_key;
        _this.lastFm = new lastfm_1.default(api_key);
        _this.user = user;
        _this.poll_time = poll_time ? poll_time : 10000;
        _this.nowplaying_only = nowplaying_only ? nowplaying_only : false;
        _this.user_agent = user_agent ? user_agent : "BarryCarlyon/1.0.0 https://github.com/BarryCarlyon/LastFMNowPlaying";
        _this.start();
        return _this;
    }
    LastFMNowPlaying.prototype.tock = function () {
        var _this = this;
        this.lastFm.user
            .getRecentTracks({ user: this.user, limit: 1 })
            .then(function (resp) {
            _this.emit("always", resp);
            try {
                var recenttracks = resp.recenttracks;
                var track = recenttracks.track[0];
                var is_playing = false;
                if (track["@attr"] && track["@attr"].nowplaying) {
                    is_playing = true;
                }
                if (!is_playing && _this.nowplaying_only) {
                    // not playing
                    _this.emit("nochange");
                    return;
                }
                var song = track.name;
                if (_this.lasttrack != song) {
                    _this.lasttrack = song;
                    _this.emit("song", track);
                }
                else {
                    // no change
                    _this.emit("nochange");
                }
            }
            catch (err) {
                _this.emit("error", err);
            }
        })
            .catch(function (err) {
            _this.emit("error", err);
        });
    };
    LastFMNowPlaying.prototype.start = function () {
        var _this = this;
        this.stop();
        this.tick = setInterval(function () {
            _this.tock();
        }, this.poll_time);
        this.tock();
    };
    LastFMNowPlaying.prototype.stop = function () {
        clearInterval(this.tick);
    };
    return LastFMNowPlaying;
}(events_1.EventEmitter));
exports.LastFMNowPlaying = LastFMNowPlaying;
