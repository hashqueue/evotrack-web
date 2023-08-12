<template>
  <component
    class="fullscreen"
    :is="isFullscreen ? 'fullscreen-exit-outlined' : 'fullscreen-outlined'"
    @click="onToggle"
  />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import screenfull from 'screenfull'

const emit = defineEmits(['onFullscreen'])
// 是否全屏
const isFullscreen = ref(false)

// 监听变化
const change = () => {
  isFullscreen.value = screenfull.isFullscreen
  emit('onFullscreen', isFullscreen.value)
}

// 切换事件
const onToggle = () => {
  screenfull.toggle()
}

// 设置侦听器
onMounted(() => {
  screenfull.on('change', change)
})

// 删除侦听器
onUnmounted(() => {
  screenfull.off('change', change)
})
</script>

<style scoped>
.fullscreen {
  transition: 0.4s;
}
</style>
