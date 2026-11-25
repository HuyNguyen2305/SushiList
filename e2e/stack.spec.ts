import { expect, test } from '@playwright/test'

test('eat a plate: it lands on the stack, survives a reload, and Undo brings it back', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel('Task title').first().fill('Pay rent')
  await page.getByRole('button', { name: 'Order' }).click()

  await page.getByRole('button', { name: 'Eat Pay rent' }).click()
  await expect(page.getByText('1 of 1 eaten').filter({ visible: true })).toBeVisible()
  await expect(page.locator('[data-landing]')).toBeVisible() // visible once the flight has landed
  await page.reload()
  await expect(page.getByText('1 of 1 eaten').filter({ visible: true })).toBeVisible()

  await page.getByRole('button', { name: 'Eat Pay rent' }).count() // gone: it is done
  await page.getByLabel('Task title').first().fill('Buy milk')
  await page.getByRole('button', { name: 'Order' }).click()
  await page.getByRole('button', { name: 'Eat Buy milk' }).click()
  await page.getByRole('button', { name: 'Undo' }).click()
  await expect(page.getByRole('button', { name: 'Pick plate: Buy milk' })).toBeVisible()
})

test('at midnight the stack empties into History and unfinished plates stay on the belt', async ({ page }) => {
  await page.clock.install({ time: new Date(2026, 10, 25, 23, 59, 0) })
  await page.emulateMedia({ reducedMotion: 'reduce' }) // no flight, so no animation frames to wait for
  await page.goto('/')
  for (const title of ['Done today', 'Still open']) {
    await page.getByLabel('Task title').first().fill(title)
    await page.getByRole('button', { name: 'Order' }).click()
  }
  await page.getByRole('button', { name: 'Eat Done today' }).click()
  await expect(page.getByText('1 of 2 eaten').filter({ visible: true })).toBeVisible()

  await page.clock.runFor('02:00') // past local midnight
  await expect(page.getByText('0 of 1 eaten').filter({ visible: true })).toBeVisible()
  await page.getByRole('button', { name: 'History', exact: true }).click()
  await expect(page.getByText(/Wed, Nov 25 · 1 plate/)).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('button', { name: 'Pick plate: Still open' })).toBeVisible()
})
