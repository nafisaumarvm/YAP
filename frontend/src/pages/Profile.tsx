import { useAuth } from '../hooks/useAuth'

export function Profile() {
  const { user } = useAuth()

  return (
    <div className="space-y-4 pb-4 pt-2">
      <section className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/80 to-slate-950/80 p-4 shadow-xl shadow-slate-950/60">
        <h2 className="text-sm font-semibold tracking-tight text-slate-50">
          Profile
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Edit your name, avatar, and timezone here so posting windows and
          expiry behave correctly.
        </p>
      </section>

      <section className="space-y-3 rounded-2xl border border-slate-800/80 bg-slate-950/40 p-4 text-xs text-slate-300">
        {user ? (
          <>
            <div>
              <div className="text-[11px] text-slate-500">Username</div>
              <div className="text-sm font-medium text-slate-50">
                @{user.username}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-500">Email</div>
              <div className="text-sm text-slate-200">{user.email}</div>
            </div>
            <div>
              <div className="text-[11px] text-slate-500">Timezone</div>
              <div className="text-sm text-slate-200">{user.timezone}</div>
            </div>
          </>
        ) : (
          <p>We&apos;ll load your profile once auth is connected.</p>
        )}
      </section>
    </div>
  )
}

