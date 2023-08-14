<template>
  <a-button type="primary" @click="createUser">新增用户</a-button>
  <standard-table
    :data-source="dataList"
    :columns="columns"
    :row-key="'id'"
    :loading="tableLoading"
    :pagination="paginationData"
    @on-page-change="onPageChange"
  >
    <template #action="{ column, record }">
      <template v-if="column.key === 'action'">
        <span>
          <a @click="updateUser(record)">修改</a>
          <a-divider type="vertical" />
          <a-popconfirm
            title="确定删除该用户吗？"
            ok-text="确定"
            cancel-text="取消"
            @confirm="deleteUser(record.id)"
          >
            <a>删除</a>
          </a-popconfirm>
        </span>
      </template>
      <template v-else-if="column.key === 'roles'">
        <template v-for="(role, index) in record.roles" :key="index">
          <a-tag color="processing">{{ role }}</a-tag>
        </template>
      </template>
      <template v-else-if="column.key === 'gender'">
        <a-tag :color="genderEnum[record.gender].color" v-if="record.gender">{{
          genderEnum[record.gender].value
        }}</a-tag>
      </template>
    </template>
  </standard-table>
  <user-form
    :modal-open="modalOpen"
    :title="title"
    :user-id="userId"
    @close-modal="closeModal"
    @get-latest-user-list="getUserListData"
  />
</template>

<script setup>
import { ref } from 'vue'
import { deleteUserDetail, getUserList } from '@/apis/system/user'
import UserForm from './UserForm.vue'
import { genderEnum } from '@/utils/enum'
import StandardTable from '@/components/StandardTable.vue'

const dataList = ref([])
const title = ref('新增用户')
const modalOpen = ref(false)
const tableLoading = ref(false)
const userId = ref(null)
const paginationData = ref({})
const columns = [
  {
    title: '用户名',
    dataIndex: 'username',
    key: 'username'
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    key: 'email'
  },
  {
    title: '性别',
    dataIndex: 'gender',
    key: 'gender'
  },
  {
    title: '昵称',
    dataIndex: 'nick_name',
    key: 'nick_name'
  },

  {
    title: '部门',
    dataIndex: 'department',
    key: 'department'
  },
  {
    title: '职位',
    dataIndex: 'position',
    key: 'position'
  },
  {
    title: '角色',
    dataIndex: 'roles',
    key: 'roles'
  },
  {
    title: '操作',
    key: 'action'
  }
]

const getUserListData = () => {
  tableLoading.value = true
  getUserList().then((res) => {
    dataList.value = res.results
    paginationData.value = {
      total: res.count,
      current: res.current_page,
      pageSize: 10,
      pageSizeOptions: ['10', '20', '30', '40', '50'],
      showSizeChanger: true,
      showTotal: () => `共 ${res.count} 条`
    }
    tableLoading.value = false
  })
}
getUserListData()
const onPageChange = (pagination, filters, sorter, currentDataSource) => {
  const params = {}
  params.page = pagination.current
  params.page_size = pagination.pageSize
  tableLoading.value = true
  getUserList(params).then((res) => {
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
const createUser = () => {
  title.value = '新增用户'
  modalOpen.value = true
}
const closeModal = () => {
  title.value = '新增用户'
  modalOpen.value = false
}
const updateUser = (record) => {
  userId.value = record.id
  title.value = '修改用户'
  modalOpen.value = true
}
const deleteUser = (userId) => {
  deleteUserDetail(userId).then(() => {
    getUserListData()
  })
}
</script>

<style scoped></style>
