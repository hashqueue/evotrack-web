<template>
  <a-modal
    :open="modalOpen"
    :width="modalWidth"
    :title="modalTitle"
    :ok-text="modalOkText"
    :cancel-text="modalCancelText"
    @ok="onOk"
    @cancel="onCancel"
    :mask-closable="modalMaskClosable"
    :destroy-on-close="destroyModalOnClose"
  >
    <slot name="form"></slot>
  </a-modal>
</template>

<script setup>
defineProps({
  destroyModalOnClose: {
    type: Boolean,
    required: false,
    default: false
  },
  modalMaskClosable: {
    type: Boolean,
    required: false,
    default: true
  },
  modalOpen: {
    type: Boolean,
    required: true
  },
  modalWidth: {
    type: [Number, String],
    required: false
  },
  modalTitle: {
    type: String,
    required: true
  },
  modalOkText: {
    type: String,
    required: false,
    default: '提交'
  },
  modalCancelText: {
    type: String,
    required: false,
    default: '取消'
  }
})
const emit = defineEmits(['onModalOk', 'onModalCancel'])
const onOk = () => {
  emit('onModalOk')
}
const onCancel = () => {
  emit('onModalCancel')
}
</script>

<style scoped></style>
