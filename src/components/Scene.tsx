import type { CSSProperties } from 'react'

const abs = (s: CSSProperties): CSSProperties => ({ position: 'absolute', ...s })
const JP = "var(--font-jp)"

const WALL: CSSProperties = {
  backgroundColor: '#573823',
  backgroundImage:
    'repeating-linear-gradient(0deg, rgba(0,0,0,.05) 0 2px, transparent 2px 7px, rgba(255,255,255,.025) 7px 8px, transparent 8px 13px), repeating-linear-gradient(90deg, #5E3D27 0 86px, #3F2716 86px 89px)',
}

function Lantern({ left, text, vertical, delay }: { left: number; text: string; vertical?: boolean; delay?: string }) {
  const cap = { width: 44, height: 10, borderRadius: 3, background: '#1F1F1F' }
  return (
    <div aria-hidden="true" className="sway" style={abs({ left, top: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', animationDelay: delay })}>
      <div style={{ width: 2, height: 26, background: '#1C1008' }} />
      <div style={cap} />
      <div
        style={{
          width: 76,
          height: 96,
          borderRadius: '42% / 50%',
          backgroundColor: '#D23B2E',
          backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,.16) 0 2px, transparent 2px 9px)',
          boxShadow: '0 0 30px rgba(255,120,60,.55), inset -10px 0 14px rgba(0,0,0,.18), inset 10px 0 14px rgba(255,230,180,.18)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFF3DC',
          fontFamily: JP,
          fontSize: vertical ? 22 : 30,
          writingMode: vertical ? 'vertical-rl' : undefined,
        }}
      >
        {text}
      </div>
      <div style={cap} />
      <div style={{ width: 3, height: 14, background: '#1F1F1F' }} />
    </div>
  )
}

const MENU = ['鮭', '鮪', '玉子', '海老', '河童巻', '本日']
const bottle = (w: number, neck: [number, number, string], body: number, color: string, label: [number, number, string]) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <div style={{ width: 10, height: neck[0], background: neck[2], borderRadius: '3px 3px 0 0' }} />
    <div style={{ width: w, height: body, background: color, borderRadius: '10px 10px 4px 4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: label[0], height: label[1], background: label[2] }} />
    </div>
  </div>
)

/** The izakaya behind the counter: noren curtain, sign, lanterns, chef, menu and shelf. Wide screens only. */
export function Scene({ eaten, total, open, chefLine }: { eaten: number; total: number; open: number; chefLine: string }) {
  const today = new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
  const noren: CSSProperties = {
    flex: 1,
    background: '#24304D',
    borderRadius: '0 0 6px 6px',
    backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,.03) 0 1px, transparent 1px 4px)',
  }
  return (
    <header className="hidden xl:block">
      <div className="relative h-[344px] shrink-0 overflow-hidden" style={WALL}>
        <div aria-hidden="true" className="glow" style={abs({ left: 300, top: 40, width: 680, height: 300, borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(255,190,110,.32), rgba(255,190,110,0))' })} />
        <div aria-hidden="true" style={abs({ left: 0, top: 0, width: 1280, height: 28, background: '#2A190E', borderBottom: '4px solid #1C1008', boxShadow: '0 4px 10px rgba(0,0,0,.35)' })} />

        <div style={abs({ left: 44, top: 32, width: 300, display: 'flex', flexDirection: 'column' })}>
          <div aria-hidden="true" style={{ height: 8, background: '#8A5B33', borderRadius: 4 }} />
          <div style={{ position: 'relative', display: 'flex', gap: 5, height: 118 }}>
            <div style={noren} />
            <div style={noren} />
            <div style={noren} />
            <div style={abs({ inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, color: '#fff' })}>
              <span aria-hidden="true" style={{ width: 34, height: 34, borderRadius: '50%', border: '3px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: JP, fontSize: 18 }}>寿</span>
              <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 34, letterSpacing: '.5px' }}>Sushibar</h1>
            </div>
          </div>
        </div>

        <div
          style={abs({
            left: 70, top: 176, width: 248, boxSizing: 'border-box', padding: '12px 16px', backgroundColor: '#D4A46A',
            backgroundImage: 'repeating-linear-gradient(0deg, rgba(120,70,30,.10) 0 1px, transparent 1px 6px)',
            border: '4px solid #7A4E2A', borderRadius: 8, boxShadow: '0 6px 0 #3A2414', display: 'flex', flexDirection: 'column', gap: 4,
          })}
        >
          <span style={{ fontSize: 13, fontWeight: 800, color: '#3A2414' }}>{today} · Open</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 600, color: '#2E1F14' }}>
            {eaten} of {total} eaten
          </span>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#3A2414' }}>{open} orders on the belt</span>
        </div>

        <Lantern left={418} text="酒" />
        <Lantern left={986} text="寿司" vertical delay="-2s" />

        <div aria-hidden="true" style={abs({ left: 1074, top: 34, display: 'flex', gap: 5 })}>
          {MENU.map((m, i) => (
            <div
              key={m}
              style={{
                width: 26, height: 118, background: '#F1E4C8', borderTop: '6px solid #8A5B33', boxShadow: '0 3px 0 rgba(0,0,0,.3)',
                writingMode: 'vertical-rl', fontFamily: JP, fontSize: 16, color: i === 5 ? '#B8321F' : '#2A190E', // a touch darker than the design's #C7392D so it passes 4.5:1 on the cream strip
                display: 'flex', alignItems: 'center', paddingTop: 8, boxSizing: 'border-box',
              }}
            >
              {m}
            </div>
          ))}
        </div>

        <div aria-hidden="true" style={abs({ left: 1068, top: 196, width: 196, display: 'flex', flexDirection: 'column' })}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, padding: '0 8px', height: 104 }}>
            {bottle(30, [22, 0, '#1E5A3A'], 70, '#2F7D55', [20, 30, '#F1E4C8'])}
            {bottle(32, [26, 0, '#3A2414'], 76, '#6B3A1E', [22, 34, '#C7392D'])}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: 14, height: 10, background: '#24304D', borderRadius: 3 }} />
              <div style={{ width: 26, height: 46, background: '#F1E4C8', borderRadius: '12px 12px 6px 6px', border: '2px solid #24304D', boxSizing: 'border-box' }} />
            </div>
            {bottle(30, [20, 0, '#1E2B4A'], 66, '#3B6FD9', [20, 26, '#fff'])}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: 22, height: 30, background: '#F1E4C8', borderRadius: 4, border: '2px solid #8A5B33', boxSizing: 'border-box' }} />
            </div>
          </div>
          <div style={{ height: 10, background: '#8A5B33', borderRadius: 2, boxShadow: '0 4px 0 #2A190E' }} />
        </div>

        <div aria-hidden="true" className="bob" style={abs({ left: 556, top: 104, width: 180, height: 240 })}>
          <div style={abs({ left: 50, top: 0, width: 80, height: 40, background: '#fff', borderRadius: '40px 40px 8px 8px', boxShadow: 'inset 0 -6px 0 #E6E1D6' })} />
          <div style={abs({ left: 46, top: 30, width: 88, height: 86, borderRadius: '50%', background: '#F2C49B' })} />
          <div style={abs({ left: 46, top: 32, width: 88, height: 14, background: '#fff', borderRadius: 6 })} />
          <div style={abs({ left: 70, top: 66, width: 8, height: 10, borderRadius: '50%', background: '#2A190E' })} />
          <div style={abs({ left: 102, top: 66, width: 8, height: 10, borderRadius: '50%', background: '#2A190E' })} />
          <div style={abs({ left: 58, top: 82, width: 14, height: 9, borderRadius: '50%', background: '#F29B8A' })} />
          <div style={abs({ left: 108, top: 82, width: 14, height: 9, borderRadius: '50%', background: '#F29B8A' })} />
          <div style={abs({ left: 78, top: 82, width: 24, height: 12, borderBottom: '4px solid #8A3A2A', borderRadius: '0 0 14px 14px', boxSizing: 'border-box' })} />
          <div style={abs({ left: 10, top: 116, width: 160, height: 130, background: '#fff', borderRadius: '60px 60px 0 0', boxShadow: 'inset 0 -10px 0 #E6E1D6' })} />
          <div style={abs({ left: 70, top: 114, width: 40, height: 34, background: '#24304D', clipPath: 'polygon(0 0, 100% 0, 50% 100%)' })} />
          <div style={abs({ left: 82, top: 114, width: 16, height: 14, background: '#F2C49B', clipPath: 'polygon(0 0, 100% 0, 50% 100%)' })} />
          <div style={abs({ left: 44, top: 172, width: 92, height: 74, background: '#24304D', borderRadius: '6px 6px 0 0' })} />
          <div style={abs({ left: -6, top: 150, width: 40, height: 40, borderRadius: '50%', background: '#F2C49B' })} />
          <div style={abs({ left: 146, top: 150, width: 40, height: 40, borderRadius: '50%', background: '#F2C49B' })} />
        </div>

        <div style={abs({ left: 752, top: 96, width: 210, boxSizing: 'border-box', padding: '12px 14px', background: '#FFFBF2', borderRadius: 16, boxShadow: '0 4px 0 rgba(0,0,0,.3)' })}>
          <span aria-hidden="true" style={abs({ left: -10, top: 26, width: 0, height: 0, borderTop: '9px solid transparent', borderBottom: '9px solid transparent', borderRight: '12px solid #FFFBF2' })} />
          <p role="status" style={{ margin: 0, fontSize: 15, fontWeight: 700, lineHeight: 1.35, color: '#2E1F14' }}>
            {chefLine}
          </p>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="relative h-[26px] shrink-0"
        style={{
          backgroundColor: '#E3C08C',
          backgroundImage: 'repeating-linear-gradient(90deg, rgba(150,100,50,.10) 0 1px, transparent 1px 11px, rgba(150,100,50,.07) 11px 13px, transparent 13px 29px)',
          borderTop: '4px solid #F2D7A9',
          borderBottom: '4px solid #A57A48',
        }}
      >
        <div style={abs({ left: 470, top: -16, width: 120, height: 22, background: '#F3EEE4', borderRadius: 4, boxShadow: '0 3px 0 #A57A48' })} />
        <div style={abs({ left: 700, top: -10, width: 60, height: 16, background: '#C7392D', borderRadius: '50%' })} />
      </div>
    </header>
  )
}

