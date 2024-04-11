import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig ({
  test: {
    fileParallelism: false,
    environmentOptions: {
      nuxt: {
        domEnvironment: 'happy-dom',
        overrides: {
          app: {
            // baseURL: BASE_API_URL,
          },
        },
      },
    },
  },
})
