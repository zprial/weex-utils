// https://developer.mozilla.org/zh-CN/docs/Web/API/Request/Request
import Headers from './Headers';
import Body from './Body';

// HTTP methods whose capitalization should be normalized
const methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];

function normalizeMethod(method) {
  const upcased = method.toUpperCase();
  return methods.indexOf(upcased) > -1 ? upcased : method;
}

export default class Request extends Body {
  constructor(input, options = {}) {
    super();
    let body = options.body;

    if (input instanceof Request) {
      if (input.bodyUsed) {
        throw new TypeError('Already read');
      }
      this.url = input.url;
      this.credentials = input.credentials;
      this.method = input.method;
      this.mode = input.mode;
      if (!options.headers) {
        this.headers = new Headers(input.headers);
      }
      if (!body && input._bodyInit != null) {
        body = input._bodyInit;
        input.bodyUsed = true;
      }
    } else {
      this.url = String(input);
    }

    // 想要在请求中使用的credentials: omit, same-origin, 或 include
    this.credentials = options.credentials || this.credentials || 'same-origin';
    // 请求的方法
    this.method = normalizeMethod(options.method || this.method || 'GET');
    // 请求的模式, 比如 cors, no-cors, same-origin, 或 navigate
    this.mode = options.mode || this.mode || null;
    // 请求的来源,浏览器里是只读的
    this.referrer = null;

    // 包含请求相关的Headers对象
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers);
    }

    // GET 或者 HEAD 方法不能有 body
    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests');
    }
    this._initBody(body);
  }

  clone() {
    return new Request(this, { body: this._bodyInit });
  }
}
