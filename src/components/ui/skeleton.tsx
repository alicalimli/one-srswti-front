import { cn } from '@/lib/utils'

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-[8px] bg-primary/60', className)}
      {...props}
    />
  )
}

export { Skeleton }
