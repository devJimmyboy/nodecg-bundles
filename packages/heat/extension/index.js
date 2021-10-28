var $7iaTA$events = require("events");
var $7iaTA$ws = require("ws");
var $7iaTA$dotenv = require("dotenv");
var $7iaTA$nodefetch = require("node-fetch");

function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}



$7iaTA$dotenv.config({
    path: "../.env"
});

const $3d7ee7e9e627fdc4$var$fetch = (...args)=>// @ts-ignore
    $3d7ee7e9e627fdc4$importAsync$be7ad1c4dc96fb3b.then(({ default: fetch  })=>fetch(...args)
    )
;
class $3d7ee7e9e627fdc4$export$37bec69b0a6426df extends $7iaTA$events.EventEmitter {
    constructor(channelId, nodecg){
        super();
        if (!channelId) {
            this.log("Invalid channel ID.");
            return;
        }
        this.token = nodecg.Replicant("twitchToken", {
            persistent: true
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
        this.ws = new $7iaTA$ws.WebSocket(url);
        // Initial connection.
        this.ws.addEventListener("open", ()=>{
            this.log(`Connection open to Heat API server, channel ${this.channelId}.`);
        });
        // Message received.
        this.ws.addEventListener("message", (message)=>{
            let data = JSON.parse(message.data.toString());
            console.log("message received: ", data);
            if (data.type == "system") this.log("System message: " + data.message);
            else this.emit("click", data);
        });
        // Handle close and reconnect.
        this.ws.addEventListener("close", (event)=>{
            this.log("Connection closed:");
            console.log(event);
            this.ws = null;
            setTimeout(()=>{
                this.connect();
            }, 1000);
        });
    }
    async getUserById(id) {
        // Check user map first.
        if (this.users.has(id)) return this.users.get(id);
        // Ignore invalid names.
        if (id.startsWith("A")) return {
            display_name: "Anonymous"
        };
        if (id.startsWith("U")) return {
            display_name: "Unverified"
        };
        // Query Twitch for user details.
        const url = `https://api.twitch.tv/helix/users?id=${id}`;
        const headers = {
            Authorization: `Bearer ${this.token.value.access_token}`
        };
        // Handle response.
        let response = await $3d7ee7e9e627fdc4$var$fetch(url, {
            headers: headers
        });
        if (response.ok) {
            let data = await response.json();
            this.users.set(id, data);
            this.log("User for id " + id + " found: " + data.display_name);
            return data;
        } else return {
            display_name: "Unknown"
        };
    }
    async getUserByName(name) {
        name = name.toLowerCase();
        // Check user map first.
        // Ignore invalid names.
        if (name.startsWith("A")) return {
            display_name: "Anonymous"
        };
        if (name.startsWith("U")) return {
            display_name: "Unverified"
        };
        // Query Twitch for user details.
        const url = `https://api.twitch.tv/helix/users?login=${name}`;
        const headers = {
            Authorization: `Bearer ${this.token.value.access_token}`
        };
        // Handle response.
        let response = await $3d7ee7e9e627fdc4$var$fetch(url, {
            headers: headers
        });
        if (response.ok) {
            let data = await response.json();
            this.users.set(name, data);
            this.log("User for id " + name + " found: " + data.display_name);
            return data;
        } else return {
            display_name: "Unknown"
        };
    }
    async getToken() {
        var ref;
        const url = `https://id.twitch.tv/oauth2/token`;
        const clientID = process.env.CLIENT_ID || "", clientSecret = process.env.CLIENT_SECRET || "";
        const body = new URLSearchParams({
            grant_type: "client_credentials",
            client_id: clientID,
            client_secret: clientSecret,
            scope: "user:read:follows user:read:subscriptions channel:read:subscriptions channel:read:predictions channel:read:polls channel:read:hype_train channel:read:goals bits:read"
        });
        let tokenScopes = this.token.value.scope;
        let currScopes = body.get("scope").split(" ");
        if (((ref = this.token.value) === null || ref === void 0 ? void 0 : ref.refresh_token) && tokenScopes.every((s)=>currScopes.includes(s)
        ) && tokenScopes.length == currScopes.length) {
            body.set("refresh_token", this.token.value.refresh_token);
            body.set("grant_type", "refresh_token");
            body.delete("scope");
        }
        // Handle response.
        let response = await $3d7ee7e9e627fdc4$var$fetch(url, {
            body: body,
            method: "POST"
        });
        let data = await response.json();
        if (response.ok) {
            this.token.value = data;
            this.log("Token received: " + data.access_token + ", Expires in: " + data.expires_in);
            return data;
        } else {
            this.log("Token request rejected: " + data.message);
            return {
                access_token: "",
                expires_in: 0,
                refresh_token: "",
                scope: [],
                token_type: "bearer"
            };
        }
    }
    refreshConnection() {
        if (this.ws && this.ws.readyState != $7iaTA$ws.WebSocket.CLOSED) {
            this.ws.close();
            this.ws = null;
        }
        this.connect();
    }
    log(message) {
        let prefix = "[HEAT]";
        console.log(prefix + " " + message);
    }
}


module.exports = function(nodecg) {
    var ref;
    // let client: TwitchApiServiceClient | null = null;
    let channel = nodecg.Replicant("channel", {
        defaultValue: "47019739",
        persistent: true
    }); //648196501 - bot 47019739 - Main Channel
    if ((ref = nodecg.bundleConfig) === null || ref === void 0 ? void 0 : ref.channel) channel.value = nodecg.bundleConfig.channel;
    else nodecg.log.info(`No channel specified, using previous value or default: ${channel.value}`);
    if (!channel.value || typeof channel.value !== "string") channel.value = "47019739";
    var heat;
    heat = new $3d7ee7e9e627fdc4$export$37bec69b0a6426df(channel.value, nodecg);
    heat.on("click", async (data)=>{
        const clickData = {
            x: data.x,
            y: data.y,
            id: data.id,
            user: await heat.getUserById(data.id)
        };
        // Finally, use the click coordinates to create your experience.
        nodecg.log.info("Someone fucking clicked the stream: ", clickData.x, clickData.y);
        nodecg.sendMessage("click", clickData);
    });
    nodecg.listenFor("restartHeat", heatReset);
    nodecg.log.info("heat bundle started.");
    function heatReset() {
        heat.channelId = channel.value;
        heat.refreshConnection();
    }
};


//# sourceMappingURL=index.js.map
