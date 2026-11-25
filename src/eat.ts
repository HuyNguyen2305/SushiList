import { PLATE_H } from './components/Plate'
import { useStore } from './store'

/** Where the oval plate sits on screen right now, kept inside the visible belt, so the flight starts there. */
function plateRect(id: string): DOMRect | undefined {
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined
  const r = document.querySelector(`[data-plate="${id}"]`)?.getBoundingClientRect()
  const belt = document.querySelector('.belt')?.getBoundingClientRect()
  if (!r || !belt || r.width === 0) return undefined
  const left = Math.min(Math.max(r.left, belt.left), belt.right - r.width)
  return new DOMRect(left, r.bottom - PLATE_H, r.width, PLATE_H) // the plate is the bottom of the button
}

/** Eat a plate from a click or key press; the flight starts from the plate's current spot. */
export const eatPlate = (id: string) => useStore.getState().eat(id, plateRect(id))
