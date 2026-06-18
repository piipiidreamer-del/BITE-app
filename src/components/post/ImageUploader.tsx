'use client'
import { useRef } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils/cn'

interface ImageUploaderProps {
  label: string
  value: string | null
  onChange: (file: File) => void
}

function Slot({ label, value, onChange }: ImageUploaderProps) {
  const ref = useRef<HTMLInputElement>(null)
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-bold text-gray-500 font-body">{label}</span>
      <button
        type="button"
        onClick={() => ref.current?.click()}
        className={cn(
          'relative w-full aspect-[4/3] rounded-2xl border-2 border-dashed transition-all overflow-hidden',
          value ? 'border-bite-teal' : 'border-gray-300 bg-gray-50 hover:border-bite-purple'
        )}
      >
        {value ? (
          <Image src={value} alt={label} fill className="object-cover" sizes="430px" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
            <span className="text-3xl">📷</span>
            <span className="text-xs text-gray-400 font-body">Tap to add</span>
          </div>
        )}
      </button>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => { if (e.target.files?.[0]) onChange(e.target.files[0]) }}
      />
    </div>
  )
}

interface Props {
  previews: [string | null, string | null, string | null]
  onFilePicked: (index: 0 | 1 | 2, file: File) => void
}

export default function ImageUploader({ previews, onFilePicked }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <Slot label="Top" value={previews[0]} onChange={(f) => onFilePicked(0, f)} />
      <Slot label="Middle" value={previews[1]} onChange={(f) => onFilePicked(1, f)} />
      <Slot label="Bottom" value={previews[2]} onChange={(f) => onFilePicked(2, f)} />
    </div>
  )
}
