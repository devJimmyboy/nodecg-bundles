import { requireService } from "nodecg-io-core";
import { NodeCG } from "nodecg-types/types/server";
import OBSWebSocket, { EventSubscription } from "obs-websocket-js";

import { PositionConfig } from "../../global";

module.exports = async function (nodecg: NodeCG) {
  nodecg.Replicant<PositionConfig>("posLogo", {
    defaultValue: [0, 0],
    persistent: true,
  });

  const obs = new OBSWebSocket();
  await refreshClient();
  const reps = {
    currentScene: nodecg.Replicant<string>("currentScene", {
      defaultValue: "unknown",
    }),
  };

  let scenes = (await obs.call("GetSceneList")).scenes;
  nodecg.log.info(`There are ${scenes.length} scenes!`);

  nodecg.listenFor("refreshClient", refreshClient);

  nodecg.log.info(
    "OBS client has been updated, counting scenes and switching to another one."
  );

  // obs.on("error", (err) => {
  //   nodecg.log.error("Socket error:", err);
  // });

  // obs.on("ConnectionClosed", () => {
  //   nodecg.log.info(
  //     "OBS connection has been closed, attempting to Reconnect..."
  //   );
  // });

  // nodecg.listenFor("switchScene", (sceneName: string) => {
  //   if (!sceneList.find((scene) => scene.name === sceneName)) {
  //     return;
  //   }
  // });
  // nodecg.listenFor("sendMessage", (data: { msg: string; obj: object }) => {});
  // obs.on("SwitchScenes", (data: any) => {
  //   reps.currentScene.value = data["scene-name"];
  // });

  // obs?.onUnavailable(() => nodecg.log.info('OBS client has been unset.'))

  async function refreshClient() {
    await obs
      .connect("ws://47.188.34.85:4444", process.env.OBS_PASSWORD)
      .then((a) => nodecg.log.info("OBS Refreshed :)"))
      .catch(nodecg.log.error);
  }
};
