<template>
  <a-result
    v-if="status"
    :status="status"
    :title="descriptionData[status].title"
    :sub-title="descriptionData[status].subTitle"
  >
    <template #extra>
      <a-button type="primary" @click="router.push('/')">返回首页</a-button>
    </template>
  </a-result>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
defineProps({
  status: {
    type: String,
    required: true
  }
})
const descriptionData = {
  403: {
    title: '403',
    subTitle: '抱歉，您无权访问此页面'
  },
  404: {
    title: '404',
    subTitle: '抱歉，您访问的页面不存在'
  },
  500: {
    title: '500',
    subTitle: '抱歉，服务器报告错误'
  }
}
</script>

<style scoped></style>
