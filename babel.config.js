module.exports = {
  presets: ['@babel/preset-typescript', '@babel/preset-flow'],

  overrides: [
    {
      include: ['./packages/core', './packages/vue'],
      presets: [['@babel/preset-env', { targets: 'defaults, not ie 11' }]],
    },
  ],
}
