'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function OnboardingPage() {
  const router = useRouter()
  const [nickname, setNickname] = useState('')
  const [handle, setHandle] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleNext(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!nickname.trim() || !handle.trim()) { setError('Fill in both fields'); return }
    if (!/^[a-z0-9_]{3,20}$/.test(handle)) {
      setError('Handle: 3-20 chars, lowercase letters/numbers/underscore only')
      return
    }
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { error: checkErr, count } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('user_handle', handle)
    if (checkErr) { setError(checkErr.message); setLoading(false); return }
    if (count && count > 0) { setError('That handle is already taken!'); setLoading(false); return }

    const { error: upsertErr } = await supabase.from('profiles').upsert({
      id: user.id,
      nickname,
      user_handle: handle,
      icon_char: nickname[0]?.toUpperCase() || 'B',
    })
    if (upsertErr) { setError(upsertErr.message); setLoading(false); return }

    router.push('/onboarding/icon')
  }

  return (
    <div className="min-h-screen bg-bite-bg flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl text-bite-purple mb-1">Set up your profile 🍽️</h1>
          <p className="font-body text-gray-500 text-sm">Step 1 of 2</p>
        </div>

        <form onSubmit={handleNext} className="flex flex-col gap-4 bg-white rounded-4xl p-6 shadow-bubbly">
          <Input
            label="Nickname"
            placeholder="e.g. Hungry Mickey"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
          />
          <Input
            label="Your @handle"
            prefix="@"
            placeholder="hungry_mickey"
            value={handle}
            onChange={(e) => setHandle(e.target.value.toLowerCase())}
            required
          />
          {error && <p className="text-red-500 text-sm font-body text-center">{error}</p>}
          <Button type="submit" loading={loading}>Next →</Button>
        </form>
      </div>
    </div>
  )
}
