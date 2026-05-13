export function LoadingSkeleton({ className = 'h-24' }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-deus-border/60 ${className}`} />
}
