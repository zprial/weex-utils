<script>
export default {
  render() {
    return <div>
      {/* class 必须这么子写。。。 */}
      <text class={["dialog"]} style={{color: 'red'}}>This is JSX</text>
      <a href='/dist/fetch/index.js'>这是一个链接</a>
    </div>;
  }
};

// 在另一个 .vue 里，可以这么子搞
// const node = new Vue({
//   el: document.createElement('div'),
//   render() {
//     return <WeexDialog />;
//   }
// });
// document.body.appendChild(node.$el);
</script>

<style scoped>
.dialog{
  font-size: 30px;
}
</style>
