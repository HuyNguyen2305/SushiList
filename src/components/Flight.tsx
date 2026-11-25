import { motion } from 'motion/react'
import { useLayoutEffect, useState } from 'react'
import { typeOf } from '../data'
import { EASE_IN_OUT, EASE_OUT } from '../motion'
import { useStore } from '../store'
import { PlateSvg } from './Plate'
import { Sushi } from './Sushi'

type Target = { dx: number; dy: number; sx: number; sy: number }

/**
 * The key moment: the two pieces pop and vanish (300 ms), then the empty plate lifts off the belt
 * and arcs onto the stack (600 ms), flattening from the plate seen from above into the stack's
 * side-on plate and landing with a slight tilt. transform/opacity only. Skipped under reduced motion.
 */
export function Flight() {
  const flight = useStore((s) => s.flight)
  const end = useStore((s) => s.endFlight)
  const [target, setTarget] = useState<Target | null>(null)

  useLayoutEffect(() => {
    if (!flight) return setTarget(null)
    const land = document.querySelector(`[data-landing="${flight.task.id}"]`)?.getBoundingClientRect()
    if (!land) return end()
    const { from } = flight
    setTarget({
      dx: land.left + land.width / 2 - (from.left + from.width / 2),
      dy: land.top + land.height / 2 - (from.top + from.height / 2),
      sx: land.width / from.width,
      sy: land.height / from.height,
    })
  }, [flight, end])

  if (!flight || !target) return null
  const { from, task } = flight
  const type = typeOf(task.sushiTypeId)

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed z-50"
      style={{ left: from.left, top: from.top, width: from.width, height: from.height }}
      animate={{
        x: [0, target.dx],
        y: [0, -70, target.dy],
        scaleX: [1, target.sx],
        scaleY: [1, target.sy],
        rotate: [0, task.stackTilt ?? 0],
      }}
      transition={{
        delay: 0.3,
        duration: 0.6,
        ease: EASE_IN_OUT,
        // A property-level transition replaces the shared one, so it repeats the delay and duration.
        y: { delay: 0.3, duration: 0.6, times: [0, 0.45, 1], ease: [EASE_IN_OUT, EASE_IN_OUT] },
      }}
      onAnimationComplete={end}
    >
      <PlateSvg rim={type.colour} className="absolute inset-0" />
      <motion.span
        className="absolute inset-x-0 bottom-[18px] flex items-end justify-center gap-0.5"
        animate={{ scale: [1, 1.15, 0], opacity: [1, 1, 0] }}
        transition={{ duration: 0.3, times: [0, 0.3, 1], ease: EASE_OUT }}
      >
        <Sushi id={type.art} />
        <Sushi id={type.art} />
      </motion.span>
    </motion.div>
  )
}
