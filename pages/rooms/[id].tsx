import Head from 'next/head'
import supabase from '../../utils/supabase'
import { Input } from '@supabase/ui'
import Messages from '../../components/messages'
import { useRouter } from 'next/router'
import UserList from '../../components/user-list'
import { Profile, ProfileCache } from '../../utils/types'
import { useEffect, useState } from 'react'
import Header from '../../components/header'

export default function Room() {
  const [profileCache, setProfileCache] = useState<ProfileCache>({})
  const [roomName, setRoomName] = useState<string>('')
  const router = useRouter()
  const roomId = router.query.id as string

  useEffect(() => {
    const getRoomName = async () => {
      const { data } = await supabase
        .from('rooms')
        .select('name')
        .match({
          id: roomId,
        })
        .single()

      setRoomName(data.name ?? 'Untitled')
    }

    if (roomId) {
      getRoomName()
    }
  }, [roomId])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const { message } = Object.fromEntries(new FormData(form))

    if (typeof message === 'string' && message.trim().length !== 0) {
      form.reset()
      const { error } = await supabase
        .from('messages')
        .insert({ content: message, room_id: roomId })

      if (error) {
        alert(error.message)
      }
    }
  }

  const handleInvite = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const target = e.currentTarget

      const { data } = await supabase
        .from<Profile>('profiles')
        .select('id, username')
        .match({ username: target.value })
        .single()

      if (!data) {
        return alert('No user found!')
      }

      const { error } = await supabase
        .from('room_participants')
        .insert({ profile_id: data.id, room_id: roomId })

      if (error) {
        return alert(error.message)
      }

      target.value = ''
    }
  }

  const handleRoomRename = async () => {
    const newName = prompt('What would you like to rename to?')
    const oldName = roomName
    if (!newName) return
    setRoomName(newName)

    const { error } = await supabase
      .from('rooms')
      .update({ name: newName })
      .match({
        id: roomId,
      })

    if (error) {
      setRoomName(oldName)
      alert(error.message)
    }
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <Head>
        <title>Happy Chat</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex h-full w-full flex-1 flex-col items-stretch bg-blue-400 py-10 px-20 text-gray-800">
        <Header />

        <div className="flex justify-between bg-green-200 px-4 py-2">
          <button className="text-4xl" onClick={handleRoomRename}>
            {roomName}
          </button>
          <Input type="text" onKeyPress={handleInvite} />
        </div>
        {roomId && (
          <Messages
            roomId={roomId}
            profileCache={profileCache}
            setProfileCache={setProfileCache}
          />
        )}
        <form onSubmit={handleSubmit} className="bg-red-200 p-2">
          <Input type="text" name="message" />
        </form>
        <UserList profileCache={profileCache} />
      </main>
    </div>
  )
}
