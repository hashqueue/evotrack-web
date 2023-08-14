<template>
  <standard-modal
    :modal-open="modalOpen"
    :modal-width="600"
    :modal-title="title"
    :modal-ok-text="'提交'"
    :modal-cancel-text="'取消'"
    @on-modal-ok="onOk"
    @on-modal-cancel="onCancel"
  >
    <template #form>
      <a-alert
        message="新增用户后默认密码为88888888，用户可自行去个人中心重置密码。"
        type="success"
        style="margin-bottom: 30px"
        v-if="title === '新增用户'"
      />
      <a-form
        ref="createUpdateFormRef"
        :model="createUpdateForm"
        :rules="createUpdateRules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-item name="username" label="用户名">
          <a-input v-model:value="createUpdateForm.username" placeholder="请输入用户名" />
        </a-form-item>
        <a-form-item name="email" label="邮箱">
          <a-input v-model:value="createUpdateForm.email" placeholder="请输入邮箱" />
        </a-form-item>
        <a-form-item name="nick_name" label="昵称">
          <a-input v-model:value="createUpdateForm.nick_name" placeholder="请输入昵称" />
        </a-form-item>
        <a-form-item name="position" label="职位">
          <a-input v-model:value="createUpdateForm.position" placeholder="请输入职位" />
        </a-form-item>
        <a-form-item name="roles" label="角色">
          <a-select
            v-model:value="createUpdateForm.roles"
            mode="multiple"
            style="width: 100%"
            placeholder="请选择角色"
            :options="roleOptions"
          ></a-select>
        </a-form-item>
        <a-form-item name="department" label="部门">
          <a-tree-select
            v-model:value="createUpdateForm.department"
            placeholder="请选择部门"
            allow-clear
            tree-default-expand-all
            :tree-data="deptTreeSelectTreeData"
          >
          </a-tree-select>
        </a-form-item>
        <a-form-item name="gender" label="性别">
          <a-radio-group v-model:value="createUpdateForm.gender" name="permType">
            <a-radio :value="1">男</a-radio>
            <a-radio :value="2">女</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </template>
  </standard-modal>
</template>

<script setup>
import { ref, watch } from 'vue'
import { createUser, updateUser, getUserDetail } from '@/apis/system/user'
import { getRoleList } from '@/apis/system/role'
import { convertDeptTreeData2TreeSelectData } from '@/utils/common'
import { getDepartmentTreeList } from '@/apis/system/department'
import StandardModal from '@/components/StandardModal.vue'

const props = defineProps({
  userId: {
    type: [Number, null],
    required: false
  },
  modalOpen: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    required: true
  }
})
const emit = defineEmits(['closeModal', 'getLatestUserList'])

const deptTreeSelectTreeData = ref([])
const roleOptions = ref([])

const createUpdateForm = ref({
  username: '',
  email: '',
  nick_name: '',
  gender: null,
  position: '',
  department: null,
  roles: []
})
const createUpdateFormRef = ref()
const labelCol = { span: 3 }
const wrapperCol = { span: 24 }
const createUpdateRules = {
  username: [
    { required: true, trigger: 'change', message: '用户名不能为空' },
    { max: 150, trigger: 'change', message: '用户名不能多于150位' }
  ],
  email: [
    { required: true, trigger: 'change', message: '邮箱不能为空' },
    { max: 254, trigger: 'change', message: '邮箱不能多于254位' }
  ],
  position: [{ max: 64, trigger: 'change', message: '职位不能多于64位' }]
}
const onOk = () => {
  createUpdateFormRef.value
    .validateFields()
    .then((values) => {
      if (props.title === '修改用户') {
        updateUser(props.userId, values).then(() => {
          // 重新获取一遍用户信息
          emit('getLatestUserList')
          createUpdateFormRef.value.resetFields()
          emit('closeModal')
        })
      } else {
        createUser(values).then(() => {
          emit('getLatestUserList')
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
watch(
  () => props.modalOpen,
  (newValue, oldValue) => {
    if (newValue) {
      // 当弹窗打开时，获取部门树和角色列表
      getDepartmentTreeList().then((res) => {
        deptTreeSelectTreeData.value = convertDeptTreeData2TreeSelectData(res.results)
      })
      // 角色一般来说不会有那么多，所以这里直接获取50个角色
      getRoleList({ page: 1, page_size: 50 }).then((res) => {
        const tmpRoleArr = []
        for (const item of res.results) {
          tmpRoleArr.push({ value: item.id, label: item.name })
        }
        roleOptions.value = tmpRoleArr
      })
    }
    if (props.title === '修改用户') {
      getUserDetail(props.userId).then((res) => {
        const { username, email, nick_name, gender, position, department, roles } = res
        const tmpRoleList = []
        for (const role of roles) {
          tmpRoleList.push(role.id)
        }
        createUpdateForm.value = {
          username,
          email,
          nick_name,
          position,
          gender,
          department: department !== null ? department.id : null,
          roles: tmpRoleList
        }
      })
    }
  }
)
</script>

<style scoped></style>
