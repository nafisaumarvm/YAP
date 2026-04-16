import { useState, type FormEvent } from 'react'
import { Link, useLocation, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function Login() {
  const { login, isLoading, user } = useAuth()
  const location = useLocation() as { state?: { from?: Location } }
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  if (user) {
    return <Navigate to={location.state?.from?.pathname ?? '/'} replace />
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await login(email, password)
    } catch (err) {
      console.error(err)
      setError('Could not log you in. Double-check your details and try again.')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4 py-8 text-zinc-100">
      <div className="w-full max-w-md">
        <div className="mb-7 text-center">
          <h1 className="text-6xl font-black lowercase leading-none tracking-tight text-[#e35c32]">
            yap
          </h1>
          <p className="mt-2 text-xs text-zinc-500">Sign in</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-3xl border border-zinc-900 bg-zinc-950 p-6"
        >
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-zinc-400">Email</label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-black px-3 py-2 text-sm text-zinc-100 outline-none ring-[#e35c32]/0 transition focus:border-[#e35c32]/70 focus:ring-2 focus:ring-[#e35c32]/30"
              placeholder="you@yap.app"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-zinc-400">Password</label>
            <input
              type="password"
              required
              minLength={8}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-black px-3 py-2 text-sm text-zinc-100 outline-none ring-[#e35c32]/0 transition focus:border-[#e35c32]/70 focus:ring-2 focus:ring-[#e35c32]/30"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-xs font-medium text-rose-400/90">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 w-full rounded-xl bg-[#e35c32] px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-[#f06a3f] disabled:cursor-not-allowed disabled:bg-[#e35c32]/60"
          >
            {isLoading ? 'Signing you in…' : 'Continue'}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-zinc-500">
          New here?{' '}
          <Link
            to="/register"
            className="font-medium text-[#ff8a63] hover:text-[#ffa180]"
          >
            Create your circle
          </Link>
        </p>
      </div>
    </div>
  )
}

