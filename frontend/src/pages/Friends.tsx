export function Friends() {
  return (
    <div className="space-y-4 pb-4 pt-2">
      <section className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/80 to-slate-950/80 p-4 shadow-xl shadow-slate-950/60">
        <h2 className="text-sm font-semibold tracking-tight text-slate-50">
          Your 15
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          This is where friend requests, search, and your capped list of 15
          friends will live.
        </p>
      </section>

      <section className="rounded-2xl border border-dashed border-slate-800/80 bg-slate-950/40 p-6 text-xs text-slate-400">
        Friend system coming next:
        <ul className="mt-3 space-y-1 text-left text-[11px] text-slate-400">
          <li>• Send + accept requests</li>
          <li>• Enforce 15-friend hard cap</li>
          <li>• Manage and remove friends</li>
        </ul>
      </section>
    </div>
  )
}

