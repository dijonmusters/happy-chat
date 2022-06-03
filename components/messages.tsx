import { useEffect, useState, useRef, Dispatch, SetStateAction } from 'react'
import supabase from '../utils/supabase'

export type Profile = {
  id: string
  username: string
}

type Message = {
  id: string
  created_at: string
  content: string
  profile_id: string
  profile?: Profile
}

type MessagesProps = {
  roomId: string
}

type ProfileCache = {
  [userId: string]: Profile
}

const Message = ({
  message,
  profile,
  setProfileCache,
}: {
  message: Message
  profile?: Profile
  setProfileCache: Dispatch<SetStateAction<ProfileCache>>
}) => {
  const userId = supabase.auth.user()?.id

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await supabase
        .from<Profile>('profiles')
        .select('id, username')
        .match({ id: message.profile_id })
        .single()

      if (data) {
        setProfileCache((current) => ({
          ...current,
          [data.id]: data,
        }))
      }
    }
    if (!profile) {
      fetchProfile()
    }
  }, [profile, message.profile_id])

  return (
    <li
      key={message.id}
      className={
        message.profile_id === userId
          ? 'self-end rounded bg-blue-400 px-2'
          : 'self-start rounded bg-gray-100 px-2'
      }
    >
      <span className="block text-xs text-gray-500">
        {profile?.username ?? 'Loading...'}
      </span>
      <span className="">{message.content}</span>
    </li>
  )
}

export default function Messages({ roomId }: MessagesProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const messagesRef = useRef<HTMLDivElement>(null)
  const [profileCache, setProfileCache] = useState<ProfileCache>({})

  const getData = async () => {
    const { data } = await supabase
      .from<Message>('messages')
      .select('*, profile: profiles(id, username)')
      .match({ room_id: roomId })
      .order('created_at')

    if (!data) {
      alert('no data')
      return
    }

    const newProfiles = Object.fromEntries(
      data
        .map((message) => message.profile)
        .filter(Boolean) // is truthy
        .map((profile) => [profile!.id, profile!])
    )

    setProfileCache((current) => ({
      ...current,
      ...newProfiles,
    }))

    setMessages(data)

    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight
    }
  }

  useEffect(() => {
    getData()
  }, [])

  useEffect(() => {
    const subscription = supabase
      .from<Message>(`messages:room_id=eq.${roomId}`)
      .on('INSERT', (payload) => {
        // TODO: add new user to cache if their profile doesn't exist
        setMessages((current) => [...current, payload.new])
        if (messagesRef.current) {
          messagesRef.current.scrollTop = messagesRef.current.scrollHeight
        }
      })
      .subscribe()

    return () => {
      supabase.removeSubscription(subscription)
    }
  }, [])

  return (
    <div className="flex-1 overflow-y-scroll bg-pink-200" ref={messagesRef}>
      <ul className="flex flex-col justify-end space-y-1 p-4">
        {messages.map((message) => (
          <Message
            message={message}
            profile={profileCache[message.profile_id]}
            setProfileCache={setProfileCache}
          />
        ))}
      </ul>
    </div>
  )
}
