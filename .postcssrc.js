// https://github.com/michael-ciniawsky/postcss-load-config
const config = require('./configs/config');

module.exports = {
  "plugins": {
    // you can edit target browsers: use "browserslist" field in package.json
    "postcss-import": {},
    "postcss-plugin-weex": {},
    "autoprefixer": {
      browsers: ['> 0.1%', 'ios >= 8', 'android >= 4']
    },
    "postcss-plugin-px2rem": {
      // base on 750px standard.
      rootValue: config.designSize / 10,
      // to leave 1px alone.
      minPixelValue: 1.01
    }
  }
}