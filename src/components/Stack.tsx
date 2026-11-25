import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { typeOf, type Task } from '../data'
import { timeLabel } from '../dates'
import { EASE_OUT } from '../motion'
import { useStore } from '../store'

const PILE = 10 // after this many plates the stack starts a second pile beside it

function Pile({ plates }: { plates: Task[] }) {
  const flightId = useStore((s) => s.flight?.task.id)
  return (
    <div className="flex w-40 flex-col-reverse items-center">
      <div aria-hidden="true" className="mt-1 h-2.5 w-38 rounded bg-[#B07A47]" />
      {plates.length === 0 && <div className="h-3.5 w-34 rounded-[50%] border-3 border-dashed border-[#B9A184]" />}
      {plates.map((d) => {
        const colour = typeOf(d.sushiTypeId).colour
        return (
          <div
            key={d.id}
            data-landing={d.id}
            className="-mb-[3px] flex flex-col items-center"
            style={{ transform: `rotate(${d.stackTilt ?? 0}deg)`, visibility: flightId === d.id ? 'hidden' : undefined }}
          >
            <div className="h-3 w-34 rounded-t-md rounded-b-[40px] shadow-[inset_0_3px_0_rgba(255,255,255,.45)]" style={{ background: colour }} />
            <div className="h-1.5 w-23 rounded-b-md brightness-75" style={{ background: colour }} />
          </div>
        )
      })}
    </div>
  )
}

/** Today's finished plates. `today` keys the piles so the stack slides away at midnight. */
export function Stack({ done, today }: { done: Task[]; today: string }) {
  const [open, setOpen] = useState(false)
  const sorted = [...done].sort((a, b) => (a.completedAt ?? '').localeCompare(b.completedAt ?? ''))
  const piles = Array.from({ length: Math.max(1, Math.ceil(sorted.length / PILE)) }, (_, i) => sorted.slice(i * PILE, (i + 1) * PILE))

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end gap-x-8 gap-y-4">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={today}
            className="flex flex-wrap items-end gap-4"
            exit={{ x: 240, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE_OUT }}
          >
            {piles.map((p, i) => (
              <Pile key={i} plates={p} />
            ))}
          </motion.div>
        </AnimatePresence>
        <div className="flex flex-col gap-1.5 pb-1.5">
          <span className="text-sm font-extrabold tracking-wider text-label uppercase">Your stack</span>
          <span className="font-display text-[40px] leading-none font-semibold">{done.length}</span>
          <span className="text-sm text-ink-soft">plates eaten today</span>
        </div>
      </div>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="h-11 self-start rounded-xl bg-counter px-3 text-sm font-bold"
      >
        Today&apos;s plates
      </button>
      {open && (
        <ul className="m-0 flex list-none flex-col gap-1 p-0 text-sm">
          {done.length === 0 && <li className="text-ink-soft">Nothing eaten yet today.</li>}
          {[...sorted].reverse().map((d) => (
            <li key={d.id} className="flex gap-3">
              <span className="w-16 shrink-0 text-ink-soft">{d.completedAt && timeLabel(d.completedAt)}</span>
              <span className="font-semibold">{d.title}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
