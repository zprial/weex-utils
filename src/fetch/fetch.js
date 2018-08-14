import Headers from './Headers';
import Request from './Request';
import Response from './Response';

const stream = weex.requireModule('stream');

// fetch() 方法的参数与 Request() 构造器是一样的
export default function (input, init) {
  return new Promise((resolve, reject) => {
    const request = new Request(input, init);

    const headers = {};
    request.headers.forEach((value, name) => {
      headers[name] = value;
    });

    stream.fetch({
      method: request.method,
      url: request.url,
      headers,
      type: 'text',
      body: typeof request._bodyInit === 'undefined' ? null : request._bodyInit
    }, (ret) => {
      // 不能单纯的判断 !ret.ok, ok 有等于 false 的情况
      if (typeof ret.ok === 'undefined') {
        reject(new TypeError('Network request failed'));
        return;
      }
      const options = {
        status: ret.status,
        statusText: ret.statusText,
        headers: new Headers(ret.headers)
      };
      const body = ret.data ? ret.data : '';
      resolve(new Response(body, options));
    });
  });
}
