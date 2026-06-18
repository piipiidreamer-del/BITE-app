'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import IconBuilder from '@/components/onboarding/IconBuilder'

export default function IconPage() {
  const router = useRouter()
  const [iconData, setIconData] = useState({ char: 'B', bgColor: '#7C3AED', textColor: '#ffffff' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSave() {
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { error } = await supabase.from('profiles').update({
      icon_char: iconData.char,
      icon_bg_color: iconData.bgColor,
      icon_text_color: iconData.textColor,
    }).eq('id', user.id)

    if (error) { setError(error.message); setLoading(false); return }
    router.push('/first-bite')
  }

  return (
    <div className="min-h-screen bg-bite-bg flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl text-bite-purple mb-1">Create your icon 🎨</h1>
          <p className="font-body text-gray-500 text-sm">Step 2 of 2</p>
        </div>

        <div className="bg-white rounded-4xl p-6 shadow-bubbly mb-4">
          <IconBuilder onChange={setIconData} />
        </div>

        {error && <p className="text-red-500 text-sm font-body text-center mb-2">{error}</p>}
        <Button onClick={handleSave} loading={loading}>Save & continue 🚀</Button>
      </div>
    </div>
  )
}
