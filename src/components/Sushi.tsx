export type SushiId = 'salmon' | 'kappa' | 'tuna' | 'tamago' | 'ikura' | 'ebi'

const FILE: Record<SushiId, string> = {
  salmon: 'salmon-nigiri',
  kappa: 'kappa-maki',
  tuna: 'tuna-nigiri',
  tamago: 'tamago-nigiri',
  ikura: 'ikura-gunkan',
  ebi: 'ebi-nigiri',
}

/** One piece of sushi, drawn by the design's own illustrations in /public/sushi. */
export function Sushi({ id, className = 'block h-[42px] w-12' }: { id: SushiId; className?: string }) {
  return <img src={`/sushi/${FILE[id]}.svg`} alt="" width={48} height={42} className={className} />
}
