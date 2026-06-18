'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'

export default function CreatePage() {
  const router = useRouter()
  const [files, setFiles] = useState<[File|null,File|null,File|null]>([null,null,null])
  const [previews, setPreviews] = useState<[string|null,string|null,string|null]>([null,null,null])
  const [caption, setCaption] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const inputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)]

  function handleFile(index: 0|1|2, file: File) {
    const url = URL.createObjectURL(file)
    const nf = [...files] as [File|null,File|null,File|null]
    const np = [...previews] as [string|null,string|null,string|null]
    nf[index] = file; np[index] = url
    setFiles(nf); setPreviews(np)
  }

  async function handlePost() {
    if (!files[0] || !files[1] || !files[2]) { setError('3枚の写真を追加してね！'); return }
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
    const { error: postErr } = await supabase.from('posts').insert({ user_id: user.id, caption, image_top: urls[0], image_middle: urls[1], image_bottom: urls[2] })
    if (postErr) { setError(postErr.message); setLoading(false); return }
    router.push('/feed')
  }

  const allSet = files.every(Boolean)

  return (
    <div className="min-h-dvh bg-bite-bg pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-bite-purple to-bite-purple-light px-5 pt-12 pb-10 relative overflow-hidden">
        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 430 24" preserveAspectRatio="none">
          <path d="M0,12 C72,24 144,0 215,12 C286,24 358,0 430,12 L430,24 L0,24 Z" fill="#F0FFFE"/>
        </svg>
        <h1 className="font-display text-4xl text-white relative">今日のBiteを残す 📸</h1>
        <p className="text-white/70 font-body text-sm mt-1 relative">3ショットで今日のごはんを記録しよう</p>
      </div>

      <div className="px-5 -mt-2 flex flex-col gap-4">
        {/* Main shot — large */}
        <div className="bg-white rounded-[2rem] p-3 shadow-bubbly">
          <div className="flex items-center gap-2 px-1 mb-2">
            <div className="w-2 h-2 rounded-full bg-bite-purple" />
            <span className="text-xs font-bold text-gray-500 font-body">メインショット</span>
            <span className="ml-auto text-[10px] text-gray-300 font-body">料理のアップ</span>
          </div>
          <button
            onClick={() => inputRefs[0].current?.click()}
            className={`relative w-full aspect-[4/3] rounded-2xl overflow-hidden btn-press ${previews[0] ? '' : 'image-slot'}`}
          >
            {previews[0] ? (
              <Image src={previews[0]} alt="" fill className="object-cover" sizes="380px" />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                <div className="w-16 h-16 rounded-2xl bg-bite-purple/10 flex items-center justify-center text-3xl">📷</div>
                <p className="text-sm font-body text-bite-teal-dark font-semibold">タップして追加</p>
              </div>
            )}
          </button>
          <input ref={inputRefs[0]} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handleFile(0, e.target.files[0]) }} />
        </div>

        {/* Sub shots — side by side */}
        <div className="flex gap-3">
          {([1,2] as const).map((i) => (
            <div key={i} className="flex-1 bg-white rounded-[1.5rem] p-3 shadow-bubbly">
              <div className="flex items-center gap-1.5 mb-2">
                <div className="w-2 h-2 rounded-full bg-bite-teal" />
                <span className="text-xs font-bold text-gray-500 font-body">{i === 1 ? 'アップ' : '雰囲気'}</span>
              </div>
              <button
                onClick={() => inputRefs[i].current?.click()}
                className={`relative w-full aspect-square rounded-xl overflow-hidden btn-press ${previews[i] ? '' : 'image-slot'}`}
              >
                {previews[i] ? (
                  <Image src={previews[i]!} alt="" fill className="object-cover" sizes="190px" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl">📷</span>
                  </div>
                )}
              </button>
              <input ref={inputRefs[i]} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handleFile(i, e.target.files[0]) }} />
            </div>
          ))}
        </div>

        {/* Caption */}
        <div className="bg-white rounded-[2rem] p-4 shadow-bubbly">
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="今日は何を作った？🍳 一言どうぞ"
            rows={2}
            className="w-full bg-transparent text-sm font-body text-gray-800 focus:outline-none resize-none placeholder:text-gray-300"
          />
        </div>

        {/* Progress indicator */}
        <div className="flex items-center gap-2 px-1">
          {([0,1,2] as const).map(i => (
            <div key={i} className={`flex-1 h-1.5 rounded-full transition-all ${files[i] ? 'bg-bite-purple' : 'bg-gray-200'}`} />
          ))}
          <span className="text-xs text-gray-400 font-body ml-1">{files.filter(Boolean).length}/3</span>
        </div>

        {error && <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-red-500 text-sm font-body font-semibold text-center">{error}</div>}

        <Button
          onClick={handlePost}
          loading={loading}
          size="lg"
          disabled={!allSet}
          className="bg-gradient-to-r from-bite-purple to-bite-purple-light shadow-purple disabled:opacity-40"
        >
          {allSet ? '今日のBiteを投稿する 🚀' : `あと${3 - files.filter(Boolean).length}枚追加してね`}
        </Button>
      </div>
    </div>
  )
}
