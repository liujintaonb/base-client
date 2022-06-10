/* eslint-disable multiline-ternary */
/* eslint-disable camelcase */
'use strict'

const path = require('path')
// const webpack = require('webpack')
const CompressionWebpackPlugin = require('compression-webpack-plugin') // 开启压缩

const Zopfli = require('@gfx/zopfli') // zipfli 压缩

const HardSourceWebpackPlugin = require('hard-source-webpack-plugin') // 打包性能优化
// const CopyWebpackPlugin = require('copy-webpack-plugin')
// const cesiumSource = 'node_modules/cesium/Source'
// const cesiumWorkers = '../Build/Cesium/Workers'

const resolve = (dir) => path.resolve(__dirname, dir)

const plugins = process.env.NODE_ENV === 'development' ? [] : [
  new HardSourceWebpackPlugin(),

  new CompressionWebpackPlugin({
    filename: '[path][base].gz',
    algorithm: (input, compressionOptions, callback) => {
      return Zopfli.gzip(input, compressionOptions, callback)
    },
    test: /\.(js|css)$/, // 匹配文件名
    threshold: 10240, // 对超过 10K 的数据压缩
    deleteOriginalAssets: false, // 不删除源文件
    minRatio: 0.8 // 压缩比
  }),
  // brotli 压缩，nginx 同样需要配置, 当浏览器支持 br 格式文件，会首先访问 br 文件，不支持则访问 gz
  // 必须开启 https, 两种压缩选一种即可
  new CompressionWebpackPlugin({
    filename: '[path][base].br',
    // algorithm: 'brotliCompress',
    test: /\.(js|css|html|svg)$/, // 匹配文件名
    compressionOptions: {
      level: 9
    },
    threshold: 10240, // 对超过 10K 的数据压缩
    deleteOriginalAssets: false, // 不删除源文件
    minRatio: 0.8 // 压缩比
  })
]

module.exports = {
  publicPath: process.env.VUE_APP_PUBLIC_PATH,
  assetsDir: 'static',
  productionSourceMap: false,
  devServer: {
    port: 9540,
    proxy: {
      '/api': {
        target: 'http://123.56.44.250:8090/',
        ws: true,
        changeOrigin: true,
        pathRewrite: { '^/api': '' }
      }
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src'),
        _c: resolve('src/components')
      },
      extensions: ['.js', '.vue', '.json']
    },
    plugins: [
      ...plugins

      // cesium
      // new CopyWebpackPlugin([{ from: path.join(cesiumSource, cesiumWorkers), to: 'Workers' }]),
      // new CopyWebpackPlugin([{ from: path.join(cesiumSource, 'Assets'), to: 'Assets' }]),
      // new CopyWebpackPlugin([{ from: path.join(cesiumSource, 'Widgets'), to: 'Widgets' }]),
      // new CopyWebpackPlugin([{ from: path.join(cesiumSource, 'ThirdParty/Workers'), to: 'ThirdParty/Workers' }]),
      // new webpack.DefinePlugin({
      //   CESIUM_BASE_URL: JSON.stringify(process.env.VUE_APP_PUBLIC_PATH || '/')
      // })
    ]
  },
  chainWebpack: config => {
    // it can improve the speed of the first screen, it is recommended to turn on preload
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        // to ignore runtime.js
        // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }
    ])

    // when there are many pages, it will cause too many meaningless requests
    config.plugins.delete('prefetch')

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
    config.module
      .rule('image')
      .test(/\.ico$/)
      .use('url-loader')
      .loader('url-loader')
      .end()

    config.when(process.env.NODE_ENV !== 'development', config => {
      // 去掉注释， console.log 等
      config.optimization.minimizer('terser').tap(options => {
        options[0].terserOptions.compress.drop_console = true
        options[0].terserOptions.compress.drop_debugger = true
        options[0].terserOptions.compress.pure_funcs = ['console.log']
        return options
      })

      config
        .plugin('ScriptExtHtmlWebpackPlugin')
        .after('html')
        .use('script-ext-html-webpack-plugin', [{
          // `runtime` must same as runtimeChunk name. default is `runtime`
          inline: /runtime\..*\.js$/
        }])
        .end()

      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial' // only package third parties that are initially dependent
          },
          elementUI: {
            name: 'chunk-elementUI', // split elementUI into a single package
            priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
            test: /[\\/]node_modules[\\/]_?element-plus(.*)/ // in order to adapt to cnpm
          },
          commons: {
            name: 'chunk-commons',
            test: resolve('src/components'), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true
          }
        }
      })
      // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
      config.optimization.runtimeChunk('single')
    })
  }
}
