const IMGHIPPO_UPLOAD_URL = 'https://api.imghippo.com/v1/upload'

export async function uploadToImgHippo(fileBuffer, filename, mimeType) {
  const apiKey = process.env.IMGHIPPO_API_KEY
  if (!apiKey) {
    throw new Error('IMGHIPPO_API_KEY is not set on the server')
  }

  const formData = new FormData()
  formData.append('api_key', apiKey)
  formData.append('file', new Blob([fileBuffer], { type: mimeType }), filename)

  const res = await fetch(IMGHIPPO_UPLOAD_URL, {
    method: 'POST',
    body: formData,
  })

  const data = await res.json().catch(() => null)
  if (!res.ok || !data?.success) {
    throw new Error(data?.message || `ImgHippo upload failed with status ${res.status}`)
  }

  return data.data.url
}
