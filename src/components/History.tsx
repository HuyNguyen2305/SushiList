import type { Task } from '../data'
import { dayLabel, timeLabel } from '../dates'

/** Finished plates from earlier days, newest day first. `done` must already exclude today. */
export function History({ done }: { done: Task[] }) {
  const days = new Map<string, Task[]>()
  for (const t of done) days.set(t.dayKey ?? '', [...(days.get(t.dayKey ?? '') ?? []), t])
  const keys = [...days.keys()].sort().reverse()

  return (
    <section className="rounded-2xl bg-white p-6 shadow-[0_2px_0_#E2CFB4]">
      <h2 className="mb-3 text-sm font-extrabold tracking-wider text-label uppercase">History</h2>
      {keys.length === 0 && <p className="text-sm text-ink-soft">Past days show up here after midnight.</p>}
      {keys.map((k) => {
        const plates = days.get(k)!.sort((a, b) => (a.completedAt ?? '').localeCompare(b.completedAt ?? ''))
        return (
          <details key={k} className="border-t border-counter py-2">
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
