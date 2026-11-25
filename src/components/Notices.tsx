import { useEffect, useState } from 'react'
import { staleBackupDays } from '../storage'
import { useStore } from '../store'

type Notice = { id: string; text: string }

/** The storage warnings that apply right now: the browser refused permanent storage, or the last backup is old. */
function useNotices(): Notice[] {
  const storage = useStore((s) => s.storage)
  if (!storage) return []
  const days = staleBackupDays(storage)
  return [
    !storage.persistGranted && {
      id: 'persist',
      text: "Your browser may clear this app's data if space runs low. Install the app or export a backup.",
    },
    days !== null && {
      id: 'stale',
      text: storage.lastBackupAt ? `It has been ${days} days since your last backup.` : 'You have not backed up your plates yet.',
    },
  ].filter((n): n is Notice => !!n)
}

/** Phones and tablets: a small notice above the belt that can be dismissed. Wide screens get the wall sign instead. */
export function Notices() {
  const startStorage = useStore((s) => s.startStorage)
  const [dismissed, setDismissed] = useState<string[]>([])
  const notices = useNotices().filter((n) => !dismissed.includes(n.id))

  useEffect(() => {
    void startStorage()
  }, [startStorage])

  if (notices.length === 0) return null
  return (
    <aside aria-label="Storage notices" className="flex flex-col xl:hidden">
      {notices.map((n) => (
        <p key={n.id} className="m-0 flex items-center justify-between gap-3 bg-gold px-5 py-1 text-sm font-bold text-ink">
          <span>{n.text}</span>
          <button type="button" onClick={() => setDismissed([...dismissed, n.id])} className="h-11 shrink-0 rounded-xl px-3 font-extrabold underline">
            Dismiss
          </button>
        </p>
      ))}
    </aside>
  )
}

/**
 * Wide screens: the same warnings as a permanent hazard notice pinned to the wall, like the fire-safety
 * signs in a real izakaya. It is part of the room, so it never needs dismissing; the only action on it is
 * the one that makes the warning go away. Drawn at the Scene's 1280px size.
 */
export function WallSign({ left, top }: { left: number; top: number }) {
  const notices = useNotices()
  const exportBackup = useStore((s) => s.exportBackup)
  if (notices.length === 0) return null
  return (
    <aside
      aria-label="Storage notices"
      className="depth-3"
      style={{ position: 'absolute', left, top, width: 212, transform: 'rotate(-1.5deg)', transformOrigin: '50% 0', filter: 'drop-shadow(0 6px 5px rgba(0,0,0,.45))' }}
    >
      <span aria-hidden="true" className="absolute -top-1.5 left-1/2 z-10 size-4 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_35%_30%,#FF8A7A,#C7392D_55%,#7A1D14)] shadow-[0_2px_2px_rgba(0,0,0,.5)]" />
      <div className="overflow-hidden rounded-[3px] border-[3px] border-[#1C1008] bg-[#FFE98A] text-[#2A190E]">
        <div aria-hidden="true" className="flex h-[22px] items-center justify-center bg-[repeating-linear-gradient(-45deg,#1C1008_0_9px,#F5C842_9px_18px)]">
          <span className="bg-[#1C1008] px-2 font-display text-[13px] font-semibold tracking-[.2em] text-[#F5C842]">CAUTION</span>
        </div>
        <div className="flex gap-2.5 px-3 pt-2.5 pb-2">
          <svg aria-hidden="true" viewBox="0 0 40 36" width="34" height="31" className="mt-0.5 shrink-0">
            <path d="M20 3L38 33H2Z" fill="#1C1008" strokeLinejoin="round" stroke="#1C1008" strokeWidth="3" />
            <path d="M20 8L33 30H7Z" fill="#F5C842" />
            <rect x="18.3" y="14" width="3.4" height="9" rx="1.5" fill="#1C1008" />
            <circle cx="20" cy="26.2" r="2" fill="#1C1008" />
          </svg>
          <div className="flex flex-col gap-1.5">
            {notices.map((n) => (
              <p key={n.id} className="m-0 text-[13px] leading-snug font-bold">
                {n.text}
              </p>
            ))}
          </div>
        </div>
        <button type="button" onClick={() => void exportBackup()} className="mx-3 mb-2.5 h-7 cursor-pointer rounded-[3px] border-2 border-[#1C1008] bg-[#1C1008] px-2.5 text-xs font-extrabold tracking-wide text-[#F5C842] uppercase">
          Export backup
        </button>
      </div>
    </aside>
  )
}
