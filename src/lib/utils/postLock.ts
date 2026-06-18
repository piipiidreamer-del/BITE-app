export function hasPostedToday(lastPostDate: string | null): boolean {
  if (!lastPostDate) return false
  const today = new Date()
  const last = new Date(lastPostDate)
  return (
    today.getFullYear() === last.getFullYear() &&
    today.getMonth() === last.getMonth() &&
    today.getDate() === last.getDate()
  )
}
