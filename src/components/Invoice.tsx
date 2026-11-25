import type { Task } from '../data'
import { dayLabel } from '../dates'
import { Stack } from './Stack'
import { TaskList } from './TaskList'

/**
 * One paper invoice lying on the table: the open orders as line items, and the plates eaten today as the
 * total at the foot, with the receipt behind its button.
 */
export function Invoice({ open, done, today }: { open: Task[]; done: Task[]; today: string }) {
  return (
    <section aria-label="Orders" className="invoice relative flex flex-col gap-2 xl:h-full bg-[#FFFDF6] px-4 pt-3 pb-4 text-ink">
      <header className="flex items-baseline justify-between border-b-2 border-dashed border-[#B9A27A] pb-2 font-mono">
        <h2 className="m-0 text-sm font-extrabold tracking-widest uppercase">Orders</h2>
        <span className="text-xs text-ink-soft">
          {dayLabel(today)} · {open.length} open
        </span>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <TaskList tasks={open} />
      </div>
      <Stack done={done} />
    </section>
  )
}
