'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'

const tabs = [
  { href: '/feed', label: 'Feed', icon: '🏠' },
  { href: '/create', label: 'Bite', icon: '📸' },
  { href: '/friends', label: 'Friends', icon: '👥' },
  { href: '/profile', label: 'Me', icon: '🐾' },
]

export default function BottomNav() {
  const pathname = usePathname()
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-100 z-50 shadow-lg">
      <div className="flex items-center justify-around py-2 px-2">
        {tabs.map((tab) => {
          const active = pathname === tab.href || (tab.href !== '/feed' && pathname.startsWith(tab.href))
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-4 py-2 rounded-2xl transition-all',
                active ? 'bg-bite-purple/10' : 'hover:bg-gray-50'
              )}
            >
              <span className="text-2xl">{tab.icon}</span>
              <span className={cn('text-xs font-bold font-body', active ? 'text-bite-purple' : 'text-gray-400')}>
                {tab.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
