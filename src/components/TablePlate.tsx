import { motion, useReducedMotion } from 'motion/react'
import { dueLabel, isOverdue } from '../dates'
import { HAND_CARRY, HAND_REACH } from '../motion'
import { useCategory, useStore } from '../store'
import { PLATE_W, PlateSvg } from './Plate'
import { Sushi } from './Sushi'

const K = 'var(--pk)' // the plate is drawn bigger than the belt's (1.5x, less on short screens) so it reads at a glance

/** Your place at the counter. The plate you picked is set down here, big enough to see what you are about to eat. Wide screens only. */
export function TablePlate() {
  const task = useStore((s) => s.tasks.find((t) => t.id === s.selectedId && t.status === 'open'))
  const type = useCategory(task?.sushiTypeId ?? '')
  const overdue = isOverdue(task?.dueDate)
  const still = useReducedMotion()

  return (
    <div data-table-spot className="pointer-events-none relative z-10 hidden min-h-0 w-full min-w-0 flex-1 flex-col items-center justify-center gap-3 xl:flex">
      <p className="sr-only" aria-live="polite">{task ? `On your table: ${task.title}` : ''}</p>
      {task ? (
        <motion.div
          key={task.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          // appears as the hand lets go of it (see Hand)
          transition={{ delay: still ? 0 : HAND_REACH + HAND_CARRY + (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--hand-lag')) || 0), duration: 0.12 }}
          className="p3d flex flex-col items-center gap-1.5"
        >
          <div data-table-plate className="plate-sway p3d relative" style={{ width: `calc(${PLATE_W}px * ${K})`, height: `calc(100px * ${K})` }}>
            <div aria-hidden="true" className="absolute bottom-0 left-[2%] h-6 w-[96%] rounded-[50%] bg-black/40 blur-md" />
            <div className="plate-tilt p3d absolute inset-0">
              <div className="p3d absolute top-0 left-0 origin-top-left" style={{ width: PLATE_W, height: 100, transform: `scale(${K})` }}>
                <PlateSvg rim={overdue ? '#C7392D' : type.colour} className="absolute bottom-0 left-0" />
                {/* the pieces stand 18px off the plate in 3D, so tilting shows real parallax */}
                <span className="p3d absolute inset-x-0 bottom-[18px] flex items-end justify-center gap-0.5" style={{ transform: 'translateZ(18px)' }}>
                  <Sushi id={type.art} />
                  <Sushi id={type.art} />
                </span>
                <span aria-hidden="true" className="plate-gloss absolute top-[54px] left-0.5 h-[40px] w-[112px] rounded-[50%]" />
              </div>
            </div>
          </div>
          <div className="relative -mt-3 flex max-w-[240px] flex-col items-center gap-0.5 rounded-md bg-[#FBF5E9] px-3 py-1 text-center shadow-contact">
            <span className="max-w-full truncate text-sm font-extrabold">{task.title}</span>
            <span className="text-xs text-ink-soft">
              2 × {type.dish}
              {task.dueDate && ` · ${overdue ? 'overdue' : 'due'} ${dueLabel(task.dueDate)}`}
            </span>
          </div>
        </motion.div>
      ) : null}
    </div>
  )
}
