import { defineVitestConfig,
} from '@nuxt/test-utils/config'
import { BASE_API_URL } from './lib/constants'

export default defineVitestConfig ({
  test: {
    environmentOptions: {
      nuxt: {
        overrides: {
          app: {
            // baseURL: BASE_API_URL,
          },
        },
      },
    },
  },
})
