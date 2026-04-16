export function SundayPost() {
  const today = new Date()
  const isSunday = today.getDay() === 0 || today.getDay() === 7 // fallback

  return (
    <div className="space-y-4 pb-4 pt-2">
      <section className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/80 to-slate-950/80 p-4 shadow-xl shadow-slate-950/60">
        <h2 className="text-sm font-semibold tracking-tight text-slate-50">
          Sunday dump
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Upload up to 10 photos and videos to recap your week. These disappear
          48 hours after posting for everyone except you.
        </p>
      </section>

      {!isSunday && (
        <div className="rounded-2xl border border-sky-500/40 bg-sky-500/10 p-3 text-xs text-sky-100">
          Sunday dumps unlock on Sundays in your timezone. We&apos;ll still use
          this screen to build and test the uploader experience.
        </div>
      )}

      <section className="rounded-2xl border border-dashed border-slate-800/80 bg-slate-950/40 p-6 text-center text-xs text-slate-400">
        Sunday dump uploader coming next:
        <ul className="mt-3 space-y-1 text-left text-[11px] text-slate-400">
          <li>• Multi-select photos + videos</li>
          <li>• Drag to reorder grid</li>
          <li>• Per-file validation and progress</li>
          <li>• Prompt response + song of the week</li>
        </ul>
      </section>
    </div>
  )
}

