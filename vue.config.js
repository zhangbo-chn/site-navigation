import path from 'path'

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/www/' : '/',
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [
      ]
    }
  }
}
