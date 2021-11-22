import {
  TwitchAddonsClient,
  EmoteCollection,
} from "../../../../nodecg/nodecg-io/services/nodecg-io-twitch-addons/extension"
import { NodeCGServer } from "nodecg-types/types/lib/nodecg-instance"
import { ServiceProvider } from "../../../../nodecg/nodecg-io/node_modules/nodecg-io-core"
import { Emoter, ParseMsgOptions } from "./Emoter"

module.exports = async function (nodecg: NodeCGServer, twitchAddonsProvider: ServiceProvider<TwitchAddonsClient>) {
  let tAddonsClient = twitchAddonsProvider?.getClient()
  let emotes: EmoteCollection
  let emoteNames: string[]
  let emoteParser = new Emoter()

  twitchAddonsProvider?.onAvailable(async (client) => {
    tAddonsClient = client
    if (emotes === undefined)
      emotes = await client.getEmoteCollection("devjimmyboy", { includeGlobal: true, include7tv: true })
    if (emoteNames === undefined) emoteNames = client.getEmoteNames(emotes)
    if (emoteParser.emotes.size == 0)
      emoteParser.addEmoteSet(emoteNames, async (e) => (await client.getEmoteURL(e, emotes, 4)) || "")
    let success = {
      ffz: emotes.ffz[0].emoticons.length,
      ffzGlobal: emotes.ffzGlobal[0].emoticons.length,
      bttv: emotes.bttvChannel.length + emotes.bttvShared.length,
      bttvGlobal: emotes.bttvGlobal.length,
      "7tv": emotes.stv.length,
      "7tvGlobal": emotes.stvGlobal.length,
    }
    nodecg.log.info(emoteNames.length, "Emotes Retrieved from providers: ", success)
  })
  twitchAddonsProvider?.onUnavailable(() => (tAddonsClient = undefined))

  nodecg.listenFor("parseEmotes", ({ message, options }: { message: string; options: ParseMsgOptions }) => {
    return emoteParser.parseMessage(message, options)
  })
}
