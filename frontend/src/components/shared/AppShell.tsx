import { useState } from 'react'
import { Header } from './Header'
import { FeedColumn } from '../feed/FeedColumn'
import { UploadPanel } from '../upload/UploadPanel'
import { UserColumn } from '../profile/UserColumn'
import { MobileDock } from './MobileDock'

export function AppShell() {
  const [activeTab, setActiveTab] = useState<'feed' | 'upload' | 'profile'>(
    'upload',
  )

  return (
    <div className="flex min-h-screen flex-col bg-black text-zinc-100">
      <Header />
      <main className="flex-1 pb-24 pt-20 md:pb-6">
        <div className="mx-auto h-full w-full max-w-5xl px-4">
          <div className="mb-3 flex items-center justify-between md:hidden">
            <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-600">
              {activeTab === 'feed'
                ? 'Feed'
                : activeTab === 'upload'
                  ? 'Upload'
                  : 'Profile'}
            </span>
            <span className="text-[11px] text-zinc-600">mobile view</span>
          </div>

          <div className="space-y-3 md:hidden">
            {activeTab === 'feed' && <FeedColumn />}
            {activeTab === 'upload' && <UploadPanel />}
            {activeTab === 'profile' && <UserColumn />}
          </div>

          <div className="hidden gap-3 md:grid md:grid-cols-[minmax(0,2fr)_minmax(0,2.2fr)_minmax(0,1.5fr)]">
            <FeedColumn />
            <UploadPanel />
            <UserColumn />
          </div>
        </div>
      </main>
      <MobileDock activeTab={activeTab} onChange={setActiveTab} />
    </div>
  )
}

