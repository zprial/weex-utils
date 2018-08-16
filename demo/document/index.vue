<template>
  <div>
    <text>Document</text>
  </div>
</template>

<script>
import document from '../../src/document';
import URL from '../../src/location/URL';

const modal = weex.requireModule('modal');
const navigator = weex.requireModule('navigator');

console.log(new URL('https://anonymous:flabada@developer.mozilla.org/en-US/docs/HTMLHyperlinkElementUtils.username?name=zzzz#3333'));

export default {
  mounted() {
    const div = document.createElement('div');
    // 将会生成一个宽100，高100，背景色为红色的正方形
    div.style.cssText = `
      width: 100px;
      height: 100px;
      background-color: red;
    `;
    document.body.appendChild(div);
    div.setAttribute('data-name', 'myDiv');
    console.log('data-name:', div.getAttribute('data-name'));

    div.addEventListener('click', () => {
      modal.alert({
        message: '23333'
      }, (value) => {
        div.removeEventListener('click');
        navigator.pop();
        navigator.push({
          url: 'http://192.168.102.216:8081/dist/fetch/index.js'
        });
      });
    });

    // 将会更改div的背景色
    setTimeout(() => {
      div.style.backgroundColor = 'blue';
    }, 2000);

    // 插入链接
    const a = document.createElement('a');
    const text = document.createElement('text');
    text.setAttribute('value', '这是一个链接');
    a.title = 'link';
    a.href = "http://ztktct:zt123@192.168.102.216:8081/dist/fetch/index.js";
    a.appendChild(text);
    document.body.appendChild(a);

    setTimeout(() => {
      const deleteDom = a.removeChild(text);
      console.log('deleteDom:', deleteDom);
    }, 4000);
  }
};
</script>
