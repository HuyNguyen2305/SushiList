import { create } from 'zustand'
import type { Task, TaskInput } from './data'
import { db } from './db'

type State = {
  tasks: Task[]
  ready: boolean
  error: string | null
  load: () => Promise<void>
  add: (input: TaskInput) => Promise<void>
  update: (id: string, input: TaskInput) => Promise<void>
  remove: (id: string) => Promise<void>
}

const clean = (i: TaskInput): TaskInput => ({
  title: i.title.trim(),
  note: i.note?.trim() || undefined,
  dueDate: i.dueDate || undefined,
  sushiTypeId: i.sushiTypeId,
})

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
      return { tasks: get().tasks.filter((t) => t.id !== id) }
    }),
}))
