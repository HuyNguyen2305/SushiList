import { useEffect, useRef, useState } from 'react'
import { typeOf, type Task } from '../data'
import { useStore } from '../store'
import { TaskForm } from './TaskForm'

function Row({ task }: { task: Task }) {
  const update = useStore((s) => s.update)
  const remove = useStore((s) => s.remove)
  const selected = useStore((s) => s.selectedId === task.id)
  const [editing, setEditing] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const ref = useRef<HTMLLIElement>(null)

  // Tapping a plate on the belt brings its row into view.
  useEffect(() => {
    if (selected) ref.current?.scrollIntoView?.({ block: 'nearest' })
  }, [selected])

  if (editing) {
    return (
      <li ref={ref}>
        <TaskForm
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
    <li
      ref={ref}
      className={`flex items-center gap-3 rounded-2xl bg-white p-3 shadow-[0_2px_0_#E2CFB4] ${selected ? 'ring-4 ring-gold' : ''}`}
    >
      <span aria-hidden="true" className="size-4 shrink-0 rounded-full" style={{ background: typeOf(task.sushiTypeId).colour }} />
      <div className="min-w-0 flex-1">
        <p className="truncate font-extrabold">{task.title}</p>
        <p className="truncate text-sm text-ink-soft">
          {typeOf(task.sushiTypeId).name}
          {task.dueDate && ` · due ${task.dueDate}`}
          {task.note && ` · ${task.note}`}
        </p>
      </div>
      <button type="button" onClick={() => setEditing(true)} aria-label={`Edit ${task.title}`} className="h-11 rounded-xl bg-counter px-3 text-sm font-bold">
        Edit
      </button>
      <button
        type="button"
        onClick={() => (confirming ? void remove(task.id) : setConfirming(true))}
        onBlur={() => setConfirming(false)}
        aria-label={`${confirming ? 'Confirm delete' : 'Delete'} ${task.title}`}
        className="h-11 rounded-xl bg-tomato px-3 text-sm font-bold text-white"
      >
        {confirming ? 'Sure?' : 'Delete'}
      </button>
    </li>
  )
}

export function TaskList({ tasks }: { tasks: Task[] }) {
  if (tasks.length === 0) return null
  return (
    <ul className="m-0 flex list-none flex-col gap-2 p-0">
      {tasks.map((t) => (
        <Row key={t.id} task={t} />
      ))}
    </ul>
  )
}
