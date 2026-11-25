import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test('no automated accessibility violations with plates, a stack and the import panel showing', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await page.getByLabel('Task title').first().fill('Pay rent')
  await page.getByLabel('Due date').first().fill('2020-01-05')
  await page.getByRole('button', { name: 'Order' }).click()
  await page.getByLabel('Task title').first().fill('Buy milk')
  await page.getByRole('button', { name: 'Order' }).click()
  await page.getByRole('button', { name: 'Eat Buy milk' }).click()
  await page.getByRole('button', { name: "Today's plates" }).click()

  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`)).toEqual([])
})
