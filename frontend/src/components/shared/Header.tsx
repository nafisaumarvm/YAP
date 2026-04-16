import { useAuth } from '../../hooks/useAuth'

export function Header() {
  const { user } = useAuth()

  return (
    <header className="fixed inset-x-0 top-0 z-20 border-b border-zinc-900 bg-black/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3">
        <div className="flex items-end gap-2">
          <h1 className="text-3xl font-black lowercase leading-none tracking-tight text-[#e35c32]">
            yap
          </h1>
          <span className="mb-1 text-[10px] font-medium uppercase tracking-wider text-zinc-500">
            weekly social
          </span>
        </div>

        <div className="flex items-center gap-2">
          {user && (
            <span className="rounded-full border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-[11px] font-medium text-zinc-300">
              @{user.username}
            </span>
          )}
        </div>
      </div>
    </header>
  )
}

