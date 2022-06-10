import { Dispatch, SetStateAction } from 'react'

export type Profile = {
  id: string
  username: string
}

export type Message = {
  id: string
  created_at: string
  content: string
  profile_id: string
  profile?: Profile
}

export type MessagesProps = {
  roomId: string
  profileCache: ProfileCache
  setProfileCache: Dispatch<SetStateAction<ProfileCache>>
}

export type ProfileCache = {
  [userId: string]: Profile
}
