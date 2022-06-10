import Link from 'next/link'
import supabase from '../utils/supabase'
import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/router'

export default function Header() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    setUser(supabase.auth.session()?.user ?? null)

    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="flex justify-between">
      <Link href="/">
        <a>Home</a>
      </Link>
      <div className="flex gap-2">
        {user ? (
          <>
            <span>{user.user_metadata.username}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link href="/register">
              <a>Register</a>
            </Link>
            <Link href="/login">
              <a>Login</a>
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
