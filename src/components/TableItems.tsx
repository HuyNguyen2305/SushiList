import { useState, type ReactNode } from 'react'
import type { Task } from '../data'
import { BackupCard } from './BackupCard'
import { History } from './History'
import { Modal } from './Modal'

const item = 'group flex w-[78px] cursor-pointer flex-col items-center gap-1 border-0 bg-transparent p-0 text-xs font-extrabold text-ink xl:text-[#FBF5E9] xl:[text-shadow:0_1px_0_rgba(60,30,10,.6)] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-gold'

/** The ledger: a closed navy book with a red spine. */
function Ledger() {
  return (
    <svg viewBox="0 0 64 48" width="64" height="48" aria-hidden="true" className="transition-transform group-hover:-translate-y-0.5 motion-reduce:transition-none">
      <ellipse cx="32" cy="43" rx="28" ry="4" fill="#000" opacity=".3" />
      <path d="M6 38V14L14 8H58V32L50 38Z" fill="#1A2238" />
      <path d="M6 14H50V38H6Z" fill="#24304D" />
      <path d="M50 14L58 8V32L50 38Z" fill="#F4EDE0" />
      <path d="M50 20L58 14M50 26L58 20M50 32L58 26" stroke="#D8C6AE" strokeWidth="1" />
      <rect x="6" y="14" width="7" height="24" fill="#C7392D" />
      <rect x="20" y="20" width="24" height="12" rx="2" fill="#F4EDE0" opacity=".92" />
      <path d="M24 24H40M24 28H36" stroke="#24304D" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

/** The backup box: a two-tier lacquer box with a gold band. */
function LacquerBox() {
  return (
    <svg viewBox="0 0 64 48" width="64" height="48" aria-hidden="true" className="transition-transform group-hover:-translate-y-0.5 motion-reduce:transition-none">
      <ellipse cx="32" cy="43" rx="26" ry="4" fill="#000" opacity=".3" />
      <rect x="10" y="26" width="44" height="16" rx="3" fill="#1C1008" />
      <rect x="10" y="26" width="44" height="5" rx="2" fill="#fff" opacity=".1" />
      <rect x="8" y="10" width="48" height="17" rx="3" fill="#C7392D" />
      <rect x="8" y="10" width="48" height="5" rx="2" fill="#fff" opacity=".18" />
      <rect x="8" y="21" width="48" height="3" fill="#D9A441" />
      <circle cx="32" cy="18" r="2.5" fill="#F5C842" />
    </svg>
  )
}

/** History and backup live on the table as two small objects; each opens in a pop-up. */
export function TableItems({ earlier }: { earlier: Task[] }) {
  const [open, setOpen] = useState<'history' | 'backup' | null>(null)
  const close = () => setOpen(null)
  const body: Record<'history' | 'backup', ReactNode> = {
    history: <History done={earlier} />,
    backup: <BackupCard />,
  }
  return (
    <>
      <div className="flex justify-center gap-3">
        <button type="button" onClick={() => setOpen('history')} className={item}>
          <Ledger />
          History
        </button>
        <button type="button" onClick={() => setOpen('backup')} className={item}>
          <LacquerBox />
          Backup
        </button>
      </div>
      <Modal open={open !== null} onClose={close} title={open === 'backup' ? 'Backup' : 'History'}>
        {open && body[open]}
        <div className="flex justify-end">
          <button type="button" onClick={close} className="h-11 rounded-xl bg-white px-5 text-sm font-bold">Done</button>
        </div>
      </Modal>
    </>
  )
}
