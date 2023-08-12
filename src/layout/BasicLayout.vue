<template>
  <a-layout class="main-layout">
    <a-layout-sider v-model:collapsed="collapsed" collapsible class="sidebar">
      <sidebar-layout :is-collapsed="collapsed"></sidebar-layout>
    </a-layout-sider>
    <a-layout class="right-layout" :style="{ marginLeft: rightLayoutMarginLeft }">
      <a-layout-header class="header-layout"><header-layout></header-layout></a-layout-header>
      <a-layout-content class="content-layout">
        <content-layout></content-layout>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup>
import { ref, computed } from 'vue'

import SidebarLayout from '@/layout/SidebarLayout.vue'
import HeaderLayout from '@/layout/HeaderLayout.vue'
import ContentLayout from '@/layout/ContentLayout.vue'

const collapsed = ref(false)
const rightLayoutMarginLeft = computed(() => {
  return collapsed.value ? '80px' : '200px'
})
</script>

<style scoped lang="less">
.main-layout {
  height: 100vh;
  .sidebar {
    overflow: auto;
    height: 100%;
    position: fixed;
  }
  .right-layout {
    transition: margin-left 0.3s ease;
    .header-layout {
      background: #fff;
      padding: 0;
    }
    .content-layout {
      overflow: auto;
      margin: 24px 16px 0;
    }
  }
}
</style>
