<template>
<a-locale-provider :locale="locale">
  <div id="app">
    <router-view/>
  </div>
   </a-locale-provider>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
export default {
  name: 'App',
  data() {
      return {
        locale: zhCN,
      };
    },
}
</script>

<style>
/* 线上导入fontIcon */
/* @import url('//at.alicdn.com/t/font_1702412_46if5ose7ty.css'); */
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
