export function Feed() {
  return (
    <div className="space-y-4 pb-4 pt-2">
      <section className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/80 to-slate-950/80 p-4 shadow-xl shadow-slate-950/60">
        <h2 className="text-sm font-semibold tracking-tight text-slate-50">
          This week&apos;s feed
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Once the backend is wired up, this will show Wednesday videos and
          Sunday dumps from your 15 closest friends, in order.
        </p>
      </section>

      <section className="rounded-2xl border border-dashed border-slate-800/80 bg-slate-950/40 p-4 text-center">
        <p className="text-xs text-slate-400">
          No posts yet. Hit{' '}
          <span className="rounded-full bg-primary-500/30 px-2 py-0.5 text-[11px] font-semibold text-primary-100">
            New post
          </span>{' '}
          below to drop your Wednesday video or Sunday dump.
        </p>
      </section>
    </div>
  )
}

