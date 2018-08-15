# Document

[https://developer.mozilla.org/zh-CN/docs/Web/API/Document](https://developer.mozilla.org/zh-CN/docs/Web/API/Document)

## 属性

### documentElement

>是一个会返回文档对象（document）的根元素的只读属性（如HTML文档的 \<html\> 元素)

### body

>document.body是包含当前页面内容的元素,对于拥有\<body\>元素的文档来说,返回的是\<body\>元素,对于一个拥有\<frameset\>元素的文档来说,返回的是最外层的\<frameset\>元素.

### URL

> 返回当前文档的URL地址

## 方法

### createElement(tagName[, options])

> 创建由tagName 指定的HTML元素，或一个HTMLUnknownElement，如果tagName不被识别

生成的元素具有以下属性(特性，与 web 用法一致), 已实现：

* [setAttribute](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/setAttribute): 设置指定元素上的一个属性值。如果属性已经存在，则更新该值; 否则将添加一个新的属性用指定的名称和值。

* [getAttribute](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/getAttribute): 返回元素上一个指定的属性值。如果指定的属性不存在，则返回

* [removeAttribute](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/removeAttribute): 从指定的元素中删除一个属性

* [style](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement/style): 表示元素的 内联style 属性, 通过 style 可以访问的 CSS 属性

  * cssText: 暂时只是可写，如果读取的话会始终返回`undefined`

* [appendChild](https://developer.mozilla.org/zh-CN/docs/Web/API/Node/appendChild)(weex原生支持): 将一个节点添加到指定父节点的子节点列表末尾。

* [insertBefore](https://developer.mozilla.org/zh-CN/docs/Web/API/Node/insertBefore)(weex原生支持): 在参考节点之前插入一个节点作为一个指定父节点的子节点

* [insertAfter](https://github.com/apache/incubator-weex/blob/89b7ac4badb48476f8ba0e072ef2dd050d62adff/runtime/vdom/Element.js#L179): 非标准，只有`weex原生支持`,在参考节点之后插入一个节点作为一个指定父节点的子节点

* [removeChild](https://developer.mozilla.org/zh-CN/docs/Web/API/Node/removeChild): 从DOM中删除一个子节点。返回删除的节点

* [addEventListener](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener): 方法将指定的监听器注册到 EventTarget 上，当该对象触发指定的事件时，指定的回调函数就会被执行

* [removeEventListener](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/removeEventListener): 删除使用 EventTarget.addEventListener() 方法添加的事件

## Usage

```js
  const div = document.createElement('div');
  // 将会生成一个宽100，高100，背景色为红色的正方形
  div.style.cssText = `
    width: 100px;
    height: 100px;
    background-color: red;
  `;
  document.body.appendChild(div);

  // 设置属性
  div.setAttribute('data-name', 'myDiv');
  // 获取属性
  console.log('data-name:', div.getAttribute('data-name'));

  // 添加事件监听
  div.addEventListener('click', function() {
    modal.alert({
      message: '23333'
    }, value => {
      // 移除事件
      div.removeEventListener('click');
    });
  });

  // 2s将会更改div的背景色
  setTimeout(() => {
    div.style.backgroundColor = 'blue';
  }, 2000);

  // 插入链接
  const a = document.createElement('a');
  const text = document.createElement('text');
  text.setAttribute('value', '这是一个链接');

  // 可以直接通过点操作符设置属性
  a.href = "http://192.168.102.216:8081/dist/fetch/index.js";
  a.appendChild(text);
  document.body.appendChild(a);

  // 4s后将会移除链接下面的文本节点
  setTimeout(() => {
    const deleteDom = a.removeChild(text);
    console.log('deleteDom:', deleteDom);
  }, 4000);
```
