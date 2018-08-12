const commonConfig = require('./webpack.common.conf');
const webpackMerge = require('webpack-merge'); // used to merge webpack configs
// tools
const chalk = require('chalk');
const path = require('path');
const webpack = require('webpack');
const helper = require('./helper');
const config = require('./config');
const isAnalyse = process.env.NODE_ENV === 'analyse';
const extractCss = config.prod.extractCss; // web提取css代码

console.log(`${chalk.green(`Package weex project at ${chalk.bold(path.resolve('./dist/weex'))}!`)}`)
console.log(`${chalk.green(`Package web project at ${chalk.bold(path.resolve('./dist/web'))}!`)}`)
/**
 * Webpack Plugins
 */
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

/**
 * Generate multiple entrys
 * @param {Array} entry 
 */
const generateMultipleEntrys = (entry) => {
  let entrys = Object.keys(entry);
  // exclude vendor entry.
  entrys = entrys.filter(entry => entry !== 'vendor' );
  const htmlPlugin = entrys.map(name => {
    return new HtmlWebpackPlugin({
      filename: name + '.html',
      template: helper.rootNode(`index.html`),
      isDevServer: true,
      chunksSortMode: 'dependency',
      inject: true,
      chunks: [name],
      // production
      minimize: true
    })
  })
  return htmlPlugin;
}

/**
 * Webpack configuration for web.
 */
const webConfig = webpackMerge(commonConfig[0], {
  mode: 'production',
  /**
   * Developer tool to enhance debugging
   *
   * See: http://webpack.github.io/docs/configuration.html#devtool
   * See: https://github.com/webpack/docs/wiki/build-performance#sourcemaps
   */
  devtool: config.prod.devtool,
  /**
   * Options affecting the output of the compilation.
   *
   * See: http://webpack.github.io/docs/configuration.html#output
   */
  output: {
    /**
     * The output directory as absolute path (required).
     *
     * See: http://webpack.github.io/docs/configuration.html#output-path
     */
    path: helper.rootNode('dist/web'),
    /**
     * Specifies the name of each output file on disk.
     * IMPORTANT: You must not specify an absolute path here!
     *
     * See: http://webpack.github.io/docs/configuration.html#output-filename
     */
    filename: '[name].[chunkhash].web.js',
    /**
     * The filename of the SourceMaps for the JavaScript files.
     * They are inside the output.path directory.
     *
     * See: http://webpack.github.io/docs/configuration.html#output-sourcemapfilename
     */
    sourceMapFilename: '[name].[chunkhash].web.map',
    /**
     * The filename of non-entry chunks as relative path
     * inside the output.path directory.
     *
     * See: http://webpack.github.io/docs/configuration.html#output-chunkfilename
     */
    chunkFilename: '[id].[chunkhash].chunk.js'
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  /*
   * Add additional plugins to the compiler.
   *
   * See: http://webpack.github.io/docs/configuration.html#plugins
   */
  plugins: [
    /*
     * Plugin: UglifyJsPlugin
     * Description: Minimize all JavaScript output of chunks.
     * Loaders are switched into minimizing mode.
     *
     * See: https://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
     */
    ...generateMultipleEntrys(commonConfig[0].entry),
    /*
     * Plugin: HtmlWebpackPlugin
     * Description: Simplifies creation of HTML files to serve your webpack bundles.
     * This is especially useful for webpack bundles that include a hash in the filename
     * which changes every compilation.
     *
     * See: https://github.com/ampedandwired/html-webpack-plugin
     */
    new HtmlWebpackPlugin({
      template: 'index.html',
      chunksSortMode: 'dependency',
      inject: 'head'
    }),
    /*
     * Plugin: ScriptExtHtmlWebpackPlugin
     * Description: Enhances html-webpack-plugin functionality
     * with different deployment options for your scripts including:
     *
     * See: https://github.com/numical/script-ext-html-webpack-plugin
     */
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'defer'
    }),
    /*
    这里不使用 [chunkhash]
    因为从同一个 chunk 抽离出来的 css 共享同一个 [chunkhash]
    [contenthash] 你可以简单理解为 moduleId + content 生成的 hash
    因此一个 chunk 中的多个 module 有自己的 [contenthash]
    */
    extractCss && new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[contenthash].css'
    }),
    /*
     * Plugin: UglifyJsPlugin
     * Description: Identical to standard uglify webpack plugin
     * with an option to build multiple files in parallel
     *
     * See: https://github.com/webpack-contrib/uglifyjs-webpack-plugin
     */
    new UglifyJsPlugin({
      cache: true,
      parallel: true, // Use multi-process parallel running to improve the build speed
      sourceMap: true
    }),
    isAnalyse ? new BundleAnalyzerPlugin({
      reportFilename: 'report.web.html',
      analyzerMode: 'static',
      analyzerPort: 8888,
      openAnalyzer: true
    }) : () => {}
  ]
});

/**
 * Webpack configuration for weex.
 */
const weexConfig = webpackMerge(commonConfig[1], {
  mode: 'production',
  /**
   * Options affecting the output of the compilation.
   *
   * See: http://webpack.github.io/docs/configuration.html#output
   */
  output: {
    /**
     * The output directory as absolute path (required).
     *
     * See: http://webpack.github.io/docs/configuration.html#output-path
     */
    path: helper.rootNode('dist/weex'),
    /**
     * Specifies the name of each output file on disk.
     * IMPORTANT: You must not specify an absolute path here!
     *
     * See: http://webpack.github.io/docs/configuration.html#output-filename
     */
    filename: '[name].js'
  },
  optimization: {
    minimizer: [
      /*
       * Plugin: UglifyJsPlugin
       * Description: Identical to standard uglify webpack plugin
       * with an option to build multiple files in parallel
       *
       * See: https://github.com/webpack-contrib/uglifyjs-webpack-plugin
       */
      new UglifyJsPlugin({
        cache: true,
        parallel: true, // Use multi-process parallel running to improve the build speed
        sourceMap: true,
        extractComments: true,
        uglifyOptions: {
          output: {
            comments: false,
            beautify: false,
          },
          compress: {
            drop_console: true,
            warnings: false,
            drop_debugger: true,
          },
        },
      }),
      /*
       * Plugin: BannerPlugin
       * Description: Adds a banner to the top of each generated chunk.
       * See: https://webpack.js.org/plugins/banner-plugin/
       * BannerPlugin 应该放在 UglifyJsPlugin 之后
       */
      new webpack.BannerPlugin({
        banner: '// { "framework": "Vue"} \n',
        raw: true,
        exclude: 'Vue'
      }),
    ]
  },
  /*
   * Add additional plugins to the compiler.
   *
   * See: http://webpack.github.io/docs/configuration.html#plugins
   */
  plugins: [
    isAnalyse ? new BundleAnalyzerPlugin({
      reportFilename: 'report.weex.html',
      analyzerMode: 'static',
      analyzerPort: 8888,
      openAnalyzer: true
    }) : () => {}
  ]
})

module.exports = [webConfig, weexConfig]
