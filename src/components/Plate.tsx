import type { ComponentProps, CSSProperties, Ref } from 'react'
import { typeOf, type Task } from '../data'
import { dueLabel, isOverdue } from '../dates'
import { Sushi } from './Sushi'

type Props = {
  task: Task
  selected?: boolean
  rootRef?: Ref<HTMLDivElement>
  rootStyle?: CSSProperties
} & ComponentProps<'button'>

const OVERDUE_RIM = '#C7392D'

export function PlateView({ task, selected, rootRef, rootStyle, ...button }: Props) {
  const type = typeOf(task.sushiTypeId)
  const overdue = isOverdue(task.dueDate)
  return (
    <div ref={rootRef} style={rootStyle} className="relative flex w-[104px] shrink-0 flex-col items-center gap-1.5">
      <button
        type="button"
        aria-label={`Pick plate: ${task.title}`}
        className="flex size-24 cursor-pointer items-center justify-center gap-1 rounded-full bg-white p-0 shadow-[0_4px_0_rgba(0,0,0,.25)] transition-transform hover:-translate-y-0.5 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-gold data-[selected]:shadow-[0_0_0_4px_#fff,0_0_0_8px_var(--color-gold)]"
        style={{ border: `7px solid ${overdue ? OVERDUE_RIM : type.colour}` }}
        data-selected={selected || undefined}
        {...button}
      >
        <Sushi id={type.art} />
        <Sushi id={type.art} />
      </button>
      <span className="max-w-[104px] truncate rounded-md bg-white px-2 py-0.5 text-xs font-bold">{task.title}</span>
      {task.dueDate && (
        <span
          className={`rounded-md px-2 py-0.5 text-xs font-bold ${overdue ? 'bg-tomato text-white' : 'bg-gold text-ink'}`}
        >
          {overdue ? 'Overdue · ' : 'Due '}
          {dueLabel(task.dueDate)}
        </span>
      )}
    </div>
  )
}
