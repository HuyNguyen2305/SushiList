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
import { useState, type CSSProperties } from 'react'
import type { Task } from '../data'
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
      {...attributes}
      {...listeners}
    />
  )
}

const copy = 'flex min-w-[100cqw] shrink-0 gap-[18px] px-[9px]'

/**
 * The belt is two identical copies side by side that slide left by exactly one copy, so the loop
 * never jumps. The first copy is the real, sortable one; the second is an inert visual clone.
 * Pointer hover, focus, a held touch, a selected plate or a drag all pause it.
 */
export function Belt({ tasks, paused }: { tasks: Task[]; paused: boolean }) {
  const move = useStore((s) => s.move)
  const selectedId = useStore((s) => s.selectedId)
  const [dragging, setDragging] = useState(false)
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  function onDragEnd(e: DragEndEvent) {
    setDragging(false)
    if (e.over && e.active.id !== e.over.id) void move(String(e.active.id), String(e.over.id))
  }

  // About one plate width every 3 seconds; at least 11 plates' worth so a short belt is not frantic.
  const seconds = Math.max(tasks.length, 11) * 3

  return (
    <div className="belt @container h-48 overflow-hidden border-y-[6px] border-belt-edge bg-belt py-3.5 motion-reduce:overflow-x-auto">
      <div
        className="belt-track flex w-max"
        data-paused={paused || dragging || selectedId !== null || undefined}
        style={{ '--belt-s': `${seconds}s` } as CSSProperties}
      >
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={() => setDragging(true)} onDragCancel={() => setDragging(false)} onDragEnd={onDragEnd}>
          <SortableContext items={tasks.map((t) => t.id)} strategy={horizontalListSortingStrategy}>
            <div className={copy}>
              {tasks.map((t) => (
                <SortablePlate key={t.id} task={t} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
        <div aria-hidden="true" inert className={`${copy} motion-reduce:hidden`}>
          {tasks.map((t) => (
            <PlateView key={t.id} task={t} tabIndex={-1} />
          ))}
        </div>
      </div>
    </div>
  )
}
