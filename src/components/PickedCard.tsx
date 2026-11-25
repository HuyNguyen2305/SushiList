import { useState } from 'react'
import { dueLabel } from '../dates'
import { eatPlate } from '../eat'
import { useCategory, useStore } from '../store'
import { NoteDialog } from './NoteDialog'

/** The counter card under the belt: a hint when nothing is picked, the picked plate with Eat when one is. */
export function PickedCard({ openCount }: { openCount: number }) {
  const task = useStore((s) => s.tasks.find((t) => t.id === s.selectedId && t.status === 'open'))
  const select = useStore((s) => s.select)
  const remove = useStore((s) => s.remove)
  const update = useStore((s) => s.update)
  const type = useCategory(task?.sushiTypeId ?? '')
  const [noteOpen, setNoteOpen] = useState(false)

  return (
    <section
      aria-label="Picked plate"
      className="flex min-h-28 xl:min-h-0 flex-col gap-2.5 rounded-[18px] bg-white p-4 shadow-[0_2px_0_#E2CFB4] xl:rounded-md xl:border-t-[6px] xl:border-tomato xl:bg-[#FBF5E9] xl:px-4 xl:py-3.5 xl:shadow-lift"
    >
      {task ? (
        <>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-extrabold tracking-wide text-label uppercase">Picked plate</span>
            <span className="text-lg font-extrabold">{task.title}</span>
            <span className="text-[13px] text-ink-soft">
              2 × {type.dish}
              {task.dueDate && ` · due ${dueLabel(task.dueDate)}`}
            </span>
            <button type="button" onClick={() => setNoteOpen(true)} className="mt-1 line-clamp-2 text-left text-[13px] text-ink-soft underline decoration-dotted underline-offset-2">
              {task.note || 'Add a note…'}
            </button>
            <NoteDialog open={noteOpen} value={task.note ?? ''} title={task.title} onSave={(note) => void update(task.id, { ...task, note })} onClose={() => setNoteOpen(false)} />
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => void eatPlate(task.id)} className="h-11 flex-1 rounded-xl bg-tomato text-[15px] font-extrabold text-white">
              Eat it · mark done
            </button>
            <button type="button" onClick={() => void remove(task.id)} className="h-11 rounded-xl border-2 border-[#D8C6AE] bg-white px-3.5 text-sm font-bold">
              Send back
            </button>
            <button type="button" onClick={() => select(null)} aria-label="Put plate back on the belt" className="flex size-11 items-center justify-center rounded-xl bg-counter">
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
        </>
      ) : (
        <>
          <span className="text-lg font-extrabold">{openCount > 0 ? 'Grab a plate' : 'Belt is clear'}</span>
          <span className="text-sm text-ink-soft">
            {openCount > 0
              ? 'Tap a plate on the belt to work on that task. Eat it when it is done.'
              : 'Every order is eaten. Add a new one below, or enjoy the stack.'}
          </span>
        </>
      )}
    </section>
  )
}
