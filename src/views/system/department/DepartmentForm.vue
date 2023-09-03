<template>
  <standard-modal
    :modal-open="modalOpen"
    :modal-width="600"
    :modal-title="title"
    :modal-ok-text="'提交'"
    :modal-cancel-text="'取消'"
    @on-modal-ok="onOk"
    @on-modal-cancel="onCancel"
  >
    <template #form>
      <a-form
        ref="createUpdateFormRef"
        :model="createUpdateForm"
        :rules="createUpdateRules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-item name="name" label="名称">
          <a-input v-model:value="createUpdateForm.name" placeholder="请输入部门名称" />
        </a-form-item>
        <a-form-item name="parent" label="父部门" v-if="title !== '新增根部门'">
          <a-tree-select
            v-model:value="createUpdateForm.parent"
            placeholder="输选择父部门"
            allow-clear
            tree-default-expand-all
            :tree-data="deptTreeSelectTreeData"
          ></a-tree-select>
        </a-form-item>
      </a-form>
    </template>
  </standard-modal>
</template>

<script setup>
import { ref, watch } from 'vue'
import {
  createDepartment,
  updateDepartment,
  getDepartmentDetail,
  getDepartmentTreeList
} from '@/apis/system/department'
import StandardModal from '@/components/StandardModal.vue'
import { changeObjValUndefined2Null, convertDeptTreeData2TreeSelectData } from '@/utils/common'

const props = defineProps({
  departmentId: {
    type: [Number, null],
    required: false
  },
  modalOpen: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    required: true
  }
})
const emit = defineEmits(['closeModal', 'getLatestDepartmentList'])
const labelCol = { span: 3 }
const wrapperCol = { span: 24 }

const deptTreeSelectTreeData = ref([])

const createUpdateFormRef = ref()
const createUpdateForm = ref({
  name: '',
  parent: null
})
const createUpdateRules = {
  name: [
    { required: true, trigger: 'change', message: '部门名称不能为空' },
    { max: 128, trigger: 'change', message: '部门名称不能多于128位' }
  ]
}
const onOk = () => {
  createUpdateFormRef.value
    .validateFields()
    .then((values) => {
      changeObjValUndefined2Null(values)
      if (props.title === '修改部门') {
        updateDepartment(props.departmentId, values).then(() => {
          // 重新获取一遍部门信息
          emit('getLatestDepartmentList')
          createUpdateFormRef.value.resetFields()
          emit('closeModal')
        })
      } else {
        createDepartment(values).then(() => {
          emit('getLatestDepartmentList')
          createUpdateFormRef.value.resetFields()
          emit('closeModal')
        })
      }
    })
    .catch((info) => {
      console.log('Validate Failed:', info)
    })
}
const onCancel = () => {
  createUpdateFormRef.value.resetFields()
  emit('closeModal')
}
watch(
  () => props.modalOpen,
  (newValue, oldValue) => {
    if (props.title !== '新增根部门') {
      getDepartmentTreeList().then((res) => {
        deptTreeSelectTreeData.value = convertDeptTreeData2TreeSelectData(res.results)
      })
      getDepartmentDetail(props.departmentId).then((res) => {
        if (props.title === '添加子部门') {
          createUpdateForm.value = {
            name: '',
            parent: res.id
          }
        } else if (props.title === '修改部门') {
          const { name, parent } = res
          const parentValue = parent ? parent.id : null
          createUpdateForm.value = {
            name,
            parent: parentValue
          }
        }
      })
    }
  }
)
</script>

<style scoped></style>
