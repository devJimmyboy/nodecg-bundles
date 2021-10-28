import { PubSubListener } from "@twurple/pubsub"
import { PubSubSubscriptionMessageData } from "@twurple/pubsub/lib/Messages/PubSubSubscriptionMessage"
import { PubSubRedemptionMessageContent } from "@twurple/pubsub/lib/Messages/PubSubRedemptionMessage"
import { PubSubBitsMessageContent } from "@twurple/pubsub/lib/Messages/PubSubBitsMessage"
import { PubSubBitsBadgeUnlockMessageContent } from "@twurple/pubsub/lib/Messages/PubSubBitsBadgeUnlockMessage"
import { HelixPrivilegedUser, HelixStream } from "@twurple/api/lib"

interface TwitchCredentialConnectedAs {
  id: string
  name: string
}

export interface TwitchCredentials {
  isConnected: boolean
  connectedAs?: TwitchCredentialConnectedAs
  clientId: string
  clientSecret: string
  accessToken: string
  refreshToken: string
  expiryTimestamp: number
}

export interface TwitchPubSubListeners {
  onBitsBadgeUnlock?: PubSubListener<never>
  onSubscription?: PubSubListener<never>
  onBits?: PubSubListener<never>
  onRedemption?: PubSubListener<never>
}

export interface TwitchRedemptionEvent {
  type: string
  messageName: string
  data: PubSubRedemptionMessageContent
}

export interface TwitchBitsEvent {
  type: string
  messageName: string
  data: PubSubBitsMessageContent
}

export interface TwitchSubscriptionEvent {
  type: string
  messageName: string
  data: PubSubSubscriptionMessageData
}

export interface TwitchBitsBadgeEvent {
  type: string
  messageName: string
  data: PubSubBitsBadgeUnlockMessageContent
}

export type TwitchPubSubEvent = TwitchRedemptionEvent | TwitchBitsEvent | TwitchSubscriptionEvent | TwitchBitsBadgeEvent

export type TwitchEvent = TwitchPubSubEvent

export interface TwitchClip {
  id: string
  url: string
  creator_name: string
  title: string
  created_at: string
}

export type TwitchStats = {
  id: string
  name: string
  displayName: string
  url: string
  title: string
}

export type TwitchUserAndStream = HelixPrivilegedUser & {
  stream: HelixStream
}
