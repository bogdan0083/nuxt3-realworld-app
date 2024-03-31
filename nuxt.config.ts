const silenceSomeSassDeprecationWarnings = {
  verbose: true,
  logger: {
    warn(message: string, options: any) {
      const { stderr } = process
      const span = options.span ?? undefined
      const stack = (options.stack === 'null' ? undefined : options.stack) ?? undefined

      if (message.includes('Using / for division')) {
        // silences above deprecation warning
        return
      }

      if (options.deprecation)
        stderr.write('DEPRECATION ')

      stderr.write(`WARNING: ${message}\n`)

      if (span !== undefined) {
        // output the snippet that is causing this warning
        stderr.write(`\n"${span.text}"\n`)
      }

      if (stack !== undefined) {
        // indent each line of the stack
        stderr.write(`    ${stack.toString().trimEnd().replace(/\n/gm, '\n    ')}\n`)
      }

      stderr.write('\n')
    },
  },
}
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/scss/main.scss'],
  alias: {
    '@generated-api': '/<srcDir>/lib/api/__generated__',
  },
  modules: ['@vueuse/nuxt'],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          ...silenceSomeSassDeprecationWarnings,
        },
        sass: {
          ...silenceSomeSassDeprecationWarnings,
        },
      },
    },
  },
})
