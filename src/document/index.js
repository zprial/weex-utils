let platform = 'Web';

if (weex && weex.config && weex.config.env) {
  platform = weex.config.env.platform;
}

// eslint-disable-next-line
let document = null;

if (global.document) {
  document = global.document;
} else if (platform !== 'Web') {
  document = require('./document').default; // eslint-disable-line
}

export default document;
