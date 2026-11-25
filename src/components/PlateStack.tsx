import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { typeOf, type Task } from '../data'
import { EASE_OUT } from '../motion'
import { useStore } from '../store'

const PILE = 10 // after this many plates the stack starts a second pile beside it

function Pile({ plates }: { plates: Task[] }) {
  const flightId = useStore((s) => s.flight?.task.id)
  const cats = useStore((s) => s.categories)
  // The plate that just landed gives a small settle: a 3 px dip and rebound.
  const [landed, setLanded] = useState<string | null>(null)
  const flying = useRef<string | null>(null)
  useEffect(() => {
    if (flightId) {
      flying.current = flightId
      return
    }
    if (!flying.current) return
    setLanded(flying.current)
    flying.current = null
    const t = setTimeout(() => setLanded(null), 400)
    return () => clearTimeout(t)
  }, [flightId])
  return (
    <div className="flex w-[150px] flex-col-reverse items-center">
      {plates.length > 0 && <div aria-hidden="true" className="mt-0.5 h-2.5 w-[150px] rounded-[50%] bg-[rgba(40,20,5,.4)] blur-[1px]" />}
      {plates.map((d) => {
        const colour = typeOf(cats, d.sushiTypeId).colour
        return (
          <div
            key={d.id}
            data-landing={d.id}
            className={`relative -mb-[5px] h-[17px] w-34 motion-reduce:animate-[fade-in_.2s_ease-out] ${landed === d.id ? 'animate-[settle_.3s_cubic-bezier(.23,1,.32,1)]' : ''}`}
            style={{ transform: `rotate(${d.stackTilt ?? 0}deg)`, visibility: flightId === d.id ? 'hidden' : undefined }}
          >
            {/* seen from slightly above: the plate's underside and rim, then its face, then the dish */}
            <div className="absolute inset-x-0 top-[5px] h-[11px] rounded-[50%] brightness-[.62]" style={{ background: colour, boxShadow: '0 2px 2px rgba(30,12,2,.35)' }} />
            <div className="absolute inset-x-0 top-[3px] h-[11px] rounded-[50%]" style={{ background: colour, filter: 'brightness(.82)' }} />
            <div className="absolute inset-x-0 top-0 h-[11px] rounded-[50%]" style={{ background: colour, boxShadow: 'inset 0 2px 0 rgba(255,255,255,.4)' }} />
            <div className="absolute inset-x-3 top-[1.5px] h-[7px] rounded-[50%] bg-[#F6F3EA] shadow-[inset_0_1px_2px_rgba(60,40,20,.3)]" />
          </div>
        )
      })}
    </div>
  )
}

/** Today's eaten plates, stacked on the table. `today` keys the piles so the stack slides away at midnight. */
export function PlateStack({ done, today }: { done: Task[]; today: string }) {
  const sorted = [...done].sort((a, b) => (a.completedAt ?? '').localeCompare(b.completedAt ?? ''))
  const piles = Array.from({ length: Math.max(1, Math.ceil(sorted.length / PILE)) }, (_, i) => sorted.slice(i * PILE, (i + 1) * PILE))

  return (
    <div aria-hidden="true" className="flex shrink-0 items-end xl:self-end xl:pb-3">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={today} className="flex flex-wrap items-end gap-3" exit={{ x: 240, opacity: 0 }} transition={{ duration: 0.3, ease: EASE_OUT }}>
          {piles.map((p, i) => (
            <Pile key={i} plates={p} />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
