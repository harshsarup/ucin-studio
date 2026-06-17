import { cn } from '@/lib/cn'

/** UCIN Studio wordmark — the plum mark continues the parent brand, "Studio"
 *  in warm off-white marks the creator product. */
export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2.5 select-none', className)}>
      <div
        className="h-7 w-7 rounded-lg flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #8B5CF6, #6A3CC4)', boxShadow: '0 0 18px rgba(139,92,246,0.45)' }}
      >
        <span className="text-white font-bold text-sm leading-none">U</span>
      </div>
      <div className="leading-none">
        <span className="font-bold tracking-tight text-fg">UCIN</span>
        <span className="font-medium text-fg-subtle ml-1.5">Studio</span>
      </div>
    </div>
  )
}
