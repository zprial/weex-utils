// https://developer.mozilla.org/zh-CN/docs/Web/API/Headers

// 是否支持迭代器
const isSupportIterable = 'Symbol' in global && 'iterator' in Symbol;

// 确保name是合法的字符串
function normalizeName(name) {
  if (typeof name !== 'string') {
    name = String(name);
  }
  if (/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(name)) {
    throw new TypeError('Invalid character in header field name');
  }
  return name.toLowerCase();
}

// 确保值是String
function normalizeValue(value) {
  if (typeof value !== 'string') {
    value = String(value);
  }
  return value;
}

// Build a destructive iterator for the value list
// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Iteration_protocols
function iteratorFor(items) {
  const iterator = {
    next() {
      const value = items.shift();
      return {
        done: value === undefined,
        value
      };
    }
  };

  if (isSupportIterable) {
    iterator[Symbol.iterator] = () => iterator;
  }

  return iterator;
}

export default class Headers {
  constructor(headers) {
    // 存储 headers 键值对
    this.map = {};

    if (headers instanceof Headers) {
      Headers.forEach((value, name) => this.append(value, name));
    } else if (Array.isArray(headers)) {
      headers.forEach(header => this.append(header[0], header[1]));
    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(name => this.append(name, headers[name]));
    }
  }

  // 在header已存在或者有多个值的状态下
  // append()会将新的值添加到已存在的值的队列末尾,以 ', ' 分隔
  // https://developer.mozilla.org/zh-CN/docs/Web/API/Headers/append
  append(name, value) {
    name = normalizeName(name);
    value = normalizeValue(value);
    const oldValue = this.map[name];
    this.map[name] = oldValue ? `${oldValue}, ${value}` : value;
  }

  // delete方法可以从Headers对象中删除指定header
  // https://developer.mozilla.org/zh-CN/docs/Web/API/Headers/delete
  delete(name) {
    delete this.map[normalizeName(name)];
  }

  // has()方法返回一个布尔值来声明一个 Headers对象是否包含特定的头信息.
  // https://developer.mozilla.org/zh-CN/docs/Web/API/Headers/has
  has(name) {
    // eslint-disable-next-line
    return this.map.hasOwnProperty(normalizeName(name));
  }

  // 以 迭代器 的形式返回Headers对象中所有的键值对
  entries() {
    const items = [];
    this.forEach((name, value) => {
      items.push([name, value]);
    });
    return iteratorFor(items);
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Headers/forEach
  forEach(callBack, thisArg) {
    for (const name in this.map) {
      if (this.map.hasOwnProperty(name)) {
        callBack.call(thisArg, this.map[name], name, this);
      }
    }
  }

  // 从Headers对象中返回指定header的第一个值. 如果Header对象中不存在请求的header,则返回 null.
  // https://developer.mozilla.org/zh-CN/docs/Web/API/Headers/get
  get(name) {
    name = normalizeName(name);
    return this.has(name) ? this.map[name].split(', ')[0] : null;
  }

  // @deprecated
  // 以数组形式返回指定header的所有值. 如果指定的header未存在,则返回一个空数组.
  // https://developer.mozilla.org/zh-CN/docs/Web/API/Headers/getAll
  getAll(name) {
    name = normalizeName(name);
    return this.has(name) ? this.map[name].split(', ') : [];
  }

  // 在header已存在或者有多个值的状态下,将会用新的值覆盖已存在的值
  // https://developer.mozilla.org/zh-CN/docs/Web/API/Headers/set
  set(name, value) {
    this.map[normalizeName(name)] = normalizeValue(value);
  }

  // 返回一个迭代器，允许遍历此对象中包含的所有键。
  // https://developer.mozilla.org/zh-CN/docs/Web/API/Headers/keys
  keys() {
    const items = [];
    this.forEach((value, name) => {
      items.push(name);
    });
    return iteratorFor(items);
  }

  // 返回一个迭代器，允许遍历此对象中包含的所有值。
  // https://developer.mozilla.org/en-US/docs/Web/API/Headers/values
  values() {
    const items = [];
    this.forEach((value) => {
      items.push(value);
    });
    return iteratorFor(items);
  }
}

if (isSupportIterable) {
  Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
}
