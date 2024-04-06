export const apiFetch = $fetch.create({
  baseURL: 'https://api.realworld.io/api',
  headers: {
    'Content-Type': 'application/json',
  },
  async onRequest({ options }) {
    const token = useCookie('token').value

    if (options.headers === undefined)
      options.headers = {}

    if (token)
      (options.headers as Record<string, string>).Authorization = `Token ${token}`
  },
})
