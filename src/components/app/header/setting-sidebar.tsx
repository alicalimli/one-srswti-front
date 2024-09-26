import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

interface SidebarNavItem {
  title: string
}

interface SidebarNavProps {
  className?: string
  items: SidebarNavItem[]
  tab: string
  setTab: (tab: string) => void
  [key: string]: any // For any additional props
}

export function SidebarNav({
  className,
  items,
  tab,
  setTab,
  ...props
}: SidebarNavProps) {
  return (
    <nav
      className={cn(
        'text-start grid grid-cols-2 lg:flex m-1 lg:flex-col lg:space-x-0 lg:space-y-1',
        className
      )}
      {...props}
    >
      {items.map((item, i) => (
        <button
          key={i}
          data-ga-label={`Settings: ${item.title} Button`}
          data-ga-category="app_interactions"
          data-ga-track="true"
          onClick={() => setTab(item.title)}
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            tab === item.title
              ? 'bg-muted hover:bg-muted'
              : 'hover:bg-transparent hover:underline',
            'justify-start'
          )}
        >
          {item.title}
        </button>
      ))}
    </nav>
  )
}
