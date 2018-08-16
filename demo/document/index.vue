<template>
  <div>
    <text>Document</text>
  </div>
</template>

<script>
import { document, location } from 'weex-utils';

const modal = weex.requireModule('modal');
const navigator = weex.requireModule('navigator');

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

    function gotoFetchPage() {
      modal.alert({
        message: '将会前往fetch页面'
      }, (value) => {
        div.removeEventListener('click', gotoFetchPage);
        location.href = `${location.origin}/dist/fetch/index.js`;
      });
    }
    div.addEventListener('click', gotoFetchPage);

    // 将会更改div的背景色
    setTimeout(() => {
      div.style.backgroundColor = 'blue';
    }, 2000);

    // 插入链接
    const a = document.createElement('a');
    const text = document.createElement('text');
    text.setAttribute('value', '这是一个链接');
    a.title = 'link';
    a.href = `${location.origin}/dist/fetch/index.js`;
    a.appendChild(text);
    document.body.appendChild(a);

    setTimeout(() => {
      const deleteDom = a.removeChild(text);
      console.log('deleteDom:', deleteDom);
    }, 4000);
  }
};
</script>
