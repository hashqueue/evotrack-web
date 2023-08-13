<template>
  <standard-modal
    :modal-open="modelOpen"
    :modal-width="500"
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
        <a-form-item name="name" label="角色名称">
          <a-input v-model:value="createUpdateForm.name" placeholder="请输入角色名称" />
        </a-form-item>
        <a-form-item name="desc" label="角色描述">
          <a-input v-model:value="createUpdateForm.desc" placeholder="请输入角色描述" />
        </a-form-item>
      </a-form>
    </template>
  </standard-modal>
</template>

<script setup>
import { ref, watch } from 'vue'
import { createRole, updateRole, getRoleDetail } from '@/apis/system/role'
import StandardModal from '@/components/StandardModal.vue'

const props = defineProps({
  roleId: {
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
const emit = defineEmits(['closeModal', 'getLatestRoleList'])
const createUpdateForm = ref({
  name: '',
  desc: ''
})
const createUpdateFormRef = ref()
const labelCol = { span: 5 }
const wrapperCol = { span: 20 }
const createUpdateRules = {
  name: [
    { required: true, trigger: 'change', message: '角色名称不能为空' },
    { max: 32, trigger: 'change', message: '角色名称不能多于32位' }
  ],
  desc: [{ max: 64, trigger: 'change', message: '角色描述不能多于64位' }]
}

watch(
  () => props.modelOpen,
  (newValue, oldValue) => {
    if (props.title === '修改角色') {
      getRoleDetail(props.roleId).then((res) => {
        const { name, desc } = res
        createUpdateForm.value = {
          name: name,
          desc: desc
        }
      })
    }
  }
)

const onOk = () => {
  createUpdateFormRef.value
    .validateFields()
    .then((values) => {
      if (props.title === '修改角色') {
        updateRole(props.roleId, values).then(() => {
          // 重新获取一遍角色信息
          emit('getLatestRoleList')
          createUpdateFormRef.value.resetFields()
          emit('closeModal')
        })
      } else {
        createRole(values).then(() => {
          emit('getLatestRoleList')
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
