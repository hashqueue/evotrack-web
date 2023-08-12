<template>
  <a-config-provider :locale="locale" :theme="appTheme">
    <RouterView />
  </a-config-provider>
</template>

<script setup>
import { RouterView } from 'vue-router'
import { theme } from 'ant-design-vue'
// 全局国际化语言配置为zh-cn
import locale from 'ant-design-vue/es/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn')
const appTheme = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: '#00b96b'
  }
}
</script>

<style scoped></style>
