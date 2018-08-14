// import Headers from './Headers';

// const env = weex.config.env;

// eslint-disable-next-line
let fetch = null;

if (global.fetch) {
//   fetch = global.fetch;
// } else if (env.platform !== 'Web') {
  const stream = weex.requireModule('stream');
  // eslint-disable-next-line
  function initFetch(initConfig) {
    return (url, options) => {
      const config = {
        ...initConfig,
        ...options
      };
      return new Promise((resolve, reject) => {
        stream.fetch({
          url,
          method: config.method,
        }, (ret) => {
          if (!ret.ok) {
            console.log(ret);
            reject(ret);
          } else {
            console.log(ret);
            resolve(ret);
          }
        }, (response) => {
          console.log(response);
          console.log(`progress:${JSON.stringify(response)}`);
        });
      });
    };
  }
  fetch = initFetch({
    method: 'GET'
  });
}

export default fetch;
