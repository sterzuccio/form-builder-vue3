module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  env: {
    test: {
      presets: [
        ['@vue/cli-plugin-babel/preset', {
          targets: {
            node: 'current'
          }
        }]
      ]
    }
  }
}