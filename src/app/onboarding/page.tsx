'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

const steps = ['プロフィール', 'アイコン', 'First Bite']

export default function OnboardingPage() {
  const router = useRouter()
  const [nickname, setNickname] = useState('')
  const [handle, setHandle] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleNext(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!nickname.trim() || !handle.trim()) { setError('両方入力してください'); return }
    if (!/^[a-z0-9_]{3,20}$/.test(handle)) {
      setError('ハンドル：小文字英数字・アンダースコア、3〜20文字')
      return
    }
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { count } = await supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('user_handle', handle)
    if (count && count > 0) { setError('そのハンドルはすでに使われています 😢'); setLoading(false); return }

    const { error: upsertErr } = await supabase.from('profiles').upsert({
      id: user.id, nickname, user_handle: handle,
      icon_char: nickname[0]?.toUpperCase() || 'B',
    })
    if (upsertErr) { setError(upsertErr.message); setLoading(false); return }
    router.push('/onboarding/icon')
  }

  return (
    <div className="min-h-dvh bg-bite-bg flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-br from-bite-purple to-bite-purple-light px-6 pt-12 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 text-[60px] flex flex-wrap gap-6 overflow-hidden select-none">
          {['✨','🍴','👤','🌟'].map((e,i)=><span key={i} className="float" style={{animationDelay:`${i*0.5}s`}}>{e}</span>)}
        </div>
        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-6">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-body ${i === 0 ? 'bg-white text-bite-purple' : 'bg-white/30 text-white/60'}`}>{i+1}</div>
              {i < steps.length - 1 && <div className="w-8 h-0.5 bg-white/30" />}
            </div>
          ))}
        </div>
        <h1 className="font-display text-3xl text-white">プロフィール設定 🍽️</h1>
        <p className="text-white/70 font-body text-sm mt-1">ステップ 1 / 3</p>
        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 430 24" preserveAspectRatio="none">
          <path d="M0,12 C72,24 144,0 215,12 C286,24 358,0 430,12 L430,24 L0,24 Z" fill="#F0FFFE"/>
        </svg>
      </div>

      <div className="flex-1 px-5 -mt-2">
        <form onSubmit={handleNext} className="bg-white rounded-[2rem] p-6 shadow-bubbly-lg flex flex-col gap-4">
          <Input
            label="ニックネーム"
            placeholder="例：Hungry Mickey"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            hint="他のユーザーに表示される名前"
            required
          />
          <Input
            label="ユーザーハンドル"
            prefix="@"
            placeholder="hungry_mickey"
            value={handle}
            onChange={(e) => setHandle(e.target.value.toLowerCase())}
            hint="小文字英数字・アンダースコア（3〜20文字）"
            required
          />
          {error && <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-red-500 text-sm font-body font-semibold text-center">{error}</div>}
          <Button type="submit" loading={loading} size="lg" className="mt-2 bg-gradient-to-r from-bite-purple to-bite-purple-light shadow-purple">
            次へ →
          </Button>
        </form>
      </div>
    </div>
  )
}
