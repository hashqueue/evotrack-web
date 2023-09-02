<template>
  <a-card>
    <standard-table
      :data-source="dataList"
      :columns="columns"
      :scroll="{ x: '100%', y: '100%' }"
      :loading="tableLoading"
      :row-key="'id'"
      :table-size="'small'"
      :pagination="{ hideOnSinglePage: true }"
      :expanded-row-keys="expandedRowKeys"
      :expand-row-by-click="true"
      @on-expanded-rows-change="onExpandedRowsChange"
    >
      <template #tableFilter>
        <a-button
          type="primary"
          @click="createRootPermission"
          v-permission="btnPermissions.permission.create"
          >新增根权限</a-button
        >
      </template>
      <template #action="{ column, record }">
        <template v-if="column.key === 'perm_type'">
          <a-tag :color="permTypeEnum[record.perm_type].color">
            {{ permTypeEnum[record.perm_type].value }}
          </a-tag>
        </template>
        <template v-else-if="column.key === 'name'">
          <component v-if="record.icon" style="margin-right: 3px" :is="record.icon" /><span>{{
            record.name
          }}</span>
        </template>
        <template v-else-if="column.key === 'is_visible'">
          <a-tag :color="record.is_visible ? 'success' : 'error'">
            {{ record.is_visible ? '显示' : '隐藏' }}
          </a-tag>
        </template>
        <template v-else-if="column.key === 'action'">
          <a-button
            class="action-btn"
            type="link"
            @click="createSubPermission(record)"
            :disabled="record.perm_type === 3"
            v-permission="btnPermissions.permission.create"
            >添加子权限</a-button
          >
          <a-button
            class="action-btn"
            type="link"
            @click="updatePermission(record)"
            v-permission="btnPermissions.permission.update"
            >修改</a-button
          >
          <a-button
            class="action-btn"
            type="link"
            @click="copyPermission(record)"
            v-permission="btnPermissions.permission.create"
            >复制</a-button
          >
          <a-popconfirm
            title="确定删除该权限吗？"
            ok-text="确定"
            cancel-text="取消"
            @confirm="deletePermission(record.id)"
          >
            <a-button type="link" v-permission="btnPermissions.permission.delete">删除</a-button>
          </a-popconfirm>
        </template>
      </template>
    </standard-table>
  </a-card>
  <permission-form
    :modal-open="modalOpen"
    :title="title"
    :permission-id="permissionId"
    @close-modal="closeModal"
    @get-latest-permission-list="getPermissionTreeListData"
  />
</template>

<script setup>
import { ref } from 'vue'
import { getPermissionTreeList, deletePermissionDetail } from '@/apis/system/permission'
import PermissionForm from './PermissionForm.vue'
import StandardTable from '@/components/StandardTable.vue'
import { permTypeEnum, btnPermissions } from '@/utils/enum'
import { filterDefaultExpandedRowKeys } from '@/utils/common'

const dataList = ref([])
const expandedRowKeys = ref([])
const modalOpen = ref(false)
const tableLoading = ref(false)
const title = ref('新增根权限')
const permissionId = ref(null)

const getPermissionTreeListData = () => {
  tableLoading.value = true
  getPermissionTreeList().then((res) => {
    expandedRowKeys.value = filterDefaultExpandedRowKeys(res.results)
    dataList.value = res.results
    tableLoading.value = false
  })
}
getPermissionTreeListData()
const columns = [
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    width: 330,
    fixed: 'left'
  },
  {
    title: '类型',
    dataIndex: 'perm_type',
    width: 70,
    key: 'perm_type'
  },

  {
    title: '路由path',
    dataIndex: 'path',
    width: 200,
    key: 'path'
  },
  {
    title: '组件路径',
    dataIndex: 'component',
    width: 300,
    key: 'component'
  },
  {
    title: '路由重定向path',
    dataIndex: 'redirect',
    width: 200,
    key: 'redirect'
  },
  {
    title: '是否显示',
    dataIndex: 'is_visible',
    width: 90,
    key: 'is_visible'
  },
  {
    title: '创建时间',
    dataIndex: 'created_at',
    width: 150,
    key: 'created_at'
  },
  {
    title: '修改时间',
    dataIndex: 'updated_at',
    width: 150,
    key: 'updated_at'
  },
  {
    title: '创建人',
    dataIndex: 'created_by',
    width: 100,
    key: 'created_by'
  },
  {
    title: '修改人',
    dataIndex: 'updated_by',
    width: 100,
    key: 'updated_by'
  },
  {
    title: '操作',
    key: 'action',
    width: 280,
    fixed: 'right'
  }
]
const onExpandedRowsChange = (expandedRows) => {
  expandedRowKeys.value = expandedRows
}

const createRootPermission = () => {
  title.value = '新增根权限'
  modalOpen.value = true
}
const closeModal = () => {
  title.value = '新增根权限'
  modalOpen.value = false
}
const createSubPermission = (record) => {
  permissionId.value = record.id
  title.value = '添加子权限'
  modalOpen.value = true
}
const updatePermission = (record) => {
  permissionId.value = record.id
  title.value = '修改权限'
  modalOpen.value = true
}
const copyPermission = (record) => {
  permissionId.value = record.id
  title.value = '复制权限'
  modalOpen.value = true
}
const deletePermission = (permissionId) => {
  deletePermissionDetail(permissionId).then(() => {
    getPermissionTreeListData()
  })
}
</script>

<style scoped>
.action-btn {
  padding: 4px 5px;
}
</style>
