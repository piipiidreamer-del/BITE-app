'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'

const tabs = [
  { href: '/feed',    label: 'Feed',    icon: '🏠' },
  { href: '/create',  label: 'Bite',    icon: '📸', big: true },
  { href: '/friends', label: 'Friends', icon: '👥' },
  { href: '/profile', label: 'Me',      icon: '🐾' },
]

export default function BottomNav() {
  const pathname = usePathname()
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50">
      <div className="bg-white/95 backdrop-blur-md border-t border-gray-100">
        <div className="flex items-end justify-around px-4 pt-2 pb-4">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href
            if (tab.big) {
              return (
                <Link key={tab.href} href={tab.href} className="flex flex-col items-center -mt-7">
                  <div className={cn(
                    'w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-2xl btn-press',
                    'shadow-purple border-4 border-white',
                    'bg-gradient-to-br from-bite-purple to-bite-purple-light',
                    pathname === tab.href && 'scale-110'
                  )}>
                    {tab.icon}
                  </div>
                  <span className="text-[10px] font-bold font-body text-bite-purple mt-1.5">{tab.label}</span>
                </Link>
              )
            }
            return (
              <Link key={tab.href} href={tab.href} className="flex flex-col items-center gap-1">
                <div className={cn(
                  'w-11 h-11 rounded-2xl flex items-center justify-center text-xl transition-all duration-200',
                  isActive
                    ? 'bg-bite-purple/10 scale-110 shadow-sm'
                    : 'hover:bg-gray-50'
                )}>
                  {tab.icon}
                </div>
                <span className={cn('text-[10px] font-bold font-body', isActive ? 'text-bite-purple' : 'text-gray-400')}>
                  {tab.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
