# weex-utils

Utils for smooth weex and web platform gap

* [Fetch](./docs/fetch.md)
* [Document](./docs/document.md)
* [Location](./docs/location.md)
* [querystring](./docs/querystring.md)

## Run Project

```bash
  git clone https://github.com/zprial/weex-utils.git
  cd weex-utils
  yarn install
  yarn start # then view your http://localhost:8081
```

## Install

```bash
  npm install --save weex-utils
```

or if you prefer yarn:

```bash
  yarn add weex-utils
```

## Examples

### [Fetch](./docs/fetch.md)

```js
import { fetch } from 'weex-utils';
// or you can import like this:
// import fetch from 'weex-utils/lib/fetch';

fetch('https://api.douban.com/v2/book/search?q=%E5%B0%86%E5%A4%9C', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded; UTF-8',
  },
})
  .then(resp => resp.text())
  .then((result) => {
    modal.toast({
      message: result
    });
  })
  .catch((error) => {
    modal.toast({
      message: `error: ${error.message}`
    });
  });
```

### [Document](./docs/document.md)

```js
import { document, location } from 'weex-utils';

const div = document.createElement('div');
div.style.cssText = `
  width: 100px;
  height: 100px;
  background-color: red;
`;
document.body.appendChild(div);

div.setAttribute('data-name', 'myDiv');
console.log('data-name:', div.getAttribute('data-name'));

function gotoFetchPage() {
  modal.alert({
    message: 'will go to fetch\'s page'
  }, (value) => {
    div.removeEventListener('click', gotoFetchPage);
    location.href = `${location.origin}/dist/fetch/index.js`;
  });
}
div.addEventListener('click', gotoFetchPage);

// will change div's background-color
setTimeout(() => {
  div.style.backgroundColor = 'blue';
}, 2000);

// append link
const a = document.createElement('a');
const text = document.createElement('text');
text.setAttribute('value', 'This is a link');
a.href = `${location.origin}/dist/fetch/index.js`;
a.appendChild(text);
document.body.appendChild(a);
```

### [Location](./docs/location.md)

```js
import location, { URL } from 'weex-utils/lib/location';

// will go to fetch's page
location.assign(`${location.origin}/dist/fetch/index.js`);
// or you can do
location.href = `${location.origin}/dist/fetch/index.js`;

location.replace(`${location.origin}/dist/fetch/index.js`);

location.reload();
```

### [Querystring](./docs/querystring.md)

```js
  import { querystring } from 'weex-utils';

  querystring.parse('name=zprial&age=23'); // ->> {name: 'zprial', age: '23' }

  // you will get: name=zprial&age=23
  querystring.stringify({
    name: 'zprial',
    age: 23
  });
```