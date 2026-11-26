import { animate } from 'motion/react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { Task } from '../data'
import { isOverdue } from '../dates'
import { EASE_IN_OUT, EASE_OUT, HAND_BACK, HAND_CARRY, HAND_LEAVE, HAND_REACH } from '../motion'
import { useCategory, useStore } from '../store'
import { PlateSvg } from './Plate'
import { Sushi } from './Sushi'

type Pt = { x: number; y: number }
type Step = { task: Task; take: boolean }

/** Where the plate sits on the belt right now (live: the belt keeps moving), kept inside the visible belt. */
function beltSpot(id: string): Pt | null {
  const r = document.querySelector(`[data-plate="${id}"]`)?.getBoundingClientRect()
  const belt = document.querySelector('.belt')?.getBoundingClientRect()
  if (!r || !belt || r.width === 0) return null
  return { x: Math.min(Math.max(r.left, belt.left), belt.right - r.width), y: r.top }
}

/** Top-left of the plate on the table, plus its scale. The plate and its caption are centred in the spot together. */
function tableSpot(): (Pt & { s: number }) | null {
  const el = document.querySelector('[data-table-spot]')
  if (!el) return null
  const r = el.getBoundingClientRect()
  if (r.width === 0) return null
  const s = parseFloat(getComputedStyle(el).getPropertyValue('--pk')) || 1.5
  return { x: r.left + r.width / 2 - 58 * s, y: r.top + r.height / 2 - (100 * s + 34) / 2, s }
}

const lerp = (a: number, b: number, u: number) => a + (b - a) * u

/** A customer's hand reaching up from the bottom of the screen to pinch the plate's near rim. Just the hand and a wrist that fades out; the pinch is at (58, 92) of the 116x100 plate box. */
function HandArt() {
  const skin = '#F2C49B'
  const edge = '#D49E74'
  return (
    <svg aria-hidden="true" width="70" height="120" viewBox="0 0 70 120" className="absolute" style={{ left: 23, top: 66 }}>
      <defs>
        <linearGradient id="wrist-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={skin} />
          <stop offset="1" stopColor={skin} stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="20" y="78" width="30" height="42" fill="url(#wrist-fade)" />
      <rect x="12" y="36" width="46" height="56" rx="18" fill={skin} stroke={edge} strokeWidth="1.5" />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={13 + i * 11.5} y={[12, 2, 0, 10][i]} width="10" height={[38, 44, 44, 36][i]} rx="5" fill={skin} stroke={edge} strokeWidth="1.5" />
      ))}
      <rect x="0" y="40" width="13" height="38" rx="6.5" fill={skin} stroke={edge} strokeWidth="1.5" transform="rotate(30 6 76)" />
    </svg>
  )
}

