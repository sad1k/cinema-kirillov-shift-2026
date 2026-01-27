import antfu from '@antfu/eslint-config'

export default antfu({
  nextjs: true,
  typescript: true,

  lessOpinionated: true,

  stylistic: {
    indent: 2,
    quotes: 'single',
  },

  formatters: {
    css: true,
  },

  ignores: [
    'next-env.d.ts',
    'node_modules',
    'pnpm-lock.yaml',
    'pnpm-workspace.yaml',
    'postcss.config.mjs',
    'tailwind.config.ts',
    'tsconfig.json',
    'eslint.config.mjs',
    './src/shared/api/generated',
  ],
})
