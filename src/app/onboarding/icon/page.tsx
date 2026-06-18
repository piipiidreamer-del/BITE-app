'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import IconBuilder from '@/components/onboarding/IconBuilder'

const steps = ['プロフィール', 'アイコン', 'First Bite']

export default function IconPage() {
  const router = useRouter()
  const [iconData, setIconData] = useState({ char: 'B', bgColor: '#7C3AED', textColor: '#ffffff', name: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSave() {
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }
    const { data: profile } = await supabase.from('profiles').select('nickname').eq('id', user.id).single()

    const { error } = await supabase.from('profiles').update({
      icon_char: iconData.char,
      icon_bg_color: iconData.bgColor,
      icon_text_color: iconData.textColor,
    }).eq('id', user.id)
    if (error) { setError(error.message); setLoading(false); return }
    router.push('/first-bite')
  }

  return (
    <div className="min-h-dvh bg-bite-bg flex flex-col">
      <div className="bg-gradient-to-br from-bite-purple to-bite-purple-light px-6 pt-12 pb-16 relative overflow-hidden">
        <div className="flex items-center gap-2 mb-6">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-body ${i === 1 ? 'bg-white text-bite-purple' : i < 1 ? 'bg-white/80 text-bite-purple' : 'bg-white/30 text-white/60'}`}>{i < 1 ? '✓' : i+1}</div>
              {i < steps.length - 1 && <div className={`w-8 h-0.5 ${i < 1 ? 'bg-white/80' : 'bg-white/30'}`} />}
            </div>
          ))}
        </div>
        <h1 className="font-display text-3xl text-white">アイコンを作ろう 🎨</h1>
        <p className="text-white/70 font-body text-sm mt-1">ステップ 2 / 3 — 自分だけのアイコンをつくろう！</p>
        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 430 24" preserveAspectRatio="none">
          <path d="M0,12 C72,24 144,0 215,12 C286,24 358,0 430,12 L430,24 L0,24 Z" fill="#F0FFFE"/>
        </svg>
      </div>

      <div className="flex-1 px-5 -mt-2 pb-6">
        <div className="bg-white rounded-[2rem] p-6 shadow-bubbly-lg mb-4">
          <IconBuilder onChange={(d) => setIconData({ ...d, name: d.name })} />
        </div>
        {error && <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-red-500 text-sm font-body font-semibold text-center mb-3">{error}</div>}
        <Button onClick={handleSave} loading={loading} size="lg" className="bg-gradient-to-r from-bite-purple to-bite-purple-light shadow-purple">
          保存して次へ ✨
        </Button>
      </div>
    </div>
  )
}
