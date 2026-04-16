import { useState, type FormEvent } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function Register() {
  const { register, isLoading, user } = useAuth()
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  if (user) {
    return <Navigate to="/" replace />
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await register({
        email,
        username,
        password,
        full_name: fullName || undefined,
      })
    } catch (err) {
      console.error(err)
      setError('Could not create your account. Try a different email/username.')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4 py-8 text-zinc-100">
      <div className="w-full max-w-md">
        <div className="mb-7 text-center">
          <h1 className="text-6xl font-black lowercase leading-none tracking-tight text-[#e35c32]">
            yap
          </h1>
          <p className="mt-2 text-xs text-zinc-500">Create account</p>
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-black px-3 py-2 text-sm text-zinc-100 outline-none ring-[#e35c32]/0 transition focus:border-[#e35c32]/70 focus:ring-2 focus:ring-[#e35c32]/30"
              placeholder="you@yap.app"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-zinc-400">Username</label>
            <input
              type="text"
              required
              minLength={3}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-black px-3 py-2 text-sm text-zinc-100 outline-none ring-[#e35c32]/0 transition focus:border-[#e35c32]/70 focus:ring-2 focus:ring-[#e35c32]/30"
              placeholder="yourhandle"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-zinc-400">
              Full name <span className="text-zinc-600">(optional)</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-black px-3 py-2 text-sm text-zinc-100 outline-none ring-[#e35c32]/0 transition focus:border-[#e35c32]/70 focus:ring-2 focus:ring-[#e35c32]/30"
              placeholder="How friends know you"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-zinc-400">Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-black px-3 py-2 text-sm text-zinc-100 outline-none ring-[#e35c32]/0 transition focus:border-[#e35c32]/70 focus:ring-2 focus:ring-[#e35c32]/30"
              placeholder="At least 8 characters"
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
            {isLoading ? 'Creating your circle…' : 'Create account'}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-zinc-500">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-[#ff8a63] hover:text-[#ffa180]"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

