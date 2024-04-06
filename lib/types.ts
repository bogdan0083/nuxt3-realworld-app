import type { NuxtError } from '#app'

export type NuxtErrorWithRecord = NuxtError<{ errors: Record<string, string[]> }>
