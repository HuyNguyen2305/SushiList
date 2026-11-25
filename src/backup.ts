import { SUSHI_TYPES, type Task } from './data'

export const SCHEMA_VERSION = 1
const MAX_BYTES = 5_000_000

export const makeBackup = (tasks: Task[]) => ({ schemaVersion: SCHEMA_VERSION, sushiTypes: [...SUSHI_TYPES], tasks })

type Parsed = { ok: true; tasks: Task[] } | { ok: false; error: string }

const isStr = (v: unknown): v is string => typeof v === 'string'
const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v)
const TYPE_IDS: readonly string[] = SUSHI_TYPES.map((t) => t.id)

/** Checks a backup file before anything touches the database. Unknown fields are dropped. */
export function parseBackup(text: string): Parsed {
  if (text.length > MAX_BYTES) return { ok: false, error: 'That file is too large to be a Sushibar backup.' }
  let data: unknown
  try {
    data = JSON.parse(text)
  } catch {
    return { ok: false, error: 'That file is not valid JSON.' }
  }
  const root = data as { schemaVersion?: unknown; tasks?: unknown }
  if (!root || typeof root !== 'object' || !Array.isArray(root.tasks)) {
    return { ok: false, error: 'That file is not a Sushibar backup.' }
  }
  if (!isNum(root.schemaVersion) || root.schemaVersion < 1) return { ok: false, error: 'That backup has no valid version.' }
  if (root.schemaVersion > SCHEMA_VERSION) return { ok: false, error: 'That backup was made by a newer version of Sushibar.' }

  const tasks: Task[] = []
  for (const [i, raw] of root.tasks.entries()) {
    const t = raw as Record<string, unknown>
    const bad = (why: string) => ({ ok: false as const, error: `Plate ${i + 1} is invalid: ${why}.` })
    if (!t || typeof t !== 'object') return bad('not an object')
    if (!isStr(t.id) || !t.id) return bad('missing id')
    if (!isStr(t.title) || !t.title.trim()) return bad('missing title')
    if (!isStr(t.sushiTypeId) || !TYPE_IDS.includes(t.sushiTypeId)) return bad('unknown sushi type')
    if (t.status !== 'open' && t.status !== 'done') return bad('bad status')
    if (!isNum(t.beltOrder)) return bad('bad belt position')
    if (!isStr(t.createdAt)) return bad('missing creation time')
    if (t.note !== undefined && !isStr(t.note)) return bad('bad note')
    if (t.dueDate !== undefined && !(isStr(t.dueDate) && /^\d{4}-\d{2}-\d{2}$/.test(t.dueDate))) return bad('bad due date')
    if (t.completedAt !== undefined && !isStr(t.completedAt)) return bad('bad completion time')
    if (t.dayKey !== undefined && !isStr(t.dayKey)) return bad('bad day')
    if (t.stackTilt !== undefined && !isNum(t.stackTilt)) return bad('bad tilt')
    tasks.push({
      id: t.id,
      title: t.title.trim(),
      note: t.note as string | undefined,
      sushiTypeId: t.sushiTypeId as Task['sushiTypeId'],
      dueDate: t.dueDate as string | undefined,
      status: t.status,
      beltOrder: t.beltOrder,
      createdAt: t.createdAt,
      completedAt: t.completedAt as string | undefined,
      dayKey: t.dayKey as string | undefined,
      stackTilt: t.stackTilt as number | undefined,
    })
  }
  return { ok: true, tasks }
}
