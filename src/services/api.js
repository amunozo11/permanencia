export const API = {
  post: async (path, data, isFormData = false) => {
    const opts = {
      method: 'POST',
      headers: isFormData ? {} : { 'Content-Type': 'application/json' },
      body: isFormData ? data : JSON.stringify(data),
    }
    const res = await fetch(`/api${path}`, opts)
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  },
  get: async (path) => {
    const res = await fetch(`/api${path}`)
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  }
}
