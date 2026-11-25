import { create } from 'zustand'
import type { Task, TaskInput } from './data'
import { dayKey } from './dates'
import { makeBackup } from './backup'
import { db } from './db'
import { initStorage, markBackup, type StorageInfo } from './storage'

type Undoable = { kind: 'eat' | 'delete'; task: Task }
// A plate in flight from the belt to the stack. Purely visual: the task is already saved as done.
type Flight = { task: Task; from: DOMRect; index: number }

type State = {
  tasks: Task[]
  ready: boolean
  error: string | null
  selectedId: string | null
  undoable: Undoable | null
  flight: Flight | null
  storage: StorageInfo | null
  load: () => Promise<void>
  add: (input: TaskInput) => Promise<void>
  update: (id: string, input: TaskInput) => Promise<void>
  remove: (id: string) => Promise<void>
  eat: (id: string, from?: DOMRect) => Promise<void>
  undo: () => Promise<void>
  move: (id: string, overId: string) => Promise<void>
  sortByDue: () => Promise<void>
  startStorage: () => Promise<void>
  exportBackup: () => Promise<void>
  importTasks: (tasks: Task[], mode: 'merge' | 'replace') => Promise<void>
  select: (id: string | null) => void
  clearUndo: () => void
  endFlight: () => void
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
  undoable: null,
  flight: null,
  storage: null,
  select: (id) => set({ selectedId: id }),
  clearUndo: () => set({ undoable: null }),
  endFlight: () => set({ flight: null }),
  // Asks the browser to keep storage permanently and loads the backup reminder info. Failing is not fatal.
  startStorage: async () => {
    try {
      set({ storage: await initStorage() })
    } catch {
      /* storage info is advisory only */
    }
  },
  exportBackup: async () => {
    const blob = new Blob([JSON.stringify(makeBackup(get().tasks), null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sushibar-backup-${dayKey()}.json`
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 0)
    await markBackup()
    await get().startStorage()
  },
  // Merge keeps what is here and adds plates with new ids at the end of the belt; replace swaps everything.
  importTasks: (incoming, mode) =>
    save(set, async () => {
      const have = new Set(get().tasks.map((t) => t.id))
      const offset = Math.max(0, ...get().tasks.map((t) => t.beltOrder))
      const add = mode === 'merge' ? incoming.filter((t) => !have.has(t.id)).map((t) => ({ ...t, beltOrder: t.beltOrder + offset })) : incoming
      await db.transaction('rw', db.tasks, async () => {
        if (mode === 'replace') await db.tasks.clear()
        await db.tasks.bulkPut(add)
      })
      return { tasks: await db.tasks.orderBy('beltOrder').toArray(), selectedId: null, undoable: null, flight: null }
    }),
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
      const task = get().tasks.find((t) => t.id === id)
      if (!task) return {}
      await db.tasks.delete(id)
      return {
        tasks: get().tasks.filter((t) => t.id !== id),
        selectedId: get().selectedId === id ? null : get().selectedId,
        undoable: { kind: 'delete', task },
      }
    }),
  // "Eating" a plate: it is saved as done at once (nothing is lost if the tab closes mid-animation),
  // then the optional `from` rectangle lets the UI fly the empty plate onto the stack.
  eat: (id, from) =>
    save(set, async () => {
      const task = get().tasks.find((t) => t.id === id)
      if (!task || !isOpen(task)) return {}
      const now = new Date()
      const done: Task = {
        ...task,
        status: 'done',
        completedAt: now.toISOString(),
        dayKey: dayKey(now),
        stackTilt: Math.round((Math.random() * 6 - 3) * 10) / 10,
      }
      const index = get().tasks.filter(isOpen).findIndex((t) => t.id === id)
      await db.tasks.put(done)
      return {
        tasks: get().tasks.map((t) => (t.id === id ? done : t)),
        selectedId: get().selectedId === id ? null : get().selectedId,
        undoable: { kind: 'eat', task },
        flight: from ? { task: done, from, index } : null,
      }
    }),
  // Undo restores the task exactly as it was before the last eat or delete.
  undo: () =>
    save(set, async () => {
      const u = get().undoable
      if (!u) return {}
      await db.tasks.put(u.task)
      return {
        tasks: [...get().tasks.filter((t) => t.id !== u.task.id), u.task].sort(byBelt),
        undoable: null,
        flight: null,
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
