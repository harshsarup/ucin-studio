import { cn } from '@/lib/cn'

/** UCIN Studio wordmark — an ink block mark with a signal-red corner cut;
 *  high-contrast, no gradients. "Studio" sits quieter beside the parent brand. */
export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2.5 select-none', className)}>
      <div className="relative h-7 w-7 flex items-center justify-center" style={{ background: 'var(--fg)' }}>
        <span className="font-bold text-sm leading-none" style={{ color: 'var(--bg)', fontFamily: '"Bricolage Grotesque", Inter, sans-serif' }}>U</span>
        <span className="absolute bottom-0 right-0 h-2 w-2" style={{ background: 'var(--accent)' }} />
      </div>
      <div className="leading-none text-[16px]">
        <span className="font-bold tracking-tight text-fg" style={{ fontFamily: '"Bricolage Grotesque", Inter, sans-serif' }}>UCIN</span>
        <span className="font-medium text-fg-subtle ml-1.5">Studio</span>
      </div>
    </div>
  )
}
