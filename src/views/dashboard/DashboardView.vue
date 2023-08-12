<template>
  <a-row type="flex" justify="space-between">
    <a-col :span="12">
      <a-card title="Python" class="card">
        <a-switch
          style="margin-bottom: 15px"
          v-model:checked="pythonEditorOptions.readOnly"
          checked-children="只读状态"
          un-checked-children="编辑状态"
        />
        <monaco-editor
          v-model:content-value="pythonCode"
          :editor-options="pythonEditorOptions"
        ></monaco-editor>
      </a-card>
    </a-col>
    <a-col :span="12">
      <a-card title="JSON" class="card">
        <a-switch
          style="margin-bottom: 15px"
          v-model:checked="jsonEditorOptions.readOnly"
          checked-children="只读状态"
          un-checked-children="编辑状态"
        />
        <monaco-editor
          v-model:content-value="jsonCode"
          :editor-options="jsonEditorOptions"
        ></monaco-editor>
      </a-card>
    </a-col>
  </a-row>
</template>

<script setup>
import { ref } from 'vue'
import MonacoEditor from '@/components/editor/MonacoEditor.vue'
// import { getUserProfile } from '@/apis/system/user'
//
// getUserProfile().then((res) => {
//   console.log('dashboard', res)
// })

const pythonCode = ref(
  '# @FileName: custom_server_error_500_handler.py\n' +
    '\n' +
    'from django.http import JsonResponse\n' +
    'from rest_framework import status\n' +
    '\n' +
    '\n' +
    'def server_error(request, *args, **kwargs):\n' +
    '    """\n' +
    '    Generic 500 error handler.\n' +
    '    """\n' +
    '    data = {\n' +
    "        'code': 40000,\n" +
    "        'message': '服务器开小差了(500)',\n" +
    "        'data': None\n" +
    '    }\n' +
    '    return JsonResponse(data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)\n'
)
const jsonCode = ref(
  '{\n' +
    '  "username": "test",\n' +
    '  "department": null,\n' +
    '  "is_superuser": false,\n' +
    '  "email": "test@qq.com",\n' +
    '  "is_staff": false,\n' +
    '  "is_active": true,\n' +
    '  "name": "马保国",\n' +
    '  "birthday": "1952-03-16",\n' +
    '  "gender": "male",\n' +
    '  "mobile": "",\n' +
    '  "avatar": "http://127.0.0.1:8000/media/avatars/default.png",\n' +
    '  "position": "浑元形意太极拳掌门人"\n' +
    '}'
)
const pythonEditorOptions = ref({
  formatOnPaste: true,
  formatOnType: true,
  automaticLayout: true, // 自动撑开布局
  language: 'python', // 语言
  readOnly: true, // 只读
  tabSize: 2, // tab 缩进长度
  fontSize: 16, // 字体大小
  theme: 'vs-dark', // 官方自带三种主题vs, hc-black, or vs-dark
  divWidth: '100%',
  divHeight: '400px',
  minimap: {
    enabled: false // 不显示代码缩略图
  }
})
const jsonEditorOptions = ref({
  formatOnPaste: true,
  formatOnType: true,
  automaticLayout: true, // 自动撑开布局
  language: 'json', // 语言
  readOnly: true, // 只读
  tabSize: 2, // tab 缩进长度
  fontSize: 16, // 字体大小
  theme: 'vs-dark', // 官方自带三种主题vs, hc-black, or vs-dark
  divWidth: '100%',
  divHeight: '400px',
  minimap: {
    enabled: false // 不显示代码缩略图
  }
})
</script>

<style scoped>
.card {
  height: 560px;
  width: 99%;
  margin-bottom: 10px;
}
</style>
