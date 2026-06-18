'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function SignupForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password !== confirm) { setError('パスワードが一致しません'); return }
    if (password.length < 6) { setError('パスワードは6文字以上にしてください'); return }
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/api/auth/callback` } })
    if (error) { setError(error.message); setLoading(false); return }
    setDone(true)
  }

  if (done) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center bg-bite-bg px-6 text-center gap-6">
        <div className="text-8xl bounce-in">📬</div>
        <div>
          <h2 className="font-display text-3xl text-bite-purple mb-2">メールを確認して！</h2>
          <p className="font-body text-gray-500 text-sm leading-relaxed">
            <strong className="text-gray-700">{email}</strong> に確認リンクを送りました。<br />クリックして有効化してね。
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh flex flex-col bg-bite-bg">
      <div className="relative bg-gradient-to-br from-bite-teal via-cyan-400 to-bite-purple pt-16 pb-24 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-5 text-[80px] flex flex-wrap gap-4 overflow-hidden select-none">
          {['🍕','🍣','🥩','🍰','🥐','🍱'].map((e,i)=><span key={i} className="float" style={{animationDelay:`${i*0.4}s`}}>{e}</span>)}
        </div>
        <div className="relative inline-flex flex-col items-center">
          <div className="w-24 h-24 rounded-[2rem] bg-bite-teal border-4 border-white/40 shadow-bubbly-lg flex items-center justify-center mb-3">
            <div className="w-[72px] h-[72px] rounded-[1.5rem] bg-bite-purple flex items-center justify-center">
              <span className="font-display text-4xl text-white">Bite</span>
            </div>
          </div>
          <p className="text-white/80 font-body text-xs font-bold tracking-widest uppercase">Join the food crew</p>
        </div>
        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 430 28" preserveAspectRatio="none">
          <path d="M0,14 C72,28 144,0 215,14 C286,28 358,0 430,14 L430,28 L0,28 Z" fill="#F0FFFE"/>
        </svg>
      </div>
      <div className="flex-1 px-5 -mt-4">
        <div className="bg-white rounded-[2rem] p-6 shadow-bubbly-lg">
          <h2 className="font-display text-3xl text-gray-800 mb-1">はじめよう ✨</h2>
          <p className="text-gray-400 text-sm font-body mb-6">自炊の記録をはじめよう！</p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input label="メールアドレス" type="email" placeholder="you@uni.edu" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input label="パスワード" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <Input label="パスワード（確認）" type="password" placeholder="••••••••" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
            {error && <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-red-500 text-sm font-body font-semibold text-center">{error}</div>}
            <Button type="submit" loading={loading} size="lg" className="mt-2 bg-gradient-to-r from-bite-purple to-bite-purple-light shadow-purple">アカウント作成 🍔</Button>
          </form>
        </div>
        <p className="text-center mt-5 text-sm font-body text-gray-400">
          すでにアカウントがある？{' '}
          <Link href="/login" className="text-bite-purple font-bold hover:underline">ログイン</Link>
        </p>
      </div>
    </div>
  )
}
