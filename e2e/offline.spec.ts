import { expect, test } from '@playwright/test'

const PREVIEW = 'http://localhost:4173/'

test('installed app works offline, with the plates saved earlier', async ({ page, context }) => {
  await page.goto(PREVIEW)
  await page.evaluate(() => navigator.serviceWorker.ready)
  await page.getByLabel('Task title').first().fill('Pay rent')
  await page.getByRole('button', { name: 'Order' }).click()
  await expect(page.getByRole('button', { name: 'Pick plate: Pay rent' })).toBeVisible()
  await page.reload() // let the service worker take control of the page
  await expect(page.getByRole('button', { name: 'Pick plate: Pay rent' })).toBeVisible()

  await context.setOffline(true)
  await page.reload()
  await expect(page.getByRole('heading', { name: 'Sushibar' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Pick plate: Pay rent' })).toBeVisible()

  await page.getByLabel('Task title').first().fill('Added offline')
  await page.getByRole('button', { name: 'Order' }).click()
  await expect(page.getByRole('button', { name: 'Pick plate: Added offline' })).toBeVisible()
})

test('serves a valid web app manifest with installable icons', async ({ request }) => {
  const manifest = await (await request.get(`${PREVIEW}manifest.webmanifest`)).json()
  expect(manifest).toMatchObject({ name: 'Sushibar', display: 'standalone' })
  for (const size of ['192x192', '512x512']) expect(manifest.icons.some((i: { sizes: string }) => i.sizes === size)).toBe(true)
})
