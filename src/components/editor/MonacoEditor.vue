<template>
  <div :id="editorId" :style="{ width: aDivWidth, height: aDivHeight }"></div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import * as monaco from 'monaco-editor'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

/**
 * setup MonacoEnvironment
 * @type {{getWorker(*, *): (*)}}
 */
self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === 'json') {
      return new jsonWorker()
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return new cssWorker()
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return new htmlWorker()
    }
    if (label === 'typescript' || label === 'javascript') {
      return new tsWorker()
    }
    return new editorWorker()
  }
}

let editor
const editorId = Math.random().toString(36).slice(-10)
const props = defineProps({
  contentValue: {
    type: String,
    required: true
  },
  editorOptions: {
    type: Object,
    required: true
  }
})
const aDivWidth = ref('100%')
const aDivHeight = ref('400px')
const emit = defineEmits(['update:contentValue'])

watch(
  () => props.contentValue,
  async (newContentValue, oldContentValue) => {
    if (editor) {
      if (newContentValue !== editor.getValue()) {
        editor.setValue(newContentValue)
      }
    }
  }
)

watch(
  () => props.editorOptions,
  async (newEditorOptions, oldEditorOptions) => {
    if (editor) {
      // 动态更新editor的options
      editor.updateOptions(newEditorOptions)
    }
  },
  { deep: true } //强制转成深层侦听器
)

onMounted(() => {
  const { divWidth, divHeight, ...aEditorOptions } = props.editorOptions
  aDivWidth.value = divWidth
  aDivHeight.value = divHeight
  // 创建editor并挂载
  editor = monaco.editor.create(document.getElementById(editorId), {
    value: props.contentValue,
    ...aEditorOptions
  })
  editor.onDidChangeModelContent(() => {
    const currentValue = editor.getValue()
    if (currentValue !== props.contentValue) {
      emit('update:contentValue', currentValue)
    }
  })
})

onUnmounted(() => {
  // 销毁editor
  editor.dispose()
})
</script>

<style scoped></style>
