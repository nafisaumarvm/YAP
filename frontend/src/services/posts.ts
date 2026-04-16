import api from './api'

export async function createWednesdayVideo(
  formData: FormData,
  onUploadProgress?: (percentage: number) => void,
) {
  const { data } = await api.post('/api/posts/wednesday-video', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (event) => {
      if (!event.total || !onUploadProgress) return
      const percentage = Math.round((event.loaded * 100) / event.total)
      onUploadProgress(percentage)
    },
  })
  return data
}

export async function createSundayDump(
  formData: FormData,
  onUploadProgress?: (percentage: number) => void,
) {
  const { data } = await api.post('/api/posts/sunday-dump', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (event) => {
      if (!event.total || !onUploadProgress) return
      const percentage = Math.round((event.loaded * 100) / event.total)
      onUploadProgress(percentage)
    },
  })
  return data
}

