import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import { horizontalListSortingStrategy, SortableContext, sortableKeyboardCoordinates, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { motion } from 'motion/react'
import { useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react'
import type { Task } from '../data'
import { EASE_OUT } from '../motion'
import { useStore } from '../store'
import { PlateView } from './Plate'

function SortablePlate({ task }: { task: Task }) {
  const selectedId = useStore((s) => s.selectedId)
  const select = useStore((s) => s.select)
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id })
  return (
    <PlateView
      task={task}
      selected={selectedId === task.id}
      onClick={() => select(selectedId === task.id ? null : task.id)}
      rootRef={setNodeRef}
      rootStyle={{ transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 10 : undefined }}
      data-plate={task.id}
      {...attributes}
      {...listeners}
    />
  )
}

/** Holds the eaten plate's slot while it flies off, then closes the gap so the others slide in.
 *  shortcut: animates width (layout) because a gap has no transform equivalent; it is one element, 300 ms. */
function Gap() {
  return (
    <motion.div
      aria-hidden="true"
      className="shrink-0"
      initial={{ width: 120, marginLeft: 0 }}
      animate={{ width: 0, marginLeft: -18 }}
      transition={{ delay: 0.3, duration: 0.3, ease: EASE_OUT }}
    />
  )
}

const copy = 'flex min-w-[100cqw] shrink-0 gap-[18px] px-[9px]'
const SLOTS = 10 // empty dashed slots pad a short belt, as drawn in the design

function EmptySlot() {
  return (
    <div aria-hidden="true" className="flex h-[100px] w-[120px] shrink-0 items-end justify-center">
      <div className="mb-2 h-[38px] w-[108px] rounded-[50%] border-3 border-dashed border-[#6C707A]" />
    </div>
  )
}

/**
 * The belt is two identical copies side by side that slide left by exactly one copy, so the loop
 * never jumps. The first copy is the real, sortable one; the second is an inert visual clone.
 * Pointer hover, focus, a held touch, a selected plate or a drag all pause it.
 */
export function Belt({ tasks, paused }: { tasks: Task[]; paused: boolean }) {
  const move = useStore((s) => s.move)
  const selectedId = useStore((s) => s.selectedId)
  const flight = useStore((s) => s.flight)
  const [dragging, setDragging] = useState(false)
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 8 } }),
    // Space lifts a plate to reorder it (arrows move it, Space drops); Enter stays free to select it.
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
      keyboardCodes: { start: ['Space'], cancel: ['Escape'], end: ['Space', 'Enter'] },
    }),
  )

  function onDragEnd(e: DragEndEvent) {
    setDragging(false)
    if (e.over && e.active.id !== e.over.id) void move(String(e.active.id), String(e.over.id))
  }

  const slots = (render: (t: Task) => ReactNode) => {
    const nodes = tasks.map(render)
    if (flight) nodes.splice(flight.index, 0, <Gap key={`gap-${flight.task.id}`} />)
    for (let i = tasks.length; i < SLOTS; i++) nodes.push(<EmptySlot key={`empty-${i}`} />)
    return nodes
  }

  // Arrow keys step focus between plates (not while one is lifted: the drag uses them).
  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    const t = e.target as HTMLElement
    if (!t.dataset.plate || t.getAttribute('aria-pressed') === 'true') return
    const all = [...e.currentTarget.querySelectorAll<HTMLElement>('[data-plate]')]
    const next = all[all.indexOf(t) + (e.key === 'ArrowRight' ? 1 : -1)]
    if (next) {
      e.preventDefault()
      next.focus()
    }
  }

  // About one plate width every 3 seconds; at least 11 plates' worth so a short belt is not frantic.
  const seconds = Math.max(tasks.length, 11) * 3

  return (
    <div
      role="group"
      aria-label="Belt of open tasks"
      aria-describedby="belt-help"
      onKeyDown={onKeyDown}
      className="belt @container h-[184px] overflow-hidden border-y-[6px] border-belt-edge bg-belt bg-[repeating-linear-gradient(90deg,rgba(255,255,255,.06)_0_2px,transparent_2px_34px)] pt-3.5 xl:pt-4 motion-reduce:overflow-x-auto"
    >
      <p id="belt-help" className="sr-only">
        Left and right arrows move between plates. Enter selects a plate. E eats it. Space lifts it to reorder, arrows move it, Space drops it. Z undoes the last eat or delete.
      </p>
      <div
        className="belt-track flex w-max"
        data-paused={paused || dragging || selectedId !== null || undefined}
        style={{ '--belt-s': `${seconds}s` } as CSSProperties}
      >
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={() => setDragging(true)} onDragCancel={() => setDragging(false)} onDragEnd={onDragEnd}>
          <SortableContext items={tasks.map((t) => t.id)} strategy={horizontalListSortingStrategy}>
            <div className={copy}>{slots((t) => <SortablePlate key={t.id} task={t} />)}</div>
          </SortableContext>
        </DndContext>
        <div aria-hidden="true" inert className={`${copy} motion-reduce:hidden`}>
          {slots((t) => <PlateView key={t.id} task={t} tabIndex={-1} />)}
        </div>
      </div>
    </div>
  )
}
