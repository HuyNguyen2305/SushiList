export type SushiId = 'salmon' | 'kappa' | 'tuna' | 'tamago' | 'sake' | 'ebi'

type Piece = { kind: 'nigiri' | 'maki'; fish: string; stripe?: string; band?: boolean }

const PIECES: Record<SushiId, Piece> = {
  salmon: { kind: 'nigiri', fish: '#F48C5B', stripe: '#FFD5BF' },
  kappa: { kind: 'maki', fish: '#6DBB5A' },
  tuna: { kind: 'nigiri', fish: '#D8434E', stripe: '#F2959C' },
  tamago: { kind: 'nigiri', fish: '#F5C842', stripe: '#F5C842', band: true },
  sake: { kind: 'maki', fish: '#F48C5B' },
  ebi: { kind: 'nigiri', fish: '#F7A27A', stripe: '#FFFFFF' },
}

export function Sushi({ id }: { id: SushiId }) {
  const p = PIECES[id]
  if (p.kind === 'maki') {
    return (
      <svg aria-hidden="true" width="30" height="30" viewBox="0 0 30 30">
        <circle cx="15" cy="15" r="15" fill="#1E2B22" />
        <circle cx="15" cy="15" r="11" fill="#FFFDF6" />
        <circle cx="15" cy="15" r="5" fill={p.fish} />
      </svg>
    )
  }
  return (
    <svg aria-hidden="true" width="32" height="30" viewBox="0 0 32 30">
      <rect x="3" y="12" width="26" height="16" rx="8" fill="#FFFDF6" stroke="#E8DFCB" />
      <rect x="0" y="4" width="32" height="13" rx="8" fill={p.fish} />
      <path d="M9 4l-2 13M18 4l-2 13" stroke={p.stripe} strokeWidth="3" />
      {p.band && <rect x="12" y="3" width="8" height="25" rx="2" fill="#1E2B22" />}
    </svg>
  )
}
