<template>
  <a-skeleton :loading="skeletonLoading" active>
    <a-row justify="space-between">
      <a-col :span="12">
        <a-card class="statistic-card">
          <a-statistic title="角色数量" :value="userStatisticsData.role_count" />
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card class="statistic-card">
          <a-statistic title="权限数量" :value="userStatisticsData.permission_count" />
        </a-card>
      </a-col>
    </a-row>

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
  </a-skeleton>
</template>

<script setup>
import { ref } from 'vue'
import MonacoEditor from '@/components/editor/MonacoEditor.vue'
import { getUserStatistics } from '@/apis/system/user'

const skeletonLoading = ref(true)
const userStatisticsData = ref({
  role_count: null,
  permission_count: null
})
getUserStatistics().then((res) => {
  const { role_count, permission_count } = res
  userStatisticsData.value = { role_count, permission_count }
  skeletonLoading.value = false
})

const pythonCode = ref(
  'def convert_tree2list(tree_data):\n' +
    '    """\n' +
    '    将树形结构数据转换为列表结构数据, 列表结构数据中的每一项不能包含children\n' +
    '    @param tree_data:\n' +
    '    @return:\n' +
    '    """\n' +
    '    order_list_data = []\n' +
    '    for item in tree_data:\n' +
    "        if item.get('children'):\n" +
    "            children = item.pop('children')\n" +
    '            order_list_data.append(item)\n' +
    '            order_list_data.extend(convert_tree2list(children))\n' +
    '        else:\n' +
    '            order_list_data.append(item)\n' +
    '    return order_list_data\n'
)
const jsonCode = ref(
  '{\n' +
    '  "success": true,\n' +
    '  "message": "success",\n' +
    '  "data": {\n' +
    '    "id": 1,\n' +
    '    "date_joined": "2023-08-08 22:29:51",\n' +
    '    "department": {\n' +
    '      "id": 6,\n' +
    '      "created_at": "2023-08-13 17:01:51",\n' +
    '      "updated_at": "2023-08-13 17:03:29",\n' +
    '      "created_by": "username1",\n' +
    '      "updated_by": "username1",\n' +
    '      "name": "研发部",\n' +
    '      "parent": 4\n' +
    '    },\n' +
    '    "roles": [\n' +
    '      {\n' +
    '        "id": 1,\n' +
    '        "created_at": "2023-08-08 22:33:07",\n' +
    '        "updated_at": "2023-08-15 21:40:32",\n' +
    '        "created_by": "username1",\n' +
    '        "updated_by": "username1",\n' +
    '        "name": "superadmin",\n' +
    '        "desc": "超级管理员",\n' +
    '        "permissions": [\n' +
    '          1,\n' +
    '          2,\n' +
    '          6,\n' +
    '          10,\n' +
    '          11,\n' +
    '          18,\n' +
    '          19,\n' +
    '          20\n' +
    '        ]\n' +
    '      },\n' +
    '      {\n' +
    '        "id": 4,\n' +
    '        "created_at": "2023-08-13 16:08:50",\n' +
    '        "updated_at": "2023-08-14 23:11:47",\n' +
    '        "created_by": "username1",\n' +
    '        "updated_by": "username1",\n' +
    '        "name": "guest",\n' +
    '        "desc": "游客用户角色",\n' +
    '        "permissions": [\n' +
    '          1\n' +
    '        ]\n' +
    '      }\n' +
    '    ],\n' +
    '    "username": "username1",\n' +
    '    "email": "username1@qq.com",\n' +
    '    "is_active": true,\n' +
    '    "nick_name": "无极剑圣",\n' +
    '    "gender": 1,\n' +
    '    "avatar": "http://127.0.0.1:8000/media/avatars/ninja.png",\n' +
    '    "position": ""\n' +
    '  }\n' +
    '}'
)
const pythonEditorOptions = ref({
  formatOnPaste: true,
  formatOnType: true,
  automaticLayout: true, // 自动撑开布局
  language: 'python', // 语言
  readOnly: true, // 只读
  tabSize: 4, // tab 缩进长度
  fontSize: 16, // 字体大小
  scrollBeyondLastLine: false, // 是否允许滚动超过最后一行
  theme: 'vs-dark', // 官方自带三种主题vs, hc-black, or vs-dark
  divWidth: '100%',
  divHeight: '550px',
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
  scrollBeyondLastLine: false, // 是否允许滚动超过最后一行
  theme: 'vs-dark', // 官方自带三种主题vs, hc-black, or vs-dark
  divWidth: '100%',
  divHeight: '550px',
  minimap: {
    enabled: false // 不显示代码缩略图
  }
})
</script>

<style scoped>
.card {
  height: 700px;
  width: 99%;
}
.statistic-card {
  width: 99%;
  margin-bottom: 10px;
}
</style>
