import { expect, test } from '@playwright/test'

test('a custom category and a note written in the pop-up survive a reload', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel('Task title').first().fill('Essay')
  await page.getByRole('button', { name: 'More options' }).click()

  await page.getByRole('button', { name: 'Edit categories' }).click()
  const manager = page.getByRole('dialog', { name: 'Categories' })
  await manager.getByLabel('New category name').fill('Study')
  await manager.getByRole('button', { name: 'Add' }).click()
  await expect(manager.getByLabel('Name of Study')).toBeVisible()
  await manager.getByRole('button', { name: 'Done' }).click()
  await page.getByLabel('Category').selectOption({ label: 'Study' })

  await page.getByLabel('Due date').fill('2099-12-01')
  await page.getByRole('button', { name: 'Add a note…' }).click()
  const note = page.getByRole('dialog', { name: /Note for/ })
  await note.getByLabel('Note').fill('Chapter 3 first.\nThen the summary, with sources.')
  await note.getByRole('button', { name: 'Save note' }).click()
  await page.getByRole('button', { name: 'Order' }).click()

  await page.reload()
  await expect(page.getByLabel(/Pick plate: Essay, due Dec 1/).first()).toBeVisible()
  await page.getByLabel(/Pick plate: Essay/).first().focus() // the belt never stops, so select by keyboard
  await page.keyboard.press('Enter')
  await expect(page.getByRole('region', { name: 'Picked plate' }).getByRole('button', { name: /Chapter 3 first/ })).toBeVisible()
  await expect(page.getByText(/Study/).first()).toBeVisible()
})
