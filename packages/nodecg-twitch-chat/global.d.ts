export interface Emote {
  id: string
  name: string
  owner: Owner
  visibility: number
  visibility_simple: any[]
  mime: string
  status: number
  tags: any[]
  width: number[]
  height: number[]
  urls: Array<string[]>
}

export interface Owner {
  id: string
  twitch_id: string
  login: string
  display_name: string
  role: Role
}

export interface Role {
  id: string
  name: string
  position: number
  color: number
  allowed: number
  denied: number
  default: boolean
}
