import { writeFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'

test('export a backup, lose the plate, import it back with Replace', async ({ page }, info) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await page.getByLabel('Task title').first().fill('Pay rent')
  await page.getByRole('button', { name: 'Order' }).click()

  const download = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Export backup' }).click()
  const file = info.outputPath('backup.json')
  await (await download).saveAs(file)
  await expect(page.getByText(/Last backup:/)).toBeVisible()

  await page.getByRole('button', { name: 'Delete Pay rent' }).click()
  await expect(page.getByText(/Nothing on the belt/)).toBeVisible()

  await page.getByLabel('Import backup file').setInputFiles(file)
  await expect(page.getByText(/Found 1 plate\./)).toBeVisible()
  await page.getByRole('button', { name: 'Replace' }).click()
  await expect(page.getByRole('button', { name: 'Pick plate: Pay rent' })).toBeVisible()
  await page.reload()
  await expect(page.getByRole('button', { name: 'Pick plate: Pay rent' })).toBeVisible()
})

test('a broken backup is refused with a clear message and changes nothing', async ({ page }, info) => {
  await page.goto('/')
  await page.getByLabel('Task title').first().fill('Keep me')
  await page.getByRole('button', { name: 'Order' }).click()

  const bad = info.outputPath('bad.json')
  writeFileSync(bad, JSON.stringify({ schemaVersion: 1, tasks: [{ id: 'x', title: 'Bad', sushiTypeId: 'pizza', status: 'open', beltOrder: 1, createdAt: 'now' }] }))
  await page.getByLabel('Import backup file').setInputFiles(bad)
  await expect(page.getByRole('alert')).toContainText('unknown sushi type')
  await expect(page.getByRole('group', { name: 'Import choice' })).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Pick plate: Keep me' })).toBeVisible()
})

test('the storage request result is remembered and a missing backup is flagged after 7 days', async ({ page }) => {
  await page.clock.install({ time: new Date(2026, 10, 25, 10, 0, 0) })
  await page.goto('/')
  await page.clock.runFor('24:00:00') // not yet a week
  await expect(page.getByText(/not backed up/)).toHaveCount(0)
  await page.clock.fastForward(8 * 86_400_000)
  await page.reload()
  await expect(page.getByText(/not backed up/)).toBeVisible()
})
