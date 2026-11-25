import { MotionConfig } from 'motion/react'
import { useEffect, useState } from 'react'
import { BackupCard } from './components/BackupCard'
import { Belt } from './components/Belt'
import { Flight } from './components/Flight'
import { History } from './components/History'
import { Notices } from './components/Notices'
import { Stack } from './components/Stack'
import { TaskForm } from './components/TaskForm'
import { TaskList } from './components/TaskList'
import { Toast } from './components/Toast'
import { useStore } from './store'
import { useShortcuts } from './useShortcuts'
import { useToday } from './useToday'

const todayLabel = () => new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })

export default function App() {
  const tasks = useStore((s) => s.tasks)
  const ready = useStore((s) => s.ready)
  const error = useStore((s) => s.error)
  const load = useStore((s) => s.load)
  const add = useStore((s) => s.add)
  const sortByDue = useStore((s) => s.sortByDue)
  const [paused, setPaused] = useState(false)
  const today = useToday()
  useShortcuts()

  useEffect(() => {
    void load()
  }, [load])

  const open = tasks.filter((t) => t.status === 'open')
  const done = tasks.filter((t) => t.status === 'done')
  const doneToday = done.filter((t) => t.dayKey === today)
  const earlier = done.filter((t) => t.dayKey !== today)

  return (
    <MotionConfig reducedMotion="user">
      <div className="mx-auto flex min-h-dvh max-w-[1280px] flex-col overflow-hidden">
        <header className="flex items-center justify-between bg-navy px-5 pt-5 pb-3.5 text-white lg:px-12">
          <div>
            <span className="block text-[13px] font-bold text-navy-soft">{todayLabel()}</span>
            <h1 className="m-0 font-display text-3xl font-semibold tracking-wide">Sushibar</h1>
          </div>
          <div className="rounded-full bg-gold px-3.5 py-2 text-sm font-extrabold text-ink">
            {doneToday.length} of {open.length + doneToday.length} eaten
          </div>
        </header>

        <Notices />

        {error && (
          <p role="alert" className="m-0 bg-tomato px-5 py-2 text-sm font-bold text-white lg:px-12">
            {error}
          </p>
        )}

        <main className="flex flex-1 flex-col">
        <section className="flex flex-col gap-2 pt-3.5">
          <div className="mx-5 flex flex-wrap items-center justify-between gap-2 lg:mx-12">
            <h2 className="text-sm font-extrabold tracking-wider text-label uppercase">On the belt · {open.length} orders</h2>
            <div className="flex gap-2">
              <button type="button" onClick={() => void sortByDue()} className="h-11 rounded-xl bg-white px-3 text-sm font-bold">
                Sort by due date
              </button>
              <button
                type="button"
                aria-pressed={paused}
                onClick={() => setPaused(!paused)}
                className="h-11 rounded-xl bg-navy px-3 text-sm font-bold text-white"
              >
                {paused ? 'Play belt' : 'Pause belt'}
              </button>
            </div>
          </div>
          {open.length > 0 ? (
            <Belt tasks={open} paused={paused} />
          ) : (
            <div className="flex h-48 border-y-[6px] border-belt-edge bg-belt">
              {ready && <p className="m-auto font-bold text-white">Nothing on the belt. Add your first plate.</p>}
            </div>
          )}
        </section>

        <div className="flex flex-1 flex-col gap-4 p-4 lg:flex-row lg:px-12 lg:py-6">
          <div className="flex flex-col gap-4 lg:w-[560px]">
            <TaskForm submitLabel="Order" onSubmit={(input) => void add(input)} />
            <TaskList tasks={open} />
          </div>
          <div className="flex flex-1 flex-col gap-4 self-start">
            <section className="rounded-2xl bg-white p-6 shadow-[0_2px_0_#E2CFB4]">
              <Stack done={doneToday} today={today} />
            </section>
            <History done={earlier} />
            <BackupCard />
          </div>
        </div>
        </main>
      </div>
      <Flight />
      <Toast />
    </MotionConfig>
  )
}
