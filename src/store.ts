import { create } from 'zustand'
import type { Task, TaskInput } from './data'
import { db } from './db'

type State = {
  tasks: Task[]
  ready: boolean
  error: string | null
  selectedId: string | null
  load: () => Promise<void>
  add: (input: TaskInput) => Promise<void>
  update: (id: string, input: TaskInput) => Promise<void>
  remove: (id: string) => Promise<void>
  move: (id: string, overId: string) => Promise<void>
  sortByDue: () => Promise<void>
  select: (id: string | null) => void
}

const clean = (i: TaskInput): TaskInput => ({
  title: i.title.trim(),
  note: i.note?.trim() || undefined,
  dueDate: i.dueDate || undefined,
  sushiTypeId: i.sushiTypeId,
})

const byBelt = (a: Task, b: Task) => a.beltOrder - b.beltOrder
const isOpen = (t: Task) => t.status === 'open'

// Every action writes to IndexedDB first and only then updates memory, so the screen never shows
// something that was not saved. A failed write sets `error` and leaves the state as it was.
async function save(set: (s: Partial<State>) => void, write: () => Promise<Partial<State>>) {
  try {
    set({ ...(await write()), error: null })
  } catch {
    set({ error: 'Could not save to this browser. Export a backup and check storage settings.' })
  }
}

export const useStore = create<State>((set, get) => ({
  tasks: [],
  ready: false,
  error: null,
  selectedId: null,
  select: (id) => set({ selectedId: id }),
  load: () =>
    save(set, async () => ({
      tasks: await db.tasks.orderBy('beltOrder').toArray(),
      ready: true,
    })),
  add: (input) =>
    save(set, async () => {
      const task: Task = {
        ...clean(input),
        id: crypto.randomUUID(),
        status: 'open',
        beltOrder: Math.max(0, ...get().tasks.map((t) => t.beltOrder)) + 1,
        createdAt: new Date().toISOString(),
      }
      await db.tasks.put(task)
      return { tasks: [...get().tasks, task] }
    }),
  update: (id, input) =>
    save(set, async () => {
      const patch = clean(input)
      await db.tasks.update(id, patch)
      return { tasks: get().tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)) }
    }),
  remove: (id) =>
    save(set, async () => {
      await db.tasks.delete(id)
      return {
        tasks: get().tasks.filter((t) => t.id !== id),
        selectedId: get().selectedId === id ? null : get().selectedId,
      }
    }),
  // Reordering rewrites one row: the moved plate gets a beltOrder between its new neighbours.
  // shortcut: float midpoints lose precision after ~50 reorders in the same gap; renumber then.
  move: (id, overId) =>
    save(set, async () => {
      const next = get().tasks.filter(isOpen)
      const from = next.findIndex((t) => t.id === id)
      const to = next.findIndex((t) => t.id === overId)
      if (from < 0 || to < 0 || from === to) return {}
      next.splice(to, 0, ...next.splice(from, 1))
      const before = next[to - 1]
      const after = next[to + 1]
      const order = before && after ? (before.beltOrder + after.beltOrder) / 2 : before ? before.beltOrder + 1 : after.beltOrder - 1
      await db.tasks.update(id, { beltOrder: order })
      return { tasks: get().tasks.map((t) => (t.id === id ? { ...t, beltOrder: order } : t)).sort(byBelt) }
    }),
  sortByDue: () =>
    save(set, async () => {
      const open = get()
        .tasks.filter(isOpen)
        .sort((a, b) => (a.dueDate ?? '9999').localeCompare(b.dueDate ?? '9999') || byBelt(a, b))
      const order = new Map(open.map((t, i) => [t.id, i + 1]))
      await db.tasks.bulkUpdate(open.map((t) => ({ key: t.id, changes: { beltOrder: order.get(t.id) } })))
      return {
        tasks: get()
          .tasks.map((t) => (order.has(t.id) ? { ...t, beltOrder: order.get(t.id)! } : t))
          .sort(byBelt),
      }
    }),
}))
