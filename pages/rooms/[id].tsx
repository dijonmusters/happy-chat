import Head from 'next/head'
import supabase from '../../utils/supabase'
import { Input } from '@supabase/ui'
import Messages, { Profile } from '../../components/messages'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function Room() {
  const router = useRouter()
  const roomId = router.query.id as string

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

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <Head>
        <title>Happy Chat</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex h-full w-full flex-1 flex-col items-stretch bg-blue-400 py-10 px-20 text-gray-800">
        <div className="flex justify-between bg-green-200 px-4 py-2">
          <h1 className="text-4xl">
            <Link href="/">
              <a>Happy Chat</a>
            </Link>
          </h1>
          <Input type="text" onKeyPress={handleInvite} />
        </div>
        {roomId && <Messages roomId={roomId} />}
        <form onSubmit={handleSubmit} className="bg-red-200 p-2">
          <Input type="text" name="message" />
        </form>
      </main>
    </div>
  )
}
