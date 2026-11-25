import { useEffect, useRef, useState } from 'react'
import type { Task } from '../data'
import { dueLabel } from '../dates'
import { eatPlate } from '../eat'
import { useCategory, useStore } from '../store'
import { Sushi } from './Sushi'
import { TaskForm } from './TaskForm'

function Row({ task }: { task: Task }) {
  const update = useStore((s) => s.update)
  const remove = useStore((s) => s.remove)
  const select = useStore((s) => s.select)
  const selected = useStore((s) => s.selectedId === task.id)
  const type = useCategory(task.sushiTypeId)
  const [editing, setEditing] = useState(false)
  const ref = useRef<HTMLLIElement>(null)

  // Tapping a plate on the belt brings its row into view.
  useEffect(() => {
    if (selected) ref.current?.scrollIntoView?.({ block: 'nearest' })
  }, [selected])

  if (editing) {
    return (
      <li ref={ref}>
        <TaskForm
          className="rounded-lg"
          initial={task}
          submitLabel="Save"
          onSubmit={(input) => {
            void update(task.id, input)
            setEditing(false)
          }}
          onCancel={() => setEditing(false)}
        />
      </li>
    )
  }

  return (
    <li ref={ref} className={`flex items-center gap-2.5 border-b border-dotted border-[#C9B48F] px-1 py-2 ${selected ? 'bg-gold/30' : ''}`}>
      <Sushi id={type.art} className="block h-8 w-9 shrink-0" />
      <button type="button" aria-pressed={selected} onClick={() => select(selected ? null : task.id)} className="min-w-0 flex-1 cursor-pointer border-0 bg-transparent p-0 text-left">
        <p className="m-0 truncate font-extrabold">{task.title}</p>
        <p className="m-0 truncate text-xs text-ink-soft">
          {type.name}
          {task.dueDate && ` · due ${dueLabel(task.dueDate)}`}
          {task.note && ` · ${task.note}`}
        </p>
      </button>
      <button type="button" onClick={() => void eatPlate(task.id)} aria-label={`Eat ${task.title}`} className="h-9 rounded-lg bg-navy px-3 text-sm font-bold text-white">
        Eat
      </button>
      <button type="button" onClick={() => setEditing(true)} aria-label={`Edit ${task.title}`} className="h-9 rounded-lg px-2 text-sm font-bold text-ink-soft underline decoration-dotted underline-offset-2">
        Edit
      </button>
      <button type="button" onClick={() => void remove(task.id)} aria-label={`Delete ${task.title}`} className="h-9 rounded-lg px-2 text-sm font-bold text-tomato underline decoration-dotted underline-offset-2">
        Delete
      </button>
    </li>
  )
}

export function TaskList({ tasks }: { tasks: Task[] }) {
  if (tasks.length === 0) return <p className="m-0 py-3 text-center text-sm text-ink-soft">No open orders.</p>
  return (
    <ul className="m-0 flex list-none flex-col p-0">
      {tasks.map((t) => (
        <Row key={t.id} task={t} />
      ))}
    </ul>
  )
}
