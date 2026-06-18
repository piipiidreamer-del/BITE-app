'use client'
import { useState } from 'react'
import { cn } from '@/lib/utils/cn'

// Reference: rounded-square icons with full name text
const BG_COLORS = [
  '#EF4444','#F97316','#EAB308','#84CC16','#22C55E',
  '#0DD3C5','#3B82F6','#8B5CF6','#7C3AED','#EC4899',
  '#F472B6','#FB923C','#34D399','#38BDF8','#A78BFA',
  '#6B7280','#9CA3AF','#D1FAE5',
]
const TEXT_COLORS = [
  '#ffffff','#1F2937','#7C3AED','#0DD3C5','#F472B6','#F59E0B',
]

interface IconBuilderProps {
  onChange: (data: { char: string; bgColor: string; textColor: string; name: string }) => void
  initialName?: string
}

function IconPreview({ name, bgColor, textColor, size = 'lg' }: { name: string; bgColor: string; textColor: string; size?: 'sm'|'lg' }) {
  const displayName = name.slice(0, 8) || 'あなた'
  if (size === 'sm') {
    return (
      <div className="w-14 h-14 rounded-2xl shadow-bubbly flex items-center justify-center" style={{ backgroundColor: '#E0F2FE' }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold text-xs" style={{ backgroundColor: bgColor, color: textColor }}>
          {displayName.slice(0,4)}
        </div>
      </div>
    )
  }
  return (
    <div className="w-32 h-32 rounded-[2rem] shadow-bubbly-lg flex items-center justify-center" style={{ backgroundColor: '#E0F2FE' }}>
      <div className="w-24 h-24 rounded-[1.5rem] flex items-center justify-center font-display font-bold" style={{ backgroundColor: bgColor, color: textColor }}>
        <span className="text-center px-1 leading-tight" style={{ fontSize: displayName.length > 4 ? '0.9rem' : '1.25rem' }}>
          {displayName}
        </span>
      </div>
    </div>
  )
}

export default function IconBuilder({ onChange, initialName = '' }: IconBuilderProps) {
  const [name, setName] = useState(initialName)
  const [bgColor, setBgColor] = useState('#7C3AED')
  const [textColor, setTextColor] = useState('#ffffff')

  function update(next: { name?: string; bgColor?: string; textColor?: string }) {
    const n = next.name ?? name
    const bg = next.bgColor ?? bgColor
    const tc = next.textColor ?? textColor
    if (next.name !== undefined) setName(n)
    if (next.bgColor !== undefined) setBgColor(bg)
    if (next.textColor !== undefined) setTextColor(tc)
    onChange({ char: (n[0] || 'B').toUpperCase(), bgColor: bg, textColor: tc, name: n })
  }

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Big preview */}
      <div className="bounce-in">
        <IconPreview name={name || initialName || 'あなた'} bgColor={bgColor} textColor={textColor} />
      </div>

      {/* Example row */}
      <div className="flex gap-2">
        {[
          { n:'haru', bg:'#F97316', tc:'#fff' },
          { n:'yui',  bg:'#EC4899', tc:'#fff' },
          { n:'sota', bg:'#3B82F6', tc:'#fff' },
        ].map(ex => (
          <button key={ex.n} onClick={() => update({ bgColor: ex.bg, textColor: ex.tc })} className="btn-press">
            <IconPreview name={ex.n} bgColor={ex.bg} textColor={ex.tc} size="sm" />
          </button>
        ))}
      </div>

      {/* Name input */}
      <div className="w-full">
        <label className="text-sm font-bold text-gray-600 font-body mb-1.5 block">② 名前を入れる</label>
        <input
          type="text"
          maxLength={8}
          value={name}
          onChange={(e) => update({ name: e.target.value })}
          placeholder="ひらがな・カタカナ・英数字OK"
          className="w-full bg-white border-2 border-bite-purple/30 rounded-2xl px-4 py-3 font-body text-gray-800 focus:outline-none focus:border-bite-purple focus:shadow-[0_0_0_4px_rgba(124,58,237,0.1)] placeholder:text-gray-300"
        />
        <p className="text-xs text-gray-400 font-body mt-1">※ひらがな・カタカナ・英数字OK</p>
      </div>

      {/* Background color */}
      <div className="w-full">
        <label className="text-sm font-bold text-gray-600 font-body mb-2 block">① 好きな色を2色選ぶ（背景）</label>
        <div className="flex gap-2 flex-wrap">
          {BG_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => update({ bgColor: c })}
              className={cn('w-8 h-8 rounded-full transition-all btn-press', bgColor === c && 'ring-4 ring-offset-2 ring-bite-purple scale-115')}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      {/* Text color */}
      <div className="w-full">
        <label className="text-sm font-bold text-gray-600 font-body mb-2 block">文字色</label>
        <div className="flex gap-2 flex-wrap">
          {TEXT_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => update({ textColor: c })}
              className={cn('w-8 h-8 rounded-full border-2 border-gray-200 transition-all btn-press', textColor === c && 'ring-4 ring-offset-2 ring-bite-teal scale-115')}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
