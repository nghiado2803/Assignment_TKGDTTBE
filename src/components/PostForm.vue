<template>
  <form @submit.prevent="emit('submit', form)">
    <div class="mb-3">
      <label class="form-label">Tiêu đề</label>
      <input type="text" class="form-control" v-model="form.title" required>
    </div>
    <div class="mb-3">
      <label class="form-label">Nội dung</label>
      <textarea class="form-control" rows="8" v-model="form.content" required></textarea>
    </div>
    <div class="mb-3">
      <label class="form-label">URL hình ảnh (không bắt buộc)</label>
      <input type="url" class="form-control" v-model="form.image" placeholder="https://example.com/image.jpg">
    </div>
    <div class="d-flex gap-2">
      <button type="submit" class="btn btn-primary" :disabled="isLoading">
        <span v-if="isLoading" class="loading-spinner me-2"></span>
        {{ isLoading ? 'Đang xử lý...' : submitText || 'Gửi' }}
      </button>
      <button type="button" @click="emit('cancel')" class="btn btn-outline-secondary">Hủy</button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
const props = defineProps<{
  post?: any
  isLoading?: boolean
  submitText?: string
}>()
const emit = defineEmits<{
  submit: [form: { title: string; content: string; image: string }]
  cancel: []
}>()
const form = ref({
  title: '',
  content: '',
  image: ''
})
watch(
  () => props.post,
  newPost => {
    if (newPost) form.value = { ...newPost }
  },
  { immediate: true, deep: true }
)
</script>

<style scoped>
.form-control {
  border-radius: 8px;
  border: 2px solid #e9ecef;
  padding: 0.7rem;
}
.form-control:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}
.loading-spinner {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>