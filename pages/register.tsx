import { Input, Button } from '@supabase/ui'
import supabase from '../utils/supabase'

export default function Login() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const { email, username, password } = Object.fromEntries(
      new FormData(e.currentTarget)
    )

    if (
      typeof email === 'string' &&
      typeof password === 'string' &&
      typeof username === 'string'
    ) {
      await supabase.auth.signUp(
        {
          email,
          password,
        },
        {
          data: {
            username,
          },
        }
      )
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl items-center px-4">
      <form className="w-full space-y-2" onSubmit={handleSubmit}>
        <Input type="email" name="email" label="Email" />
        <Input type="username" name="username" label="Username" />
        <Input type="password" name="password" label="Password" />
        <Button type="primary" htmlType="submit">
          Sign up
        </Button>
      </form>
    </div>
  )
}
