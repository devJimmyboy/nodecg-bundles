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
      data.type,
      `(${data.name}) just SENT ME MONEY!!!!! - (${data.userCurrency.symbol}${data.amount} Pog Dollars)`,
      data.message
    );
  }
  const jwt = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNWZkMDQ1YTE2YmYwODE0YTk1NTM2YWNiIiwicm9sZSI6Im93bmVyIiwiY2hhbm5lbCI6IjVmZDA0NWExNmJmMDgxMjcxNjUzNmFjYyIsInByb3ZpZGVyIjoidHdpdGNoIiwiYXV0aFRva2VuIjoiNkdlTkUzc2lqSWlsYlNDdVBtdVlqRmFKbXV6OG91NTJKcHc0U2pzYU9NeDd3RW9NIiwiaWF0IjoxNjU1ODAxNjYxLCJpc3MiOiJTdHJlYW1FbGVtZW50cyJ9.m3sbigWyXnI5FkNl_JbNR56PUmbs6L03Gh0e4EN0_94`;

  socket.on("connect", onConnect);
  // Socket got disconnected
  socket.on("disconnect", onDisconnect);
  // Socket is authenticated
  socket.on("authenticated", onAuthenticated);
  socket.on("unauthorized", console.error);
  socket.on("event:test", (data) => {
    console.log(data);
    // Structure as on https://github.com/StreamElements/widgets/blob/master/CustomCode.md#on-event
  });
  socket.on("event", (data) => {
    console.log(data);
    // Structure as on https://github.com/StreamElements/widgets/blob/master/CustomCode.md#on-event
  });

  function onEvent(event: any) {
    const type = event.detail.listener;
    if (type === "tip-latest") {
      onTip(event.detail.event);
    }
  }
  function onConnect() {
    console.log("Successfully connected to the websocket");
    socket.emit("authenticate", { method: "jwt", token: jwt });
  }

  function onDisconnect() {
    console.log("Disconnected from websocket");
    // Reconnect
    socket.connect();
  }

  function onAuthenticated(data) {
    const { channelId } = data;
    console.log(`Successfully connected to channel ${channelId}`);
  }
}
