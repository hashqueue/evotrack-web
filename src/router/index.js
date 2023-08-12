import { createRouter, createWebHashHistory } from 'vue-router'

const BasicLayout = () => import('@/layout/BasicLayout.vue')
const publicRoutes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/UserLogin.vue')
  },
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    redirect: '/dashboard',
    children: [
      {
        path: '/403',
        name: '/403',
        component: () => import('@/views/errorPage/Exc403View.vue')
      },
      {
        path: '/404',
        name: '/404',
        component: () => import('@/views/errorPage/Exc404View.vue')
      },
      {
        path: '/500',
        name: '/500',
        component: () => import('@/views/errorPage/Exc500View.vue')
      }
      // {
      //   path: '/:pathMatch(.*)*',
      //   name: 'notFound',
      //   // 访问未在路由表中定义的路径则重定向到404页面
      //   redirect: '/404'
      // }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: [...publicRoutes]
})

export default router
