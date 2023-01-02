import { StreamElementsServiceClient } from "nodecg-io-streamelements/extension/StreamElements";
import { StreamElementsEvent } from "nodecg-io-streamelements/extension/StreamElementsEvent";
// import axios from "axios"
import { NodeCG } from "nodecg-types/types/server";

import { ServiceProvider } from "nodecg-io-core";
import { Twitch } from "./Twitch";
import { Socket } from "socket.io-client";
// const alert = axios.create({ baseURL: "/alerts" })

export default function (
  nodecg: NodeCG,
  socket: typeof Socket,
  alertHandler: Twitch
) {
  // nodecg.listenFor("alert", (data: Alerts.Alert) => alert.post("/alerts", data))

  function onHost(data) {
    alertHandler.sendAlert(
      data.type,
      `(${data.data.displayName}) just hosted lil' old me with (${data.data.amount} cool kids)!`
    );
  }

  function onRaid(data) {
    alertHandler.sendAlert(
      data.type,
      `(${data.data.displayName}) just raided lil' old me with (${data.data.amount} cool kids)!`
    );
  }

  function onTip(data) {
    alertHandler.sendAlert(
      "tip",
      `(${data.name}) just SENT ME MONEY!!!!! - (${
        data.currency === "USD" ? "$" : ""
      }${data.amount}) (Pog) (Dollars)`,
      data.message
    );
  }
  const jwt = process.env["STREAMELEMENTS_JWT"];

  socket.on("connect", onConnect);
  // Socket got disconnected
  socket.on("disconnect", onDisconnect);
  // Socket is authenticated
  socket.on("authenticated", onAuthenticated);
  socket.on("unauthorized", console.error);
  socket.on("event:test", (data) => {
    nodecg.log.info(data);
    onEvent(data, true);
    // Structure as on https://github.com/StreamElements/widgets/blob/master/CustomCode.md#on-event
  });
  socket.on("event", (data) => {
    nodecg.log.info(data);
    onEvent(data);
    // Structure as on https://github.com/StreamElements/widgets/blob/master/CustomCode.md#on-event
  });
  socket.on("event:update", (data) => {
    nodecg.log.info(data);
    // Structure as on https://github.com/StreamElements/widgets/blob/master/CustomCode.md#on-session-update
  });
  socket.on("event:reset", (data) => {
    nodecg.log.info(data);
    // Structure as on https://github.com/StreamElements/widgets/blob/master/CustomCode.md#on-session-update
  });

  function onEvent(event: any, test = false) {
    const type = event.listener;
    if (type === "tip-latest") {
      onTip(event.event);
    }
  }
  function onConnect() {
    nodecg.log.info("Successfully connected to the websocket");
    socket.emit("authenticate", { method: "jwt", token: jwt });
  }

  function onDisconnect() {
    nodecg.log.info("Disconnected from websocket");
    // Reconnect
    socket.connect();
  }

  function onAuthenticated(data) {
    const { channelId } = data;
    nodecg.log.info(`Successfully connected to channel ${channelId}`);
  }
}
