import type { ComponentProps, CSSProperties, Ref } from 'react'
import type { Task } from '../data'
import { dueLabel, isOverdue } from '../dates'
import { useCategory } from '../store'
import { Sushi } from './Sushi'

export const PLATE_W = 116
export const PLATE_H = 56 // height of the oval plate itself; the sushi sits above it
const OVERDUE_RIM = '#C7392D'

/** The oval plate seen from slightly above, in its rim colour. */
export function PlateSvg({ rim, className = 'absolute bottom-0 left-0' }: { rim: string; className?: string }) {
  return (
    <svg aria-hidden="true" width={PLATE_W} height={PLATE_H} viewBox="0 0 116 56" className={className}>
      <ellipse cx="58" cy="44" rx="40" ry="10" fill="#000" opacity=".28" />
      <path d="M22 36 Q24 46 58 47 Q92 46 94 36 Z" fill={rim} />
      <path d="M22 36 Q24 46 58 47 Q92 46 94 36 Z" fill="#000" opacity=".22" />
      {/* the plate's thickness: two darker ellipses stacked under the rim */}
      <ellipse cx="58" cy="35" rx="56" ry="20" fill={rim} />
      <ellipse cx="58" cy="35" rx="56" ry="20" fill="#000" opacity=".38" />
      <ellipse cx="58" cy="32.5" rx="56" ry="20" fill={rim} />
      <ellipse cx="58" cy="32.5" rx="56" ry="20" fill="#000" opacity=".16" />
      <ellipse cx="58" cy="30" rx="56" ry="20" fill={rim} />
      <ellipse cx="58" cy="28" rx="55" ry="18.5" fill="#fff" opacity=".18" />
      <ellipse cx="58" cy="30" rx="45" ry="14.5" fill="#FBFAF6" />
      <ellipse cx="58" cy="31.5" rx="38" ry="11" fill="#F0EDE5" />
      <path d="M16 22 Q30 13 52 12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity=".55" />
    </svg>
  )
}

type Props = {
  task: Task
  selected?: boolean
  rootRef?: Ref<HTMLDivElement>
  rootStyle?: CSSProperties
} & ComponentProps<'button'>

export function PlateView({ task, selected, rootRef, rootStyle, ...button }: Props) {
  const type = useCategory(task.sushiTypeId)
  const overdue = isOverdue(task.dueDate)
  return (
    <div ref={rootRef} style={rootStyle} className="relative flex w-[120px] shrink-0 flex-col items-center gap-1.5">
      <button
        type="button"
        aria-label={`Pick plate: ${task.title}${task.dueDate ? `, due ${dueLabel(task.dueDate)}${overdue ? ' (overdue)' : ''}` : ''}`}
        className="relative h-[100px] w-[116px] cursor-pointer border-0 bg-transparent p-0 transition-transform hover:-translate-y-[3px] motion-reduce:transition-none motion-reduce:hover:translate-y-0 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-gold data-[selected]:[filter:drop-shadow(0_0_3px_#fff)_drop-shadow(0_0_8px_#F5C842)]"
        data-selected={selected || undefined}
        {...button}
      >
        <PlateSvg rim={overdue ? OVERDUE_RIM : type.colour} />
        <span className="absolute inset-x-0 bottom-[18px] flex items-end justify-center gap-0.5">
          <Sushi id={type.art} />
          <Sushi id={type.art} />
        </span>
      </button>
      <span className="max-w-[120px] truncate rounded-md bg-white px-2 py-0.5 text-xs font-bold">{task.title}</span>
      {task.dueDate && (
        <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${overdue ? 'bg-tomato text-white' : 'bg-gold text-ink'}`}>
          {overdue ? 'Overdue · ' : 'Due '}
          {dueLabel(task.dueDate)}
        </span>
      )}
    </div>
  )
}
