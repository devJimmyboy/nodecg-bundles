"use strict"
Object.defineProperty(exports, "__esModule", { value: true })
exports.Heat = void 0
var tslib_1 = require("tslib")
var events_1 = require("events")
var ws_1 = require("ws")
require("dotenv").config({ path: "../.env" })
// mod.cjs
var fetch = function () {
  var args = []
  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i]
  }
  return Promise.resolve()
    .then(function () {
      return import("node-fetch")
    })
    .then(function (_a) {
      var fetch = _a.default
      return fetch.apply(void 0, args)
    })
}
var Heat = /** @class */ (function (_super) {
  ;(0, tslib_1.__extends)(Heat, _super)
  function Heat(channelId, nodecg) {
    var _this = _super.call(this) || this
    _this.setMaxListeners(30)
    if (!channelId) {
      _this.log("Invalid channel ID.")
      return _this
    }
    _this.token = nodecg.Replicant("twitchToken", {
      persistent: true,
    })
    _this.users = new Map()
    _this.getToken()
    _this.channelId = channelId
    _this.connect()
    return _this
  }
  Heat.prototype.connect = function () {
    var _this = this
    var url = "wss://heat-api.j38.net/channel/" + this.channelId
    //let url = `wss://heat-api.j38.workers.dev/channel/${this.channelId}`;
    this.log("Connecting to " + url + ".")
    this.ws = new ws_1.WebSocket(url)
    this.ws.setMaxListeners(30)
    // Initial connection.
    this.ws.addEventListener("open", function () {
      _this.log("Connection open to Heat API server, channel " + _this.channelId + ".")
    })
    // Message received.
    this.ws.addEventListener("message", function (message) {
      var data = JSON.parse(message.data.toString())
      console.log("message received: ", data)
      if (data.type == "system") {
        _this.log("System message: " + data.message)
      } else {
        _this.emit("click", data)
      }
    })
    // Handle close and reconnect.
    this.ws.addEventListener("close", function (event) {
      _this.log("Connection closed:")
      console.log(event)
      _this.ws = null
      setTimeout(function () {
        _this.connect()
      }, 1000)
    })
  }
  Heat.prototype.getUserById = function (id) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
      var url, headers, response, data
      return (0, tslib_1.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            // Check user map first.
            if (this.users.has(id))
              return [
                2 /*return*/,
                this.users.get(id),
                // Ignore invalid names.
              ]
            // Ignore invalid names.
            if (id.startsWith("A")) return [2 /*return*/, { display_name: "Anonymous" }]
            if (id.startsWith("U"))
              return [
                2 /*return*/,
                { display_name: "Unverified" },
                // Query Twitch for user details.
              ]
            url = "https://api.twitch.tv/helix/users?id=" + id
            headers = {
              Authorization: "Bearer " + this.token.value.access_token,
            }
            return [4 /*yield*/, fetch(url, { headers: headers })]
          case 1:
            response = _a.sent()
            if (!response.ok) return [3 /*break*/, 3]
            return [4 /*yield*/, response.json()]
          case 2:
            data = _a.sent()
            this.users.set(id, data)
            this.log("User for id " + id + " found: " + data.display_name)
            return [2 /*return*/, data]
          case 3:
            return [2 /*return*/, { display_name: "Unknown" }]
        }
      })
    })
  }
  Heat.prototype.getUserByName = function (name) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
      var url, headers, response, data
      return (0, tslib_1.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            name = name.toLowerCase()
            // Check user map first.
            // Ignore invalid names.
            if (name.startsWith("A")) return [2 /*return*/, { display_name: "Anonymous" }]
            if (name.startsWith("U"))
              return [
                2 /*return*/,
                { display_name: "Unverified" },
                // Query Twitch for user details.
              ]
            url = "https://api.twitch.tv/helix/users?login=" + name
            headers = {
              Authorization: "Bearer " + this.token.value.access_token,
            }
            return [4 /*yield*/, fetch(url, { headers: headers })]
          case 1:
            response = _a.sent()
            if (!response.ok) return [3 /*break*/, 3]
            return [4 /*yield*/, response.json()]
          case 2:
            data = _a.sent()
            this.users.set(name, data)
            this.log("User for id " + name + " found: " + data.display_name)
            return [2 /*return*/, data]
          case 3:
            return [2 /*return*/, { display_name: "Unknown" }]
        }
      })
    })
  }
  Heat.prototype.getToken = function () {
    var _a
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
      var url, clientID, clientSecret, body, tokenScopes, currScopes, response, data
      return (0, tslib_1.__generator)(this, function (_b) {
        switch (_b.label) {
          case 0:
            url = "https://id.twitch.tv/oauth2/token"
            ;(clientID = process.env.CLIENT_ID || ""), (clientSecret = process.env.CLIENT_SECRET || "")
            body = new URLSearchParams({
              grant_type: "client_credentials",
              client_id: clientID,
              client_secret: clientSecret,
              scope:
                "user:read:follows user:read:subscriptions channel:read:subscriptions channel:read:polls channel:read:hype_train channel:read:goals bits:read",
            })
            tokenScopes = this.token.value.scope
            currScopes = body.get("scope").split(" ")
            if (
              ((_a = this.token.value) === null || _a === void 0 ? void 0 : _a.refresh_token) &&
              tokenScopes.every(function (s) {
                return currScopes.includes(s)
              }) &&
              tokenScopes.length == currScopes.length
            ) {
              body.set("refresh_token", this.token.value.refresh_token)
              body.set("grant_type", "refresh_token")
              body.delete("scope")
            }
            return [4 /*yield*/, fetch(url, { body: body, method: "POST" })]
          case 1:
            response = _b.sent()
            return [4 /*yield*/, response.json()]
          case 2:
            data = _b.sent()
            if (response.ok) {
              data = data
              this.token.value = data
              this.log("Token received: " + data.access_token + ", Expires in: " + data.expires_in)
              return [2 /*return*/, data]
            } else {
              data = data
              this.log("Token request rejected: " + data.message)
              return [
                2 /*return*/,
                {
                  access_token: "",
                  expires_in: 0,
                  refresh_token: "",
                  scope: [],
                  token_type: "bearer",
                },
              ]
            }
        }
      })
    })
  }
  Heat.prototype.refreshConnection = function () {
    if (this.ws && this.ws.readyState != ws_1.WebSocket.CLOSED) {
      this.ws.removeAllListeners()
      this.ws.close()
      this.ws = null
    }
    this.connect()
  }
  Heat.prototype.log = function (message) {
    var prefix = "[HEAT]"
    console.log(prefix + " " + message)
  }
  return Heat
})(events_1.EventEmitter)
exports.Heat = Heat
//# sourceMappingURL=Heat.js.map
