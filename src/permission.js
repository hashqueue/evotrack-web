import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import router from '@/router'
import { useUserStore } from '@/stores/user'
import { removeAllItem } from '@/utils/storage'
import { getUserPermissions } from '@/apis/system/permission'
import { generateRouteData } from '@/utils/common'

// 白名单
const routeWhiteList = ['/login']

/**
 * 添加动态路由
 * @param routesData
 */
const addDynamicRoutes = (routesData) => {
  // 动态添加可访问路由表
  for (const item of routesData) {
    // if (!router.hasRoute(item.name)) {
    if (item.meta.parentRouteName !== null) {
      router.addRoute(item.meta.parentRouteName, item)
    } else {
      router.addRoute('index', item)
    }
    // }
  }
}

/**
 * 获取用户菜单权限，添加动态路由
 * @param userStore
 * @returns {Promise<unknown>}
 */
const getMenuPermission2Routes = async (userStore) => {
  try {
    const res = await getUserPermissions()
    const routesData = generateRouteData(res.menu_permissions)
    addDynamicRoutes(routesData)
    userStore.setMenuPermissions(res.menu_permissions)
    userStore.setButtonPermissions(res.button_permissions)
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * 路由全局解析守卫
 * 和 router.beforeEach 类似，因为它在每次导航时都会触发
 * 不同的是，解析守卫刚好会在导航被确认之前、所有组件内守卫和异步路由组件被解析之后调用。
 */
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  NProgress.start() // start progress bar
  // 存在token
  if (userStore.getToken) {
    if (!userStore.getMenuPermissions) {
      try {
        await getMenuPermission2Routes(userStore) // 等待动态路由加载完成
        next({ ...to, replace: true })
      } catch (error) {
        console.error('Error loading dynamic routes:', error)
        removeAllItem()
        next('/login')
      }
    } else {
      addDynamicRoutes(generateRouteData(userStore.getMenuPermissions))
      if (to.matched.length === 0 && from.matched.length === 0) {
        // 刷新页面时页面白屏处理
        next({ ...to, replace: true })
      } else if (to.matched.length === 0 && from.matched.length !== 0) {
        // 未匹配到路由path时跳转到404页面
        next({ path: '/404' })
      } else {
        next()
      }
    }
  } else if (routeWhiteList.includes(to.path)) {
    // 没有token的情况下，可以进入白名单
    next()
  } else {
    removeAllItem()
    next('/login')
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})

// 按钮级别权限控制通过自定义指令v-permission实现，Usage：v-permission="'新增部门'"
export const permission = {
  // mounted是指令的一个生命周期
  mounted(el, binding, vnode, prevVnode) {
    const userStore = useUserStore()
    // value 获取用户使用自定义指令绑定的内容
    const { value } = binding
    // console.log(value)
    // 获取用户所有的权限按钮
    const buttonPermissions = userStore.getButtonPermissions
    // 判断用户使用自定义指令，是否使用正确了
    if (value && value !== '') {
      //判断自定义指令传递进来的按钮权限，用户是否拥有
      const hasPermission = buttonPermissions.includes(value)
      // console.log('permission', value, 'hasPermission', hasPermission)
      // 当用户没有这个按钮权限时，设置隐藏这个按钮
      if (!hasPermission) {
        el.style.display = 'none'
      }
    } else {
      throw new Error('need permissions! Like v-permission="\'新增部门\'"')
    }
  }
}
