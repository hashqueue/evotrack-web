<template>
  <div class="logo">
    <img alt="logo-img" class="logo-img" src="@/assets/logo.svg" /><span v-show="!isCollapsed">{{
      title
    }}</span>
  </div>
  <a-menu
    theme="dark"
    :items="menuItems"
    mode="inline"
    :openKeys="selectedKeys"
    :selectedKeys="selectedKeys"
    @click="clickMenuItem"
  >
  </a-menu>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useUserStore } from '@/stores/user'
import { generateTreeMenuData } from '@/utils/common'

defineProps({
  isCollapsed: {
    type: Boolean,
    required: true
  }
})

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const title = import.meta.env.VITE_TITLE
const selectedKeys = computed(() => {
  const pathArray = route.path.split('/')
  // 删除第一个空字符串
  pathArray.shift()
  pathArray[0] = `/${pathArray[0]}`
  return pathArray
})

const menuItems = generateTreeMenuData(userStore.getMenuPermissions)
const clickMenuItem = ({ item, key, keyPath }) => {
  if (!route.path.endsWith(key)) {
    router.push({ name: key })
  }
}
</script>

<style scoped lang="less">
.logo {
  display: flex;
  justify-content: space-between;
  // 垂直居中
  align-items: center;
  // 文本水平居中
  text-align: center;
  height: 45px;
  width: 75%;
  color: fade(#fff, 85%);
  font-size: 24px;
  margin: 2px 24px;
  .logo-img {
    height: 28px;
    vertical-align: top;
  }
}
</style>
