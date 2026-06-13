interface StackBadgeProps {
  label: string
  size?: 'sm' | 'md'
  variant?: 'default' | 'white'
}

export function StackBadge({ label, size = 'sm', variant = 'default' }: StackBadgeProps) {
  const padding = size === 'sm' ? 'px-[10px] py-[4px]' : 'px-[14px] py-[6px]'
  const fontSize = size === 'sm' ? 'text-[11px]' : 'text-[13px]'
  const colours =
    variant === 'white'
      ? 'text-white/80 border border-white/30 bg-transparent'
      : 'text-ink/60 border border-ink/15 bg-transparent'

  return (
    <span className={`inline-block rounded-full font-satoshi ${padding} ${fontSize} ${colours}`}>
      {label}
    </span>
  )
}
