import { expect, test, type Page } from '@playwright/test'

const names = (page: Page) =>
  page.getByRole('button', { name: /^Pick plate:/ }).evaluateAll((els) => els.map((e) => e.getAttribute('aria-label')?.replace('Pick plate: ', '')))

test('dragging a plate reorders the belt and the order survives a reload', async ({ page }) => {
  await page.goto('/')
  for (const title of ['One', 'Two', 'Three']) {
    await page.getByLabel('Task title').first().fill(title)
    await page.getByRole('button', { name: 'Order' }).click()
  }
  await expect.poll(() => names(page)).toEqual(['One', 'Two', 'Three'])

  const three = (await page.getByRole('button', { name: 'Pick plate: Three' }).boundingBox())!
  const one = (await page.getByRole('button', { name: 'Pick plate: One' }).boundingBox())!
  await page.mouse.move(three.x + three.width / 2, three.y + three.height / 2)
  await page.mouse.down()
  await page.mouse.move(one.x + one.width / 2, one.y + one.height / 2, { steps: 12 })
  await page.mouse.up()
  await expect.poll(() => names(page)).toEqual(['Three', 'One', 'Two'])

  await page.reload()
  await expect.poll(() => names(page)).toEqual(['Three', 'One', 'Two'])
})

test('the belt moves, and pausing stops it', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel('Task title').first().fill('One')
  await page.getByRole('button', { name: 'Order' }).click()
  const track = page.locator('.belt-track')
  const x = () => track.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m41)

  await page.mouse.move(0, 700) // keep the pointer off the belt so hover does not pause it
  const a = await x()
  await page.waitForTimeout(500)
  expect(await x()).toBeLessThan(a)

  await page.getByRole('button', { name: 'Pause belt' }).click()
  await page.mouse.move(0, 700)
  const b = await x()
  await page.waitForTimeout(500)
  expect(await x()).toBe(b)
})
