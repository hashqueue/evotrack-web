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
    :size="tableSize"
    :expanded-row-keys="expandedRowKeys"
    :expand-row-by-click="expandRowByClick"
    @change="onPageChange"
    @expandedRowsChange="onExpandedRowsChange"
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
  },
  expandedRowKeys: {
    type: Array,
    required: false
  },
  expandRowByClick: {
    type: Boolean,
    required: false,
    default: false
  }
})
const emit = defineEmits(['onPageChange', 'onExpandedRowsChange'])

const onPageChange = (pagination, filters, sorter, { currentDataSource }) => {
  emit('onPageChange', pagination, filters, sorter, currentDataSource)
}
const onExpandedRowsChange = (expandedRows) => {
  emit('onExpandedRowsChange', expandedRows)
}
</script>

<style scoped></style>
