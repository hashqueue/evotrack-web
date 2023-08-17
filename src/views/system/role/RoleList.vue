<template>
  <a-button type="primary" @click="createRole" v-permission="btnPermissions.role.create"
    >新增角色</a-button
  >
  <standard-table
    :data-source="dataList"
    :loading="tableLoading"
    :columns="columns"
    :row-key="'id'"
    :pagination="paginationData"
    @on-page-change="onPageChange"
  >
    <template #action="{ column, record }">
      <!--  record: 具名插槽作用域传值(父插槽内容中获取子组件数据record)  -->
      <template v-if="column.key === 'action'">
        <span>
          <a @click="updateRole(record)" v-permission="btnPermissions.role.update">修改</a>
          <a-divider type="vertical" />
          <a @click="setPermissions(record)" v-permission="btnPermissions.role.update">设置权限</a>
          <a-divider type="vertical" />
          <a-popconfirm
            title="确定删除该角色吗？"
            ok-text="确定"
            cancel-text="取消"
            @confirm="deleteRole(record.id)"
          >
            <a v-permission="btnPermissions.role.delete">删除</a>
          </a-popconfirm>
        </span>
      </template>
    </template>
  </standard-table>
  <role-form
    :modal-open="modalOpen"
    :title="title"
    :role-id="roleId"
    @close-modal="closeModal"
    @get-latest-role-list="getRoleListData"
  />
  <a-drawer :open="drawerOpen" :title="drawerTitle" width="40%" @close="closeDrawer">
    <a-alert
      message="提示"
      description="蓝色为菜单权限，绿色为目录权限，红色为按钮权限。"
      type="info"
      show-icon
      style="margin-bottom: 10px"
    />
    <a-tree
      :default-expand-all="true"
      :checked-keys="checkedKeys"
      :check-strictly="true"
      @check="getTreeCheckedKeys"
      checkable
      :tree-data="permissionTreeData"
    >
      <template #title="{ title, perm_type }">
        <span v-if="perm_type === 1" style="color: #1677ff">{{ title }}</span>
        <span v-else-if="perm_type === 2" style="color: #52c41a">{{ title }}</span>
        <span v-else style="color: #ff4d4f">{{ title }}</span>
      </template>
    </a-tree>
    <a-button type="primary" @click="submitPermissions" class="submit-btn">提交</a-button>
  </a-drawer>
</template>

<script setup>
import { ref } from 'vue'
import {
  deleteRoleDetail,
  getRoleList,
  getRoleDetail,
  updateRoleWithPatch
} from '@/apis/system/role'
import { getPermissionTreeList } from '@/apis/system/permission'
import RoleForm from './RoleForm.vue'
import StandardTable from '@/components/StandardTable.vue'
import { btnPermissions, permTypeEnum } from '@/utils/enum'

const dataList = ref([])
const title = ref('新增角色')
const modalOpen = ref(false)
const tableLoading = ref(false)
const roleId = ref(null)
const paginationData = ref({})
const columns = [
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '描述',
    dataIndex: 'desc',
    key: 'desc'
  },
  {
    title: '创建时间',
    dataIndex: 'created_at',
    key: 'created_at'
  },
  {
    title: '修改时间',
    dataIndex: 'updated_at',
    key: 'updated_at'
  },
  {
    title: '创建人',
    dataIndex: 'created_by',
    key: 'created_by'
  },
  {
    title: '修改人',
    dataIndex: 'updated_by',
    key: 'updated_by'
  },
  {
    title: '操作',
    key: 'action'
  }
]
const getRoleListData = () => {
  tableLoading.value = true
  getRoleList().then((res) => {
    const { page, results, page_size, count } = res
    dataList.value = results
    paginationData.value = {
      total: count,
      current: page,
      pageSize: page_size,
      pageSizeOptions: ['10', '20', '30', '40', '50'],
      showSizeChanger: true,
      showTotal: () => `共 ${count} 条`
    }
    tableLoading.value = false
  })
}
getRoleListData()
const onPageChange = (pagination, filters, sorter, currentDataSource) => {
  const params = {}
  params.page = pagination.current
  params.page_size = pagination.pageSize
  tableLoading.value = true
  getRoleList(params).then((res) => {
    const { page, results, page_size, count } = res
    dataList.value = results
    paginationData.value = {
      total: count,
      current: page,
      pageSize: page_size,
      pageSizeOptions: ['10', '20', '30', '40', '50'],
      showSizeChanger: true,
      showTotal: () => `共 ${count} 条`
    }
    tableLoading.value = false
  })
}
const createRole = () => {
  title.value = '新增角色'
  modalOpen.value = true
}
const closeModal = () => {
  title.value = '新增角色'
  modalOpen.value = false
}
const updateRole = (record) => {
  roleId.value = record.id
  title.value = '修改角色'
  modalOpen.value = true
}
const deleteRole = (roleId) => {
  deleteRoleDetail(roleId).then(() => {
    getRoleListData()
  })
}

// 为角色设置权限
const permissionTreeData = ref([])
const checkedKeys = ref({ checked: [], halfChecked: [] })
const drawerOpen = ref(false)
const drawerTitle = ref('')
const setPermissionsRoleId = ref(null)
const closeDrawer = () => {
  checkedKeys.value = { checked: [], halfChecked: [] }
  drawerOpen.value = false
}
const getTreeCheckedKeys = (pCheckedKeys) => {
  // 每次选中某个权限时更新被选中的权限的key
  // console.log(pCheckedKeys)
  checkedKeys.value = pCheckedKeys
}
const convertPermTreeData2TreeSelectData = (treeData) => {
  const treeSelectData = []
  for (const item of treeData) {
    const tmpItem = {
      title: `${item.name} - ${permTypeEnum[item.perm_type].value}`,
      key: item.id,
      perm_type: item.perm_type
    }
    if (item.children) {
      tmpItem.children = convertPermTreeData2TreeSelectData(item.children)
    }
    treeSelectData.push(tmpItem)
  }
  return treeSelectData
}
const setPermissions = (record) => {
  getPermissionTreeList().then((res) => {
    const { results } = res
    permissionTreeData.value = convertPermTreeData2TreeSelectData(results)
    getRoleDetail(record.id).then((res) => {
      const { permissions, name } = res
      const permissionIds = []
      for (const permission of permissions) {
        permissionIds.push(permission.id)
      }
      checkedKeys.value.checked = permissionIds
      // console.log(res)
      drawerTitle.value = `为角色 ${name} 设置权限`
      drawerOpen.value = true
      setPermissionsRoleId.value = record.id
    })
  })
}
const submitPermissions = () => {
  updateRoleWithPatch(setPermissionsRoleId.value, { permissions: checkedKeys.value.checked }).then(
    () => {
      checkedKeys.value = { checked: [], halfChecked: [] }
      drawerOpen.value = false
    }
  )
}
</script>

<style scoped>
.submit-btn {
  margin-top: 100px;
}
</style>
