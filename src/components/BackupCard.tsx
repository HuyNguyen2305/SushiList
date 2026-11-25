import { useState, type ChangeEvent } from 'react'
import { parseBackup } from '../backup'
import type { Task } from '../data'
import { dayLabel } from '../dates'
import { useStore } from '../store'

export function BackupCard() {
  const storage = useStore((s) => s.storage)
  const exportBackup = useStore((s) => s.exportBackup)
  const importTasks = useStore((s) => s.importTasks)
  const [pending, setPending] = useState<Task[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function onFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = '' // lets the same file be chosen again
    if (!file) return
    const parsed = parseBackup(await file.text())
    setError(parsed.ok ? null : parsed.error)
    setPending(parsed.ok ? parsed.tasks : null)
  }

  const done = async (mode: 'merge' | 'replace') => {
    await importTasks(pending ?? [], mode)
    setPending(null)
  }

  return (
    <section className="rounded-2xl bg-white p-6 shadow-[0_2px_0_#E2CFB4]">
      <h2 className="mb-3 text-sm font-extrabold tracking-wider text-label uppercase">Backup</h2>
      <p className="mb-3 text-sm text-ink-soft">
        Your plates live only in this browser.{' '}
        {storage?.lastBackupAt ? `Last backup: ${dayLabel(storage.lastBackupAt.slice(0, 10))}.` : 'No backup yet.'}
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => void exportBackup()} className="h-11 rounded-xl bg-navy px-3 text-sm font-bold text-white">
          Export backup
        </button>
        <label className="text-sm font-bold">
          <span className="sr-only">Import backup file</span>
          <input
            type="file"
            accept="application/json,.json"
            onChange={(e) => void onFile(e)}
            className="text-sm file:mr-3 file:h-11 file:cursor-pointer file:rounded-xl file:border-0 file:bg-counter file:px-3 file:font-bold"
          />
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
            Found {pending.length} {pending.length === 1 ? 'plate' : 'plates'}. Merge adds the ones you do not have. Replace deletes everything here first.
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
