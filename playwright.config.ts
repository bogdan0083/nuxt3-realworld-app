import { fileURLToPath } from 'node:url'
import type { ConfigOptions } from '@nuxt/test-utils/playwright'
import { defineConfig } from '@playwright/test'

export default defineConfig<ConfigOptions>({
  use: {
    nuxt: {
      rootDir: fileURLToPath(new URL('.', import.meta.url)),
    },
  },
  // ...
})
