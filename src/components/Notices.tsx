import { useEffect, useState } from 'react'
import { staleBackupDays } from '../storage'
import { useStore } from '../store'

/** Gentle storage warnings: the browser refused permanent storage, or the last backup is old. */
export function Notices() {
  const storage = useStore((s) => s.storage)
  const startStorage = useStore((s) => s.startStorage)
  const [dismissed, setDismissed] = useState<string[]>([])

  useEffect(() => {
    void startStorage()
  }, [startStorage])

  if (!storage) return null
  const days = staleBackupDays(storage)
  const notices = [
    !storage.persistGranted && {
      id: 'persist',
      text: "Your browser may clear this app's data if space runs low. Install the app or export a backup.",
    },
    days !== null && {
      id: 'stale',
      text: storage.lastBackupAt ? `It has been ${days} days since your last backup.` : 'You have not backed up your plates yet.',
    },
  ].filter((n): n is { id: string; text: string } => !!n && !dismissed.includes(n.id))

  if (notices.length === 0) return null
  return (
    <aside aria-label="Storage notices" className="flex flex-col">
      {notices.map((n) => (
        <p key={n.id} className="m-0 flex items-center justify-between gap-3 bg-gold px-5 py-1 text-sm font-bold text-ink lg:px-12">
          <span>{n.text}</span>
          <button type="button" onClick={() => setDismissed([...dismissed, n.id])} className="h-11 shrink-0 rounded-xl px-3 font-extrabold underline">
            Dismiss
          </button>
        </p>
      ))}
    </aside>
  )
}
