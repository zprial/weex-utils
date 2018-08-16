const commonConfig = require('./webpack.common.conf');
// tools
const helper = require('./helper');
const isAnalyse = process.env.NODE_ENV === 'analyse';

/**
 * Webpack Plugins
 */
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const webConfig = commonConfig[0];
/**
 * Webpack configuration for web.
 */
module.exports = {
  entry: {
    index: helper.rootNode('./src/index.js'),
    fetch: helper.rootNode('./src/fetch/index.js'),
    document: helper.rootNode('./src/document/index.js'),
    location: helper.rootNode('./src/location/index.js'),
  },
  mode: 'production',
  module: webConfig.module,
  devtool: false,
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
    path: helper.rootNode('lib'),
    /**
     * Specifies the name of each output file on disk.
     * IMPORTANT: You must not specify an absolute path here!
     *
     * See: http://webpack.github.io/docs/configuration.html#output-filename
     */
    filename: '[name].js',
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
    ]
  },
  /*
   * Add additional plugins to the compiler.
   *
   * See: http://webpack.github.io/docs/configuration.html#plugins
   */
  plugins: webConfig.plugins.concat([
    isAnalyse ? new BundleAnalyzerPlugin({
      reportFilename: 'report.html',
      analyzerMode: 'static',
      analyzerPort: 8888,
      openAnalyzer: true
    }) : () => {}
  ])
};
