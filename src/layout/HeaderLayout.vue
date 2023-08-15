<template>
  <div class="header-main">
    <a-row justify="space-between" align="middle">
      <a-col :span="16">
        <div>
          <a-breadcrumb>
            <template v-for="(item, index) in breadcrumbItems" :key="index">
              <a-breadcrumb-item v-if="index === breadcrumbItems.length - 1">
                {{ item.breadcrumbName }}
              </a-breadcrumb-item>
              <a-breadcrumb-item v-else>
                <router-link :to="item.path">{{ item.breadcrumbName }}</router-link>
              </a-breadcrumb-item>
            </template>
          </a-breadcrumb>
        </div>
      </a-col>
      <a-col :span="8" class="app-setting">
        <a-row justify="end">
          <a-col :span="2">
            <a-tooltip>
              <template #title>API文档</template>
              <component class="app-link" :is="'api-outlined'" @click="goToApiDocs" />
            </a-tooltip>
          </a-col>
          <a-col :span="2">
            <a-tooltip>
              <template #title>Github</template>
              <component class="app-link" :is="'github-outlined'" @click="goToGithub" />
            </a-tooltip>
          </a-col>
          <a-col :span="2">
            <a-tooltip>
              <template #title>{{ fullscreenTitle }}</template>
              <screenfull-view class="app-link" @on-fullscreen="onFullscreen" />
            </a-tooltip>
          </a-col>
          <a-col :span="2">
            <a-dropdown v-if="userInfo">
              <a-avatar style="margin-bottom: 8px" shape="square" :src="userInfo.avatar"></a-avatar>
              <template #overlay>
                <a-menu @click="clickUserSetting">
                  <a-menu-item :key="'1'">Hello {{ userInfo.username }}</a-menu-item>
                  <a-menu-item :key="'2'"><UserOutlined /> 个人中心</a-menu-item>
                  <a-menu-divider />
                  <a-menu-item :key="'3'"><LogoutOutlined /> 退出登录</a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { LogoutOutlined, UserOutlined } from '@ant-design/icons-vue'
import { notification } from 'ant-design-vue'

import ScreenfullView from '@/components/ScreenfullView.vue'
import { getUserProfile } from '@/apis/system/user'
import { getItem, removeAllItem, setItem } from '@/utils/storage'
import { useUserStore } from '@/stores/user'
import { generateBreadcrumbData } from '@/utils/common'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const breadcrumbItems = computed(() => {
  return generateBreadcrumbData(route.matched)
})
const userInfo = ref(null)
// 获取用户信息
getUserProfile().then((res) => {
  userInfo.value = res
  if (!getItem('welcomeNotification')) {
    notification.success({
      message: '欢迎回来',
      description: `欢迎回来，${res.username}`,
      placement: 'topRight',
      duration: 2
    })
    setItem('welcomeNotification', true)
  }
})

// 全屏 or 退出全屏
const fullscreenTitle = ref('全屏')
const onFullscreen = (isFullscreen) => {
  if (isFullscreen) {
    fullscreenTitle.value = '退出全屏'
  } else {
    fullscreenTitle.value = '全屏'
  }
}
const goToApiDocs = () => {
  if (import.meta.env.MODE === 'development') {
    window.open(`http://127.0.0.1:8000/api/v1/swagger/`)
    window.open(`http://127.0.0.1:8000/api/v1/redoc/`)
  } else {
    window.open(`http://${location.host}/api/v1/swagger/`)
    window.open(`http://${location.host}/api/v1/redoc/`)
  }
}
const goToGithub = () => {
  window.open('https://github.com/hashqueue/sugar')
}
const clickUserSetting = ({ item, key, keyPath }) => {
  if (key === '2') {
    router.push('/profile')
  } else if (key === '3') {
    // 退出登录
    // 删除当前登录用户拥有的动态路由权限
    for (const menuPermission of userStore.getMenuPermissions) {
      if (router.hasRoute(menuPermission.path)) {
        router.removeRoute(menuPermission.path)
      }
    }
    // 重置store的数据
    userStore.$reset()
    // 清除本地存储的数据
    removeAllItem()
    // 跳转到登录页
    router.push('/login')
  }
}
</script>

<style scoped lang="less">
.header-main {
  margin: 0 16px;
  .app-setting {
    cursor: pointer;
    .app-link {
      font-size: 21px;
      color: rgba(0, 0, 0, 0.75);
    }
  }
}
</style>
