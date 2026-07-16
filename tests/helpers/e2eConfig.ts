export function resolveE2EPort(value: string | undefined): number {
  const port = Number(value ?? '3100')

  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error('E2E_PORT must be an integer between 1 and 65535')
  }

  return port
}

export function resolveE2EBaseURL(value: string | undefined): string | undefined {
  const baseURL = value?.trim()

  if (!baseURL) return undefined

  try {
    const url = new URL(baseURL)

    if (url.protocol === 'http:' || url.protocol === 'https:') return baseURL
  } catch {
    // Use the shared error below for malformed and unsupported URLs.
  }

  throw new Error('E2E_BASE_URL must be an absolute HTTP or HTTPS URL')
}
