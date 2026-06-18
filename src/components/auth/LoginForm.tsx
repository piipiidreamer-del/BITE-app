'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    router.push('/feed')
    router.refresh()
  }

  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-8">
        <h1 className="font-display text-5xl text-bite-purple mb-2">Bite 🍔</h1>
        <p className="font-body text-gray-500 text-sm">Best Item To Eat</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white rounded-4xl p-6 shadow-bubbly">
        <h2 className="font-display text-2xl text-gray-800">Welcome back!</h2>

        <Input
          label="Email"
          type="email"
          placeholder="you@uni.edu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-red-500 text-sm font-body text-center">{error}</p>}

        <Button type="submit" loading={loading}>Log in 🚀</Button>
      </form>

      <p className="text-center mt-4 text-sm font-body text-gray-500">
        No account?{' '}
        <Link href="/signup" className="text-bite-purple font-bold hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  )
}
