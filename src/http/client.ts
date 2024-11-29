import Cookies from 'universal-cookie'

export async function getHeaders(headers?: HeadersInit): Promise<HeadersInit> {
  const cookies = new Cookies()
  const token = cookies.get('in-orbit.token')

  if (token) {
    return { ...headers, Authorization: `Bearer ${token}` }
  }

  return headers ?? {}
}

export async function http<T>(path: string, options: RequestInit): Promise<T> {
  const headers = await getHeaders(options.headers)
  const baseUrl = import.meta.env.VITE_BACKEND_URL;

  const url = new URL(path, baseUrl)

  const request = new Request(url, {
    ...options,
    headers,
  })

  const response = await fetch(request)

  if (response.ok) {
    if (response.headers.get('content-type')?.includes('application/json')) {
      const data = await response.json()

      return data as T
    }

    const data = await response.text()

    return data as T
  }

  return Promise.reject(response)
}