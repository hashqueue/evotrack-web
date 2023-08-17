<template>
  <a-card :style="{ width: '50%' }">
    <template #actions>
      <a-tooltip>
        <template #title>修改个人信息</template>
        <edit-outlined
          @click="editProfile"
          v-permission="btnPermissions.userProfile.updateProfile"
        />
      </a-tooltip>
      <a-tooltip>
        <template #title>重置密码</template>
        <unlock-outlined
          @click="resetPassword"
          v-permission="btnPermissions.userProfile.resetPassword"
        />
      </a-tooltip>
    </template>
    <a-card-meta title="个人资料" description="心之所向，素履以往~">
      <template #avatar v-if="userInfo">
        <a-avatar :size="96" shape="square" :src="userInfo.avatar" />
      </template>
    </a-card-meta>
    <a-descriptions class="content" v-if="userInfo">
      <a-descriptions-item label="用户名">{{ userInfo.username }}</a-descriptions-item>
      <a-descriptions-item label="邮箱">{{ userInfo.email }}</a-descriptions-item>
      <a-descriptions-item label="昵称">{{ userInfo.nick_name }}</a-descriptions-item>
      <a-descriptions-item label="性别">{{
        userInfo.gender === 1 ? '男' : '女'
      }}</a-descriptions-item>
      <a-descriptions-item label="职位">{{ userInfo.position }}</a-descriptions-item>
      <a-descriptions-item label="部门" v-if="userInfo.department">{{
        userInfo.department.name
      }}</a-descriptions-item>
      <a-descriptions-item label="加入时间">{{ userInfo.date_joined }}</a-descriptions-item>
      <a-descriptions-item label="角色">
        <template v-for="(role, index) in userInfo.roles" :key="index">
          <a-tag color="blue">{{ role.name }}</a-tag>
        </template>
      </a-descriptions-item>
    </a-descriptions>
  </a-card>
  <standard-modal
    :modal-open="resetModalOpen"
    :modal-width="500"
    :modal-title="'重置密码'"
    :modal-ok-text="'提交'"
    :modal-cancel-text="'取消'"
    :confirm-loading="resetConfirmLoading"
    @on-modal-ok="onResetOk"
    @on-modal-cancel="onResetCancel"
  >
    <template #form>
      <a-alert
        message="提示"
        description="修改密码成功后，会立即退出系统，需重新登录"
        type="info"
        show-icon
        style="margin-bottom: 30px"
      />
      <a-form
        ref="resetFormRef"
        :model="resetPasswordForm"
        :rules="resetRules"
        :label-col="passwordLabelCol"
        :wrapper-col="passwordWrapperCol"
      >
        <a-form-item name="old_password" label="原密码">
          <a-input-password
            v-model:value="resetPasswordForm.old_password"
            placeholder="请输入原密码"
          />
        </a-form-item>
        <a-form-item name="new_password" label="新密码">
          <a-input-password
            v-model:value="resetPasswordForm.new_password"
            placeholder="请输入新密码"
          />
        </a-form-item>
      </a-form>
    </template>
  </standard-modal>

  <standard-modal
    :modal-width="400"
    :modal-open="updateModalOpen"
    :modal-title="'修改个人信息'"
    :modal-ok-text="'提交'"
    :modal-cancel-text="'取消'"
    @on-modal-ok="onUpdateOk"
    @on-modal-cancel="onUpdateCancel"
  >
    <template #form>
      <a-form
        ref="updateFormRef"
        :model="updateProfileForm"
        :rules="updateRules"
        :label-col="profileLabelCol"
        :wrapper-col="profileWrapperCol"
      >
        <a-form-item name="nick_name" label="昵称">
          <a-input v-model:value="updateProfileForm.nick_name" placeholder="请输入昵称" />
        </a-form-item>
        <a-form-item name="gender" label="性别">
          <a-radio-group v-model:value="updateProfileForm.gender">
            <a-radio :value="1">男</a-radio>
            <a-radio :value="2">女</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </template>
  </standard-modal>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { EditOutlined, UnlockOutlined } from '@ant-design/icons-vue'
import { getUserProfile, resetUserPassword, updateUserProfile } from '@/apis/system/user'
import { removeAllItem } from '@/utils/storage'
import StandardModal from '@/components/StandardModal.vue'
import { useUserStore } from '@/stores/user'
import { btnPermissions } from '@/utils/enum'

const router = useRouter()
const userStore = useUserStore()

// update profile
const updateFormRef = ref()
const profileLabelCol = { span: 4 }
const profileWrapperCol = { span: 24 }
const updateModalOpen = ref(false)
const updateProfileForm = ref({
  nick_name: '',
  gender: null
})
const updateRules = {
  nick_name: [
    { required: true, trigger: 'change', message: '昵称不能为空' },
    { max: 20, trigger: 'change', message: '昵称不能多于20位' }
  ]
}
const editProfile = () => {
  updateModalOpen.value = true
}
const onUpdateOk = () => {
  updateFormRef.value
    .validateFields()
    .then((values) => {
      updateUserProfile(values).then(() => {
        // 重新获取一遍用户信息
        getUserInfo()
        updateModalOpen.value = false
        updateFormRef.value.resetFields()
      })
    })
    .catch((info) => {
      console.log('Validate Failed:', info)
    })
}
const onUpdateCancel = () => {
  updateModalOpen.value = false
  updateFormRef.value.resetFields()
}

// get user info
const userInfo = ref(null)
const getUserInfo = () => {
  getUserProfile().then((res) => {
    const { nick_name, gender } = res
    userInfo.value = res
    updateProfileForm.value = {
      nick_name,
      gender
    }
  })
}
getUserInfo()

// reset password
const resetFormRef = ref()
const passwordLabelCol = { span: 4 }
const passwordWrapperCol = { span: 24 }
const resetModalOpen = ref(false)
const resetConfirmLoading = ref(false)
const resetPasswordForm = reactive({
  old_password: '',
  new_password: ''
})
const resetRules = {
  old_password: [{ required: true, trigger: 'change', message: '原密码不能为空' }],
  new_password: [
    { required: true, trigger: 'change', message: '新密码不能为空' },
    { min: 8, trigger: 'change', message: '新密码不能少于8位' },
    { max: 128, trigger: 'change', message: '新密码不能多于128位' }
  ]
}
const resetPassword = () => {
  resetModalOpen.value = true
}
const onResetOk = () => {
  resetFormRef.value
    .validateFields()
    .then((values) => {
      resetConfirmLoading.value = true
      resetUserPassword(values)
        .then(() => {
          message.success('您已成功修改密码, 请重新登录')
          resetConfirmLoading.value = false
          resetModalOpen.value = false
          resetFormRef.value.resetFields()
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
        })
        .catch(() => {
          resetConfirmLoading.value = false
        })
    })
    .catch((info) => {
      console.log('Validate Failed:', info)
    })
}
const onResetCancel = () => {
  resetModalOpen.value = false
  resetFormRef.value.resetFields()
}
</script>

<style scoped>
.content {
  margin-top: 8px;
}
</style>
