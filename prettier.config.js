/** @type {import("prettier").Options} */
const config = {
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
  plugins: [require('prettier-plugin-tailwindcss')],
};

module.exports = config;
