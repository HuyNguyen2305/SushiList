import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

/**
 * A native <dialog> opened with showModal (focus trap, Esc and the backdrop come free). It renders into
 * document.body so its inputs never end up inside the page's forms, and mounts its children only while
 * open so every opening starts from fresh state.
 */
export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) d.showModal?.()
    if (!open && d.open) d.close()
  }, [open])
  return createPortal(
    <dialog
      ref={ref}
      aria-label={title}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="m-auto w-[min(560px,92vw)] rounded-2xl bg-[#FBF5E9] p-0 text-ink shadow-[0_12px_40px_rgba(30,16,8,.45)] backdrop:bg-[rgba(30,16,8,.55)]"
    >
      {open && <div className="flex max-h-[85dvh] flex-col gap-4 overflow-y-auto overscroll-contain p-5">{children}</div>}
    </dialog>,
    document.body,
  )
}
