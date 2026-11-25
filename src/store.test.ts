import { expect, it } from 'vitest'
import { useStore } from './store'

const reload = async () => {
  useStore.setState({ tasks: [], ready: false })
  await useStore.getState().load()
  return useStore.getState().tasks
}

it('add, edit and delete are saved and survive a reload', async () => {
  const s = useStore.getState()
  await s.add({ title: '  Pay rent ', note: ' ', sushiTypeId: 'salmon' })
  await s.add({ title: 'Buy milk', dueDate: '2026-12-01', sushiTypeId: 'maki' })

  let tasks = await reload()
  expect(tasks.map((t) => t.title)).toEqual(['Pay rent', 'Buy milk'])
  expect(tasks[0].note).toBeUndefined()
  expect(tasks[0].beltOrder).toBeLessThan(tasks[1].beltOrder)

  await s.update(tasks[0].id, { title: 'Pay rent today', sushiTypeId: 'tuna' })
  await s.remove(tasks[1].id)

  tasks = await reload()
  expect(tasks).toHaveLength(1)
  expect(tasks[0]).toMatchObject({ title: 'Pay rent today', sushiTypeId: 'tuna' })
})

const titles = () => useStore.getState().tasks.map((t) => t.title)

it('reordering is saved, and sort by due date puts undated plates last', async () => {
  const s = useStore.getState()
  await s.add({ title: 'A', sushiTypeId: 'salmon', dueDate: '2026-12-09' })
  await s.add({ title: 'B', sushiTypeId: 'salmon' })
  await s.add({ title: 'C', sushiTypeId: 'salmon', dueDate: '2026-12-01' })
  const [a, , c] = useStore.getState().tasks

  await s.move(c.id, a.id) // drag C onto A's slot: C goes first
  expect(titles()).toEqual(['C', 'A', 'B'])
  await reload()
  expect(titles()).toEqual(['C', 'A', 'B'])

  await s.move(a.id, useStore.getState().tasks[2].id) // A to the end
  await reload()
  expect(titles()).toEqual(['C', 'B', 'A'])

  await s.sortByDue()
  await reload()
  expect(titles()).toEqual(['C', 'A', 'B'])
})

it('eating saves the plate as done, and undo restores it exactly', async () => {
  const s = useStore.getState()
  await s.add({ title: 'A', sushiTypeId: 'salmon' })
  const before = useStore.getState().tasks[0]

  await s.eat(before.id)
  let [t] = await reload()
  expect(t).toMatchObject({ status: 'done', dayKey: new Date().toLocaleDateString('en-CA') })
  expect(t.completedAt).toBeDefined()
  expect(Math.abs(t.stackTilt!)).toBeLessThanOrEqual(3)

  await useStore.getState().undo()
  ;[t] = await reload()
  expect(t).toEqual(before)
})

it('deleting can be undone, and only the latest action is undoable', async () => {
  const s = useStore.getState()
  await s.add({ title: 'A', sushiTypeId: 'salmon' })
  await s.add({ title: 'B', sushiTypeId: 'salmon' })
  const [a, b] = useStore.getState().tasks

  await s.remove(a.id)
  await s.eat(b.id)
  await useStore.getState().undo() // undoes the eat of B, not the delete of A
  expect((await reload()).map((t) => [t.title, t.status])).toEqual([['B', 'open']])
})
