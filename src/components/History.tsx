import type { Task } from '../data'
import { dayLabel, timeLabel } from '../dates'

/** Finished plates from earlier days, newest day first. `done` must already exclude today. */
export function History({ done }: { done: Task[] }) {
  const days = new Map<string, Task[]>()
  for (const t of done) days.set(t.dayKey ?? '', [...(days.get(t.dayKey ?? '') ?? []), t])
  const keys = [...days.keys()].sort().reverse()

  return (
    <section className="rounded-xl bg-white px-4 py-2.5 shadow-[0_1px_0_#E2CFB4,0_6px_10px_-6px_rgba(40,20,5,.3)]">
      <div className="flex items-center gap-2">
        <h2 className="m-0 shrink-0 text-xs font-extrabold tracking-wider text-label uppercase">History</h2>
        {keys.length === 0 && <p className="m-0 truncate text-xs text-ink-soft">Past days show up here after midnight.</p>}
      </div>
      {keys.map((k) => {
        const plates = days.get(k)!.sort((a, b) => (a.completedAt ?? '').localeCompare(b.completedAt ?? ''))
        return (
          <details key={k} className="mt-1.5 border-t border-counter pt-1.5 text-sm">
            <summary className="cursor-pointer font-bold">
              {dayLabel(k)} · {plates.length} {plates.length === 1 ? 'plate' : 'plates'}
            </summary>
            <ul className="m-0 mt-2 flex list-none flex-col gap-1 p-0 text-sm">
              {plates.map((t) => (
                <li key={t.id} className="flex gap-3">
                  <span className="w-16 shrink-0 text-ink-soft">{t.completedAt && timeLabel(t.completedAt)}</span>
                  <span className="font-semibold">{t.title}</span>
                </li>
              ))}
            </ul>
          </details>
        )
      })}
    </section>
  )
}