/** One carry: the hand comes up from the bottom of the screen, lifts the plate between belt and table, lets go and leaves. Imperative: it runs for under a second and tracks the moving belt each frame. */
function Carry({ task, take, done }: { task: Task; take: boolean; done: () => void }) {
  const g = useRef<HTMLDivElement>(null)
  const p = useRef<HTMLDivElement>(null)
  const h = useRef<HTMLDivElement>(null)
  const type = useCategory(task.sushiTypeId)
  const overdue = isOverdue(task.dueDate)

  useLayoutEffect(() => {
    const t = tableSpot()
    const b0 = beltSpot(task.id)
    if (!t || !b0) return done()

    const place = (x: number, y: number, s: number, hand: number, plate: boolean) => {
      g.current!.style.transform = `translate(${x}px,${y}px) scale(${s})`
      p.current!.style.opacity = plate ? '1' : '0'
      h.current!.style.transform = `translateY(${hand}px) rotate(6deg)`
    }
    const away = (y: number, s: number) => (window.innerHeight - y) / s + 20 // local units that take the hand off the bottom of the screen
    const stops: { stop: () => void }[] = []
    const tween = (duration: number, ease: readonly [number, number, number, number], onUpdate: (u: number) => void) => {
      const c = animate(0, 1, { duration, ease: [...ease], onUpdate })
      stops.push(c)
      return c
    }

    // The plate starts where the hand finds it: on the belt when picking, on the table when putting back.
    const from = (): Pt & { s: number } => (take ? { ...(beltSpot(task.id) ?? b0), s: 1 } : t)
    const to = (): Pt & { s: number } => (take ? t : { ...(beltSpot(task.id) ?? b0), s: 1 })

    const run = async () => {
      const a = from()
      place(a.x, a.y, a.s, away(a.y, a.s), !take)
      await tween(HAND_REACH, EASE_OUT, (u) => {
        const f = from()
        place(f.x, f.y, f.s, away(f.y, f.s) * (1 - u), !take)
      })
      const start = from()
      await tween(HAND_CARRY, EASE_IN_OUT, (u) => {
        const e = to()
        place(lerp(start.x, e.x, u), lerp(start.y, e.y, u) - Math.sin(Math.PI * u) * 36, lerp(start.s, e.s, u), 0, true)
      })
      const end = to()
      await tween(HAND_LEAVE, EASE_OUT, (u) => place(end.x, end.y, end.s, away(end.y, end.s) * u, false))
      done()
    }
    run().catch(() => {}) // a stopped tween rejects; the next carry (or unmount) has taken over
    return () => stops.forEach((c) => c.stop())
  }, [task.id, take, done])

  return (
    <div ref={g} aria-hidden="true" className="pointer-events-none fixed top-0 left-0 z-50 h-[100px] w-[116px] origin-top-left">
      <div ref={p} className="absolute inset-0 opacity-0">
        <PlateSvg rim={overdue ? '#C7392D' : type.colour} />
        <span className="absolute inset-x-0 bottom-[18px] flex items-end justify-center gap-0.5">
          <Sushi id={type.art} />
          <Sushi id={type.art} />
        </span>
      </div>
      <div ref={h} className="absolute inset-0" style={{ transformOrigin: '58px 92px' }}>
        <HandArt />
      </div>
    </div>
  )
}

/**
 * Picking a plate: a hand lifts it off the belt and sets it on the table. Unpicking: the hand carries it back to its slot. Picking another while one is out: it puts that one back first.
 * Decorative and wide-screen only (that is where the table plate exists); skipped under reduced motion. Eating has its own flight.
 */
export function Hand() {
  const selectedId = useStore((s) => s.selectedId)
  const prev = useRef<string | null>(null)
  const seq = useRef(0)
  const [run, setRun] = useState<{ n: number; steps: Step[]; i: number } | null>(null)

  // Switching plates delays the new plate's belt/table beats until the old one is back (read by .plate-root and TablePlate).
  // Runs inside set(), before React renders, so the delay is in place when the transitions start.
  useEffect(
    () =>
      useStore.subscribe((s, p) => {
        const switching = s.selectedId && p.selectedId && s.selectedId !== p.selectedId
        document.documentElement.style.setProperty('--hand-lag', switching ? `${HAND_BACK}s` : '0s')
      }),
    [],
  )

  useEffect(() => {
    const before = prev.current
    prev.current = selectedId
    const mq = (q: string) => window.matchMedia?.(q).matches
    if (!mq('(min-width: 80rem)') || mq('(prefers-reduced-motion: reduce)')) return
    const tasks = useStore.getState().tasks
    // An eaten or deleted plate is no longer open, so it is not carried back.
    const open = (id: string | null) => tasks.find((t) => t.id === id && t.status === 'open')
    const back = open(before)
    const take = open(selectedId)
    const steps: Step[] = []
    if (back && back.id !== selectedId) steps.push({ task: back, take: false })
    if (take) steps.push({ task: take, take: true })
    if (steps.length) setRun({ n: ++seq.current, steps, i: 0 })
  }, [selectedId])

  if (!run) return null
  const { n, steps, i } = run
  const next = () => setRun((r) => (r?.n !== n ? r : i + 1 < steps.length ? { ...r, i: i + 1 } : null))
  return <Carry key={`${n}-${i}`} task={steps[i].task} take={steps[i].take} done={next} />
}
