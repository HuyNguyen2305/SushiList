import type { SushiId } from './components/Sushi'

export type Category = { id: string; name: string; colour: string; art: SushiId }

/** What a plate of each drawn sushi is called; a category only picks the art, so the dish follows it. */
export const DISH: Record<SushiId, string> = {
  salmon: 'Salmon nigiri',
  tamago: 'Tamago nigiri',
  kappa: 'Cucumber maki',
  tuna: 'Tuna nigiri',
  ebi: 'Shrimp nigiri',
  ikura: 'Salmon roe gunkan',
}
export const ARTS = Object.keys(DISH) as SushiId[]

/** The categories a fresh install starts with. After that they live in the database and the user owns them. */
export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'salmon', name: 'Work', colour: '#3B6FD9', art: 'salmon' },
  { id: 'tamago', name: 'Personal', colour: '#E0A526', art: 'tamago' },
  { id: 'maki', name: 'Errands', colour: '#2F9E6B', art: 'kappa' },
  { id: 'tuna', name: 'Tuna', colour: '#D9483B', art: 'tuna' },
  { id: 'ebi', name: 'Ebi', colour: '#8B5CC7', art: 'ebi' },
  { id: 'ikura', name: 'Ikura', colour: '#1F9CA6', art: 'ikura' },
]

/** Looks a category up; a plate whose category was deleted falls back to the first one. */
export const typeOf = (cats: Category[], id: string): Category & { dish: string } => {
  const c = cats.find((t) => t.id === id) ?? cats[0] ?? DEFAULT_CATEGORIES[0]
  return { ...c, dish: DISH[c.art] }
}

export type Task = {
  id: string
  title: string
  note?: string
  sushiTypeId: string
  dueDate?: string // YYYY-MM-DD
  status: 'open' | 'done'
  beltOrder: number
  createdAt: string
  completedAt?: string
  dayKey?: string
  stackTilt?: number
}

export type TaskInput = Pick<Task, 'title' | 'note' | 'dueDate' | 'sushiTypeId'>
