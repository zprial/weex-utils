<template>
  <div class="wrapper">
    <image :src="logo" class="logo" />
    <text class="greeting">The environment is ready!</text>
  </div>
</template>

<script>
// import fetch from '../src/fetch';

const modal = weex.requireModule('modal');

export default {
  name: 'App',
  data() {
    return {
      logo: 'https://gw.alicdn.com/tfs/TB1yopEdgoQMeJjy1XaXXcSsFXa-640-302.png',
    };
  },
  created() {
    fetch('http://proxy.zprial.com/proxy?url=https://api.zhuishushenqi.com/book/508646479dacd30e3a000001')
      .then((resp) => {
        console.log(2333, resp);
        return resp.json();
      })
      .then((result) => {
        console.log(4444, result);
        modal.toast({
          message: JSON.stringify(result)
        });
      });
  }
};
</script>

<style scoped lang="scss">
  .wrapper {
    justify-content: center;
    align-items: center;
  }
  .logo {
    width: 424px;
    height: 200px;
  }
  .greeting {
    text-align: center;
    margin-top: 70px;
    font-size: 50px;
    color: #41B883;
  }
  .message {
    margin: 30px;
    font-size: 32px;
    color: #727272;
  }
</style>
