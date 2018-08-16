<template>
  <div>
    <text class="button" @click="onAssign">location.assign</text>
    <text class="button" @click="onReload">location.reload</text>
    <text class="button" @click="onReplace">location.replace</text>
    <text class="button" @click="onHref">location.href</text>
    <text v-for="(item, key) in location" :key="item">{{key}}: {{item}}</text>
  </div>
</template>

<script>
import location, { URL } from 'weex-utils/lib/location';

export default {
  data() {
    return {
      location
    };
  },
  methods: {
    onAssign() {
      location.assign(`${location.origin}/dist/fetch/index.js`);
    },
    onReload() {
      location.reload();
    },
    onReplace() {
      location.replace(`${location.origin}/dist/fetch/index.js`);
    },
    onHref() {
      location.href = `${location.origin}/dist/fetch/index.js`;
    }
  },
  mounted() {
    console.log(URL.qs.parse(location.search));
  }
};
</script>

<style>
.button{
  align-items: center;
  justify-content: center;
  height: 100px;
  line-height: 100px;
  text-align: center;
  margin-bottom: 40px;
  background-color: mediumpurple;
  color: #fff;
}
</style>
