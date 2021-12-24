import { TwitchPrivateMessage } from "@twurple/chat/lib/commands/TwitchPrivateMessage";
import fetch from 'node-fetch';
export class Emoter {
  channel?: string
  emotes: EmoterMap
  badges: BadgeMap
  badgeObj = {}

  constructor() {
    this.emotes = new Map()
    this.badges = new Map()

  }

  setChannel(channel: string) {
    this.channel = channel
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
        if (this.emotes.has(w)) {
          let emote: string;
          if (!this.emotes.get(w)) return w
          if (this.emotes.get(w)?.length === 0) return w
          else emote = this.emotes.get(w)?.[0] as string
          if (emote.startsWith("/")) (this.emotes.get(w) as string[])[0] = `https:` + this.emotes.get(w)?.[0]
          return `</span> <span class="${options.classListEmoteSpan.join(" ")}"><img src="${(this.emotes.get(w) as string[])[0]
            }" class="${options.classListEmoteImg.join(" ")}"/></span> <span class="${options.classListWords.join(" ")}">`
        }
        else return w
      }),
      `</span>`,
    ]
    return messageArray.join(" ")
  }

  async getBadges(user: string): Promise<string[] | undefined> {
    let badges = this.badges.get(user.toLowerCase())
    return badges ?? []
  }
  async loadBadges() {
    if (!this.channel) throw new Error("No channel set")

    let badges: string[] = []
    let _7tvBadges = (await (await fetch("https://api.7tv.app/v2/badges?user_identifier=login")).json()) as {
      badges: {
        id: string
        name: string
        tooltip: string
        urls: [string, string][]
        users: string[]
      }[]
    }
    for (const badge of _7tvBadges.badges) {
      let url = badge.urls[0][1]
      for (const user of badge.users) {
        if (!this.badges.has(user)) {
          this.badges.set(user, [])
        }
        if (!this.badges.get(user)?.includes(url)) this.badges.get(user)?.push(url)
      }
    }

    let ffzBadges = (await (await fetch("https://api.frankerfacez.com/v1/badges")).json()) as {
      badges: {
        id: number
        name: string
        title: string
        slot: number
        color: string
        image: string
        urls: { [resolution: string]: string }
      }[]
      users: { [badgeId: string]: string[] }
    }
    for (const badge of ffzBadges.badges) {
      let url = badge.urls["2"]
      for (const user of ffzBadges.users[badge.id.toString()]) {
        if (!this.badges.has(user)) {
          this.badges.set(user, [])
        }
        this.badges.get(user)?.push(url)
      }
    }
    let bttvBadges = (await (await fetch("https://api.betterttv.net/3/cached/badges")).json()) as {
      name: string
      badge: { description: string; svg: string }
    }[]
    for (const user in bttvBadges) {
      let url = bttvBadges[user].badge.svg
      if (!this.badges.has(user)) {
        this.badges.set(user, [])
      }
      if (!this.badges.get(user)?.includes(url)) this.badges.get(user)?.push(url)
    }
    let chatterinoBadges = (await (await fetch("https://api.chatterino.com/badges")).json()) as {
      badges: { description: string; image1: string; image2: string; image3: string; users: string[] }[]
    }
    for (const badge of chatterinoBadges.badges) {
      let url = badge.image2 || badge.image1
      for (const user of badge.users) {
        if (!this.badges.has(user)) {
          this.badges.set(user, [])
        }
        if (!this.badges.get(user)?.includes(url)) this.badges.get(user)?.push(url)
      }
    }
    let cBadges = await (await fetch(`https://badges.twitch.tv/v1/badges/channels/${this.channel}/display`)).json()
    let ffz = await (
      await fetch(`https://api.frankerfacez.com/v1/_room/id/${encodeURIComponent(this.channel)}`)
    ).json()
    const channelB = new Map<string, { [badgeId: string]: string }>()
    for (let b in cBadges.badge_sets) {
      const bVersions: { [key: string]: any } = {}
      for (let v in cBadges.badge_sets[b].versions) {
        bVersions[v] = cBadges.badge_sets[b].versions[v].image_url_2x
      }

      channelB.set(b, bVersions)
    }
    if (ffz.room.moderator_badge)
      channelB.set("moderator", {
        "1": `https://cdn.frankerfacez.com/room-badge/mod/${ffz.room.id}/4/rounded`,
      })
    if (ffz.room.vip_badge)
      channelB.set("vip", {
        "1": `https://cdn.frankerfacez.com/room-badge/vip/${ffz.room.id}/4`,
      })
    this.channelBadges.set(this.channel, channelB)

  }

  globals: any = {}
  twitchGlobal: Promise<JSON | void> = fetch("https://badges.twitch.tv/v1/badges/global/display")
    .then((res) => res.json())
    .then((v) => {
      this.globals = v
    })
  channelBadges = new Map<string, Map<string, { [badgeId: string]: string }>>()

  async getBadgeURL(badgeObj: { badge: string; badgeId: string }) {
    if (!this.channel) return new Error("No channel set")
    var url = ""
    let badge = badgeObj.badge
    var badgeId = badgeObj.badgeId
    await this.twitchGlobal
    if (this.channelBadges.has(this.channel) && this.channelBadges.get(this.channel)?.has(badge)) {
      url = this.channelBadges.get(this.channel)?.get(badge)?.[badgeId] || "";
    }
    if (this.channelBadges.has(this.channel) && this.channelBadges.get(this.channel)?.has(badge)) {
      url = this.channelBadges.get(this.channel)?.get(badge)?.[badgeId] || ""
    } else if (Object.keys(this.globals.badge_sets).includes(badge)) {
      url =
        this.globals.badge_sets[badge].versions[badgeId]?.image_url_2x || this.globals.badge_sets[badge].versions[0]["image_url_2x"]
    }

    if (url === "") {
      url = Object.keys(this.globals.badge_sets).includes(badge)
        ? this.globals.badge_sets[badge].versions[badgeId]["image_url_2x"]
        : "https://api.iconify.design/mdi:file-question-outline.svg"
    }

    // console.log("URL for Badge: ", url)

    return url
  }
}

export type EmoterMap = Map<string, string[]>
export type BadgeMap = Map<string, string[]>


export type ParseMsgOptions = {
  classListWords: string[]
  classListEmoteSpan: string[]
  classListEmoteImg: string[]
}
