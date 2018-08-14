# Fetch

遵循 Fetch 标准的，适用于weex平台的 fetch

[https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API)

## Usage

```JS
  fetch('http://192.168.102.216:3002/proxy?url=https://api.zhuishushenqi.com/book/508646479dacd30e3a000001', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; UTF-8',
    },
  }).then(resp => resp.text())
    .then((result) => {
      console.log(`retult ok: ${JSON.stringify(result)}`);
    })
    .catch((error) => {
      console.log('ERROR: ', error);
    });
```
