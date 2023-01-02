import { requireService } from "nodecg-io-core";
import { NodeCG } from "nodecg-types/types/server";
import OBSWebSocket, {
  EventSubscription,
  OBSWebSocketError,
} from "obs-websocket-js";
import { config } from "process";

import { PositionConfig, OBSConfig } from "../../global";

module.exports = async function (nodecg: NodeCG) {
  nodecg.Replicant<PositionConfig>("posLogo", {
    defaultValue: [0, 0],
    persistent: true,
  });
  const obsConfig = nodecg.Replicant<OBSConfig>("obsConfig", {
    defaultValue: {
      url: process.env["CURRENT_IP"] ?? "",
      port: 4444,
      password: process.env["OBS_PASSWORD"] ?? "",
    },
    persistent: true,
  });

  const obs = new OBSWebSocket();
  if (obsConfig.value?.url !== "" && obsConfig.value?.port)
    await refreshClient().catch((e) => {
      if (e instanceof OBSWebSocketError) {
        nodecg.log.error(
          "OBS Connection Failed:",
          e.name,
          e.message,
          "Code",
          e.code
        );
      } else {
        nodecg.log.error("OBS Connection Failed:", e);
      }
    });
  const reps = {
    currentScene: nodecg.Replicant<string>("currentScene", {
      defaultValue: "unknown",
    }),
  };

  let scenes = (
    await obs.call("GetSceneList").catch((err) => {
      nodecg.log.error(err);
      return { scenes: [] };
    })
  ).scenes;
  nodecg.log.info(`There are ${scenes.length} scenes!`);

  nodecg.listenFor("refreshClient", (msg, cb) =>
    refreshClient()
      .then(() => cb && !cb.handled && cb())
      .catch((e) => {
        if (e instanceof OBSWebSocketError) {
          nodecg.log.error(
            "OBS Connection Failed:",
            e.name,
            e.message,
            "Code",
            e.code
          );
        } else {
          nodecg.log.error("OBS Connection Failed:", e);
        }
        if (cb && !cb.handled) cb(e);
      })
  );

  nodecg.log.info(
    "OBS client has been updated, counting scenes and switching to another one."
  );

  obs.on("ConnectionError", (err) => {
    nodecg.log.error("Socket error:", err);
  });
  let reconnectTries = 0;
  obs.on("ConnectionClosed", () => {
    nodecg.log.info(
      "OBS connection has been closed, attempting to Reconnect..."
    );
    if (reconnectTries === 0) {
      attemptReconnect();
    }
  });

  obs.on("ConnectionOpened", () => {
    nodecg.log.info("OBS connection has been opened!");
    reconnectTries = 0;
  });

  async function attemptReconnect() {
    if (reconnectTries < 5) {
      reconnectTries++;
      try {
        await refreshClient();
      } catch (err) {
        nodecg.log.error("Failed to reconnect, retrying in 5 seconds...");
        setTimeout(attemptReconnect, 5000);
      }
    } else {
      nodecg.log.error("Failed to reconnect, giving up.");
      reconnectTries = 4;
      setTimeout(attemptReconnect, 1000 * 60 * 10);
    }
  }

  // nodecg.listenFor("switchScene", (sceneName: string) => {
  //   if (!sceneList.find((scene) => scene.name === sceneName)) {
  //     return;
  //   }
  // });
  // nodecg.listenFor("sendMessage", (data: { msg: string; obj: object }) => {});
  obs.on("SceneNameChanged", (data) => {
    reps.currentScene.value = data.sceneName;
  });

  obsConfig.on("change", async (old, newVal) => {
    await obs.disconnect();
    await refreshClient().catch((err) => {
      nodecg.log.error(err);
    });
  });

  async function refreshClient() {
    const protocol = obsConfig.value?.port === 443 ? "wss" : "ws";
    const url = `${protocol}://${obsConfig.value.url}:${
      obsConfig.value.port || 4444
    }`;
    const passwd = obsConfig.value.password;
    nodecg.log.info(
      "refreshing client with ip",
      `${url}`,
      "and",
      passwd ? "password" : "NO PASSWORD"
    );
    await obs
      .connect(url, passwd, {
        eventSubscriptions: EventSubscription.All,
        rpcVersion: 1,
      })
      .then((a) => nodecg.log.info("OBS Refreshed :)"));
  }
};
