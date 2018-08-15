const env = weex.config.env;

// eslint-disable-next-line
let document = null;

if (global.document) {
  document = global.document;
} else if (env.platform !== 'Web') {
  document = require('./document').default; // eslint-disable-line
}

export default document;
