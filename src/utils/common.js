import { h } from 'vue'
import * as AntdIcons from '@ant-design/icons-vue'

import { removeAllItem } from '@/utils/storage'
import router from '@/router'

export const redirectToLogin = () => {
  removeAllItem()
  router.push('/login')
}

export const isSelectOptionsIncludeSelectedData = (originOptions, data, OriginOptionsKey) => {
  let result = false
  for (const originOption of originOptions) {
    if (data === originOption[OriginOptionsKey]) {
      result = true
    }
  }
  return result
}

/**
 * 将树结构的部门数据转换为TreeSelect组件可用的数据
 * @param treeData
 * @returns {*[]}
 */
export const convertDeptTreeData2TreeSelectData = (treeData) => {
  const treeSelectData = []
  for (const item of treeData) {
    const tmpItem = {
      label: item.name,
      value: item.id
    }
    if (item.children) {
      tmpItem.children = convertDeptTreeData2TreeSelectData(item.children)
    }
    treeSelectData.push(tmpItem)
  }
  return treeSelectData
}

/**
 * 从树结构的数据过滤出默认需要展开的节点
 * @param treeData
 * @returns {*[]}
 */
export const filterDefaultExpandedRowKeys = (treeData) => {
  const expandedRowKeys = []
  for (const item of treeData) {
    if (item.children) {
      expandedRowKeys.push(item.id)
      expandedRowKeys.push(...filterDefaultExpandedRowKeys(item.children))
    }
  }
  return expandedRowKeys
}

/**
 * 将路由原始菜单权限数据转化为vue-router可用的数据，添加路由懒加载
 * @param originData
 * @returns {{}}
 */
const convertMenuPermission2Route = (originData) => {
  const modules = import.meta.glob(['../views/**/*.vue', '../layout/**/*.vue'])
  const routeData = {}
  routeData.path = originData['path']
  routeData.name = originData['path']
  if (originData['component'] !== '') {
    const component = modules[`../views/${originData['component']}.vue`]
    if (component) {
      routeData.component = component
    } else {
      routeData.component = modules['../views/errorPage/Exc404View.vue']
    }
  } else {
    // 如果没有设置component，则说明是目录，则使用默认的ContentLayout.vue
    routeData.component = modules['../layout/ContentLayout.vue']
  }
  if (originData['redirect'] !== '') {
    routeData.redirect = originData['redirect']
  }
  routeData.meta = {}
  routeData['meta']['title'] = originData['name']
  routeData['meta']['icon'] = originData['icon']
  return routeData
}

/**
 * 生成路由表数据(非树结构),组件设置路由懒加载
 * @param originMenuPermissionDataArr
 * @returns {*[]}
 */
export const generateRouteData = (originMenuPermissionDataArr) => {
  const routeDataObj = {}
  const routeData = []
  for (const item of originMenuPermissionDataArr) {
    routeDataObj[item.id] = item
  }
  for (const item of originMenuPermissionDataArr) {
    if (item.parent !== null) {
      const pid = item.parent
      const parent_data = routeDataObj[pid]
      if (parent_data) {
        // 如果父级存在，则将当前路由添加到父级的children中
        const tmpChildren = convertMenuPermission2Route(item)
        tmpChildren.meta.parentRouteName = parent_data.path
        tmpChildren.meta.id = item.id
        tmpChildren.meta.parentId = parent_data.id
        routeData.push(tmpChildren)
      }
    } else {
      const tmpParent = convertMenuPermission2Route(item)
      tmpParent.meta.parentRouteName = null
      tmpParent.meta.parentId = null
      tmpParent.meta.id = item.id
      routeData.push(tmpParent)
    }
  }
  return routeData
}

/**
 * 将字符串转换为图标组件名
 * @param inputIconString
 * @returns {*}
 */
const transformIconString = (inputIconString) => {
  // 将字符串按照 '-' 分割成单词数组
  const words = inputIconString.split('-')
  // 将每个单词的首字母大写，其余字母小写
  const capitalizedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  )
  // 将单词连接成最终的字符串
  return capitalizedWords.join('')
}

/**
 * 生成icon选择器的选项
 * @returns {*[]}
 */
export const getIconOptions = () => {
  const iconOptions = []
  for (const name of Object.keys(AntdIcons)) {
    if (!['createFromIconfontCN', 'getTwoToneColor', 'setTwoToneColor', 'default'].includes(name)) {
      iconOptions.push({
        value: name
      })
    }
  }
  return iconOptions
}

/**
 * 根据用户的原始菜单权限数据转换为标准的树结构的菜单格式数据
 */
export const generateTreeMenuData = (originMenuPermissionDataArr) => {
  const treeObj = {}
  for (const item of originMenuPermissionDataArr) {
    if (item.is_visible) {
      const tmpMenuData = {
        key: item.path,
        label: item.name,
        title: item.name
      }
      if (item.icon) {
        tmpMenuData.icon = () => h(AntdIcons[item.icon])
      }
      treeObj[item.id] = tmpMenuData
    }
  }
  const treeMenuData = []
  for (const item of originMenuPermissionDataArr) {
    if (item.is_visible) {
      const currentNode = treeObj[item.id]
      if (item.parent !== null) {
        const pid = item.parent
        const parent_data = treeObj[pid]
        if (parent_data) {
          // 如果父节点存在，则将当前节点添加到父节点的children中
          if (!parent_data.children) {
            parent_data.children = []
          }
          parent_data.children.push(currentNode)
        }
      } else {
        treeMenuData.push(currentNode)
      }
    }
  }
  return treeMenuData
}

/**
 * 根据用户所在当前页面的routeMatched数据转换为标准的树结构的面包屑格式的数据
 * @param routeMatchedData
 * @returns {*[]}
 */
export const generateBreadcrumbData = (routeMatchedData) => {
  const breadcrumbData = []
  for (let i = 0; i < routeMatchedData.length; i++) {
    if (i !== 0) {
      // 第一个元素是首页index，不需要添加
      breadcrumbData.push({
        path: routeMatchedData[i].path,
        name: routeMatchedData[i].name,
        breadcrumbName: routeMatchedData[i].meta.title
      })
    }
  }
  return breadcrumbData
}

/**
 * 将对象中的undefined值转换为null
 * @param obj
 */
export const changeObjValUndefined2Null = (obj) => {
  for (const key in obj) {
    if (obj[key] === undefined) {
      obj[key] = null
    }
  }
}
