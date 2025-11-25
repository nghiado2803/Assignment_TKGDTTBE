<template>
  <div class="card post-card h-100">
    <img v-if="post.image" :src="post.image" class="post-image" :alt="post.title" @error="handleImageError">
    <div class="card-body">
      <h5 class="card-title fw-bold">{{ post.title }}</h5>
      <p class="card-text text-muted">{{ truncateText(post.content, 120) }}</p>
      <div class="d-flex align-items-center mb-3">
        <img
          :src="post.avatar || 'https://via.placeholder.com/45'"
          class="avatar me-2"
          :alt="post.authorName"
          @error="handleAvatarError"
        >
        <div>
          <div class="fw-semibold">{{ post.authorName }}</div>
          <small class="text-muted">{{ formatDate(post.createdAt) }}</small>
        </div>
      </div>
      <div class="d-flex gap-2">
        <button @click="emit('view', post)" class="btn btn-primary btn-sm flex-grow-1">
          Xem chi tiết
        </button>
        <button
          v-if="currentUser && currentUser.__backendId === post.authorId"
          @click="emit('edit', post)"
          class="btn btn-outline-primary btn-sm"
        >
          <i class="bi bi-pencil"></i>
        </button>
        <button
          v-if="currentUser && currentUser.__backendId === post.authorId"
          @click="emit('delete', post)"
          class="btn btn-outline-danger btn-sm"
        >
          <i class="bi bi-trash"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  post: any
  currentUser: any
}>()
const emit = defineEmits<{
  view: [post: any]
  edit: [post: any]
  delete: [post: any]
}>()

function truncateText(text: string, maxLength: number) {
  if (!text) return ''
  return text.length <= maxLength ? text : text.substring(0, maxLength) + '...'
}
function formatDate(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Vừa xong'
  if (diffMins < 60) return `${diffMins} phút trước`
  if (diffHours < 24) return `${diffHours} giờ trước`
  if (diffDays < 7) return `${diffDays} ngày trước`
  return date.toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })
}
function handleImageError(event: Event) {
  const target = event.target as HTMLImageElement
  target.style.display = 'none'
  target.alt = 'Ảnh không khả dụng'
}
function handleAvatarError(event: Event) {
  const target = event.target as HTMLImageElement
  target.src = 'https://via.placeholder.com/45'
  target.alt = 'Avatar không khả dụng'
}
</script>

<style scoped>
.post-card {
  border-radius: 12px;
  transition: transform 0.2s, box-shadow 0.2s;
  border: none;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  background: white;
}
.post-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}
.post-image {
  height: 200px;
  object-fit: cover;
  border-radius: 12px 12px 0 0;
  width: 100%;
}
.avatar {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #667eea;
}
.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  padding: 0.6rem 1.5rem;
  font-weight: 500;
}
.btn-primary:hover {
  background: linear-gradient(135deg, #5568d3 0%, #63408b 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}
</style>