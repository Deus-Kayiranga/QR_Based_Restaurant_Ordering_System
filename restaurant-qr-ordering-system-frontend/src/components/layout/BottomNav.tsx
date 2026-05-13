import { NavLink } from 'react-router-dom'
import { cn } from '../../utils/classNames'
import type { NavItem } from './Sidebar'

export function BottomNav({ items }: { items: NavItem[] }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-deus-border bg-white/95 pb-safe md:hidden">
      {items.slice(0, 5).map((item) => {
        const Icon = item.icon
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] text-deus-muted',
                isActive && 'text-deus-primary font-semibold',
              )
            }
          >
            <Icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        )
      })}
    </nav>
  )
}
