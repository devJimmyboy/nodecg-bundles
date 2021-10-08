import { NodeCG } from "nodecg-types/types/server"
import { requireService } from "nodecg-io-core"
import { OBSServiceClient } from "nodecg-io-obs"
import * as ObsWebSocket from "obs-websocket-js"

module.exports = function (nodecg: NodeCG) {
  const obs = requireService<OBSServiceClient>(nodecg, "obs")
  const reps = { currentScene: nodecg.Replicant<string>("currentScene", { defaultValue: "unknown" }) }

  let sceneList: ObsWebSocket.Scene[]

  obs?.onAvailable((client) => {
    nodecg.log.info("OBS client has been updated, counting scenes and switching to another one.")
    client.send("GetSceneList").then((data) => {
      nodecg.log.info(`There are ${data.scenes.length} scenes!`)
      sceneList = data.scenes
    })
    nodecg.listenFor("switchScene", (sceneName: string) => {
      if (!sceneList.find((scene) => scene.name === sceneName)) {
        return
      }
      client.send("SetCurrentScene", { "scene-name": sceneName })
    })
    nodecg.listenFor("sendMessage", (data: { msg: string; obj: object }) => {})
    client.on("SwitchScenes", (data) => {
      reps.currentScene.value = data["scene-name"]
    })
  })

  obs?.onUnavailable(() => nodecg.log.info("OBS client has been unset."))
}
