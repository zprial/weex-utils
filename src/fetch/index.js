let platform = 'Web';

if (weex && weex.config && weex.config.env) {
  platform = weex.config.env.platform;
}

// eslint-disable-next-line
let fetch = null;

if (global.fetch) {
  fetch = global.fetch;
} else if (platform !== 'Web') {
  fetch = require('./fetch').default; // eslint-disable-line
}

export default fetch;
