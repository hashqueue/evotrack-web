<template>
  <slot name="tableFilter"></slot>
  <a-table
    :columns="columns"
    :data-source="dataSource"
    :scroll="scroll"
    bordered
    :row-key="rowKey"
    :row-selection="rowSelection"
    :pagination="pagination"
    :loading="loading"
    @change="onPageChange"
    :default-expand-all-rows="defaultExpandAllRows"
    :size="tableSize"
    style="margin-top: 8px"
  >
    <template #bodyCell="{ column, record }">
      <slot name="action" :column="column" :record="record"></slot>
    </template>
  </a-table>
</template>

<script setup>
defineProps({
  columns: {
    type: Array,
    required: true
  },
  dataSource: {
    type: Array,
    required: true
  },
  pagination: {
    type: [Object, Boolean],
    required: false
  },
  // x,y轴是否可滚动
  scroll: {
    type: Object,
    required: false
  },
  defaultExpandAllRows: {
    type: Boolean,
    default: false,
    required: false
  },
  rowKey: {
    type: String,
    default: 'id',
    required: false
  },
  rowSelection: {
    type: Object,
    required: false,
    default: null
  },
  loading: {
    type: Boolean,
    required: false,
    default: false
  },
  tableSize: {
    type: String,
    required: false,
    default: 'large'
  }
})
const emit = defineEmits(['onPageChange'])

const onPageChange = (pagination, filters, sorter, { currentDataSource }) => {
  emit('onPageChange', pagination, filters, sorter, currentDataSource)
}
</script>

<style scoped></style>
