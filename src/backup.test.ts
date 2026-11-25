import { expect, it } from 'vitest'
import { makeBackup, parseBackup } from './backup'
import { DEFAULT_CATEGORIES, type Task } from './data'
import { useStore } from './store'
import { staleBackupDays } from './storage'

const task = (over: Partial<Task> = {}): Task => ({
  id: 'a',
  title: 'Pay rent',
  sushiTypeId: 'salmon',
  status: 'open',
  beltOrder: 1,
  createdAt: '2026-11-25T10:00:00.000Z',
  ...over,
})

it('a backup round-trips through export and parse', () => {
  const tasks = [task(), task({ id: 'b', status: 'done', completedAt: '2026-11-25T11:00:00.000Z', dayKey: '2026-11-25', stackTilt: 1.5, dueDate: '2026-12-01', note: 'x' })]
  const parsed = parseBackup(JSON.stringify(makeBackup(tasks)))
  expect(parsed).toEqual({ ok: true, categories: DEFAULT_CATEGORIES, tasks: expect.arrayContaining(tasks.map((t) => expect.objectContaining(t))) })
})

it.each([
  ['not json', '{nope', /not valid JSON/],
  ['no tasks', '{"schemaVersion":1}', /not a Sushibar backup/],
  ['newer version', '{"schemaVersion":99,"tasks":[]}', /newer version/],
  ['bad status', JSON.stringify({ schemaVersion: 1, tasks: [{ ...task(), status: 'eaten' }] }), /Plate 1 is invalid/],
  ['unknown type', JSON.stringify({ schemaVersion: 1, tasks: [{ ...task(), sushiTypeId: 'pizza' }] }), /unknown sushi type/],
  ['bad date', JSON.stringify({ schemaVersion: 1, tasks: [{ ...task(), dueDate: 'tomorrow' }] }), /bad due date/],
])('rejects a bad backup: %s', (_name, text, error) => {
  const r = parseBackup(text)
  expect(r.ok).toBe(false)
  expect(!r.ok && r.error).toMatch(error)
})

it('import merges new plates after existing ones, or replaces everything', async () => {
  const s = useStore.getState()
  await s.add({ title: 'Mine', sushiTypeId: 'salmon' })
  const mine = useStore.getState().tasks[0]

  await s.importTasks([task({ id: mine.id, title: 'Same id, ignored' }), task({ id: 'new', title: 'Theirs' })], 'merge')
  expect(useStore.getState().tasks.map((t) => t.title)).toEqual(['Mine', 'Theirs'])

  await s.importTasks([task({ id: 'only', title: 'Only' })], 'replace')
  expect(useStore.getState().tasks.map((t) => t.title)).toEqual(['Only'])
})

it('reminds about a backup after 7 days, counted from the last backup or the first run', () => {
  const now = Date.parse('2026-11-25T12:00:00Z')
  const base = { persistGranted: true, firstRunAt: '2026-11-10T12:00:00Z' }
  expect(staleBackupDays(base, now)).toBe(15)
  expect(staleBackupDays({ ...base, lastBackupAt: '2026-11-20T12:00:00Z' }, now)).toBeNull()
  expect(staleBackupDays({ ...base, lastBackupAt: '2026-11-18T12:00:00Z' }, now)).toBe(7)
})

it('keeps custom categories through a backup, and rejects bad ones', () => {
  const cats = [{ id: 'study', name: 'Study', colour: '#112233', art: 'tuna' as const }]
  const t = task({ sushiTypeId: 'study' })
  const ok = parseBackup(JSON.stringify(makeBackup([t], cats)))
  expect(ok).toEqual({ ok: true, categories: cats, tasks: [expect.objectContaining({ sushiTypeId: 'study' })] })
  expect(parseBackup(JSON.stringify(makeBackup([task({ sushiTypeId: 'gone' })], cats)))).toMatchObject({ ok: false })
  expect(parseBackup(JSON.stringify({ schemaVersion: 2, tasks: [], categories: [{ id: 'x', name: 'X', colour: 'red', art: 'tuna' }] }))).toMatchObject({ ok: false })
})
