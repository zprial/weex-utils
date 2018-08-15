const env = weex.config.env;

// eslint-disable-next-line
let location = null;

if (env.platform === 'Web' && global && global.location) {
  location = global.location;
} else {
  location = require('./location').default; // eslint-disable-line
}

export default location;
