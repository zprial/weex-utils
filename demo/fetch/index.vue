<template>
  <div class="wrapper">
    <image :src="logo" class="logo" @click="onClick"/>
    <text class="greeting">{{innerText}}</text>
  </div>
</template>

<script>
import fetch from '../../src/fetch';

export default {
  name: 'App',
  data() {
    return {
      logo: 'https://gw.alicdn.com/tfs/TB1yopEdgoQMeJjy1XaXXcSsFXa-640-302.png',
      innerText: 'The environment is ready!'
    };
  },
  methods: {
    onClick() {
      fetch('http://192.168.102.216:3002/proxy?url=https://api.zhuishushenqi.com/book/508646479dacd30e3a000001', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; UTF-8',
        },
      })
        .then(resp => resp.text())
        .then((result) => {
          console.log(`retult ok: ${JSON.stringify(result)}`);
          this.innerText = result;
        })
        .catch((error) => {
          this.innerText = `error: ${error.message}`;
        });
    }
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
