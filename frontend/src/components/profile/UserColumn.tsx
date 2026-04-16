import { useAuth } from '../../hooks/useAuth'

export function UserColumn() {
  const { user } = useAuth()

  return (
    <section className="space-y-3 rounded-3xl border border-zinc-900 bg-zinc-950 p-4">
      <header>
        <h2 className="text-sm font-semibold tracking-tight text-white">You</h2>
        <p className="mt-0.5 text-[11px] text-zinc-500">Profile + archive</p>
      </header>

      <div className="rounded-2xl border border-zinc-900 bg-black p-3 text-xs text-zinc-300">
        {user ? (
          <div className="space-y-2">
            <div>
              <div className="text-[11px] text-zinc-500">Username</div>
              <div className="text-sm font-medium text-white">
                @{user.username}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-zinc-500">Email</div>
              <div className="text-sm text-zinc-300">{user.email}</div>
            </div>
            <div>
              <div className="text-[11px] text-zinc-500">Timezone</div>
              <div className="text-sm text-zinc-300">{user.timezone}</div>
            </div>
          </div>
        ) : (
          <p className="text-[11px] text-zinc-400">
            We&apos;ll load your profile once auth is fully wired.
          </p>
        )}
      </div>

      <div className="rounded-2xl border border-zinc-900 bg-black p-3 text-[11px] text-zinc-400">
        Your old posts will appear here after they expire.
      </div>
    </section>
  )
}

