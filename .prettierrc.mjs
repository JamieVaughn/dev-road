// .prettierrc.mjs
/** @type {import("prettier").Config} */
export default {
  plugins: ['prettier-plugin-astro'],
  files: ['src/**/*.[jt]s?(x)'],
  overrides: [
    {
      files: ['*.astro'],
      options: {
        parser: 'astro',
      },
    },
  ],
  singleQuote: true,
  semi: false,
  trailingComma: 'always-multiline',
  astroAllowShorthand: true,
};