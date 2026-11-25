import { useEffect, useRef, useState } from 'react'
import { useStore } from '../store'

const KEY = 'sushibar.timer'

// A timer is either idle/paused (remaining ms) or running (the wall-clock time it ends), so a reload or a
// background tab never makes it drift. It is saved in localStorage, which only costs the timer on a failure.
type Timer = { total: number; remaining: number; endsAt: number | null }
const fresh = (minutes: number): Timer => ({ total: minutes * 60_000, remaining: minutes * 60_000, endsAt: null })

function load(): Timer {
  try {
    const t = JSON.parse(localStorage.getItem(KEY) ?? 'null') as Timer | null
    if (t && Number.isFinite(t.total) && Number.isFinite(t.remaining) && t.total > 0) {
      return t.endsAt && t.endsAt <= Date.now() ? { ...t, endsAt: null, remaining: 0 } : t
    }
  } catch {
    /* fall through to the default */
  }
  return fresh(25)
}

const clock = (ms: number) => {
  const s = Math.ceil(ms / 1000)
  const h = Math.floor(s / 3600)
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, '0')
  const ss = String(s % 60).padStart(2, '0')
  return h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`
}

function beep() {
  try {
    const ctx = new AudioContext()
    for (let i = 0; i < 3; i++) {
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.frequency.value = 880
      g.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.3)
      g.gain.setValueAtTime(0, ctx.currentTime + i * 0.3 + 0.18)
      o.connect(g).connect(ctx.destination)
      o.start(ctx.currentTime + i * 0.3)
      o.stop(ctx.currentTime + i * 0.3 + 0.2)
    }
  } catch {
    /* no audio available: the display still says time is up */
  }
}

const key = 'flex size-8 items-center justify-center rounded-md bg-[#3A4566] text-sm font-extrabold text-white shadow-[0_2px_0_#0E1325] active:translate-y-px active:shadow-none disabled:opacity-40'

/** A small digital timer that sits on the counter: minutes down/up, start or pause, reset. Rings at zero. */
export function TimerCard() {
  const picked = useStore((s) => s.tasks.find((t) => t.id === s.selectedId && t.status === 'open'))
  const [t, setT] = useState(load)
  const [now, setNow] = useState(() => Date.now())
  const rang = useRef(false)

  const remaining = t.endsAt ? Math.max(0, t.endsAt - now) : t.remaining
  const running = t.endsAt !== null && remaining > 0
  const done = t.total > 0 && remaining === 0

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(t))
    } catch {
      /* private mode: the timer just will not survive a reload */
    }
  }, [t])

  useEffect(() => {
    if (!t.endsAt) return
    const id = setInterval(() => setNow(Date.now()), 250)
    return () => clearInterval(id)
  }, [t.endsAt])

  // Rings once when a running timer reaches zero (not when a finished one is restored after a reload).
  useEffect(() => {
    if (t.endsAt && remaining === 0 && !rang.current) {
      rang.current = true
      beep()
      setT((x) => ({ ...x, endsAt: null, remaining: 0 }))
    }
  }, [t.endsAt, remaining])

  // The countdown also shows in the tab title, so it is visible from another tab.
  useEffect(() => {
    document.title = running ? `${clock(remaining)} · Sushibar` : 'Sushibar'
    return () => {
      document.title = 'Sushibar'
    }
  }, [running, remaining])

  const minutes = Math.round(t.total / 60_000)
  const set = (m: number) => {
    rang.current = false
    setT(fresh(Math.min(180, Math.max(1, m))))
  }
  const start = () => {
    rang.current = false
    setNow(Date.now())
    setT((x) => (x.remaining > 0 ? { ...x, endsAt: Date.now() + x.remaining } : { ...x, remaining: x.total, endsAt: Date.now() + x.total }))
  }
  const pause = () => setT((x) => ({ ...x, endsAt: null, remaining }))

  return (
    <section
      aria-label="Timer"
      title={picked ? `Working on: ${picked.title}` : 'Timer'}
      className="flex w-[168px] shrink-0 flex-col gap-1.5 rounded-xl bg-[#2A3350] p-2 shadow-[0_5px_0_rgba(30,16,8,.45),0_9px_10px_rgba(30,16,8,.3)]"
    >
      {/* The faint "88:88" behind the digits is the unlit segments of a real display. */}
      <div
        role="timer"
        aria-label={done ? 'Time is up' : `${clock(remaining)} left`}
        className="relative overflow-hidden rounded-md bg-[#141A2E] px-2 py-1 text-right shadow-[inset_0_2px_5px_rgba(0,0,0,.6)]"
      >
        <span aria-hidden="true" className="absolute inset-0 flex items-center justify-end px-2 font-display text-[30px] leading-none text-gold/10 tabular-nums">
          {clock(remaining).replace(/\d/g, '8')}
        </span>
        <span className={`relative block font-display text-[30px] leading-none tabular-nums ${done ? 'text-tomato' : 'text-gold'}`}>{clock(remaining)}</span>
      </div>
      <div className="flex items-center justify-between gap-1">
        <button type="button" aria-label="5 minutes less" disabled={running || minutes <= 5} onClick={() => set(minutes - 5)} className={key}>
          −
        </button>
        <button type="button" aria-label="5 minutes more" disabled={running} onClick={() => set(minutes + 5)} className={key}>
          +
        </button>
        {running ? (
          <button type="button" onClick={pause} className={`${key} w-12 bg-navy`}>
            Pause
          </button>
        ) : (
          <button type="button" onClick={start} className={`${key} w-12 bg-tomato`}>
            {done ? 'Again' : remaining < t.total ? 'Resume' : 'Start'}
          </button>
        )}
        <button type="button" aria-label="Reset timer" onClick={() => set(minutes)} className={key}>
          ↺
        </button>
      </div>
      <p aria-live="polite" className="sr-only">
        {done ? 'Time is up!' : ''}
      </p>
    </section>
  )
}
