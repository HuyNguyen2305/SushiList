import { typeOf, type Task } from '../data'

export function Stack({ done }: { done: Task[] }) {
  const shown = done.slice(-9).reverse()
  return (
    <div className="flex items-end gap-4">
      <div className="flex h-44 w-40 flex-col items-center justify-end overflow-hidden">
        {shown.length === 0 && (
          <div className="h-3.5 w-34 rounded-[50%] border-3 border-dashed border-[#B9A184]" />
        )}
        {shown.map((d) => {
          const colour = typeOf(d.sushiTypeId).colour
          return (
            <div key={d.id} className="-mt-[3px] flex flex-col items-center">
              <div
                className="h-3 w-34 rounded-t-md rounded-b-[40px] shadow-[inset_0_3px_0_rgba(255,255,255,.45)]"
                style={{ background: colour }}
              />
              <div className="h-1.5 w-23 rounded-b-md brightness-75" style={{ background: colour }} />
            </div>
          )
        })}
        <div aria-hidden="true" className="mt-1 h-2.5 w-38 rounded bg-[#B07A47]" />
      </div>
      <div className="flex flex-col gap-1.5 pb-1.5">
        <span className="text-sm font-extrabold tracking-wider text-label uppercase">Your stack</span>
        <span className="font-display text-[40px] leading-none font-semibold">{done.length}</span>
        <span className="text-sm text-ink-soft">plates eaten today</span>
      </div>
    </div>
  )
}
