// https://developer.mozilla.org/zh-CN/docs/Web/API/Response
import Body from './Body';

export default class Response extends Body {
  constructor(bodyInit, options = {}) {
    super();

    // Response 接口包含的一种响应类型，是只读属性.可以是以下某一种值:
    // basic: 标准值, 同源响应, 带有所有的头部信息除了“Set-Cookie” 和 “Set-Cookie2″.
    // cors: Response 接收到一个有效的跨域请求. 部分headers和body可以被访问.
    // error: 网络错误. 没有有用的描述错误的信息。响应的状态为0，header为空且不可变。从 Response.error()中获得的响应的类型.
    // opaque: 响应 “no-cors” 的跨域请求. 严重受限.
    this.type = 'basic';

    // 包含Response的状态码
    this.status = options.status === undefined ? 200 : options.status;
    // 包含了一个布尔值来标示该Response成功(状态码200-299) 还是失败
    this.ok = this.status >= 200 && this.status < 300;
    // 包含了与该Response状态码一致的状态信息 (例如, OK对应200).
    this.statusText = 'statusText' in options ? options.statusText : 'OK';
    // 包含此Response所关联的 Headers 对象.
    this.headers = new Headers(options.headers);
    // 包含Response的URL
    this.url = options.url || '';
    this._initBody(bodyInit);
  }

  // 创建一个Response对象的克隆
  clone() {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    });
  }

  // 返回一个绑定了网络错误的新的Response对象
  static error() {
    const response = new Response(null, { status: 0, statusText: '' });
    response.type = 'error';
    return response;
  }

  // 用另一个URL创建一个新的 response.
  static redirect(url, status) {
    const redirectStatuses = [301, 302, 303, 307, 308];
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code');
    }

    return new Response(null, { status, headers: { location: url } });
  }
}
