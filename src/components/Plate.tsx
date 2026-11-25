import { typeOf, type Task } from '../data'
import { Sushi } from './Sushi'

export function Plate({ task }: { task: Task }) {
  const type = typeOf(task.sushiTypeId)
  return (
    <div className="flex w-[104px] shrink-0 flex-col items-center gap-2">
      <button
        type="button"
        aria-label={`Pick plate: ${task.title}`}
        className="flex size-24 cursor-pointer items-center justify-center gap-1 rounded-full bg-white p-0 shadow-[0_4px_0_rgba(0,0,0,.25)] transition-transform hover:-translate-y-0.5 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-gold"
        style={{ border: `7px solid ${type.colour}` }}
      >
        <Sushi id={type.art} />
        <Sushi id={type.art} />
      </button>
      <span className="max-w-[104px] truncate rounded-md bg-white px-2 py-0.5 text-xs font-bold">
        {task.title}
      </span>
    </div>
  )
}
