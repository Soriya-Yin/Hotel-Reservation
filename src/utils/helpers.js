export function generateRefCode() {
  const num = Math.floor(10000 + Math.random() * 90000)
  return `LK-${num}`
}

export function nightsBetween(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0
  const start = new Date(checkIn)
  const end = new Date(checkOut)
  const diff = (end - start) / (1000 * 60 * 60 * 24)
  return diff > 0 ? Math.round(diff) : 0
}
