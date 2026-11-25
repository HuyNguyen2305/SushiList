import { useEffect } from 'react'
import { eatPlate } from './eat'
import { useStore } from './store'

const plates = () => [...document.querySelectorAll<HTMLElement>('.belt [data-plate]')]

/** Keyboard paths: E eats the focused (or selected) plate, Z undoes the last eat or delete.
 *  Arrow keys between plates live on the belt itself; Enter selects (a native button click). */
export function useShortcuts() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      const target = e.target as HTMLElement
      if (target.closest('input, select, textarea, [contenteditable]')) return
      if (target.getAttribute('aria-pressed') === 'true') return // mid-drag: keys belong to the drag
      const store = useStore.getState()

      if (e.key === 'z' && store.undoable) {
        e.preventDefault()
        void store.undo()
      }

      if (e.key === 'e') {
        const focused = target.closest<HTMLElement>('[data-plate]')
        const id = focused?.dataset.plate ?? store.selectedId
        if (!id) return
        e.preventDefault()
        const all = plates()
        const at = all.findIndex((p) => p.dataset.plate === id)
        const next = all[at + 1] ?? all[at - 1]
        void eatPlate(id)
        // The eaten plate leaves the page, so hand focus to its neighbour instead of losing it.
        if (focused) requestAnimationFrame(() => next?.focus())
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])
}
