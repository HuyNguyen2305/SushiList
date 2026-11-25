import { MotionConfig } from 'motion/react'
import { useEffect, useState } from 'react'
import { BackupCard } from './components/BackupCard'
import { Belt } from './components/Belt'
import { Flight } from './components/Flight'
import { History } from './components/History'
import { Notices } from './components/Notices'
import { PickedCard } from './components/PickedCard'
import { CounterDecor, Scene } from './components/Scene'
import { Stack } from './components/Stack'
import { TaskForm } from './components/TaskForm'
import { TaskList } from './components/TaskList'
import { Toast } from './components/Toast'
import { SUSHI_TYPES, typeOf } from './data'
import { useStore } from './store'
import { useShortcuts } from './useShortcuts'
import { useToday } from './useToday'

const todayLabel = () => new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })

function BeltControls({ paused, onPause, className = '' }: { paused: boolean; onPause: () => void; className?: string }) {
  const sortByDue = useStore((s) => s.sortByDue)
  return (
    <div className={`gap-2 ${className}`}>
      <button type="button" onClick={() => void sortByDue()} className="h-11 rounded-xl bg-white px-3 text-sm font-bold xl:h-9">
        Sort by due date
      </button>
      <button type="button" aria-pressed={paused} onClick={onPause} className="h-11 rounded-xl bg-navy px-3 text-sm font-bold text-white xl:h-9">
        {paused ? 'Play belt' : 'Pause belt'}
      </button>
    </div>
  )
}

export default function App() {
  const tasks = useStore((s) => s.tasks)
  const ready = useStore((s) => s.ready)
  const error = useStore((s) => s.error)
  const selectedId = useStore((s) => s.selectedId)
  const ate = useStore((s) => s.undoable?.kind === 'eat')
  const load = useStore((s) => s.load)
  const add = useStore((s) => s.add)
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
  const eaten = doneToday.length
  const total = open.length + doneToday.length
  const picked = open.find((t) => t.id === selectedId)

  const chefLine = picked
    ? `Good pick! Two ${typeOf(picked.sushiTypeId).dish.toLowerCase()}, fresh. Eat them when the task is done.`
    : ate
      ? `Oishii! That makes ${eaten} ${eaten === 1 ? 'plate' : 'plates'} today.`
      : open.length
        ? `Irasshaimase! ${open.length} ${open.length === 1 ? 'plate is' : 'plates are'} on the belt for you.`
        : 'The belt is clear. Order something new?'

  return (
    <MotionConfig reducedMotion="user">
      <div className="bg-counter xl:bg-[#2E1D12]">
        <div className="mx-auto flex min-h-dvh max-w-[1280px] flex-col overflow-hidden">
          {/* Phone and tablet header; wide screens get the illustrated bar instead. */}
          <header className="flex items-center justify-between bg-navy px-5 pt-5 pb-3.5 text-white xl:hidden">
            <div>
              <span className="block text-[13px] font-bold text-navy-soft">{todayLabel()}</span>
              <h1 className="m-0 font-display text-3xl font-semibold tracking-wide">Sushibar</h1>
            </div>
            <div className="rounded-full bg-gold px-3.5 py-2 text-sm font-extrabold text-ink">
              {eaten} of {total} eaten
            </div>
          </header>
          <div aria-hidden="true" className="-mt-px flex gap-1.5 px-2.5 xl:hidden [&>:nth-child(n+6)]:hidden">
            {Array.from({ length: 10 }, (_, i) => (
              <div key={i} className="h-4 flex-1 rounded-b-[10px] bg-navy" />
            ))}
          </div>

          <Scene eaten={eaten} total={total} open={open.length} chefLine={chefLine} />

          <Notices />
          {error && (
            <p role="alert" className="m-0 bg-tomato px-5 py-2 text-sm font-bold text-white xl:px-12">
              {error}
            </p>
          )}

          <main className="flex flex-1 flex-col">
            <section className="flex flex-col gap-2 pt-3.5 xl:pt-0">
              <div className="mx-5 flex flex-wrap items-center justify-between gap-2 xl:hidden">
                <h2 className="text-sm font-extrabold tracking-wider text-label uppercase">On the belt · {open.length} orders</h2>
                <BeltControls paused={paused} onPause={() => setPaused(!paused)} className="flex" />
              </div>
              <div className="relative">
                <Belt tasks={open} paused={paused} />
                <BeltControls paused={paused} onPause={() => setPaused(!paused)} className="absolute top-3 right-3 z-10 hidden xl:flex" />
                {ready && open.length === 0 && (
                  <p className="pointer-events-none absolute inset-x-0 top-1/2 m-0 -translate-y-1/2 text-center font-bold text-white">
                    Nothing on the belt. Add your first plate.
                  </p>
                )}
              </div>
            </section>

            <div className="wood-counter flex flex-1 flex-col gap-3.5 p-4 max-xl:pb-36 xl:flex-row xl:gap-6 xl:border-t-8 xl:border-[#D9A066] xl:px-12 xl:pt-5 xl:pb-6">
              <div className="flex flex-col gap-3.5 xl:w-[540px] xl:shrink-0">
                <PickedCard openCount={open.length} />
                <TaskForm
                  compact
                  defaultType={SUSHI_TYPES[tasks.length % SUSHI_TYPES.length].id}
                  submitLabel="Order"
                  onSubmit={(input) => void add(input)}
                  className="max-xl:fixed max-xl:inset-x-0 max-xl:bottom-0 max-xl:z-30 max-xl:shadow-[0_-4px_0_var(--color-wood-edge)] max-xl:px-4 max-xl:pt-3.5 max-xl:pb-[max(1.375rem,env(safe-area-inset-bottom))] xl:rounded-md xl:bg-[#FBF5E9] xl:shadow-[0_4px_0_rgba(60,30,10,.35)] xl:[background-image:repeating-linear-gradient(0deg,transparent_0_27px,rgba(36,48,77,.08)_27px_28px)]"
                />
              </div>
              <CounterDecor />
              <Stack done={doneToday} today={today} />
            </div>

            <div className="grid gap-4 p-4 xl:grid-cols-2 xl:items-start xl:bg-counter xl:px-12 xl:py-6">
              <TaskList tasks={open} />
              <div className="flex flex-col gap-4">
                <History done={earlier} />
                <BackupCard />
              </div>
            </div>
          </main>
        </div>
      </div>
      <Flight />
      <Toast />
    </MotionConfig>
  )
}
