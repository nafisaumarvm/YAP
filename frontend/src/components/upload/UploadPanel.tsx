import { useMemo, useState, type FormEvent } from 'react'
import { createSundayDump, createWednesdayVideo } from '../../services/posts'

type Mode = 'wednesday' | 'sunday' | 'closed'

function getMode(date: Date): Mode {
  const day = date.getDay()
  if (day === 3) return 'wednesday'
  if (day === 0) return 'sunday'
  return 'closed'
}

export function UploadPanel() {
  const [files, setFiles] = useState<FileList | null>(null)
  const [promptResponse, setPromptResponse] = useState('')
  const [songId, setSongId] = useState('')
  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const mode = useMemo(() => getMode(new Date()), [])

  const title =
    mode === 'wednesday'
      ? "Today's drop · Wednesday video"
      : mode === 'sunday'
        ? "Today's drop · Sunday dump"
        : 'Next drop window'

  const helper =
    mode === 'wednesday'
      ? 'One 2‑minute video from your week. Recorded or uploaded here.'
      : mode === 'sunday'
        ? 'Up to 10 photos/videos. Mix of formats, each up to 2 minutes.'
        : 'Posting unlocks on Wednesdays and Sundays based on your timezone.'

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setStatus(null)

    if (mode === 'closed') {
      setError('Posting is only open on Wednesdays and Sundays.')
      return
    }

    if (!files || files.length === 0) {
      setError('Pick at least one photo or video.')
      return
    }

    if (mode === 'wednesday' && files.length !== 1) {
      setError('Wednesday is one video only. Remove extras and try again.')
      return
    }

    if (mode === 'sunday' && files.length > 10) {
      setError('Sunday dumps are capped at 10 items.')
      return
    }

    const formData = new FormData()

    if (mode === 'wednesday') {
      formData.append('video', files[0])
    } else {
      Array.from(files).forEach((file) => {
        formData.append('files[]', file)
      })
    }

    if (promptResponse.trim()) {
      formData.append('prompt_response', promptResponse.trim())
    }
    if (songId.trim()) {
      formData.append('song_spotify_id', songId.trim())
    }

    try {
      setIsUploading(true)
      setProgress(0)

      if (mode === 'wednesday') {
        await createWednesdayVideo(formData, setProgress)
      } else {
        await createSundayDump(formData, setProgress)
      }

      setStatus('Posted. Your drop is live for 48 hours.')
      setFiles(null)
      setPromptResponse('')
      setSongId('')
    } catch (err) {
      console.error(err)
      setError(
        'Upload failed. Once the backend endpoints are live, this will post for real.',
      )
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <section className="space-y-3 rounded-3xl border border-zinc-900 bg-zinc-950 p-4">
      <header className="flex items-baseline justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-white">{title}</h2>
          <p className="mt-0.5 text-[11px] text-zinc-500">{helper}</p>
        </div>
        {mode !== 'closed' && (
          <span className="rounded-full bg-[#e35c32]/10 px-2 py-0.5 text-[10px] font-medium text-[#ff8a63]">
            {mode === 'wednesday' ? 'Wednesday window' : 'Sunday window'}
          </span>
        )}
      </header>

      <form onSubmit={handleSubmit} className="mt-2 space-y-3 text-xs">
        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-zinc-800 bg-black px-4 py-6 text-center text-zinc-300 transition hover:border-[#e35c32]/40">
          <span className="text-[11px] font-medium text-zinc-200">
            {mode === 'wednesday'
              ? 'Tap to pick your 2‑minute video'
              : mode === 'sunday'
                ? 'Tap to pick up to 10 photos/videos'
                : 'Posting is closed'}
          </span>
          <span className="text-[10px] text-zinc-500">
            {mode === 'wednesday'
              ? 'Max 1 video · 2 minutes'
              : mode === 'sunday'
                ? 'Max 10 items · each up to 2 minutes'
                : 'Come back Wednesday or Sunday'}
          </span>
          <input
            type="file"
            multiple={mode === 'sunday'}
            accept={mode === 'wednesday' ? 'video/*' : 'image/*,video/*'}
            className="mt-2 hidden"
            onChange={(e) => setFiles(e.target.files)}
            disabled={mode === 'closed'}
          />
        </label>

        {files && files.length > 0 && (
          <div className="rounded-2xl border border-zinc-900 bg-black p-3 text-[11px] text-zinc-300">
            <p className="mb-1 font-medium">
              {files.length} {files.length === 1 ? 'file' : 'files'} selected
            </p>
            <ul className="space-y-0.5 text-[10px] text-zinc-500">
              {Array.from(files)
                .slice(0, 3)
                .map((file) => (
                  <li key={file.name}>{file.name}</li>
                ))}
              {files.length > 3 && (
                <li>+ {files.length - 3} more…</li>
              )}
            </ul>
          </div>
        )}

        <div className="space-y-2 rounded-2xl border border-zinc-900 bg-black p-3">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-medium text-zinc-300">
              Weekly prompt response
            </label>
            <textarea
              rows={2}
              value={promptResponse}
              onChange={(e) => setPromptResponse(e.target.value)}
              placeholder="What actually mattered to you this week?"
              className="w-full resize-none rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-[11px] text-zinc-100 outline-none ring-[#e35c32]/0 transition focus:border-[#e35c32]/70 focus:ring-2 focus:ring-[#e35c32]/30"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-medium text-zinc-300">
              Song of the week <span className="text-zinc-600">(optional)</span>
            </label>
            <input
              type="text"
              value={songId}
              onChange={(e) => setSongId(e.target.value)}
              placeholder="spotify:track:… or track id"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-[11px] text-zinc-100 outline-none ring-[#e35c32]/0 transition focus:border-[#e35c32]/70 focus:ring-2 focus:ring-[#e35c32]/30"
            />
          </div>
        </div>

        {progress > 0 && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] text-zinc-500">
              <span>Uploading</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-zinc-900">
              <div
                className="h-full rounded-full bg-[#e35c32] transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {error && (
          <p className="text-[11px] font-medium text-rose-400/90">{error}</p>
        )}
        {status && (
          <p className="text-[11px] font-medium text-emerald-400/90">
            {status}
          </p>
        )}

        <button
          type="submit"
          disabled={isUploading || mode === 'closed'}
          className="mt-1 w-full rounded-xl bg-[#e35c32] px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-[#f06a3f] disabled:cursor-not-allowed disabled:bg-[#e35c32]/50"
        >
          {mode === 'wednesday'
            ? isUploading
              ? 'Posting Wednesday video…'
              : 'Post Wednesday video'
            : mode === 'sunday'
              ? isUploading
                ? 'Posting Sunday dump…'
                : 'Post Sunday dump'
              : 'Posting closed'}
        </button>
      </form>
    </section>
  )
}

