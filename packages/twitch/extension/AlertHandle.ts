import { NodeCGServer } from "nodecg/types/lib/nodecg-instance"
import { ApiClient } from "@twurple/api"
import { RefreshingAuthProvider } from "@twurple/auth"
import { Alerts } from "simple-alerts/global"
import { promises as fs } from "fs"
import { join } from "path"
import { AlertData } from "../global"
import { ReplicantBrowser, ReplicantServer } from "nodecg/types/server"
require("dotenv").config()

export type AlertType = "subscriber" | "gift-subscriber" | "tip" | "follow" | "redemption" | "cheer" | "host" | "raid"

export type TokenTwitch = {
  refreshToken: string | null
  accessToken: string
  expiresIn: number | null
  obtainmentTimestamp: number
}

export class AlertHandler {
  tokens: ReplicantServer<TokenTwitch>
  nodecg: NodeCGServer
  auth: RefreshingAuthProvider
  api: ApiClient
  constructor(nodecg: NodeCGServer) {
    this.nodecg = nodecg
    this.tokens = nodecg.Replicant("twitchToken", {
      persistent: true,
    })
    this.init()
  }

  async init() {
    this.auth = new RefreshingAuthProvider(
      {
        clientId: (this.nodecg.config as any).login.twitch.clientID,
        clientSecret: process.env.CLIENT_SECRET as string,
        onRefresh: async (newTokenData) => {
          this.tokens.value = newTokenData
          this.nodecg.log.info("Token Refreshed.")
        },
      },
      this.tokens.value
    )
    this.api = new ApiClient({ authProvider: this.auth })
  }

  public sendAlert(type: AlertType, data: AlertData) {
    console.log("received alert of type ", type, " with data:", data)
    var alert: Alerts.Alert = { name: type, message: "", event: data }
    switch (type) {
      case "follow":
        alert.message = `(${data.displayName}) just followed!`
        break
      case "cheer":
        alert.message = `(${data.displayName}) just wired me (${data.amount} bitties)!`
        alert.attachMsg = data.message || ""
        break
      case "host":
        alert.message = `(${data.displayName}) just hosted me with (${data.amount}) lil fuckers!`
        this.nodecg.sendMessage("host", data.displayName)
        break
      case "raid":
        alert.message = `(${data.displayName}) just raided with (${data.amount}) PogChampions 😎`
        break
      case "subscriber":
        if (data.gifted) alert.name = "gift-subscriber"
        let tier = `Tier `
        if (data.tier && data.tier.toLowerCase() !== "prime") tier += (parseInt(data.tier as string) / 1000).toString()
        else if (data.tier === "prime") tier = "Prime"
        alert.message = data.gifted
          ? `${
              data.quantity !== undefined && data.quantity > 1
                ? `(${data.sender}) just gifted ${data.quantity} (${tier}) subs! My gamer <3`
                : `(${data.sender}) just gifted a (${tier}) sub to (${data.displayName})!`
            }`
          : `${
              `(${data.displayName}) just (${tier}) subbed to the channel! It's their ` +
              (data.streak === undefined
                ? ` (first)`
                : ` (${
                    data.streak && data.streak % 10 < 4 ? (data.streak % 10 == 2 ? "2nd" : "3rd") : `${data.streak}th`
                  })`) +
              " month!"
            }`
        if (data.message) alert.attachMsg = data.message
        break
      case "tip":
        alert.message = `(${data.displayName || data.username || "anonymous"}) gave me ${data.currency || ""}${
          data.amount || "money"
        }! Holy shit! Thanks!`
        alert.attachMsg = data.message
        break
    }
    this.nodecg.sendMessage("alert", alert)
  }
  getAuth() {
    return this.auth
  }

  getApi() {
    return this.api
  }
}

export default AlertHandler
