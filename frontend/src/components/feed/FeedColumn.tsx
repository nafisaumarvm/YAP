export function FeedColumn() {
  return (
    <section className="space-y-3 rounded-3xl border border-zinc-900 bg-zinc-950 p-4">
      <header className="flex items-baseline justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-white">Feed</h2>
          <p className="mt-0.5 text-[11px] text-zinc-500">Latest moments</p>
        </div>
        <span className="rounded-full bg-[#e35c32]/10 px-2 py-0.5 text-[10px] font-medium text-[#ff8a63]">
          live
        </span>
      </header>

      <div className="space-y-2">
        <div className="rounded-2xl border border-zinc-900 bg-black p-3">
          <p className="text-xs text-zinc-400">No new posts yet.</p>
        </div>
        <p className="text-[11px] text-zinc-600">
          Your friends&apos; Wednesday and Sunday posts will appear here.
        </p>
      </div>
    </section>
  )
}

