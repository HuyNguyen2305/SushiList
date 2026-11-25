import { motion } from 'motion/react'
import { useState } from 'react'
import type { Task } from '../data'
import { dayLabel, timeLabel } from '../dates'
import { EASE_OUT } from '../motion'
import { useCategory } from '../store'
import { Modal } from './Modal'

function ReceiptLine({ task }: { task: Task }) {
  const type = useCategory(task.sushiTypeId)
  return (
    <li className="flex items-baseline gap-3 border-b border-dotted border-[#C9B48F] py-1.5">
      <span className="w-16 shrink-0 text-ink-soft">{task.completedAt && timeLabel(task.completedAt)}</span>
      <span className="min-w-0 flex-1 truncate font-bold">{task.title}</span>
      <span className="shrink-0 text-xs text-ink-soft">{type.name}</span>
    </li>
  )
}

/**
 * The tab at the foot of the task list: how many plates were eaten today, and the receipt that lists them.
 * The small plate is where an eaten plate lands (`data-landing`).
 */
export function Stack({ done }: { done: Task[] }) {
  const [open, setOpen] = useState(false)
  const [seen] = useState(done.length) // the seal only stamps for plates eaten while you watch
  const newest = [...done].sort((a, b) => (b.completedAt ?? '').localeCompare(a.completedAt ?? ''))
  const today = done[0]?.dayKey

  return (
    <>
      <div className="flex shrink-0 items-center gap-3 border-t-2 border-dashed border-[#B9A27A] px-1 pt-3">
        <span aria-hidden="true" className="relative block h-3.5 w-9 shrink-0 rounded-[50%] bg-[#F4EFE2] shadow-[0_2px_0_rgba(60,30,10,.35)]">
          <span className="absolute inset-x-1.5 inset-y-0.5 rounded-[50%] bg-[#DDD6C4]" />
        </span>
        <p className="m-0 min-w-0 flex-1 truncate font-mono text-sm font-bold">
          <span className="text-lg font-extrabold tabular-nums">{done.length}</span> {done.length === 1 ? 'plate' : 'plates'} eaten today
        </p>
        {done.length > 0 && (
          <motion.span
            key={done.length}
            aria-hidden="true"
            initial={done.length === seen ? false : { opacity: 0, scale: 1.7, rotate: -18 }}
            animate={{ opacity: 0.88, scale: 1, rotate: -8 }}
            transition={{ duration: 0.22, ease: EASE_OUT }}
            className="flex size-7 shrink-0 items-center justify-center rounded-full border-2 border-tomato font-jp text-sm leading-none text-tomato"
          >
            済
          </motion.span>
        )}
        <button type="button" onClick={() => setOpen(true)} className="h-9 shrink-0 rounded-lg bg-navy px-3.5 text-sm font-extrabold text-white">
          Receipt
        </button>
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title="Receipt">
        <div className="rounded-md bg-[#FFFDF6] px-5 py-4 font-mono text-sm shadow-[0_6px_14px_-6px_rgba(40,20,5,.45)]">
          <h2 className="m-0 text-center text-base font-extrabold tracking-widest uppercase">Receipt</h2>
          <p className="m-0 mb-2 text-center text-xs text-ink-soft">{today ? dayLabel(today) : 'Today'}</p>
          <ul className="m-0 flex list-none flex-col p-0">
            {newest.length === 0 && <li className="py-2 text-ink-soft">Nothing eaten yet today.</li>}
            {newest.map((d) => (
              <ReceiptLine key={d.id} task={d} />
            ))}
          </ul>
          <p className="m-0 mt-2 flex justify-between font-extrabold">
            <span>Total</span>
            <span>
              {done.length} {done.length === 1 ? 'plate' : 'plates'}
            </span>
          </p>
        </div>
        <div className="flex justify-end">
          <button type="button" onClick={() => setOpen(false)} className="h-11 rounded-xl bg-white px-5 text-sm font-bold">
            Done
          </button>
        </div>
      </Modal>
    </>
  )
}
