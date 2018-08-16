let platform = 'Web';

if (weex && weex.config && weex.config.env) {
  platform = weex.config.env.platform;
}

// eslint-disable-next-line
let location = null;

// global.location will throw TypeError in weex, why?
if (platform === 'Web' && global && global.location) {
  location = global.location;
} else {
  location = require('./location').default; // eslint-disable-line
}

export const URL = require('./URL').default; // eslint-disable-line

export default location;
