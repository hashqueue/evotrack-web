<template>
  <a-button
    type="primary"
    @click="createRootDepartment"
    v-permission="btnPermissions.department.create"
    >新增根部门</a-button
  >
  <standard-table
    :data-source="dataList"
    :columns="columns"
    :loading="tableLoading"
    :row-key="'id'"
    :pagination="{ hideOnSinglePage: true }"
  >
    <template #action="{ column, record }">
      <template v-if="column.key === 'action'">
        <span>
          <a @click="createSubDepartment(record)" v-permission="btnPermissions.department.create"
            >添加子部门</a
          >
          <a-divider type="vertical" />
          <a @click="updateDepartment(record)" v-permission="btnPermissions.department.update"
            >修改</a
          >
          <a-divider type="vertical" />
          <a-popconfirm
            title="确定删除该部门吗？"
            ok-text="确定"
            cancel-text="取消"
            @confirm="deleteDepartment(record.id)"
          >
            <a v-permission="btnPermissions.department.delete">删除</a>
          </a-popconfirm>
        </span>
      </template>
    </template>
  </standard-table>
  <department-form
    :modal-open="modalOpen"
    :title="title"
    :department-id="departmentId"
    @close-modal="closeModal"
    @get-latest-department-list="getDepartmentTreeListData"
  />
</template>

<script setup>
import { ref } from 'vue'
import { getDepartmentTreeList, deleteDepartmentDetail } from '@/apis/system/department'
import DepartmentForm from './DepartmentForm.vue'
import StandardTable from '@/components/StandardTable.vue'
import { btnPermissions } from '@/utils/enum'

const dataList = ref([])
const modalOpen = ref(false)
const tableLoading = ref(false)
const title = ref('新增根部门')
const departmentId = ref(null)

const getDepartmentTreeListData = () => {
  tableLoading.value = true
  getDepartmentTreeList().then((res) => {
    dataList.value = res.results
    tableLoading.value = false
  })
}
getDepartmentTreeListData()
const columns = [
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name'
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

const createRootDepartment = () => {
  title.value = '新增根部门'
  modalOpen.value = true
}
const closeModal = () => {
  title.value = '新增根部门'
  modalOpen.value = false
}
const createSubDepartment = (record) => {
  departmentId.value = record.id
  title.value = '添加子部门'
  modalOpen.value = true
}
const updateDepartment = (record) => {
  departmentId.value = record.id
  title.value = '修改部门'
  modalOpen.value = true
}
const deleteDepartment = (departmentId) => {
  deleteDepartmentDetail(departmentId).then(() => {
    getDepartmentTreeListData()
  })
}
</script>

<style scoped></style>
