const path = require('path')
const resolve = dir => {
  return path.join(__dirname, dir)
}
module.exports = {
  publicPath: './',
  publicPath: './',
	outputDir: 'dist', //打包的目录
	assetsDir: 'assets', //放置生成的静态资源的目录

  chainWebpack: config => {
    config.resolve.alias.set('@', resolve('src'))
  },
  configureWebpack:{
    module:{
      rules: [
        {
          test: /\.js$/,
          include: path.resolve(__dirname, 'src'),
          loader: 'babel-loader',
        },
      ],
    }
  },

  productionSourceMap: false,

  transpileDependencies: [
    'vuetify'
  ],
}
