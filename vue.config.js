import path from 'path'

module.exports = {
  publicPath: './',
  assetsDir: 'public',
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [
        path.resolve(__dirname, 'src/global.scss')
      ]
    }
  }
}
