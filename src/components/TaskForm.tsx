import { useId, type FormEvent } from 'react'
import { SUSHI_TYPES, type SushiTypeId, type TaskInput } from '../data'

const field =
  'h-11 min-w-0 rounded-[14px] bg-[#FFF8EE] px-3.5 text-[15px] font-semibold placeholder:text-[#7A6A5C]'

type Props = {
  initial?: TaskInput
  submitLabel: string
  onSubmit: (input: TaskInput) => void
  onCancel?: () => void
}

export function TaskForm({ initial, submitLabel, onSubmit, onCancel }: Props) {
  const uid = useId()
  function handle(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const d = new FormData(form)
    const title = String(d.get('title')).trim()
    if (!title) return
    onSubmit({
      title,
      note: String(d.get('note')),
      dueDate: String(d.get('dueDate')),
      sushiTypeId: String(d.get('sushiTypeId')) as SushiTypeId,
    })
    form.reset()
  }

  return (
    <form onSubmit={handle} className="flex flex-col gap-2 rounded-2xl bg-wood p-4 shadow-[0_4px_0_var(--color-wood-edge)]">
      <div className="flex gap-2">
        <label className="sr-only" htmlFor={`${uid}-title`}>Task title</label>
        <input id={`${uid}-title`} name="title" required defaultValue={initial?.title} placeholder="New order, e.g. Pay rent" className={`${field} flex-1`} />
        <button type="submit" className="h-11 rounded-[14px] bg-navy px-[18px] text-[15px] font-extrabold text-white">
          {submitLabel}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="h-11 rounded-[14px] bg-white px-3.5 text-[15px] font-bold">
            Cancel
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        <label className="sr-only" htmlFor={`${uid}-sushiTypeId`}>Sushi type</label>
        <select id={`${uid}-sushiTypeId`} name="sushiTypeId" defaultValue={initial?.sushiTypeId ?? SUSHI_TYPES[0].id} className={field}>
          {SUSHI_TYPES.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
        <label className="sr-only" htmlFor={`${uid}-dueDate`}>Due date</label>
        <input id={`${uid}-dueDate`} name="dueDate" type="date" defaultValue={initial?.dueDate} className={field} />
        <label className="sr-only" htmlFor={`${uid}-note`}>Note</label>
        <input id={`${uid}-note`} name="note" defaultValue={initial?.note} placeholder="Note (optional)" className={`${field} flex-1`} />
      </div>
    </form>
  )
}
