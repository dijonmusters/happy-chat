import type { NextPage } from 'next'
import Head from 'next/head'
import supabase from '../utils/supabase'
import { Input } from '@supabase/ui'
import Messages from '../components/messages'

const Home: NextPage = () => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const { message } = Object.fromEntries(new FormData(form))

    if (typeof message === 'string' && message.trim().length !== 0) {
      form.reset()
      const { error } = await supabase
        .from('messages')
        .insert({ content: message })

      if (error) {
        alert(error.message)
      }
    }
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <Head>
        <title>Happy Chat</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex h-full w-full flex-1 flex-col items-stretch bg-blue-400 py-10 px-20 text-gray-800">
        <h1 className="bg-green-200 px-4 py-2 text-4xl">Happy Chat</h1>
        <Messages />
        <form onSubmit={handleSubmit} className="bg-red-200 p-2">
          <Input type="text" name="message" />
        </form>
      </main>
    </div>
  )
}

export default Home
