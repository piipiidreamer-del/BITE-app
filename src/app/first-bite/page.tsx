'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'

export default function FirstBitePage() {
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
    if (!files[0] || !files[1] || !files[2]) { setError('3枚の写真を追加してください！'); return }
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
      user_id: user.id, caption, image_top: urls[0], image_middle: urls[1], image_bottom: urls[2], is_first_bite: true,
    })
    if (postErr) { setError(postErr.message); setLoading(false); return }
    await supabase.from('profiles').update({ first_bite_done: true }).eq('id', user.id)
    router.push('/feed')
  }

  return (
    <div className="min-h-dvh bg-gradient-to-b from-[#EDE9FE] to-bite-bg flex flex-col">
      {/* Header */}
      <div className="px-5 pt-10 pb-6 text-center">
        <div className="inline-block bg-bite-purple text-white font-body font-bold text-xs px-4 py-1.5 rounded-full mb-3">
          最初の投稿はBiteのポーズで！
        </div>
        <h1 className="font-display text-5xl text-bite-purple leading-tight mb-2">First<br/>Bite!</h1>
        <p className="font-body text-gray-600 text-sm">Biteのポーズをとって最初の1枚を投稿しよう！</p>
      </div>

      {/* Pose guide */}
      <div className="mx-5 bg-white rounded-[2rem] p-5 shadow-bubbly mb-4">
        <div className="flex gap-3">
          {/* What is Bite pose */}
          <div className="flex-1 bg-bite-purple/10 rounded-2xl p-3">
            <div className="text-xs font-bold text-bite-purple font-body mb-2 text-center">Biteのポーズとは？</div>
            <div className="text-center text-4xl mb-2">🤙</div>
            <p className="text-xs text-gray-600 font-body text-center leading-relaxed">
              ピースの人差し指と中指を<br/>折ったポーズ！
            </p>
          </div>
          {/* Tips */}
          <div className="flex-1 bg-bite-teal/10 rounded-2xl p-3">
            <div className="text-xs font-bold text-bite-teal-dark font-body mb-2 text-center">撮影のポイント</div>
            <div className="flex flex-col gap-1.5 text-xs text-gray-600 font-body">
              <div className="flex items-start gap-1"><span>😊</span><span>顔と手がはっきり見えるように！</span></div>
              <div className="flex items-start gap-1"><span>☀️</span><span>明るい場所で撮ってみてね！</span></div>
              <div className="flex items-start gap-1"><span>📱</span><span>点線に合わせるとうまく撮れるよ！</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Upload area */}
      <div className="mx-5 bg-white rounded-[2rem] p-4 shadow-bubbly mb-4">
        {/* Dotted frame guide */}
        <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden mb-3 pulse-ring" style={{border: '3px dashed #7C3AED', background: 'linear-gradient(145deg,#F5F3FF,#EDE9FE)'}}>
          {previews[0] ? (
            <Image src={previews[0]} alt="" fill className="object-cover rounded-2xl" sizes="380px" />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <div className="text-6xl">🤙</div>
              <p className="text-sm font-body text-bite-purple font-bold">点線に合わせてBiteのポーズを！</p>
              <button onClick={() => inputRefs[0].current?.click()} className="bg-bite-purple text-white font-bold font-body px-5 py-2.5 rounded-2xl text-sm btn-press shadow-purple">
                📷 メインを撮る
              </button>
            </div>
          )}
          {previews[0] && (
            <button onClick={() => inputRefs[0].current?.click()} className="absolute bottom-3 right-3 bg-bite-purple/90 text-white text-xs font-bold font-body px-3 py-1.5 rounded-xl btn-press">
              変更
            </button>
          )}
        </div>
        <input ref={inputRefs[0]} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handleFile(0, e.target.files[0]) }} />

        {/* Sub shots */}
        <div className="flex gap-2 mb-3">
          {([1,2] as const).map((i) => (
            <div key={i} className="flex-1">
              <button onClick={() => inputRefs[i].current?.click()} className="relative w-full aspect-square rounded-2xl overflow-hidden image-slot btn-press">
                {previews[i] ? (
                  <Image src={previews[i]!} alt="" fill className="object-cover" sizes="180px" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl">📷</span>
                    <span className="text-xs text-bite-teal-dark font-body mt-1">{i === 1 ? '料理アップ' : '雰囲気ショット'}</span>
                  </div>
                )}
              </button>
              <input ref={inputRefs[i]} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handleFile(i, e.target.files[0]) }} />
            </div>
          ))}
        </div>

        <input
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="一言コメント（任意）..."
          className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl px-4 py-3 text-sm font-body focus:outline-none focus:border-bite-purple"
        />
      </div>

      {error && <div className="mx-5 bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-red-500 text-sm font-body font-semibold text-center mb-3">{error}</div>}

      <div className="px-5 pb-8">
        <Button onClick={handlePost} loading={loading} size="lg" className="bg-gradient-to-r from-bite-purple to-bite-purple-light shadow-purple">
          📸 ガイドに合わせて投稿する！
        </Button>
      </div>
    </div>
  )
}
