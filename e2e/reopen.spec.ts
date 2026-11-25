import { expect, test } from '@playwright/test'

test('tasks survive closing and reopening the page', async ({ context }) => {
  const first = await context.newPage()
  await first.goto('/')
  await first.getByLabel('Task title').fill('Pay rent')
  await first.getByRole('button', { name: 'Order' }).click()
  await expect(first.getByRole('button', { name: 'Pick plate: Pay rent' })).toBeVisible()
  await first.close()

  const second = await context.newPage()
  await second.goto('/')
  await expect(second.getByRole('button', { name: 'Pick plate: Pay rent' })).toBeVisible()
})
