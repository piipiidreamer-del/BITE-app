export type RankInfo = {
  name: string
  emoji: string
  color: string
  bgColor: string
  nextAt: number | null
  description: string
}

export function getRank(streak: number): RankInfo {
  if (streak >= 365) return { name: 'God Biter',    emoji: '👑', color: '#F59E0B', bgColor: '#FEF3C7', nextAt: null,  description: '伝説の自炊神' }
  if (streak >= 181) return { name: 'Legend Biter', emoji: '🌟', color: '#7C3AED', bgColor: '#EDE9FE', nextAt: 365,   description: 'Biteの達人' }
  if (streak >= 91)  return { name: 'Loyal Biter',  emoji: '🔥', color: '#EF4444', bgColor: '#FEE2E2', nextAt: 181,   description: '毎日コツコツ継続中' }
  if (streak >= 31)  return { name: 'Knight Biter', emoji: '⚔️', color: '#3B82F6', bgColor: '#DBEAFE', nextAt: 91,    description: '自炊の騎士' }
  if (streak >= 21)  return { name: 'Star Biter',   emoji: '⭐', color: '#0DD3C5', bgColor: '#CCFBF1', nextAt: 31,    description: '自炊スター！' }
  if (streak >= 7)   return { name: 'Tiny Biter',   emoji: '🌱', color: '#10B981', bgColor: '#D1FAE5', nextAt: 21,    description: '芽が出てきた！' }
  return               { name: 'Baby Biter',   emoji: '🍼', color: '#F472B6', bgColor: '#FCE7F3', nextAt: 7,     description: '自炊はじめたて' }
}
