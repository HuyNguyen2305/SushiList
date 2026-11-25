import { useId, useState, type FormEvent } from 'react'
import { SUSHI_TYPES, type SushiTypeId, type TaskInput } from '../data'

const field =
  'h-11 min-w-0 rounded-[14px] bg-[#FFF8EE] px-3.5 text-[15px] font-semibold placeholder:text-[#7A6A5C]'

type Props = {
  initial?: TaskInput
  submitLabel: string
  onSubmit: (input: TaskInput) => void
  onCancel?: () => void
  /** The add form: just title + button, with the other fields tucked into a "Details" disclosure. */
  compact?: boolean
  /** Sushi type used when the details are folded away; the add form rotates it so the belt is varied. */
  defaultType?: SushiTypeId
  className?: string
}

export function TaskForm({ initial, submitLabel, onSubmit, onCancel, compact, defaultType, className = '' }: Props) {
  const uid = useId()
  const [showMore, setShowMore] = useState(false)
  function handle(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const d = new FormData(form)
    const title = String(d.get('title')).trim()
    if (!title) return
    onSubmit({
      title,
      // These fields are not in the form while the add form's details are folded away.
      note: String(d.get('note') ?? ''),
      dueDate: String(d.get('dueDate') ?? ''),
      sushiTypeId: String(d.get('sushiTypeId') ?? defaultType ?? SUSHI_TYPES[0].id) as SushiTypeId,
    })
    form.reset()
    setShowMore(false)
  }

  const fields = (
    <div className="flex flex-wrap gap-2">
      <label className="sr-only" htmlFor={`${uid}-sushiTypeId`}>Sushi type</label>
      <select id={`${uid}-sushiTypeId`} name="sushiTypeId" defaultValue={initial?.sushiTypeId ?? defaultType ?? SUSHI_TYPES[0].id} className={field}>
        {SUSHI_TYPES.map((t) => (
          <option key={t.id} value={t.id}>{t.name}</option>
        ))}
      </select>
      <label className="sr-only" htmlFor={`${uid}-dueDate`}>Due date</label>
      <input id={`${uid}-dueDate`} name="dueDate" type="date" defaultValue={initial?.dueDate} className={field} />
      <label className="sr-only" htmlFor={`${uid}-note`}>Note</label>
      <input id={`${uid}-note`} name="note" defaultValue={initial?.note} placeholder="Note (optional)" className={`${field} flex-1`} />
    </div>
  )

  return (
    <form onSubmit={handle} className={`flex flex-col gap-2 bg-wood p-4 ${className}`}>
      <div className="flex items-center gap-2">
        {compact && (
          <span aria-hidden="true" className="hidden px-1.5 font-jp text-lg text-tomato xl:block">
            注文
          </span>
        )}
        <label className="sr-only" htmlFor={`${uid}-title`}>Task title</label>
        <input
          id={`${uid}-title`}
          name="title"
          required
          defaultValue={initial?.title}
          placeholder="New order, e.g. Pay rent"
          className={`${field} flex-1 ${compact ? 'h-12 xl:h-[46px] xl:rounded-[10px] xl:border-2 xl:border-[#D8C6AE] xl:bg-white' : ''}`}
        />
        {compact && (
          <button
            type="button"
            aria-label="More options"
            aria-expanded={showMore}
            onClick={() => setShowMore(!showMore)}
            className="flex size-12 shrink-0 items-center justify-center rounded-[14px] bg-white/70 xl:size-[46px] xl:rounded-[10px]"
          >
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M4 7h10M18 7h2M4 17h2M10 17h10" />
              <circle cx="16" cy="7" r="2" />
              <circle cx="8" cy="17" r="2" />
            </svg>
          </button>
        )}
        <button type="submit" className={`h-11 rounded-[14px] bg-navy px-[18px] text-[15px] font-extrabold text-white ${compact ? 'h-12 xl:h-[46px] xl:rounded-[10px] xl:px-5' : ''}`}>
          {submitLabel}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="h-11 rounded-[14px] bg-white px-3.5 text-[15px] font-bold">
            Cancel
          </button>
        )}
      </div>
      {compact ? showMore && fields : fields}
    </form>
  )
}
