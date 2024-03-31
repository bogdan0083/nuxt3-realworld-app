import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  vue: true,
  rules: {
    'eslint-comments/no-unlimited-disable': 'off',
  },
})
