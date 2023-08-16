import { createApp } from 'vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import * as AntdIcons from '@ant-design/icons-vue'

import pinia from '@/stores'
import App from './App.vue'
import router from './router'
import { permission } from '@/permission'

const app = createApp(App)

// 注册ant-design的所有图标
for (const [name, component] of Object.entries(AntdIcons)) {
  app.component(name, component)
}

app.directive('permission', permission)
app.use(pinia)
app.use(router)
app.use(Antd)

app.mount('#app')
