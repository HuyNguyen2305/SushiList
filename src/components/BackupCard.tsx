import { useState, type ChangeEvent } from 'react'
import { parseBackup } from '../backup'
import type { Category, Task } from '../data'
import { dayLabel } from '../dates'
import { useStore } from '../store'

export function BackupCard() {
  const storage = useStore((s) => s.storage)
  const exportBackup = useStore((s) => s.exportBackup)
  const importTasks = useStore((s) => s.importTasks)
  const [pending, setPending] = useState<{ tasks: Task[]; categories: Category[] } | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function onFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = '' // lets the same file be chosen again
    if (!file) return
    const parsed = parseBackup(await file.text())
    setError(parsed.ok ? null : parsed.error)
    setPending(parsed.ok ? parsed : null)
  }

  const done = async (mode: 'merge' | 'replace') => {
    await importTasks(pending?.tasks ?? [], mode, pending?.categories)
    setPending(null)
  }

  const btn = 'h-8 shrink-0 rounded-lg px-3 text-xs font-bold'
  return (
    <section className="rounded-xl bg-white px-4 py-2.5 shadow-[0_1px_0_#E2CFB4,0_6px_10px_-6px_rgba(40,20,5,.3)]">
      <div className="flex items-center gap-2">
        <h2 className="m-0 shrink-0 text-xs font-extrabold tracking-wider text-label uppercase">Backup</h2>
        <p className="m-0 min-w-0 flex-1 truncate text-xs text-ink-soft" title="Your plates live only in this browser.">
          {storage?.lastBackupAt ? `Last backup: ${dayLabel(storage.lastBackupAt.slice(0, 10))}.` : 'No backup yet.'}
        </p>
        <button type="button" onClick={() => void exportBackup()} className={`${btn} bg-navy text-white`}>
          Export backup
        </button>
        <label className={`${btn} flex cursor-pointer items-center bg-counter focus-within:outline-2 focus-within:outline-gold`}>
          <span className="sr-only">Import backup file</span>
          <span aria-hidden="true">Import</span>
          <input type="file" accept="application/json,.json" onChange={(e) => void onFile(e)} className="sr-only" />
        </label>
      </div>
      {error && (
        <p role="alert" className="mt-3 text-sm font-bold text-tomato">
          {error}
        </p>
      )}
      {pending && (
        <div role="group" aria-label="Import choice" className="mt-3 flex flex-col gap-2 rounded-xl bg-counter p-3">
          <p className="text-sm font-bold">
            Found {pending.tasks.length} {pending.tasks.length === 1 ? 'plate' : 'plates'}. Merge adds the ones you do not have. Replace deletes everything here first.
          </p>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => void done('merge')} className="h-11 rounded-xl bg-navy px-3 text-sm font-bold text-white">
              Merge
            </button>
            <button type="button" onClick={() => void done('replace')} className="h-11 rounded-xl bg-tomato px-3 text-sm font-bold text-white">
              Replace
            </button>
            <button type="button" onClick={() => setPending(null)} className="h-11 rounded-xl bg-white px-3 text-sm font-bold">
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
