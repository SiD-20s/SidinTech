interface StackBadgeProps {
  label: string
  size?: 'sm' | 'md'
}

export function StackBadge({ label, size = 'sm' }: StackBadgeProps) {
  const padding = size === 'sm' ? 'px-[10px] py-[4px]' : 'px-[14px] py-[6px]'
  const fontSize = size === 'sm' ? 'text-[11px]' : 'text-[13px]'

  return (
    <span
      className={`inline-block rounded-full font-satoshi ${padding} ${fontSize} text-ink/60 border border-ink/15 bg-transparent`}
    >
      {label}
    </span>
  )
}
