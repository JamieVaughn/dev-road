// .prettierrc.mjs
/** @type {import("prettier").Config} */
export default {
  plugins: ['prettier-plugin-astro'],
  overrides: [
    {
      files: ['*.astro', '*.ts', '*.tsx', '*.js', '*mjs'],
      options: {
        parser: 'astro',
        semi: false,
        singleQuote: true,
      },
    },
  ],
};