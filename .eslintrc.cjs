module.exports = {
  root: true,
  extends: [
    '@nuxt/eslint-config'
  ],
  rules: {
    // Global
    semi: ['warn', 'never'],
    quotes: ['warn', 'single'],
    'quote-props': ['warn', 'as-needed'],
    // Vue
    'vue/multi-word-component-names': 0,
    'vue/max-attributes-per-line': [
      'warn',
      {
        singleline: {
          max: 5
        }
      }
    ],
    'vue/no-v-html': 0
  }
}
