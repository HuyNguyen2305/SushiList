import { useEffect } from 'react'

/**
 * Feeds the pointer's position (-1..1 across the window) to CSS as --px and --py, once per frame. The wall's
 * layers (.depth-1 to .depth-4), the table plate's tilt and nothing else read it, so no React render happens
 * on a mouse move. Only a precise pointer drives it, and never under reduced motion.
 */
export function Depth() {
  useEffect(() => {
    // matchMedia is missing in some environments (tests); there the wall simply stays still
    const fine = window.matchMedia?.('(pointer: fine) and (prefers-reduced-motion: no-preference)')
    if (!fine?.matches) return
    let frame = 0
    const root = document.documentElement
    const move = (e: PointerEvent) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        root.style.setProperty('--px', String(Math.max(-1, Math.min(1, (e.clientX / innerWidth) * 2 - 1))))
        root.style.setProperty('--py', String(Math.max(-1, Math.min(1, (e.clientY / innerHeight) * 2 - 1))))
      })
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => {
      window.removeEventListener('pointermove', move)
      cancelAnimationFrame(frame)
    }
  }, [])
  return null
}
