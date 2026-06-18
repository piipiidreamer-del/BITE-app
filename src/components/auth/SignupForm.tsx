'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function SignupForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password !== confirm) { setError('Passwords do not match'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/api/auth/callback` },
    })
    if (error) { setError(error.message); setLoading(false); return }
    setDone(true)
  }

  if (done) {
    return (
      <div className="w-full max-w-sm text-center">
        <div className="text-6xl mb-4">📬</div>
        <h2 className="font-display text-2xl text-bite-purple mb-2">Check your inbox!</h2>
        <p className="font-body text-gray-500 text-sm">
          We sent a confirmation link to <strong>{email}</strong>.<br />Click it to activate your account.
        </p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-8">
        <h1 className="font-display text-5xl text-bite-purple mb-2">Bite 🍔</h1>
        <p className="font-body text-gray-500 text-sm">Join the food crew</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white rounded-4xl p-6 shadow-bubbly">
        <h2 className="font-display text-2xl text-gray-800">Create account</h2>
        <Input label="Email" type="email" placeholder="you@uni.edu" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input label="Password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <Input label="Confirm Password" type="password" placeholder="••••••••" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />

        {error && <p className="text-red-500 text-sm font-body text-center">{error}</p>}
        <Button type="submit" loading={loading}>Sign up ✨</Button>
      </form>

      <p className="text-center mt-4 text-sm font-body text-gray-500">
        Already in?{' '}
        <Link href="/login" className="text-bite-purple font-bold hover:underline">Log in</Link>
      </p>
    </div>
  )
}
