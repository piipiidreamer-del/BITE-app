import Image from 'next/image'
import { cn } from '@/lib/utils/cn'

interface TripleImageLayoutProps {
  top: string
  middle: string
  bottom: string
  className?: string
}

export default function TripleImageLayout({ top, middle, bottom, className }: TripleImageLayoutProps) {
  return (
    <div className={cn('flex flex-col gap-1 w-full', className)}>
      <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-card">
        <Image src={top} alt="Top" fill className="object-cover" sizes="430px" />
      </div>
      <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-card">
        <Image src={middle} alt="Middle" fill className="object-cover" sizes="430px" />
      </div>
      <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-card">
        <Image src={bottom} alt="Bottom" fill className="object-cover" sizes="430px" />
      </div>
    </div>
  )
}
