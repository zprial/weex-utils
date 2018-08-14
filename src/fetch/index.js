const env = weex.config.env;

// eslint-disable-next-line
let fetch = null;

if (global.fetch) {
  fetch = global.fetch;
} else if (env.platform !== 'Web') {
  const modal = weex.requireModule('modal');
  modal.toast({
    message: env.platform
  });
  fetch = require('./fetch').default; // eslint-disable-line
}

export default fetch;
