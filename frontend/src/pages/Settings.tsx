import { useAuth } from '../hooks/useAuth'

export function Settings() {
  const { logout } = useAuth()

  return (
    <div className="space-y-4 pb-4 pt-2">
      <section className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/80 to-slate-950/80 p-4 shadow-xl shadow-slate-950/60">
        <h2 className="text-sm font-semibold tracking-tight text-slate-50">
          Settings
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          This is where privacy, notifications, and account controls will live.
        </p>
      </section>

      <section className="space-y-3 rounded-2xl border border-slate-800/80 bg-slate-950/40 p-4 text-xs text-slate-300">
        <button
          type="button"
          onClick={logout}
          className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2.5 text-xs font-semibold text-slate-100 shadow-sm shadow-slate-950/60 transition hover:border-rose-500/60 hover:bg-rose-500/10 hover:text-rose-100"
        >
          Log out
        </button>
      </section>
    </div>
  )
}

