'use client'
import { useState } from 'react'
import Avatar from '@/components/ui/Avatar'
import { cn } from '@/lib/utils/cn'

const BG_COLORS = ['#7C3AED','#0DD3C5','#F472B6','#F59E0B','#EF4444','#3B82F6','#10B981','#1F2937']
const TEXT_COLORS = ['#ffffff','#1F2937','#F472B6','#0DD3C5','#F59E0B']

interface IconBuilderProps {
  onChange: (data: { char: string; bgColor: string; textColor: string }) => void
}

export default function IconBuilder({ onChange }: IconBuilderProps) {
  const [char, setChar] = useState('B')
  const [bgColor, setBgColor] = useState('#7C3AED')
  const [textColor, setTextColor] = useState('#ffffff')

  function update(next: { char?: string; bgColor?: string; textColor?: string }) {
    const c = next.char ?? char
    const bg = next.bgColor ?? bgColor
    const tc = next.textColor ?? textColor
    if (next.char !== undefined) setChar(c)
    if (next.bgColor !== undefined) setBgColor(bg)
    if (next.textColor !== undefined) setTextColor(tc)
    onChange({ char: c, bgColor: bg, textColor: tc })
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <Avatar char={char} bgColor={bgColor} textColor={textColor} size="xl" />

      <div className="w-full flex flex-col gap-2">
        <label className="text-sm font-bold text-gray-700 font-body">Icon Letter</label>
        <input
          type="text"
          maxLength={1}
          value={char}
          onChange={(e) => update({ char: e.target.value.toUpperCase() || 'B' })}
          className="w-20 text-center bg-white border-2 border-gray-200 rounded-2xl px-4 py-3 font-display text-2xl focus:outline-none focus:border-bite-teal"
        />
      </div>

      <div className="w-full flex flex-col gap-2">
        <label className="text-sm font-bold text-gray-700 font-body">Background Color</label>
        <div className="flex gap-2 flex-wrap">
          {BG_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => update({ bgColor: c })}
              className={cn('w-9 h-9 rounded-full transition-transform active:scale-90', bgColor === c && 'ring-4 ring-offset-2 ring-bite-teal scale-110')}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      <div className="w-full flex flex-col gap-2">
        <label className="text-sm font-bold text-gray-700 font-body">Text Color</label>
        <div className="flex gap-2 flex-wrap">
          {TEXT_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => update({ textColor: c })}
              className={cn('w-9 h-9 rounded-full border-2 border-gray-200 transition-transform active:scale-90', textColor === c && 'ring-4 ring-offset-2 ring-bite-teal scale-110')}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
