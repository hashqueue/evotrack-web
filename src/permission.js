import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import router from '@/router'
import { useUserStore } from '@/stores/user'
import { removeAllItem } from '@/utils/storage'
import { getUserPermissions } from '@/apis/system/permission'
import { generateRouteData } from '@/utils/common'

// 白名单
const routeWhiteList = ['/login', '/404', '/403', '/500']

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
const getMenuPermission2Routes = (userStore) => {
  return new Promise((resolve, reject) => {
    getUserPermissions()
      .then((res) => {
        const routesData = generateRouteData(res.menu_permissions)
        userStore.setMenuPermissions(res.menu_permissions)
        userStore.setButtonPermissions(res.button_permissions)
        addDynamicRoutes(routesData)
        resolve()
      })
      .catch((err) => {
        reject(err)
      })
  })
}

/**
 * 路由全局解析守卫
 * 和 router.beforeEach 类似，因为它在每次导航时都会触发
 * 不同的是，解析守卫刚好会在导航被确认之前、所有组件内守卫和异步路由组件被解析之后调用。
 */
router.beforeResolve(async (to, from, next) => {
  const userStore = useUserStore()
  NProgress.start() // start progress bar
  // 存在token
  if (userStore.getToken) {
    if (!userStore.getMenuPermissions) {
      try {
        await getMenuPermission2Routes(userStore) // 等待动态路由加载完成
        next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
      } catch (error) {
        console.error('Error loading dynamic routes:', error)
        removeAllItem()
        next('/login') // 加载失败时跳转到登录页面或其他处理
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
  } else {
    // 没有token的情况下，可以进入白名单
    if (routeWhiteList.includes(to.path)) {
      next()
    } else {
      removeAllItem()
      next('/login')
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
