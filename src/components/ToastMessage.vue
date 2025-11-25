<template>
  <div class="toast-message">
    <div class="toast show" role="alert">
      <div class="toast-header" :class="typeClass">
        <i :class="iconClass" class="me-2"></i>
        <strong class="me-auto">{{ type === 'success' ? 'Thành công' : type === 'error' ? 'Lỗi' : 'Thông báo' }}</strong>
        <button type="button" class="btn-close btn-close-white" @click="$emit('close')"></button>
      </div>
      <div class="toast-body">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  message: string
  type?: 'success' | 'error' | 'warning'
}>()
const typeClass = props.type === 'success'
  ? 'bg-success text-white'
  : props.type === 'error'
    ? 'bg-danger text-white'
    : 'bg-secondary text-white'
const iconClass = props.type === 'success'
  ? 'bi bi-check-circle'
  : props.type === 'error'
    ? 'bi bi-exclamation-circle'
    : 'bi bi-info-circle'
</script>

<style scoped>
.toast-message {
  position: fixed;
  top: 80px;
  right: 20px;
  z-index: 1050;
  min-width: 300px;
}
</style>