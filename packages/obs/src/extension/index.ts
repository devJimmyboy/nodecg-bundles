import { requireService } from 'nodecg-io-core'
import { OBSServiceClient } from 'nodecg-io-obs'
import { NodeCG } from 'nodecg-types/types/server'
import * as ObsWebSocket from 'obs-websocket-js'

import { PositionConfig } from '../../global'

module.exports = function (nodecg: NodeCG) {
  nodecg.Replicant<PositionConfig>('posLogo', { defaultValue: [0, 0], persistent: true })

  const obs = requireService<OBSServiceClient>(nodecg, 'obs')
  const reps = { currentScene: nodecg.Replicant<string>('currentScene', { defaultValue: 'unknown' }) }

  let sceneList: ObsWebSocket.Scene[]

  nodecg.listenFor('refreshClient', refreshClient)

  obs?.onAvailable((client) => {
    nodecg.log.info('OBS client has been updated, counting scenes and switching to another one.')

    client.on('error', (err) => {
      nodecg.log.error('Socket error:', err)
    })

    client.on('ConnectionClosed', () => {
      nodecg.log.info('OBS connection has been closed, attempting to Reconnect...')
    })
    client.send('GetSceneList').then((data: any) => {
      nodecg.log.info(`There are ${data.scenes.length} scenes!`)
      sceneList = data.scenes
    })
    nodecg.listenFor('switchScene', (sceneName: string) => {
      if (!sceneList.find((scene) => scene.name === sceneName)) {
        return
      }
      client.send('SetCurrentScene', { 'scene-name': sceneName })
    })
    nodecg.listenFor('sendMessage', (data: { msg: string; obj: object }) => {})
    client.on('SwitchScenes', (data: any) => {
      reps.currentScene.value = data['scene-name']
    })
  })

  obs?.onUnavailable(() => nodecg.log.info('OBS client has been unset.'))

  function refreshClient() {
    obs
      ?.getClient()
      ?.connect({ address: 'stream.jimmyboy.ngrok.io', password: process.env.OBS_PASSWORD, secure: true })
      .then(() => nodecg.log.info('OBS Refreshed :)'))
      .catch(nodecg.log.error)
  }
}
