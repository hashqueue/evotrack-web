<template>
  <standard-modal
    :modal-open="modelOpen"
    :modal-width="700"
    :modal-title="title"
    :modal-ok-text="'提交'"
    :modal-cancel-text="'取消'"
    @on-modal-ok="onOk"
    @on-modal-cancel="onCancel"
  >
    <template #form>
      <a-form
        ref="createUpdateFormRef"
        :model="createUpdateForm"
        :rules="createUpdateRules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-item name="name" label="权限名称">
          <a-input v-model:value="createUpdateForm.name" placeholder="请输入权限名称(值唯一)" />
        </a-form-item>
        <a-form-item name="perm_type" label="类型">
          <a-radio-group v-model:value="createUpdateForm.perm_type" name="permType">
            <a-radio :value="1">菜单</a-radio>
            <a-radio :value="2">目录</a-radio>
            <a-radio :value="3">按钮</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item name="icon" label="图标" v-show="[1, 2].includes(createUpdateForm.perm_type)">
          <a-input
            v-model:value="createUpdateForm.icon"
            placeholder="请输入图标code(详见https://www.antdv.com/components/icon-cn)"
            addon-before="<"
            addon-after="/>"
          />
        </a-form-item>
        <a-form-item name="component" label="组件路径" v-show="createUpdateForm.perm_type === 1">
          <a-input
            v-model:value="createUpdateForm.component"
            placeholder="请输入组件路径(system/permission/PermissionList)"
            addon-before="@/views/"
            addon-after=".vue"
          />
        </a-form-item>
        <a-form-item
          name="path"
          label="路由path"
          v-show="[1, 2].includes(createUpdateForm.perm_type)"
        >
          <a-input v-model:value="createUpdateForm.path" placeholder="请输入路由path(/system)" />
        </a-form-item>
        <a-form-item
          name="redirect"
          label="路由重定向path"
          v-show="[1, 2].includes(createUpdateForm.perm_type)"
        >
          <a-input
            v-model:value="createUpdateForm.redirect"
            placeholder="请输入路由重定向path(/system/users)"
          />
        </a-form-item>
        <a-form-item name="is_visible" label="是否显示">
          <a-switch v-model:checked="createUpdateForm.is_visible" />
        </a-form-item>
        <a-form-item name="parent" label="父权限" v-if="title !== '新增根权限'">
          <a-select
            v-model:value="createUpdateForm.parent"
            show-search
            placeholder="输入权限名称以进行(模糊)搜索"
            :default-active-first-option="false"
            :show-arrow="true"
            :filter-option="false"
            :options="parentOptions"
            @search="handleSearch"
            @change="handleChange"
          ></a-select>
        </a-form-item>
      </a-form>
    </template>
  </standard-modal>
</template>

<script setup>
import { ref, watch } from 'vue'
import {
  getPermissionList,
  createPermission,
  updatePermission,
  getPermissionDetail
} from '@/apis/system/permission'
import { isSelectOptionsIncludeSelectedData } from '@/utils/common'
import StandardModal from '@/components/StandardModal.vue'
import { permTypeEnum } from '@/utils/enum'

const props = defineProps({
  permissionId: {
    type: [Number, null],
    required: false
  },
  modelOpen: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    required: true
  }
})
const emit = defineEmits(['closeModal', 'getLatestPermissionList'])

const labelCol = { span: 4 }
const wrapperCol = { span: 20 }
const parentOptions = ref([])
const createUpdateFormRef = ref()
const createUpdateForm = ref({
  name: '',
  perm_type: 1,
  icon: '',
  component: '',
  path: '',
  redirect: '',
  is_visible: true,
  parent: undefined
})
const createUpdateRules = {
  name: [
    { required: true, trigger: 'change', message: '权限名称不能为空' },
    { max: 64, trigger: 'change', message: '权限名称不能多于64位' }
  ],
  icon: [{ max: 64, trigger: 'change', message: '图标不能多于64位' }],
  component: [{ max: 255, trigger: 'change', message: '组件路径不能多于255位' }],
  path: [{ max: 255, trigger: 'change', message: '路由path不能多于255位' }],
  redirect: [{ max: 255, trigger: 'change', message: '路由重定向path不能多于255位' }]
}

watch(
  () => props.modelOpen,
  (newValue, oldValue) => {
    if (props.title !== '新增根权限') {
      getPermissionDetail(props.permissionId).then((res) => {
        if (props.title === '添加子权限') {
          if (!isSelectOptionsIncludeSelectedData(parentOptions.value, res.id, 'value')) {
            const data = {
              label: `${res.name} - ${permTypeEnum[res.perm_type].value}`,
              value: res.id
            }
            parentOptions.value.push(data)
          }
          createUpdateForm.value = {
            name: '',
            perm_type: 1,
            icon: '',
            component: '',
            path: '',
            redirect: '',
            is_visible: true,
            parent: res.id
          }
        } else if (props.title === '修改权限' || props.title === '复制权限') {
          const { name, perm_type, icon, component, path, redirect, is_visible, parent } = res
          const parentValue = parent ? parent.id : undefined
          if (parentValue) {
            if (!isSelectOptionsIncludeSelectedData(parentOptions.value, res.parent.id, 'value')) {
              const data = {
                label: `${res.parent.name} - ${permTypeEnum[res.parent.perm_type].value}`,
                value: res.parent.id
              }
              parentOptions.value.push(data)
            }
          }
          createUpdateForm.value = {
            name,
            perm_type,
            icon,
            component,
            path,
            redirect,
            is_visible,
            parent: parentValue
          }
        }
      })
    }
  }
)
getPermissionList({ page: 1, page_size: 50 }).then((res) => {
  for (const originPermission of res.results) {
    if (!isSelectOptionsIncludeSelectedData(parentOptions.value, originPermission.id, 'value')) {
      const data = {
        label: `${originPermission.name} - ${permTypeEnum[originPermission.perm_type].value}`,
        value: originPermission.id
      }
      parentOptions.value.push(data)
    }
  }
})
const handleSearch = (val) => {
  getPermissionList({ name: val }).then((res) => {
    for (const originPermission of res.results) {
      if (!isSelectOptionsIncludeSelectedData(parentOptions.value, originPermission.id, 'value')) {
        const data = {
          label: `${originPermission.name} - ${permTypeEnum[originPermission.perm_type].value}`,
          value: originPermission.id
        }
        parentOptions.value.push(data)
      }
    }
  })
}

const handleChange = (val) => {
  createUpdateForm.value.parent = val
}
const onOk = () => {
  createUpdateFormRef.value
    .validateFields()
    .then((values) => {
      if (props.title === '修改权限') {
        updatePermission(props.permissionId, values).then(() => {
          // 重新获取一遍权限信息
          emit('getLatestPermissionList')
          createUpdateFormRef.value.resetFields()
          emit('closeModal')
        })
      } else {
        createPermission(values).then(() => {
          emit('getLatestPermissionList')
          createUpdateFormRef.value.resetFields()
          emit('closeModal')
        })
      }
    })
    .catch((info) => {
      console.log('Validate Failed:', info)
    })
}
const onCancel = () => {
  createUpdateFormRef.value.resetFields()
  emit('closeModal')
}
</script>

<style scoped></style>
