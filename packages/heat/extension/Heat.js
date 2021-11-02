"use strict"
Object.defineProperty(exports, "__esModule", { value: true })
exports.Heat = void 0
const events_1 = require("events")
const ws_1 = require("ws")
require("dotenv").config({ path: "../.env" })
const fetch = (...args) =>
  // @ts-ignore
  Promise.resolve()
    .then(() => import("node-fetch"))
    .then(({ default: fetch }) => fetch(...args))
class Heat extends events_1.EventEmitter {
  constructor(channelId, nodecg) {
    super()
    if (!channelId) {
      this.log("Invalid channel ID.")
      return
    }
    this.token = nodecg.Replicant("twitchToken", {
      persistent: true,
    })
    this.users = new Map()
    this.getToken()
    this.channelId = channelId
    
    this.connect()
  }
  connect() {
    let url = `wss://heat-api.j38.net/channel/${this.channelId}`
    //let url = `wss://heat-api.j38.workers.dev/channel/${this.channelId}`;
    this.log(`Connecting to ${url}.`)
    this.ws = new ws_1.WebSocket(url)
    // Initial connection.
    this.ws.addEventListener("open", () => {
      this.log(`Connection open to Heat API server, channel ${this.channelId}.`)
    })
    // Message received.
    this.ws.addEventListener("message", (message) => {
      let data = JSON.parse(message.data.toString())
      console.log("message received: ", data)
      if (data.type == "system") {
        this.log("System message: " + data.message)
      } else {
        this.emit("click", data)
      }
    })
    // Handle close and reconnect.
    this.ws.addEventListener("close", (event) => {
      this.log("Connection closed:")
      console.log(event)
      this.ws = null
      setTimeout(() => {
        this.connect()
      }, 1000)
    })
  }
  async getUserById(id) {
    // Check user map first.
    if (this.users.has(id)) return this.users.get(id)
    // Ignore invalid names.
    if (id.startsWith("A")) return { display_name: "Anonymous" }
    if (id.startsWith("U")) return { display_name: "Unverified" }
    // Query Twitch for user details.
    const url = `https://api.twitch.tv/helix/users?id=${id}`
    const headers = {
      Authorization: `Bearer ${this.token.value.access_token}`,
    }
    // Handle response.
    let response = await fetch(url, { headers })
    if (response.ok) {
      let data = await response.json()
      this.users.set(id, data)
      this.log("User for id " + id + " found: " + data.display_name)
      return data
    } else {
      return { display_name: "Unknown" }
    }
  }
  async getUserByName(name) {
    name = name.toLowerCase()
    // Check user map first.
    // Ignore invalid names.
    if (name.startsWith("A")) return { display_name: "Anonymous" }
    if (name.startsWith("U")) return { display_name: "Unverified" }
    // Query Twitch for user details.
    const url = `https://api.twitch.tv/helix/users?login=${name}`
    const headers = {
      Authorization: `Bearer ${this.token.value.access_token}`,
    }
    // Handle response.
    let response = await fetch(url, { headers })
    if (response.ok) {
      let data = await response.json()
      this.users.set(name, data)
      this.log("User for id " + name + " found: " + data.display_name)
      return data
    } else {
      return { display_name: "Unknown" }
    }
  }
  async getToken() {
    var _a
    const url = `https://id.twitch.tv/oauth2/token`
    const clientID = process.env.CLIENT_ID || "",
      clientSecret = process.env.CLIENT_SECRET || ""
    const body = new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientID,
      client_secret: clientSecret,
      scope:
        "user:read:follows user:read:subscriptions channel:read:subscriptions channel:read:predictions channel:read:polls channel:read:hype_train channel:read:goals bits:read",
    })
    let tokenScopes = this.token.value.scope
    let currScopes = body.get("scope").split(" ")
    if (
      ((_a = this.token.value) === null || _a === void 0 ? void 0 : _a.refresh_token) &&
      tokenScopes.every((s) => currScopes.includes(s)) &&
      tokenScopes.length == currScopes.length
    ) {
      body.set("refresh_token", this.token.value.refresh_token)
      body.set("grant_type", "refresh_token")
      body.delete("scope")
    }
    // Handle response.
    let response = await fetch(url, { body, method: "POST" })
    let data = await response.json()
    if (response.ok) {
      data = data
      this.token.value = data
      this.log("Token received: " + data.access_token + ", Expires in: " + data.expires_in)
      return data
    } else {
      data = data
      this.log("Token request rejected: " + data.message)
      return {
        access_token: "",
        expires_in: 0,
        refresh_token: "",
        scope: [],
        token_type: "bearer",
      }
    }
  }
  refreshConnection() {
    if (this.ws && this.ws.readyState != ws_1.WebSocket.CLOSED) {
      this.ws.close()
      this.ws = null
    }
    this.connect()
  }
  log(message) {
    let prefix = "[HEAT]"
    console.log(prefix + " " + message)
  }
}
exports.Heat = Heat
//# sourceMappingURL=Heat.js.map
