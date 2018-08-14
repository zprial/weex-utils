// https://developer.mozilla.org/zh-CN/docs/Web/API/Body
// https://github.com/github/fetch/blob/master/fetch.js

const support = {
  searchParams: 'URLSearchParams' in global,
  blob:
    'FileReader' in global &&
    'Blob' in global &&
    (() => {
      try {
        new Blob(); // eslint-disable-line
        return true;
      } catch (e) {
        return false;
      }
    })(),
  formData: 'FormData' in global,
  arrayBuffer: 'ArrayBuffer' in global
};

function isDataView(obj) {
  return obj && DataView.prototype.isPrototypeOf(obj);
}

let isArrayBufferView = null;
if (support.arrayBuffer) {
  const viewClasses = [
    '[object Int8Array]',
    '[object Uint8Array]',
    '[object Uint8ClampedArray]',
    '[object Int16Array]',
    '[object Uint16Array]',
    '[object Int32Array]',
    '[object Uint32Array]',
    '[object Float32Array]',
    '[object Float64Array]'
  ];

  isArrayBufferView =
    ArrayBuffer.isView ||
    function (obj) {
      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1;
    };
}

function consumed(body) {
  if (body.bodyUsed) {
    return Promise.reject(new TypeError('Already read'));
  }
  body.bodyUsed = true;
  return false;
}

function fileReaderReady(reader) {
  return new Promise(((resolve, reject) => {
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = () => {
      reject(reader.error);
    };
  }));
}

function readBlobAsArrayBuffer(blob) {
  const reader = new FileReader();
  const promise = fileReaderReady(reader);
  reader.readAsArrayBuffer(blob);
  return promise;
}

function readBlobAsText(blob) {
  const reader = new FileReader();
  const promise = fileReaderReady(reader);
  reader.readAsText(blob);
  return promise;
}

function readArrayBufferAsText(buf) {
  const view = new Uint8Array(buf);
  const chars = new Array(view.length);

  // eslint-disable-next-line
  for (let i = 0; i < view.length; i++) {
    chars[i] = String.fromCharCode(view[i]);
  }
  return chars.join('');
}

function bufferClone(buf) {
  if (buf.slice) {
    return buf.slice(0);
  }
  const view = new Uint8Array(buf.byteLength);
  view.set(new Uint8Array(buf));
  return view.buffer;
}

function decode(body) {
  const form = new FormData();
  body
    .trim()
    .split('&')
    .forEach((bytes) => {
      if (bytes) {
        const split = bytes.split('=');
        const name = split.shift().replace(/\+/g, ' ');
        const value = split.join('=').replace(/\+/g, ' ');
        form.append(decodeURIComponent(name), decodeURIComponent(value));
      }
    });
  return form;
}

export default class Body {
  constructor() {
    // 包含一个指示body是否被读取过的 Boolean 值。
    this.bodyUsed = false;

    this._initBody = (body) => {
      this._bodyInit = body;
      if (!body) {
        this._bodyText = '';
      } else if (typeof body === 'string') {
        this._bodyText = body;
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body;
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body;
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString();
      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
        this._bodyArrayBuffer = bufferClone(body.buffer);
        // IE 10-11 can't handle a DataView body.
        this._bodyInit = new Blob([this._bodyArrayBuffer]);
      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) { // eslint-disable-line
        this._bodyArrayBuffer = bufferClone(body);
      } else {
        throw new Error('unsupported BodyInit type');
      }

      // headers 在 Request 或 Response 中
      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8');
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type);
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
        }
      }
    };
  }

  text() {
    const rejected = consumed(this);
    if (rejected) {
      return rejected;
    }

    if (this._bodyBlob) {
      return readBlobAsText(this._bodyBlob);
    } else if (this._bodyArrayBuffer) {
      return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer));
    } else if (this._bodyFormData) {
      throw new Error('could not read FormData body as text');
    } else {
      return Promise.resolve(this._bodyText);
    }
  }

  json() {
    return this.text().then(JSON.parse);
  }
}

if (support.formData) {
  Body.prototype.formData = function () {
    return this.text().then(decode);
  };
}
if (support.blob) {
  Body.prototype.blob = function () {
    const rejected = consumed(this);
    if (rejected) {
      return rejected;
    }

    if (this._bodyBlob) {
      return Promise.resolve(this._bodyBlob);
    } else if (this._bodyArrayBuffer) {
      return Promise.resolve(new Blob([this._bodyArrayBuffer]));
    } else if (this._bodyFormData) {
      throw new Error('could not read FormData body as blob');
    } else {
      return Promise.resolve(new Blob([this._bodyText]));
    }
  };

  Body.prototype.arrayBuffer = function () {
    if (this._bodyArrayBuffer) {
      return consumed(this) || Promise.resolve(this._bodyArrayBuffer);
    }
    return this.blob().then(readBlobAsArrayBuffer);
  };
}
