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
