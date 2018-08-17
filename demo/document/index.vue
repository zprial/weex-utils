<template>
  <div>
    <text>Document</text>
    <web :source="url" ref="webview" :style="{ height, width: 500 }" @pagefinish="onfinished" @progressChange="onmessage" @message="onmessage"></web>
  </div>
</template>

<script>
import { document, location } from 'weex-utils';

const modal = weex.requireModule('modal');
const navigator = weex.requireModule('navigator');
const webview = weex.requireModule('webview');

const js = `
  <script>window.addEventListener('message', (e) => {
    // alert(JSON.stringify(e.data));
    window.postMessage(document.documentElement.scrollHeight, window.origin);
    alert('document.documentElement.scrollHeight:'+document.body.scrollHeight);
  });
  <\/script>
`;
export default {
  data() {
    return {
      height: 300,
      url: `data:text/html,<body oninput="i.srcdoc=h.value+'<style>'+c.value+'</style><script>'+j.value+'<\/script>'"><style>textarea,iframe{width:100%;height:50%}body{margin:0}textarea{width:33.33%;font-size:18}</style><textarea placeholder=HTML id=h></textarea><textarea placeholder=CSS id=c></textarea><textarea placeholder=JS id=j></textarea>${js}<iframe id=i>`
    }
  },
  methods: {
    onmessage(e) {
      modal.toast({
        message: e.data
      });
      this.height = e.data;
    },
    onfinished(e) {
      console.log(e, arguments);
      console.log(232323, e.target);
      modal.toast({
        message: '23333'
      });

      webview.postMessage(this.$refs.webview, {
        message: 'hello'
      });
    }
  },
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
