module.exports = {
  extends: ['next/core-web-vitals'],
  root: true,
  parserOptions: {
    babelOptions: {
      presets: [require.resolve('next/babel')],
    },
  },
};
