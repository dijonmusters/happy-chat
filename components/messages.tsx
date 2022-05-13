import { useEffect, useState, useRef } from 'react'
import supabase from '../utils/supabase'

type Message = {
  id: string
  created_at: string
  content: string
  profile_id: string
  profile: {
    username: string
  }
}

export default function Messages() {
  const [messages, setMessages] = useState<Message[]>([])
  const messagesRef = useRef<HTMLDivElement>(null)

  console.log({ messagesRef })

  const getData = async () => {
    const { data } = await supabase
      .from<Message>('messages')
      .select('*, profile: profiles(username)')

    if (!data) {
      alert('no data')
      return
    }

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
      .from<Message>('messages')
      .on('INSERT', () => {
        getData()
      })
      .subscribe()

    return () => {
      supabase.removeSubscription(subscription)
    }
  }, [])

  const userId = supabase.auth.user()?.id

  console.log({ messages })

  return (
    <div className="flex-1 overflow-y-scroll bg-pink-200" ref={messagesRef}>
      <ul className="flex flex-col justify-end space-y-1 p-4">
        {messages.map((message) => (
          <li
            key={message.id}
            className={
              message.profile_id === userId
                ? 'self-end rounded bg-blue-400 px-2'
                : 'self-start rounded bg-gray-100 px-2'
            }
          >
            <span className="block text-xs text-gray-500">
              {message.profile.username}
            </span>
            <span className="">{message.content}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
