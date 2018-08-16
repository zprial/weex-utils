const path = require('path');
const fs = require('fs-extra');
const webpack = require('webpack');
const chalk = require('chalk');
const os = require('os');
const HappyPack = require('happypack');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
const config = require('./config');
const helper = require('./helper');
const glob = require('glob');
const vueWebTemp = helper.rootNode(config.templateDir);

// conditions
const isWin = /^win/.test(process.platform);

// plugins
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const webEntry = {};
const weexEntry = {};
  
// 入口文件或文件夹,默认整个 demo 文件夹
let assignEntryPath = 'demo';
try{
  const argvs = JSON.parse(process.env.npm_config_argv);
  if (Array.isArray(argvs.remain) && argvs.remain.length > 0) {
    assignEntryPath = argvs.remain;
  }
} catch(e) { }

// Wraping the entry file for web.
// 生成web入口文件的内容
const getWebEntryFileContent = (entryPath, vueFilePath) => {
  let relativeVuePath = path.relative(path.join(entryPath, '../'), vueFilePath);
  let relativeEntryPath = helper.root(config.entryFilePath);

  let contents = '';
  let entryContents = fs.readFileSync(relativeEntryPath).toString();
  if (isWin) {
    relativeVuePath = relativeVuePath.replace(/\\/g, '\\\\');
  }
  // https://github.com/vuejs/vue-loader/releases/tag/v13.0.0
  contents += `
const App = require('${relativeVuePath}').default;
new Vue(Vue.util.extend({el: '#root'}, App));
`;
  return entryContents + contents;
}

// Wraping the entry file for native.
// 生成weex入口文件的内容
const getNativeEntryFileContent = (entryPath, vueFilePath) => {
  let relativeVuePath = path.relative(path.join(entryPath, '../'), vueFilePath);
  let contents = '';
  if (isWin) {
    relativeVuePath = relativeVuePath.replace(/\\/g, '\\\\');
  }
  contents += `import App from '${relativeVuePath}'
App.el = '#root'
new Vue(App)
`;
  
  return contents;
}

// Retrieve entry file mappings by function recursion
// 生成 web 和 weex 的入口文件
const getEntryFile = (dir) => {
  dir = dir || config.sourceDir;
  // 如果路径没有带上指定的 sourceDir，就主动加上
  if(!(new RegExp(`(^.\/?)?${config.sourceDir}`, 'ig')).test(dir)) {
    dir = path.join(config.sourceDir, dir);
  }
  let enrtys = glob.sync(`${dir}/${config.entryFilter}`, config.entryFilterOptions);
  // 如果上面没有找到文件或者dir是个以.vue为后缀的路径的话
  // 就把dir当做 enrtys
  if(enrtys.length === 0) {
    try {
      const stat = fs.statSync(dir);
      if (stat.isFile() && path.extname(dir) === '.vue') {
        enrtys = [dir];
      } else {
        throw new Error('当前路径不正确');
      }
    } catch (error) {
      // 尝试自动添加后缀
      const _tmpDir = dir + '.vue';
      console.log(`${chalk.yellow(`当前路径不正确，正在尝试添加后缀.vue...`)}`);
      try {
        const stat = fs.statSync(_tmpDir);
        if (stat.isFile()) {
          enrtys = [dir];
        }
      } catch (error) {
        console.log(`${chalk.red(`当前路径不正确: ${dir}`)}`);
        process.exit();
      }
    }
  }
  enrtys.forEach(entry => {
    const extname = path.extname(entry);
    // 取相对路径作为入口名
    const entryname = entry.replace(extname, '').replace(config.sourceDir, '').replace(/^\//, '');
    // 文件名
    const basename = entry.replace(`${dir}/`, '').replace(extname, '');
    // web 模板路径
    const templatePathForWeb = path.join(vueWebTemp, basename + '.web.js');
    // weex 模板路径
    const templatePathForNative = path.join(vueWebTemp, basename + '.js');
    fs.outputFileSync(templatePathForWeb, getWebEntryFileContent(templatePathForWeb, entry));
    fs.outputFileSync(templatePathForNative, getNativeEntryFileContent(templatePathForNative, entry));
    webEntry[entryname] = templatePathForWeb;
    weexEntry[entryname] = templatePathForNative;
  })
}

// Generate an entry file array before writing a webpack configuration
if (Array.isArray(assignEntryPath)) {
  assignEntryPath.forEach(entryPath => getEntryFile(entryPath))
} else {
  getEntryFile(assignEntryPath);
}

const createLintingRule = () => ({
  test: /\.(js|vue)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [helper.rootNode('src'), helper.rootNode('demo')],
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: !config.dev.showEslintErrorsInOverlay
  }
})
const useEslint = config.dev.useEslint ? [createLintingRule()] : []

