import type { SushiId } from './components/Sushi'

// shortcut: sushi types are constants, not a Dexie table; add the table when custom types are built.
export const SUSHI_TYPES = [
  { id: 'salmon', name: 'Salmon · work', dish: 'Salmon nigiri', colour: '#3B6FD9', art: 'salmon' },
  { id: 'tamago', name: 'Tamago · personal', dish: 'Tamago nigiri', colour: '#E0A526', art: 'tamago' },
  { id: 'maki', name: 'Maki · errands', dish: 'Cucumber maki', colour: '#2F9E6B', art: 'kappa' },
  { id: 'tuna', name: 'Tuna', dish: 'Tuna nigiri', colour: '#D9483B', art: 'tuna' },
  { id: 'ebi', name: 'Ebi', dish: 'Shrimp nigiri', colour: '#8B5CC7', art: 'ebi' },
  { id: 'ikura', name: 'Ikura', dish: 'Salmon roe gunkan', colour: '#1F9CA6', art: 'ikura' },
] as const satisfies readonly { id: string; name: string; dish: string; colour: string; art: SushiId }[]

export type SushiTypeId = (typeof SUSHI_TYPES)[number]['id']

export const typeOf = (id: string) => SUSHI_TYPES.find((t) => t.id === id) ?? SUSHI_TYPES[0]

export type Task = {
  id: string
  title: string
  note?: string
  sushiTypeId: SushiTypeId
  dueDate?: string // YYYY-MM-DD
  status: 'open' | 'done'
  beltOrder: number
  createdAt: string
  completedAt?: string
  dayKey?: string
  stackTilt?: number
}

export type TaskInput = Pick<Task, 'title' | 'note' | 'dueDate' | 'sushiTypeId'>
