module.exports = {
  presets: ['@babel/preset-typescript'],

  overrides: [
    {
      include: ['./packages/core', './packages/vue'],
      presets: [['@babel/preset-env', { targets: 'defaults, not ie 11' }]],
    },
  ],
}
