import { useEffect } from 'react'
import { json } from 'stream/consumers'
import supabase from '../utils/supabase'

import { ProfileCache } from '../utils/types'

export default function UserList({
  profileCache,
}: {
  profileCache: ProfileCache
}) {
  return (
    <div className="overflow-x-scroll p-2">
      <div className="flex gap-2 ">
        {Object.values(profileCache).map((profile) => (
          <p
            key={profile.id}
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-200 "
            title={profile.username}
          >
            {profile.username.slice(0, 2).toUpperCase()}
          </p>
        ))}
      </div>
    </div>
  )
}
