import { expect, test } from '@playwright/test'

test('plates work from the keyboard: arrows, Enter, E to eat, Z to undo', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  for (const title of ['One', 'Two', 'Three']) {
    await page.getByLabel('Task title').first().fill(title)
    await page.getByRole('button', { name: 'Order' }).click()
  }
  const plate = (n: string) => page.getByRole('button', { name: `Pick plate: ${n}` })

  await plate('One').focus()
  await page.keyboard.press('ArrowRight')
  await expect(plate('Two')).toBeFocused()
  await page.keyboard.press('ArrowLeft')
  await expect(plate('One')).toBeFocused()

  await page.keyboard.press('ArrowRight')
  await page.keyboard.press('Enter')
  await expect(plate('Two')).toHaveAttribute('data-selected', 'true')
  await page.keyboard.press('Enter') // toggles the selection off again

  await page.keyboard.press('e')
  await expect(page.getByText('1 of 3 eaten').filter({ visible: true })).toBeVisible()
  await expect(plate('Three')).toBeFocused() // focus moved to the neighbour, not lost

  await page.keyboard.press('z')
  await expect(page.getByText('0 of 3 eaten').filter({ visible: true })).toBeVisible()
  await expect(plate('Two')).toBeVisible()
})

test('Space lifts a plate, arrows move it, Space drops it, and the order is saved', async ({ page }) => {
  await page.goto('/')
  for (const title of ['One', 'Two', 'Three']) {
    await page.getByLabel('Task title').first().fill(title)
    await page.getByRole('button', { name: 'Order' }).click()
  }
  const one = page.getByRole('button', { name: 'Pick plate: One' })
  await one.focus()
  await page.keyboard.press('Space')
  await expect(one).toHaveAttribute('aria-pressed', 'true') // lifted
  await page.waitForTimeout(150) // dnd-kit measures the slots right after a lift; a person is never this fast
  await page.keyboard.press('ArrowRight')
  await expect(one.locator('xpath=..')).toHaveCSS('transform', /matrix\(1, 0, 0, 1, 1\d\d(\.\d+)?, 0\)/) // slid one slot right
  await page.keyboard.press('Space')
  await expect(one).not.toHaveAttribute('aria-pressed', 'true')
  await page.reload()
  await expect
    .poll(() =>
      page
        .getByRole('button', { name: /^Pick plate:/ })
        .evaluateAll((els) => els.map((e) => e.getAttribute('aria-label')?.replace('Pick plate: ', ''))),
    )
    .toEqual(['Two', 'One', 'Three'])
})
