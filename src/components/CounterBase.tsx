/**
 * The front of the bar: a thick wooden edge that overhangs the plain panel below it, which sits in the
 * edge's shadow above the floor. Wide screens only; its height follows --k like the wall.
 */
export function CounterBase() {
  return (
    <div aria-hidden="true" className="hidden shrink-0 xl:block">
      <div className="h-4 w-full" style={{ background: 'linear-gradient(180deg,#E8B882 0 3px,#C98F55 3px 8px,#8A5A2E 8px 13px,#5B3718 13px)', boxShadow: '0 8px 16px rgba(0,0,0,.55)' }} />
      <div className="relative overflow-hidden" style={{ height: 'calc(44px * var(--k))', background: 'linear-gradient(180deg,#3A2412,#2A190B)' }}>
        {/* the overhang throws a shadow onto the panel */}
        <div className="absolute inset-x-0 top-0 h-6" style={{ background: 'linear-gradient(180deg,rgba(0,0,0,.6),transparent)' }} />
        <div className="absolute inset-0" style={{ background: 'repeating-linear-gradient(90deg,transparent 0 118px,rgba(0,0,0,.28) 118px 120px)' }} />
      </div>
    </div>
  )
}
