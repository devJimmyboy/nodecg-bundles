declare namespace StreamElements {
  interface MessageData {
    time: number;
    tags: {
      badges: string;
      color: string;
      "display-name": string;
      emotes: string;
      flags: string;
      id: string;
      mod: string;
      "room-id": string;
      subscriber: string;
      "tmi-sent-ts": string;
      turbo: string;
      "user-id": string;
      "user-type": string;
    }
    nick: string;
    userId: string;
    displayName: string;
    displayColor: string;
    badges: {
      type: string;
      version: string;
      url: string;
      description: string;
    }[];
    channel: string;
    text: string;
    isAction: boolean;
    emotes: Emote[];
    msgId: string;
  }

  interface Emote {
    type: string;
    name: string;
    id: string;
    gif: boolean;
    urls: {
      "1": string;
      "2": string;
      "4": string;
    }
    start: number;
    end: number;

  }

  type EventData<T extends Listener = Listener> = {
    listener: T
    event: ListenerMap[T]
  }

  type Listener = keyof ListenerMap
  type ListenerMap = {
    "follower-latest": LatestData;
    "subscriber-latest": LatestData;
    "host-latest": LatestData;
    "cheer-latest": LatestData;
    "raid-latest": LatestData;
    "tip-latest": LatestData;
    "message": { data: MessageData };
    /**
     * This event is fired when a message is delete from the channel, sends msgId.
     */
    "delete-message": string;
    /**
     * This event is fired when the user is banned, sends the userId.
     */
    "delete-messages": string;
    "event:skip": {};
    "alertService:toggleSound": {};
    "bot:counter": { counter: string; value: number };
    "kvstore:update": {};
    "widget-button": { field: string; value: string };
  }

  type LatestEvent = "follower-latest" | "subscriber-latest" | "host-latest" | "cheer-latest" | "raid-latest" | "tip-latest";
  type LatestData = {
    name: string;
    amount: string;
    message: string;
    gifted: boolean;
    sender: string;
    bulkGifted: boolean;
    isCommunityGift: boolean;
    playedAsCommunityGift: boolean;
    userCurrency?: { symbol: string };

  }
}
