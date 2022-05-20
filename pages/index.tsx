import type { NextPage } from 'next'
import Head from 'next/head'
import supabase from '../utils/supabase'
import { useRouter } from 'next/router'
import Link from 'next/link'

type Room = {
  id: string
  created_at: string
  name: string | null
}

const Home: NextPage = () => {
  const router = useRouter()

  const handleCreateRoom = async () => {
    const { data, error } = await supabase.rpc<Room>('create_room').single()

    if (error) {
      alert(error.message)
      return
    }

    if (data) {
      router.push(`/rooms/${data.id}`)
    }
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <Head>
        <title>Happy Chat</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex h-full w-full flex-1 flex-col items-stretch bg-blue-400 py-10 px-20 text-gray-800">
        <h1 className="bg-green-200 px-4 py-2 text-4xl">
          Happy Chat
          <button
            className="ml-4 rounded border bg-red-200 p-2 text-xs"
            onClick={handleCreateRoom}
          >
            New room
          </button>
          <Link href="/rooms/3e1e202e-a007-4ac3-a910-03dbbc2af9e0">
            <a>Join the classic room!</a>
          </Link>
        </h1>
      </main>
    </div>
  )
}

export default Home
