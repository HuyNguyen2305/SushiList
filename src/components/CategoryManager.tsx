import { useState } from 'react'
import { ARTS, DISH, type Category } from '../data'
import { useStore } from '../store'
import { Modal } from './Modal'

const input = 'h-10 min-w-0 rounded-lg border-2 border-[#D8C6AE] bg-white px-2.5 text-sm font-semibold'
const colourInput = 'size-10 shrink-0 cursor-pointer rounded-lg border-0 bg-transparent p-0'

function ArtSelect({ value, label, onChange }: { value: Category['art']; label: string; onChange: (a: Category['art']) => void }) {
  return (
    <select aria-label={label} value={value} onChange={(e) => onChange(e.target.value as Category['art'])} className={input}>
      {ARTS.map((a) => (
        <option key={a} value={a}>{DISH[a]}</option>
      ))}
    </select>
  )
}

function Row({ c, only }: { c: Category; only: boolean }) {
  const update = useStore((s) => s.updateCategory)
  const remove = useStore((s) => s.removeCategory)
  const [name, setName] = useState(c.name)
  return (
    <li className="flex items-center gap-2">
      <input type="color" aria-label={`${c.name} colour`} value={c.colour} onChange={(e) => void update({ ...c, colour: e.target.value })} className={colourInput} />
      <input
        aria-label={`Name of ${c.name}`}
        value={name}
        maxLength={24}
        onChange={(e) => setName(e.target.value)}
        onBlur={() => (name.trim() ? void update({ ...c, name }) : setName(c.name))}
        className={`${input} flex-1`}
      />
      <ArtSelect value={c.art} label={`Sushi for ${c.name}`} onChange={(art) => void update({ ...c, art })} />
      <button type="button" disabled={only} onClick={() => void remove(c.id)} aria-label={`Delete ${c.name}`} className="h-10 rounded-lg bg-tomato px-3 text-sm font-bold text-white disabled:opacity-40">
        Delete
      </button>
    </li>
  )
}

function Body({ onClose }: { onClose: () => void }) {
  const cats = useStore((s) => s.categories)
  const add = useStore((s) => s.addCategory)
  const [name, setName] = useState('')
  const [colour, setColour] = useState('#3B6FD9')
  const [art, setArt] = useState<Category['art']>('salmon')
  return (
    <>
      <h2 className="m-0 font-display text-xl font-semibold">Categories</h2>
      <p className="m-0 -mt-2 text-sm text-ink-soft">Each category has a colour and a sushi. Deleting one moves its plates to the first category.</p>
      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {cats.map((c) => (
          <Row key={c.id} c={c} only={cats.length === 1} />
        ))}
      </ul>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation() // React bubbles portal events to the order form that opened this dialog
          if (!name.trim()) return
          void add({ name, colour, art })
          setName('')
        }}
        className="flex items-center gap-2 border-t-2 border-[#E2CFB4] pt-4"
      >
        <input type="color" aria-label="New category colour" value={colour} onChange={(e) => setColour(e.target.value)} className={colourInput} />
        <input aria-label="New category name" name="categoryName" autoComplete="off" placeholder="New category, e.g. Study…" value={name} maxLength={24} onChange={(e) => setName(e.target.value)} className={`${input} flex-1`} />
        <ArtSelect value={art} label="Sushi for the new category" onChange={setArt} />
        <button type="submit" className="h-10 rounded-lg bg-navy px-3 text-sm font-extrabold text-white">Add</button>
      </form>
      <div className="flex justify-end">
        <button type="button" onClick={onClose} className="h-11 rounded-xl bg-white px-5 text-sm font-bold">Done</button>
      </div>
    </>
  )
}

export function CategoryManager({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} title="Categories">
      <Body onClose={onClose} />
    </Modal>
  )
}
