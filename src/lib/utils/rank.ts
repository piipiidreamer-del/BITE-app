export type RankInfo = {
  name: string
  emoji: string
  color: string
}

export function getRank(streak: number): RankInfo {
  if (streak >= 365) return { name: 'God Biter', emoji: '👑', color: '#F59E0B' }
  if (streak >= 181) return { name: 'Legend Biter', emoji: '🌟', color: '#7C3AED' }
  if (streak >= 91)  return { name: 'Loyal Biter', emoji: '🔥', color: '#EF4444' }
  if (streak >= 31)  return { name: 'Knight Biter', emoji: '⚔️', color: '#3B82F6' }
  if (streak >= 21)  return { name: 'Star Biter', emoji: '⭐', color: '#0DD3C5' }
  if (streak >= 7)   return { name: 'Tiny Biter', emoji: '🌱', color: '#10B981' }
  return { name: 'Baby Biter', emoji: '🍼', color: '#F472B6' }
}
