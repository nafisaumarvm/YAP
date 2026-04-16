export function WednesdayPost() {
  const today = new Date()
  const isWednesday = today.getDay() === 3

  return (
    <div className="space-y-4 pb-4 pt-2">
      <section className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/80 to-slate-950/80 p-4 shadow-xl shadow-slate-950/60">
        <h2 className="text-sm font-semibold tracking-tight text-slate-50">
          Wednesday video
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Record or upload your 2-minute max video for this Wednesday. This is
          the core weekly touchpoint with your circle.
        </p>
      </section>

      {!isWednesday && (
        <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-100">
          Wednesday videos only unlock on Wednesdays based on your timezone.
          You&apos;ll still be able to preview the recorder UI here while we
          build things out.
        </div>
      )}

      <section className="rounded-2xl border border-dashed border-slate-800/80 bg-slate-950/40 p-6 text-center text-xs text-slate-400">
        Video recorder UI coming next:
        <ul className="mt-3 space-y-1 text-left text-[11px] text-slate-400">
          <li>• Camera access + MediaRecorder</li>
          <li>• 2-minute max timer + live countdown</li>
          <li>• Prompt response + song of the week</li>
          <li>• Upload progress and error states</li>
        </ul>
      </section>
    </div>
  )
}

