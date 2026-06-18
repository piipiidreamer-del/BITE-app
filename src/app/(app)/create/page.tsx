'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'

export default function CreatePage() {
  const router = useRouter()
  const [files, setFiles] = useState<[File | null, File | null, File | null]>([null, null, null])
  const [previews, setPreviews] = useState<[string | null, string | null, string | null]>([null, null, null])
  const [caption, setCaption] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const inputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)]

  function handleFile(index: 0 | 1 | 2, file: File) {
    const url = URL.createObjectURL(file)
    const newFiles = [...files] as [File | null, File | null, File | null]
    const newPreviews = [...previews] as [string | null, string | null, string | null]
    newFiles[index] = file
    newPreviews[index] = url
    setFiles(newFiles)
    setPreviews(newPreviews)
  }

  async function handlePost() {
    if (!files[0] || !files[1] || !files[2]) { setError('Add all 3 photos to your Bite!'); return }
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const urls: string[] = []
    for (let i = 0; i < 3; i++) {
      const file = files[i]!
      const ext = file.name.split('.').pop() ?? 'jpg'
      const path = `${user.id}/${Date.now()}_${i}.${ext}`
      const { error: upErr } = await supabase.storage.from('post-images').upload(path, file)
      if (upErr) { setError(upErr.message); setLoading(false); return }
      const { data } = supabase.storage.from('post-images').getPublicUrl(path)
      urls.push(data.publicUrl)
    }

    const { error: postErr } = await supabase.from('posts').insert({
      user_id: user.id,
      caption,
      image_top: urls[0],
      image_middle: urls[1],
      image_bottom: urls[2],
    })
    if (postErr) { setError(postErr.message); setLoading(false); return }
    router.push('/feed')
  }

  const slotLabels = ['Top 🎯', 'Middle 🍽️', 'Bottom ✨']

  return (
    <div className="min-h-screen bg-bite-bg px-4 py-6 flex flex-col gap-5">
      <div>
        <h1 className="font-display text-3xl text-bite-purple">New Bite 📸</h1>
        <p className="font-body text-gray-500 text-xs mt-1">3 shots. 1 meal. Show it off.</p>
      </div>

      <div className="bg-white rounded-4xl p-4 shadow-bubbly flex flex-col gap-3">
        {([0, 1, 2] as const).map((i) => (
          <div key={i}>
            <p className="text-xs font-bold text-gray-500 font-body mb-1">{slotLabels[i]}</p>
            <button
              type="button"
              onClick={() => inputRefs[i].current?.click()}
              className="relative w-full aspect-[4/3] rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 hover:border-bite-purple overflow-hidden transition-all"
            >
              {previews[i] ? (
                <Image src={previews[i]!} alt="" fill className="object-cover" sizes="430px" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl">📷</span>
                  <span className="text-xs text-gray-400 font-body mt-1">Tap to add</span>
                </div>
              )}
            </button>
            <input ref={inputRefs[i]} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handleFile(i, e.target.files[0]) }} />
          </div>
        ))}

        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="What did you cook? 🍳"
          rows={2}
          className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl px-4 py-3 text-sm font-body focus:outline-none focus:border-bite-teal resize-none"
        />
      </div>

      {error && <p className="text-red-500 text-sm font-body text-center">{error}</p>}
      <Button onClick={handlePost} loading={loading} size="lg">Post Bite 🚀</Button>
    </div>
  )
}
