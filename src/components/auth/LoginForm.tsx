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
    if (error) { setError(error.message); setLoading(false); return }
    router.push('/feed')
    router.refresh()
  }

  return (
    <div className="min-h-dvh flex flex-col bg-bite-bg">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-bite-teal via-cyan-400 to-bite-purple pt-16 pb-24 px-6 text-center overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-4 left-6 w-16 h-16 bg-white/10 rounded-full blur-xl" />
        <div className="absolute bottom-8 right-8 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute inset-0 opacity-5 text-[80px] flex flex-wrap gap-4 overflow-hidden select-none">
          {['🍳','🥗','🍜','🍱','🥘','🍕'].map((e,i) => (
            <span key={i} className="float" style={{animationDelay:`${i*0.4}s`}}>{e}</span>
          ))}
        </div>
        {/* Logo */}
        <div className="relative inline-flex flex-col items-center">
          <div className="w-24 h-24 rounded-[2rem] bg-bite-teal border-4 border-white/40 shadow-bubbly-lg flex items-center justify-center mb-3">
            <div className="w-18 h-18 rounded-[1.5rem] bg-bite-purple flex items-center justify-center">
              <span className="font-display text-4xl text-white drop-shadow-lg">Bite</span>
            </div>
          </div>
          <p className="text-white/80 font-body text-xs font-bold tracking-widest uppercase">Best Item To Eat</p>
        </div>
        {/* Wave */}
        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 430 28" preserveAspectRatio="none">
          <path d="M0,14 C72,28 144,0 215,14 C286,28 358,0 430,14 L430,28 L0,28 Z" fill="#F0FFFE"/>
        </svg>
      </div>

      {/* Form card */}
      <div className="flex-1 px-5 -mt-4">
        <div className="bg-white rounded-[2rem] p-6 shadow-bubbly-lg">
          <h2 className="font-display text-3xl text-gray-800 mb-1">おかえり 👋</h2>
          <p className="text-gray-400 text-sm font-body mb-6">今日も何食べた？</p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input label="メールアドレス" type="email" placeholder="you@uni.edu" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input label="パスワード" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            {error && <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-red-500 text-sm font-body font-semibold text-center">{error}</div>}
            <Button type="submit" loading={loading} size="lg" className="mt-2 bg-gradient-to-r from-bite-purple to-bite-purple-light shadow-purple">ログイン 🚀</Button>
          </form>
        </div>
        <p className="text-center mt-5 text-sm font-body text-gray-400">
          アカウントがない？{' '}
          <Link href="/signup" className="text-bite-purple font-bold hover:underline">新規登録</Link>
        </p>
      </div>
    </div>
  )
}
