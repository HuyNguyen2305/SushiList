import { AnimatePresence, motion } from 'motion/react'
import { useEffect } from 'react'
import { EASE_OUT } from '../motion'
import { useStore } from '../store'

/** "Undo" for the last eat or delete, for 5 seconds. Enters and leaves through the bottom. */
export function Toast() {
  const undoable = useStore((s) => s.undoable)
  const undo = useStore((s) => s.undo)
  const clear = useStore((s) => s.clearUndo)

  useEffect(() => {
    if (!undoable) return
    const t = setTimeout(clear, 5000)
    return () => clearTimeout(t)
  }, [undoable, clear])

  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-4 bottom-28 z-40 xl:bottom-4 flex justify-center">
      <AnimatePresence>
        {undoable && (
          <motion.div
            key={`${undoable.kind}-${undoable.task.id}`}
            className="pointer-events-auto flex max-w-full items-center gap-3 rounded-2xl bg-ink py-2 pr-2 pl-4 text-white shadow-lg"
            initial={{ y: '150%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '150%', opacity: 0 }}
            transition={{ duration: 0.2, ease: EASE_OUT }}
          >
            <span className="truncate text-sm font-bold">
              {undoable.kind === 'eat' ? 'Ate' : 'Deleted'} &ldquo;{undoable.task.title}&rdquo;
            </span>
            <button type="button" onClick={() => void undo()} className="h-11 shrink-0 rounded-xl bg-gold px-4 text-sm font-extrabold text-ink">
              Undo
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