/** Tea cup, chopsticks and soy dish on the counter between the order form and the stack. Wide screens only. */
export function CounterDecor() {
  return (
    <div aria-hidden="true" className="hidden w-[150px] shrink-0 items-end justify-center gap-[18px] pb-2 xl:flex">
      <div className="relative flex flex-col items-center">
        <div className="steam absolute -top-[26px] left-3.5 h-[18px] w-1.5 rounded-[3px] bg-white/70" />
        <div className="steam absolute -top-[26px] left-[26px] h-[18px] w-1.5 rounded-[3px] bg-white/70 [animation-delay:-1.5s]" />
        <div
          className="h-14 w-[46px] rounded-t-lg rounded-b-[14px] bg-[#7D8C6A]"
          style={{ backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,.12) 0 3px, transparent 3px 10px)' }}
        />
      </div>
      <div className="flex flex-col items-center gap-1">
        <div className="h-1.5 w-[70px] -rotate-[8deg] rounded-[3px] bg-[#3A2414]" />
        <div className="h-1.5 w-[70px] -rotate-[4deg] rounded-[3px] bg-[#3A2414]" />
        <div className="flex h-[22px] w-[50px] items-center justify-center rounded-[50%] border-3 border-navy bg-white">
          <div className="h-2.5 w-[30px] rounded-[50%] bg-[#3A2414]" />
        </div>
      </div>
    </div>
  )
}
