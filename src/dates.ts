const pad = (n: number) => String(n).padStart(2, '0')

/** Local calendar day as YYYY-MM-DD (not UTC, so "today" flips at the user's midnight). */
export const dayKey = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

export const isOverdue = (due: string | undefined, today = dayKey()) => !!due && due < today

export const dueLabel = (due: string) =>
  new Date(`${due}T00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
