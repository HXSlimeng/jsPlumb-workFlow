const path = require('path')
const resolve = dir => {
  return path.join(__dirname, dir)
}
module.exports = {
  publicPath: './',
  publicPath: './',
	outputDir: 'dist', //打包的目录
	assetsDir: 'assets', //放置生成的静态资源的目录
  devServer: {
    proxy: { //设置代理
			'/api': {
				target: 'http://192.168.2.158:7654',
				changeOrigin: true,
				pathRewrite: {
					'^/api': ''
				}
			},
  }
},

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
