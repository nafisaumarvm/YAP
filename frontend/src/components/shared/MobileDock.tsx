import { type ReactNode } from 'react'
import { Home, PlusSquare, UserCircle2 } from 'lucide-react'

type Tab = 'feed' | 'upload' | 'profile'

interface MobileDockProps {
  activeTab: Tab
  onChange: (tab: Tab) => void
}

const tabs: Array<{ id: Tab; label: string; icon: ReactNode }> = [
  { id: 'feed', label: 'Feed', icon: <Home className="h-4 w-4" /> },
  { id: 'upload', label: 'Upload', icon: <PlusSquare className="h-4 w-4" /> },
  { id: 'profile', label: 'Profile', icon: <UserCircle2 className="h-4 w-4" /> },
]

export function MobileDock({ activeTab, onChange }: MobileDockProps) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-zinc-900 bg-black/95 px-2 py-2 backdrop-blur md:hidden">
      <div className="mx-auto grid w-full max-w-md grid-cols-3 gap-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 rounded-xl px-3 py-2 text-[11px] font-medium transition ${
                isActive
                  ? 'bg-[#e35c32]/15 text-[#ff8a63]'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

