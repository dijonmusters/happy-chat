import type { NextPage } from 'next'
import Head from 'next/head'
import supabase from '../utils/supabase'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Header from '../components/header'

type Room = {
  id: string
  created_at: string
  name: string | null
}

const Home: NextPage = () => {
  const [rooms, setRooms] = useState<Room[]>([])
  const router = useRouter()

  useEffect(() => {
    const getRooms = async () => {
      const { data } = await supabase
        .from<Room>('rooms')
        .select('*')
        .order('created_at', { ascending: false })

      if (data) {
        setRooms(data)
      }
    }

    getRooms()
  }, [])

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
        <Header />
        <h1 className="bg-green-200 px-4 py-2 text-4xl">
          <Link href="/">
            <a>Happy Chat</a>
          </Link>
          <button
            className="ml-4 rounded border bg-red-200 p-2 text-xs"
            onClick={handleCreateRoom}
          >
            New room
          </button>
        </h1>

        <div className="flex-1 bg-pink-200 p-4">
          {rooms.map((room) => (
            <div key={room.id}>
              <Link href={`/rooms/${room.id}`}>
                <a>{room.name ?? 'Untitled'}</a>
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default Home
