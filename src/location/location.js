// https://developer.mozilla.org/zh-CN/docs/Web/API/Location
import URL from './URL';

const navigator = weex.requireModule('navigator');

export class Location {
  constructor() {
    this._init();
  }

  // eslint-disable-next-line
  assign(url, animated = 'true') {
    navigator.push({ url, animated });
  }

  reload() {
    this.replace(this.href);
  }

  // eslint-disable-next-line
  replace(url, animated = 'true') {
    navigator.pop();
    navigator.push({ url, animated });
  }

  toString() {
    return this.href;
  }

  _init() {
    this.href = weex.config.bundleUrl;

    const parseUrl = new URL(weex.config.bundleUrl);
    // containing the protocol scheme of the URL, including the final ':'.
    // 包含URL对应协议的一个DOMString，最后有一个":"。
    this.protocol = parseUrl.protocol;

    // containing the host, that is the hostname, a ':', and the port of the URL.
    // 包含了域名的一个DOMString，可能在该串最后带有一个":"并跟上URL的端口号。
    this.host = parseUrl.host;

    // containing the domain of the URL.
    // 包含URL域名的一个DOMString。
    this.hostname = parseUrl.hostname;

    // containing the port number of the URL.
    // 包含端口号的一个DOMString。
    this.port = parseUrl.port;

    // containing an initial '/' followed by the path of the URL.
    // 包含URL中路径部分的一个DOMString，开头有一个“/"。
    this.pathname = parseUrl.pathname;

    // containing a '?' followed by the parameters or "querystring" of the URL
    // 包含URL参数的一个DOMString，开头有一个“?”。
    this.search = parseUrl.search;

    // containing a '#' followed by the fragment identifier of the URL.
    // 包含块标识符的DOMString，开头有一个“#”。
    this.hash = parseUrl.hash;

    // containing the canonical form of the origin of the specific location.
    // 包含页面来源的域名的标准形式DOMString。
    this.origin = parseUrl.origin;

    // containing the username specified before the domain name.
    // 包含URL中域名前的用户名的一个DOMString。
    this.username = parseUrl.username;

    // containing the password specified before the domain name.
    // 包含URL域名前的密码的一个 DOMString。
    this.password = parseUrl.password;
  }
}

const location = new Location();
export default new Proxy(location, {
  set(target, property, value) {
    if (property === 'href') {
      // value === location.href, replace it
      if (value === Reflect.get(target, property)) {
        target.replace(value);
      } else {
        target.assign(value);
      }
      return true;
    }
    return Reflect.set(target, property, value);
  }
});
