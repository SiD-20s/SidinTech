import { PILLAR_COLOURS, type Pillar } from '@/lib/constants'

interface PillarBadgeProps {
  pillar: Pillar
  label: string
  size?: 'sm' | 'md'
}

export function PillarBadge({ pillar, label, size = 'md' }: PillarBadgeProps) {
  const colour = PILLAR_COLOURS[pillar]

  const padding = size === 'sm' ? 'px-[10px] py-[4px]' : 'px-[16px] py-[6px]'
  const fontSize = size === 'sm' ? 'text-[11px]' : 'text-[13px]'

  return (
    <span
      className={`inline-block rounded-full font-satoshi ${padding} ${fontSize}`}
      style={{
        border: `1.5px solid ${colour}`,
        color: colour,
        backgroundColor: `${colour}1A`,
      }}
    >
      {label}
    </span>
  )
}
