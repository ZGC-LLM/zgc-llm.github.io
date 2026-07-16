export function resolveE2EPort(value: string | undefined): number {
  const port = Number(value ?? '3100')

  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error('E2E_PORT must be an integer between 1 and 65535')
  }

  return port
}
