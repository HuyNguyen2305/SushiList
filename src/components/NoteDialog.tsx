import { useState } from 'react'
import { Modal } from './Modal'

type Props = { value: string; title: string; onSave: (note: string) => void; onClose: () => void }

function NoteBody({ value, title, onSave, onClose }: Props) {
  const [text, setText] = useState(value)
  const save = () => {
    onSave(text)
    onClose()
  }
  return (
    <>
      <h2 className="m-0 font-display text-xl font-semibold">Note</h2>
      <p className="m-0 -mt-3 truncate text-sm text-ink-soft">{title || 'New order'}</p>
      <label className="sr-only" htmlFor="note-text">Note</label>
      <textarea
        id="note-text"
        autoFocus
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => (e.ctrlKey || e.metaKey) && e.key === 'Enter' && save()}
        placeholder="Details, links, what done looks like…"
        className="h-64 w-full resize-y rounded-xl border-2 border-[#D8C6AE] bg-white p-3 text-[15px] leading-relaxed"
      />
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onClose} className="h-11 rounded-xl bg-white px-4 text-sm font-bold">Cancel</button>
        <button type="button" onClick={save} className="h-11 rounded-xl bg-navy px-5 text-sm font-extrabold text-white">Save note</button>
      </div>
    </>
  )
}

/** A roomy editor for a task's note; the form and picked card only show a short preview. */
export function NoteDialog({ open, ...rest }: Props & { open: boolean }) {
  return (
    <Modal open={open} onClose={rest.onClose} title={`Note for ${rest.title || 'new order'}`}>
      <NoteBody {...rest} />
    </Modal>
  )
}
