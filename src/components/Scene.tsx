import type { CSSProperties } from 'react'
import { WallSign } from './Notices'

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
    <div aria-hidden="true" className="sway depth-4" style={abs({ left, top: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', animationDelay: delay })}>
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

/** A shoji-lattice window onto the street at night: moon, stars, a skyline with lit windows, a wooden sill. */
function WindowPane() {
  const bar = (s: CSSProperties) => abs({ background: '#3A2414', ...s })
  const lit = (left: number, top: number) => <div key={`${left}-${top}`} style={abs({ left, top, width: 5, height: 6, background: '#F5C842', boxShadow: '0 0 6px rgba(245,200,66,.8)' })} />
  return (
    <div aria-hidden="true" className="depth-1" style={abs({ left: 24, top: 34, width: 128, height: 152 })}>
      <div style={abs({ inset: 0, background: '#2A190E', borderRadius: 6, boxShadow: '0 6px 0 #1C1008, 0 12px 14px rgba(0,0,0,.45)' })} />
      <div style={abs({ inset: 8, borderRadius: 3, overflow: 'hidden', background: 'linear-gradient(180deg,#121C45 0%,#2B3F7A 58%,#6A6C9C 100%)' })}>
        <div style={abs({ left: 70, top: 14, width: 26, height: 26, borderRadius: '50%', background: '#F7EBC8', boxShadow: '0 0 18px rgba(247,235,200,.75)' })} />
        <div style={abs({ left: 78, top: 11, width: 22, height: 22, borderRadius: '50%', background: '#1B2A5C', opacity: 0.0 })} />
        {[[14, 12], [40, 28], [22, 44], [54, 10], [100, 46]].map(([l, t], i) => (
          <div key={i} className="glow" style={abs({ left: l, top: t, width: 3, height: 3, borderRadius: '50%', background: '#fff', animationDelay: `${-i * 0.9}s` })} />
        ))}
        {/* skyline */}
        <div style={abs({ left: 0, bottom: 0, width: 36, height: 50, background: '#0E1633' })} />
        <div style={abs({ left: 30, bottom: 0, width: 40, height: 34, background: '#141D3F' })} />
        <div style={abs({ left: 64, bottom: 0, width: 30, height: 60, background: '#0E1633' })} />
        <div style={abs({ left: 90, bottom: 0, width: 30, height: 40, background: '#141D3F' })} />
        {lit(8, 80)}
        {lit(22, 94)}
        {lit(40, 98)}
        {lit(72, 76)}
        {lit(84, 92)}
        {lit(100, 98)}
        {/* shoji lattice */}
        <div style={bar({ left: 0, right: 0, top: '50%', height: 5, marginTop: -2 })} />
        <div style={bar({ top: 0, bottom: 0, left: '33%', width: 5 })} />
        <div style={bar({ top: 0, bottom: 0, left: '66%', width: 5 })} />
      </div>
      <div style={abs({ left: -8, bottom: -12, width: 144, height: 13, background: '#8A5B33', borderRadius: 3, boxShadow: '0 4px 0 #2A190E' })} />
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
      <div className="relative shrink-0 overflow-hidden" style={{ ...WALL, height: 'calc(344px * var(--k))' }}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 130% at 50% 40%, transparent 50%, rgba(12,5,0,.5)), linear-gradient(180deg, transparent 62%, rgba(0,0,0,.34))' }} />
      {/* The ceiling beam runs the full width of the screen; the art below keeps its drawn 1280px and scales with --k. */}
      <div aria-hidden="true" className="absolute inset-x-0 top-0 z-10" style={{ height: 'calc(32px * var(--k))', background: '#2A190E', borderBottom: 'calc(4px * var(--k)) solid #1C1008', boxShadow: '0 4px 10px rgba(0,0,0,.35)' }} />
      <div className="relative mx-auto h-[344px] w-[1280px]" style={{ transform: 'scale(var(--k))', transformOrigin: 'top center' }}>
        <div aria-hidden="true" className="glow" style={abs({ left: 300, top: 40, width: 680, height: 300, borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(255,190,110,.32), rgba(255,190,110,0))' })} />

        <div className="depth-2" style={abs({ left: 176, top: 32, width: 300, display: 'flex', flexDirection: 'column' })}>
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
          className="depth-2"
          style={abs({
            left: 202, top: 176, width: 248, boxSizing: 'border-box', padding: '12px 16px', backgroundColor: '#D4A46A',
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

        <Lantern left={506} text="酒" />
        <Lantern left={986} text="寿司" vertical delay="-2s" />

        <div aria-hidden="true" className="depth-2" style={abs({ left: 1074, top: 40, display: 'flex', gap: 5 })}>
          {MENU.map((m, i) => (
            <div
              key={m}
              style={{
                width: 26, height: 88, background: '#F1E4C8', borderTop: '6px solid #8A5B33', boxShadow: '0 3px 0 rgba(0,0,0,.3)',
                writingMode: 'vertical-rl', fontFamily: JP, fontSize: 16, color: i === 5 ? '#B8321F' : '#2A190E', // a touch darker than the design's #C7392D so it passes 4.5:1 on the cream strip
                display: 'flex', alignItems: 'center', paddingTop: 8, boxSizing: 'border-box',
              }}
            >
              {m}
            </div>
          ))}
        </div>

        <WindowPane />

        <div aria-hidden="true" style={abs({ left: 22, top: 222, width: 132, display: 'flex', flexDirection: 'column' })}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, padding: '0 8px', height: 84 }}>
            {bottle(26, [18, 0, '#1E5A3A'], 56, '#2F7D55', [18, 24, '#F1E4C8'])}
            {bottle(28, [20, 0, '#3A2414'], 62, '#6B3A1E', [20, 28, '#C7392D'])}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: 22, height: 28, background: '#F1E4C8', borderRadius: 4, border: '2px solid #8A5B33', boxSizing: 'border-box' }} />
            </div>
            {bottle(26, [16, 0, '#1E2B4A'], 50, '#3B6FD9', [18, 22, '#fff'])}
          </div>
          <div style={{ height: 10, background: '#8A5B33', borderRadius: 2, boxShadow: '0 4px 0 #2A190E' }} />
        </div>

        <WallSign left={1056} top={146} />

        <div aria-hidden="true" className="bob depth-3" style={abs({ left: 556, top: 104, width: 180, height: 240, filter: 'drop-shadow(0 8px 10px rgba(0,0,0,.45))' })}>
          <div style={abs({ left: 50, top: 0, width: 80, height: 40, background: '#fff', borderRadius: '40px 40px 8px 8px', boxShadow: 'inset 0 -6px 0 #E6E1D6' })} />
          <div style={abs({ left: 46, top: 30, width: 88, height: 86, borderRadius: '50%', background: '#F2C49B' })} />
          <div style={abs({ left: 46, top: 32, width: 88, height: 14, background: '#fff', borderRadius: 6 })} />
          <div className="blink" style={abs({ left: 70, top: 66, width: 8, height: 10, borderRadius: '50%', background: '#2A190E' })} />
          <div className="blink" style={abs({ left: 102, top: 66, width: 8, height: 10, borderRadius: '50%', background: '#2A190E' })} />
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
      </div>
    </header>
  )
}

/**
 * What a guest finds on the counter: tea, a tokkuri with two sake cups, a soy dish with wasabi and pickled
 * ginger, and chopsticks on a rest. One drawing, 360 wide, standing on the wood. Wide screens only.
 */
export function CounterDecor() {
  const shadow = 'rgba(40,20,5,.32)'
  return (
    <div aria-hidden="true" className="pointer-events-none relative z-0 hidden w-full max-w-[360px] shrink-0 origin-bottom brightness-[.93] xl:block [@media(max-height:820px)]:!hidden min-[1500px]:scale-[1.3]">
      <div className="steam absolute top-[31%] left-[11%] h-[18px] w-1.5 rounded-[3px] bg-white/70" />
      <div className="steam absolute top-[31%] left-[15%] h-[18px] w-1.5 rounded-[3px] bg-white/70 [animation-delay:-1.5s]" />
      <svg viewBox="0 0 360 130" className="block h-auto w-full">
        {/* tea cup on its saucer */}
        <ellipse cx="54" cy="117" rx="40" ry="5.5" fill={shadow} />
        <ellipse cx="54" cy="114" rx="36" ry="7" fill="#F4EDE0" />
        <ellipse cx="54" cy="112" rx="30" ry="5" fill="#E4D9C4" />
        <path d="M28 70H80V86Q80 110 54 110Q28 110 28 86Z" fill="#7D8C6A" />
        <path d="M28 70H80V86Q80 110 54 110Q28 110 28 86Z" fill="none" stroke="rgba(255,255,255,.14)" strokeWidth="3" strokeDasharray="1 9" />
        <ellipse cx="54" cy="70" rx="26" ry="5.5" fill="#5E6D4D" />
        <ellipse cx="54" cy="71" rx="22" ry="3.8" fill="#B7C48E" />
        <path d="M33 80Q34 100 46 106" stroke="#fff" strokeOpacity=".25" strokeWidth="3" strokeLinecap="round" fill="none" />
        {/* tokkuri */}
        <ellipse cx="132" cy="116" rx="35" ry="5.5" fill={shadow} />
        <path d="M110 114Q100 96 108 78Q113 67 124 64V46H140V64Q151 67 156 78Q164 96 154 114Q132 120 110 114Z" fill="#24304D" />
        <rect x="121" y="43" width="22" height="6" rx="3" fill="#1A2238" />
        <rect x="106" y="86" width="52" height="11" fill="#F4EDE0" opacity=".92" />
        <rect x="106" y="90" width="52" height="3" fill="#D9A441" />
        <path d="M114 74Q112 92 118 106" stroke="#fff" strokeOpacity=".22" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        {/* two ochoko cups */}
        <ellipse cx="184" cy="115" rx="15" ry="3.5" fill={shadow} />
        <path d="M172 96H196L193 114Q184 117 175 114Z" fill="#F4EDE0" />
        <path d="M174 104H194" stroke="#C7392D" strokeWidth="2" />
        <ellipse cx="184" cy="96" rx="12" ry="3.2" fill="#E4D9C4" />
        <ellipse cx="184" cy="96.5" rx="9.5" ry="2.2" fill="#E8DDBF" />
        <ellipse cx="212" cy="117" rx="13" ry="3.2" fill={shadow} />
        <path d="M202 101H222L219.5 117Q212 119.5 204.5 117Z" fill="#F4EDE0" />
        <path d="M204 108H220" stroke="#C7392D" strokeWidth="2" />
        <ellipse cx="212" cy="101" rx="10" ry="2.8" fill="#E4D9C4" />
        <ellipse cx="212" cy="101.4" rx="8" ry="1.9" fill="#E8DDBF" />
        {/* soy dish, wasabi, pickled ginger */}
        <ellipse cx="262" cy="117" rx="32" ry="6" fill={shadow} />
        <ellipse cx="262" cy="114" rx="30" ry="7.5" fill="#F4EDE0" stroke="#D8C6AE" strokeWidth="1.5" />
        <ellipse cx="254" cy="112" rx="15" ry="4" fill="#2A1408" />
        <ellipse cx="250" cy="110.8" rx="6" ry="1.2" fill="#fff" opacity=".25" />
        <path d="M272 110Q276 103 283 107Q288 112 281 115Q273 117 272 110Z" fill="#7FB04A" />
        <path d="M276 109Q280 107 282 110" stroke="#5E8B35" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <ellipse cx="270" cy="117.5" rx="5" ry="1.8" fill="#F2A6A0" />
        <ellipse cx="277" cy="118.5" rx="4.5" ry="1.6" fill="#EC8F8A" />
        {/* chopsticks on a rest */}
        <ellipse cx="324" cy="118" rx="32" ry="5" fill={shadow} />
        <rect x="318" y="108" width="16" height="8" rx="3" fill="#24304D" />
        <path d="M296 122L350 105M298 117L352 100" stroke="#3A2414" strokeWidth="3.2" strokeLinecap="round" />
        <path d="M296 122L316 116M298 117L318 111" stroke="#C7392D" strokeWidth="3.2" strokeLinecap="round" />
      </svg>
    </div>
  )
}
