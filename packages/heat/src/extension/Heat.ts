import { EventEmitter } from "events";
import { NodeCG, ReplicantServer } from "nodecg-types/types/server";
import { WebSocket } from "ws";
import axios from "axios";
import type { HelixUserData } from "@twurple/api";
require("dotenv").config({ path: "../.env" });

interface TwitchToken {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string[];
  token_type: "bearer";
}
export class Heat extends EventEmitter {
  channelId: string | number;
  users: Map<string, { display_name: string }>;
  ws: WebSocket | null;
  token: ReplicantServer<TwitchToken>;

  constructor(channelId: string | number, nodecg: NodeCG) {
    super();
    this.setMaxListeners(30);

    if (!channelId) {
      this.log("Invalid channel ID.");
      return;
    }

    this.token = nodecg.Replicant<TwitchToken>("twitchToken", {
      persistent: true,
    });
    this.users = new Map();

    this.getToken();

    this.channelId = channelId;
    this.connect();
  }

  connect() {
    let url = `wss://heat-api.j38.net/channel/${this.channelId}`;
    //let url = `wss://heat-api.j38.workers.dev/channel/${this.channelId}`;
    this.log(`Connecting to ${url}.`);
    this.ws = new WebSocket(url);
    this.ws.setMaxListeners(30);

    // Initial connection.
    this.ws.addEventListener("open", () => {
      this.log(
        `Connection open to Heat API server, channel ${this.channelId}.`
      );
    });

    interface HeatMessage {
      type: "system" | "click";

      message: string;
      id: string;
      x: string;
      y: string;
    }

    // Message received.
    this.ws.addEventListener("message", (message: any) => {
      let data = JSON.parse(message.data.toString()) as HeatMessage;
      console.log("message received: ", data);

      if (data.type == "system") {
        this.log("System message: " + data.message);
      } else {
        this.emit("click", data);
      }
    });

    // Handle close and reconnect.
    this.ws.addEventListener("close", (event: any) => {
      this.log("Connection closed:");
      console.log(event);
      this.ws = null;
      setTimeout(() => {
        this.connect();
      }, 1000);
    });
  }

  async getUserById(id: string) {
    // Check user map first.
    if (this.users.has(id)) return this.users.get(id);

    // Ignore invalid names.
    if (id.startsWith("A")) return { display_name: "Anonymous" };
    if (id.startsWith("U")) return { display_name: "Unverified" };

    // Query Twitch for user details.
    const url = `https://api.twitch.tv/helix/users`;

    // Handle response.
    let response = await axios
      .get<{ data: HelixUserData[] }>(url, {
        params: {
          id,
        },
        headers: {
          "Client-ID": process.env["TWITCH_CLIENT_ID"]!,
          Authorization: `Bearer ${this.token.value.access_token}`,
        },
      })
      .catch((err) => {
        console.debug(err);
        return this.getToken().then((token) => {
          return axios.get<{ data: HelixUserData[] }>(url, {
            params: {
              id,
            },
          });
        });
      });
    if (response.status == 200) {
      let data = response.data.data[0]!;
      this.users.set(id, data);
      this.log("User for id " + id + " found: " + data.display_name);
      return data;
    } else {
      return { display_name: "Unknown" };
    }
  }
  async getUserByName(name: string) {
    name = name.toLowerCase();
    // Check user map first.

    // Ignore invalid names.
    if (name.startsWith("A")) return { display_name: "Anonymous" };
    if (name.startsWith("U")) return { display_name: "Unverified" };

    // Query Twitch for user details.
    const url = `https://api.twitch.tv/helix/users?login=${name}`;
    const headers = {
      Authorization: `Bearer ${this.token.value.access_token}`,
    };

    // Handle response.
    let response = await axios.get<{ display_name: string }>(url, { headers });
    if (response.status == 200) {
      let data = response.data;
      this.users.set(name, data);
      this.log("User for id " + name + " found: " + data.display_name);
      return data;
    } else {
      return { display_name: "Unknown" };
    }
  }

  async getToken(): Promise<TwitchToken> {
    const url = `https://id.twitch.tv/oauth2/token`;
    const clientID = process.env["CLIENT_ID"] || "",
      clientSecret = process.env["CLIENT_SECRET"] || "";
    const body = new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientID,
      client_secret: clientSecret,
      scope:
        "user:read:follows user:read:subscriptions channel:read:subscriptions channel:read:polls channel:read:hype_train channel:read:goals bits:read",
    });
    let tokenScopes = this.token.value.scope;
    let currScopes = (body.get("scope") as string).split(" ");
    if (
      this.token.value?.refresh_token &&
      tokenScopes.every((s) => currScopes.includes(s)) &&
      tokenScopes.length == currScopes.length
    ) {
      body.set("refresh_token", this.token.value.refresh_token);
      body.set("grant_type", "refresh_token");
      body.delete("scope");
    }
    // Handle response.
    let response = await axios.post<ErrorRes | TwitchToken>(url, body, {});
    let data = response.data;
    if (response.status == 200) {
      data = data as TwitchToken;
      this.token.value = data;
      axios.defaults.headers.common["Client-ID"] = `${clientID}`;
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${data.access_token}`;
      this.log(
        "Token received: " +
          data.access_token +
          ", Expires in: " +
          data.expires_in
      );
      return data;
    } else {
      data = data as ErrorRes;

      this.log("Token request rejected: " + data.message);
      return {
        access_token: "",
        expires_in: 0,
        refresh_token: "",
        scope: [],
        token_type: "bearer",
      };
    }
  }

  refreshConnection() {
    if (this.ws && this.ws.readyState != WebSocket.CLOSED) {
      this.ws.removeAllListeners();
      this.ws.close();
      this.ws = null;
    }
    this.connect();
  }

  log(message: string | any) {
    let prefix = "[HEAT]";
    console.log(prefix + " " + message);
  }
}
interface ErrorRes {
  error: string;
  message: string;
  status: number;
}
