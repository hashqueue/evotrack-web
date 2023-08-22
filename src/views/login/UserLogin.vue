<template>
  <a-spin tip="正在登录中..." :spinning="spinning">
    <div class="base-container" ref="box">
      <div class="top">
        <div class="header">
          <img alt="logo" class="logo" src="@/assets/logo.svg" />
          <span class="title">{{ title }}</span>
        </div>
        <div class="desc">{{ titleDesc }}</div>
        <div>
          <div class="desc-item">用户名：test，密码：test3306，拥有普通用户权限</div>
          <div class="desc-item">用户名：admin，密码：admin3306，拥有超级管理员权限</div>
          <div class="desc-item">演示环境默认禁用所有数据删除权限</div>
        </div>
      </div>
      <div class="login-box">
        <a-form
          ref="loginFormRef"
          :model="loginForm"
          name="login"
          :rules="loginRules"
          @finish="onLoginFinish"
          @finishFailed="onLoginFinishFailed"
        >
          <a-form-item name="username">
            <a-input
              v-model:value="loginForm.username"
              size="large"
              placeholder="请输入用户名或邮箱"
              allow-clear
            >
              <template #prefix>
                <UserOutlined />
              </template>
            </a-input>
          </a-form-item>

          <a-form-item name="password">
            <a-input-password
              v-model:value="loginForm.password"
              size="large"
              placeholder="请输入密码"
              allow-clear
            >
              <template #prefix>
                <LockOutlined />
              </template>
            </a-input-password>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" size="large" class="login-button" html-type="submit"
              >登录</a-button
            >
          </a-form-item>
        </a-form>
      </div>
    </div>
  </a-spin>
</template>

<script setup>
import { reactive, ref, onBeforeUnmount, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import * as THREE from 'three'
import CompObj from 'vanta/dist/vanta.clouds.min' // (ripple || fog || waves || clouds)

import { login } from '@/apis/auth/login'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const title = import.meta.env.VITE_TITLE
const titleDesc = import.meta.env.VITE_TITLE_DESC

// set background
//使用ref引用挂载区域
const box = ref(null)
//创建一个全局的变量来使用vanta.js
let vantaEffect = null
//在两个生命周期钩子内创建vantaEffect
onMounted(() => {
  vantaEffect = CompObj({
    el: box.value,
    THREE: THREE
  })
})
onBeforeUnmount(() => {
  if (vantaEffect) {
    vantaEffect.destroy()
  }
})

// login
const userStore = useUserStore()
const spinning = ref(false)
const loginFormRef = ref()
const loginForm = reactive({
  username: '',
  password: ''
})
const loginRules = {
  username: [{ required: true, trigger: 'change', message: '用户名或邮箱不能为空' }],
  password: [{ required: true, trigger: 'change', message: '密码不能为空' }]
}
const onLoginFinish = (values) => {
  spinning.value = true
  login(values)
    .then((res) => {
      userStore.setToken(res.access)
      loginFormRef.value.resetFields()
      router.push('/dashboard')
      spinning.value = false
    })
    .catch(() => {
      spinning.value = false
    })
}
const onLoginFinishFailed = () => {
  message.error('输入有误')
}
</script>

<style scoped lang="less">
.base-container {
  display: flex;
  // 元素垂直显示
  flex-direction: column;
  height: 100vh;
  overflow: auto;
  //background: #f0f2f5 url('src/assets/background.svg') no-repeat;
  background-position-x: center;
  background-position-y: 110px;
  background-size: 100%;
  @media (min-width: 768px) {
    padding: 112px 0 24px;
  }
  .top {
    text-align: center;
    .header {
      height: 44px;
      line-height: 44px;
      .logo {
        height: 44px;
        vertical-align: top;
        margin-right: 16px;
      }
      .title {
        font-size: 33px;
        color: fade(#000, 85%);
        font-family: 'Myriad Pro', 'Helvetica Neue', Arial, Helvetica, sans-serif;
        font-weight: 600;
        position: relative;
        top: 2px;
      }
    }
    .desc {
      font-size: 14px;
      color: fade(#000, 80%);
      margin-top: 12px;
      margin-bottom: 40px;
    }
    .desc-item {
      margin-top: 6px;
    }
  }
  .login-box {
    width: 400px;
    margin: 50px auto;
    .login-button {
      width: 100%;
    }
  }
}
</style>
