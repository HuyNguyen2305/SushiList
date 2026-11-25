import { useEffect, useState } from 'react'
import { dayKey } from './dates'

/** Today's local day key. Flips at local midnight, and re-checks when the tab becomes visible
 *  again (timers are throttled in background tabs). */
export function useToday() {
  const [today, setToday] = useState(dayKey())
  useEffect(() => {
    const tick = () => setToday(dayKey())
    const midnight = new Date()
    midnight.setHours(24, 0, 1, 0)
    const timer = setTimeout(tick, midnight.getTime() - Date.now())
    document.addEventListener('visibilitychange', tick)
    return () => {
      clearTimeout(timer)
      document.removeEventListener('visibilitychange', tick)
    }
  }, [today])
  return today
}
