import { NodeCGServer } from "nodecg/types/lib/nodecg-instance"
import { ApiClient } from "@twurple/api"
import { RefreshingAuthProvider } from "@twurple/auth"
import { Alerts } from "simple-alerts/global"
import { promises as fs } from "fs"
import { join } from "path"
require("dotenv").config()

export type AlertType = "subscriber" | "gift-subscriber" | "tip" | "follow" | "redemption" | "cheer" | "host" | "raid"

export class AlertHandler {
  tokens: typeof import("./tokens.json")
  nodecg: NodeCGServer
  auth: RefreshingAuthProvider
  api: ApiClient
  constructor(nodecg: NodeCGServer) {
    this.nodecg = nodecg
    this.init()
  }

  async init() {
    this.tokens = await fs
      .readFile(join(__dirname, "tokens.json"), "utf-8")
      .then((data) => JSON.parse(data))
      .catch((err) => console.error(err))
    this.auth = new RefreshingAuthProvider(
      {
        clientId: (this.nodecg.config as any).login.twitch.clientID,
        clientSecret: process.env.CLIENT_SECRET as string,
        onRefresh: async (newTokenData) =>
          await fs
            .writeFile(join(__dirname, "tokens.json"), JSON.stringify(newTokenData, null, 4), "utf-8")
            .then(() => {
              this.nodecg.log.info("Token Refreshed.")
            })
            .catch((err) => this.nodecg.log.error(err)),
      },
      this.tokens
    )
    this.api = new ApiClient({ authProvider: this.auth })
  }

  public sendAlert(type: AlertType, data: any) {
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
        let tier = ""
        if (data.tier && data.tier !== "prime") tier = (parseInt(data.tier as string) / 1000).toString()
        else if (data.tier === "prime") tier = "Prime"
        alert.message =
          (data.gifted
            ? `(${data.sender}) just gifted a (Tier ${tier}) sub to (${data.displayName})!`
            : `(${data.displayName}) just (${tier}) subbed to the channel! It's their `) +
          (data.streak === undefined
            ? `(first)`
            : `(${
                data.streak && data.streak % 10 < 4 ? (data.streak % 10 == 2 ? "2nd" : "3rd") : `${data.streak}th`
              })`) +
          " month!"
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
}

export default AlertHandler
