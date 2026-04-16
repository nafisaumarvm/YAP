import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-slate-50">
      <div className="w-full max-w-md text-center">
        <h1 className="text-4xl font-semibold tracking-tight">404</h1>
        <p className="mt-2 text-sm text-slate-400">
          This route doesn&apos;t exist yet. Tap below to head back to your
          feed.
        </p>
        <Link
          to="/"
          className="mt-5 inline-flex items-center justify-center rounded-xl bg-primary-500 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-primary-500/40"
        >
          Back to feed
        </Link>
      </div>
    </div>
  )
}

