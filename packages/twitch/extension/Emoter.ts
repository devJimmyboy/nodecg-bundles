export class Emoter {
  emotes: EmoterMap
  constructor() {
    this.emotes = new Map()
  }

  async addEmoteSet(emoteSet: Iterable<string>, urlMethod: (emote: string) => string | Promise<string>) {
    for (const e of emoteSet) {
      if (!this.emotes.has(e)) this.emotes.set(e, [])
      let url = await urlMethod(e)
      this.emotes.get(e)?.push(url)
    }
  }

  parseMessage(
    message: string,
    options: ParseMsgOptions = { classListEmoteImg: [], classListEmoteSpan: [], classListWords: [] }
  ) {
    let messageArray: string[] = message.split(" ")
    messageArray = [
      `<span class="${options.classListWords.join(" ")}">`,
      ...messageArray.map((w, i, arr) => {
        if (this.emotes.has(w))
          return `</span> <span class="${options.classListEmoteSpan.join(" ")}"><img src="${
            (this.emotes.get(w) as string[])[0]
          }" class="${options.classListEmoteImg.join(" ")}"/></span> <span class="${options.classListWords.join(" ")}"`
        else return w
      }),
      `</span>`,
    ]
    return messageArray.join(" ")
  }
}

export type EmoterMap = Map<string, string[]>

export type ParseMsgOptions = {
  classListWords: string[]
  classListEmoteSpan: string[]
  classListEmoteImg: string[]
}
