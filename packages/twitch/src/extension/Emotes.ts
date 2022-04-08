import { ServiceProvider } from "nodecg-io-core";
import { EmoteCollection, TwitchAddonsClient } from "nodecg-io-twitch-addons/extension";
import { NodeCGServer } from "nodecg-types/types/lib/nodecg-instance";

import { Emoter, ParseMsgOptions } from "./Emoter";
import Twitch from "./Twitch";

export type ParseEmotesParams = { message: string; options: ParseMsgOptions }

module.exports = async function (nodecg: NodeCGServer, twitch: Twitch, twitchAddonsProvider: ServiceProvider<TwitchAddonsClient>) {
  let tAddonsClient: TwitchAddonsClient | undefined
  var emotesRep = nodecg.Replicant<EmoteCollection | undefined>('emotes', { persistent: true, defaultValue: undefined })
  let emotes: EmoteCollection
  let emoteNames: string[]
  let emoteParser = new Emoter()

  twitchAddonsProvider?.onAvailable(async (client) => {
    tAddonsClient = client
    if (emotes === undefined) emotes = await client.getEmoteCollection('devjimmyboy', { includeGlobal: true, include7tv: true }).then((res) => (emotesRep.value = res))
    if (emoteNames === undefined) emoteNames = client.getEmoteNames(emotes)
    if (emoteParser.emotes.size == 0) emoteParser.addEmoteSet(emoteNames, async (e) => (await client.getEmoteURL(e, emotes, 4)) || '')
    let success = {
      ffz: emotes.ffz[0].emoticons.length,
      ffzGlobal: emotes.ffzGlobal[0].emoticons.length,
      bttv: emotes.bttvChannel.length + emotes.bttvShared.length,
      bttvGlobal: emotes.bttvGlobal.length,
      '7tv': emotes.stv.length,
      '7tvGlobal': emotes.stvGlobal.length,
    }
    nodecg.log.info(emoteNames.length, 'Emotes Retrieved from providers: ', success)
  })
  twitchAddonsProvider?.onUnavailable(() => (tAddonsClient = undefined))
  twitch.onReady(() => {
    emoteParser.setChannel(twitch.userId)
    emoteParser.loadBadges().then(() => console.log('Badges loaded'))
  })

  nodecg.listenFor('parseEmotes', ({ message, options }: ParseEmotesParams, ack) => {
    nodecg.log.info('Parsing emotes for message ', message)
    const parsedMessage = emoteParser.parseMessage(message, options)
    nodecg.log.info('Parsed msg: ', parsedMessage)
    if (ack && !ack.handled) ack(null, parsedMessage)
  })
  nodecg.listenFor('getEmote', async (emoteCode: string, ack) => {
    if (tAddonsClient === undefined) {
      if (ack && !ack.handled) ack(new Error('Twitch Addons Client is not available'))
      return
    }
    const emote = await tAddonsClient.getEmoteURL(emoteCode, emotes, 4)
    if (ack && !ack.handled) ack(null, emote)
  })

  nodecg.listenFor('getAllEmotes', async (cock: undefined, ack) => {
    if (emotes === undefined) {
      if (ack && !ack.handled) ack(new Error('Emote Collection is undefined'))
      return
    }
    if (ack && !ack.handled) ack(null, emotes)
  })
  nodecg.listenFor('getBadges', async (user: string, ack) => {
    if (!twitch.ready) {
      if (ack && !ack.handled) ack(new Error("twitch isn't ready"))
      return
    }
    if (ack && !ack.handled) ack(null, await emoteParser.getBadges(user))
  })
}
