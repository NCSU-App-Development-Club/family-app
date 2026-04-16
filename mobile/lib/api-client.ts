import z, { ZodType } from 'zod'

export type ApiClientOptions = {
  method: 'GET' | 'POST'
  headers?: Record<string, string>
  body?: any
}

export async function apiClient(
  endpoint: string,
  options: ApiClientOptions
): Promise<any> {
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}${endpoint}`,
    {
      method: options.method,
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
        ...(options.headers || {}),
      },
      ...(options.body ? { body: JSON.stringify(options.body) } : {}),
    }
  )

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`API error: ${response.status} - ${errorText}`)
  }

  const responseJson = await response.json()

  console.log(responseJson)

  return responseJson
}
