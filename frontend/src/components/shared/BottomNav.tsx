import { Link, useLocation } from 'react-router-dom'
import { Plus } from 'lucide-react'

const tabs = [
  { path: '/', label: 'Home', icon: '🏠' },
  { path: '/friends', label: 'Friends', icon: '👥' },
  { path: '/profile', label: 'Profile', icon: '👤' },
  { path: '/settings', label: 'Settings', icon: '⚙️' },
] as const

export function BottomNav() {
  const location = useLocation()

  const isActive = (path: string) =>
    path === '/'
      ? location.pathname === '/'
      : location.pathname.startsWith(path)

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-800 bg-slate-950/90 backdrop-blur">
      <div className="relative mx-auto flex max-w-md items-center justify-between px-6 py-2.5">
        <div className="flex flex-1 items-center justify-between gap-4">
          {tabs.map((tab) => (
            <Link
              key={tab.path}
              to={tab.path}
              className="flex flex-1 flex-col items-center gap-0.5 text-[11px]"
            >
              <span
                className={`rounded-full px-2 py-1 text-base ${
                  isActive(tab.path)
                    ? 'bg-primary-500/20 text-primary-300'
                    : 'text-slate-400'
                }`}
              >
                {tab.icon}
              </span>
              <span
                className={
                  isActive(tab.path)
                    ? 'font-medium text-primary-200'
                    : 'text-slate-500'
                }
              >
                {tab.label}
              </span>
            </Link>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-x-0 -top-6 flex justify-center">
          <div className="pointer-events-auto rounded-full bg-primary-500 p-[3px] shadow-xl shadow-primary-500/40">
            <div className="rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold text-primary-100">
              <Link
                to={
                  new Date().getDay() === 3
                    ? '/post/wednesday'
                    : '/post/sunday'
                }
                className="flex items-center gap-2"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-500 text-[11px] text-white">
                  <Plus className="h-3 w-3" />
                </span>
                <span>New post</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