/**
 * Plugins for webpack configuration.
 */
const plugins = [
  new HappyPack({
    id: 'happy-babel-js',
    loaders: ['babel-loader'],
    threadPool: happyThreadPool,
    verbose: true
  }),
  new HappyPack({
    id: 'happy-babel-vue',
    loaders: ['babel-loader'],
    threadPool: happyThreadPool,
    verbose: true
  })
];

/**
 * Common loaders for webpack configuration.
 */
const loaders = [{
  test: /\.js$/,
  use: ['happypack/loader?id=happy-babel-js'],
  exclude: config.excludeModuleReg
}, {
  test: /\.scss$/,
  use: [
    'vue-style-loader',
    // see https://github.com/webpack-contrib/css-loader#importloaders
    { loader: 'css-loader', options: { importLoaders: 2 } },
    'postcss-loader',
    'sass-loader'
  ]
}, {
  test: /\.css$/,
  use: [
    // in development will use vue-style-loader
    'vue-style-loader',
    // see https://github.com/webpack-contrib/css-loader#importloaders
    { loader: 'css-loader', options: { importLoaders: 1 } },
    'postcss-loader'
  ]
}];

// Config for compile jsbundle for web.
const webConfig = {
  entry: webEntry,
  output: {
    path: helper.rootNode('./dist'),
    filename: '[name].web.js'
  },
  /**
   * Options affecting the resolving of modules.
   * See http://webpack.github.io/docs/configuration.html#resolve
   */
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': helper.resolve('demo'),
    }
  },
  // web 排除两个依赖
  externals: {
    vue: 'Vue',
    'weex-vue-render': 'weex'
  },
  /*
   * Options affecting the resolving of modules.
   *
   * See: http://webpack.github.io/docs/configuration.html#module
   */
  module: {
    rules: useEslint.concat([
      ...loaders,
      {
        test: /\.vue(\?[^?]+)?$/,
        use: [{
          loader: 'vue-loader',
          options: {
            /**
             * important! should use postTransformNode to add $processStyle for
             * inline style prefixing.
             */
            optimizeSSR: false,
            compilerOptions: {
              modules: [{
                postTransformNode: el => {
                  // to convert vnode for weex components.
                  require('weex-vue-precompiler')()(el)
                }
              }]
            }
          }
        }],
        exclude: config.excludeModuleReg
      }
    ])
  },
  /*
   * Add additional plugins to the compiler.
   *
   * See: http://webpack.github.io/docs/configuration.html#plugins
   */
  plugins: plugins.concat([
    new VueLoaderPlugin()
  ])
};

// Config for compile jsbundle for native.
const weexConfig = {
  entry: weexEntry,
  output: {
    path: path.join(__dirname, '../dist'),
    filename: '[name].js'
  },
  /**
   * Options affecting the resolving of modules.
   * See http://webpack.github.io/docs/configuration.html#resolve
   */
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': helper.resolve('demo'),
    }
  },
  /*
   * Options affecting the resolving of modules.
   *
   * See: http://webpack.github.io/docs/configuration.html#module
   */
  module: {
    rules: [
      ...loaders,
      {
        test: /\.vue(\?[^?]+)?$/,
        use: [{
          loader: 'weex-loader',
          options: {
            loaders: {
              js: 'happypack/loader?id=happy-babel-vue',
              scss: {
                loader: 'sass-loader',
                options : {
                  sourceMap: false
                }
              }
            }
          }
        }],
        exclude: config.excludeModuleReg
      }
    ]
  },
  /*
   * Add additional plugins to the compiler.
   *
   * See: http://webpack.github.io/docs/configuration.html#plugins
   */
  plugins: plugins,
  /*
  * Include polyfills or mocks for various node stuff
  * Description: Node configuration
  *
  * See: https://webpack.github.io/docs/configuration.html#node
  */
  node: config.nodeConfiguration
};

module.exports = [webConfig, weexConfig];
