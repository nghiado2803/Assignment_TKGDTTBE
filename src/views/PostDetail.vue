<template>
  <div class="bg-light min-vh-100">
    <div class="container py-4 py-md-5">

      <div class="mb-4">
        <button @click="router.back()"
          class="btn btn-outline-secondary rounded-pill px-4 py-2 d-flex align-items-center gap-2 hover-lift shadow-sm">
          <i class="bi bi-arrow-left"></i>
          <span class="fw-medium">Quay lại</span>
        </button>
      </div>

      <div class="row justify-content-center">
        <div class="col-lg-8">

          <div v-if="!post" class="text-center py-5">
            <div class="bg-white rounded-4 shadow p-5">
              <i class="bi bi-file-earmark-x display-1 text-muted"></i>
              <h3 class="mt-4">Bài viết không tồn tại</h3>
              <p class="text-muted">Hoặc đang tải dữ liệu...</p>
              <button @click="router.push('/home')" class="btn btn-primary rounded-pill px-5 mt-3">
                Về trang chủ
              </button>
            </div>
          </div>

          <div v-else>
            <div class="bg-white rounded-4 shadow overflow-hidden">

              <div class="p-4">
                <div class="d-flex align-items-start">
                  <img :src="post.avatar || 'https://via.placeholder.com/56'" class="rounded-circle me-3 flex-shrink-0"
                    width="56" height="56">
                  <div>
                    <h5 class="mb-1 fw-bold">{{ post.authorName }}</h5>
                    <small class="text-muted d-flex align-items-center gap-3">
                      <span><i class="bi bi-clock me-1"></i>{{ formatDate(post.createdAt) }}</span>
                      <span><i class="bi bi-globe2 me-1"></i>Công khai</span>
                    </small>
                  </div>
                </div>
              </div>

              <div v-if="post.image && !imgError" class="px-4 pb-3">
                <div class="text-center">
                  <img :src="post.image" class="rounded-4 shadow-sm"
                    style="max-height: 420px; width: auto; max-width: 100%; object-fit: cover;"
                    @error="imgError = true">
                </div>
              </div>

              <div class="px-4">
                <h1 class="display-5 fw-bold mb-4">{{ post.title }}</h1>
              </div>

              <div class="px-4 pb-4">
                <div class="post-content lead" style="font-size: 1.15rem; line-height: 1.9; white-space: pre-wrap;">
                  {{ post.content }}
                </div>
              </div>

              <div class="border-top px-4 py-3 d-flex justify-content-between align-items-center">
                <button @click="toggleLike" class="btn d-flex align-items-center gap-2 fw-medium"
                  :class="isLiked ? 'text-primary' : 'text-muted'">
                  <i class="bi" :class="isLiked ? 'bi-hand-thumbs-up-fill' : 'bi-hand-thumbs-up'"></i>
                  <span>Thích ({{ likeCount }})</span>
                </button>

                <button class="btn text-muted d-flex align-items-center gap-2 fw-medium">
                  <i class="bi bi-chat-dots"></i>
                  <span>Bình luận ({{ comments.length }})</span>
                </button>

                <button @click="handleShare" class="btn text-muted d-flex align-items-center gap-2 fw-medium">
                  <i class="bi bi-share"></i>
                  <span>Chia sẻ</span>
                </button>
              </div>

              <div class="p-4 border-top">

                <h5 class="mb-4 fw-semibold">
                  Bình luận <span class="text-muted">({{ comments.length }})</span>
                </h5>

                <div v-if="currentUser" class="d-flex mb-4">
                  <img :src="currentUser.avatar || 'https://via.placeholder.com/40'" class="rounded-circle me-3"
                    width="44" height="44">
                  <div class="flex-grow-1">
                    <div class="bg-light rounded-4 px-4 py-3 position-relative">
                      <textarea v-model="commentForm.content" rows="1"
                        class="form-control border-0 shadow-none resize-none bg-transparent"
                        placeholder="Viết bình luận công khai..." :disabled="isLoading"></textarea>
                      <button @click="handleCommentSubmit"
                        class="position-absolute bottom-0 end-0 btn btn-primary rounded-pill px-4 mb-2 me-3"
                        :disabled="isLoading || !commentForm.content.trim()">
                        Gửi
                      </button>
                    </div>
                  </div>
                </div>

                <div v-else class="text-center py-4 bg-light rounded-4 border">
                  <router-link to="/login" class="text-primary fw-bold">Đăng nhập</router-link> để bình luận
                </div>

                <div v-for="c in comments" :key="c.__backendId" class="d-flex mb-4">
                  <img :src="c.avatar || 'https://via.placeholder.com/40'" class="rounded-circle me-3" width="40"
                    height="40">
                  <div class="flex-grow-1">
                    <div class="bg-light rounded-4 px-4 py-3">
                      <div class="fw-bold">{{ c.commentAuthorName }}</div>
                      <p class="mb-0 mt-1">{{ c.commentContent }}</p>
                    </div>
                    <div class="ms-4 mt-1 text-muted small">
                      <span class="me-3" style="cursor:pointer;">Thích</span>
                      <span style="cursor:pointer;">Phản hồi</span>
                      <span class="ms-3">{{ formatDate(c.createdAt) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, computed, onMounted, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const allData = inject<Ref<any[]>>('allData')!
const showToast = inject<(msg: string, type?: string) => void>('showToast')!
const currentUser = inject<Ref<any>>('currentUser')?.value

const route = useRoute()
const router = useRouter()

const post = ref<any>(null)
const imgError = ref(false)
const commentForm = ref({ content: '' })
const isLoading = ref(false)

// --- LOGIC LẤY BÀI VIẾT ---
const users = computed(() => allData.value.filter(u => u.type === 'user'))

const postsWithAuthor = computed(() => {
  return allData.value.filter(p => p.type === 'post').map(p => {
    const author = users.value.find(u => u.__backendId === p.authorId)
    return { ...p, authorName: author?.username || 'Ẩn danh', avatar: author?.avatar || '' }
  })
})

const comments = computed(() => {
  if (!post.value) return []
  return allData.value
    .filter(c => c.type === 'comment' && c.postId === post.value.__backendId)
    .map(c => {
      const author = users.value.find(u => u.__backendId === c.commentAuthorId)
      return { ...c, commentAuthorName: author?.username || 'Ẩn danh', avatar: author?.avatar || '' }
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
})

// --- LOGIC LIKE ĐỒNG BỘ ---
const likes = computed(() => {
  if (!post.value) return []
  return allData.value.filter(l => l.type === 'like' && l.postId === post.value.__backendId)
})

const likeCount = computed(() => likes.value.length)

const isLiked = computed(() => {
  if (!currentUser) return false
  return likes.value.some(l => l.authorId === currentUser.__backendId)
})

const toggleLike = () => {
  if (!currentUser) {
    showToast('Bạn cần đăng nhập để thực hiện thao tác này!', 'warning')
    router.push('/login')
    return
  }

  // SỬ DỤNG CÙNG LOGIC VỚI UserProfileView
  // 1. Tìm index trực tiếp trong allData
  const existingLikeIndex = allData.value.findIndex(item =>
    item.type === 'like' &&
    item.postId === post.value.__backendId &&
    item.authorId === currentUser.__backendId
  )

  if (existingLikeIndex !== -1) {
    // 2a. Nếu ĐÃ có -> Xóa (Unlike)
    allData.value.splice(existingLikeIndex, 1)
    showToast('Đã bỏ thích bài viết này.', 'info')
  } else {
    // 2b. Nếu CHƯA có -> Thêm (Like)
    allData.value.push({
      type: 'like',
      __backendId: Math.random().toString(36).substr(2, 9),
      postId: post.value.__backendId,
      authorId: currentUser.__backendId,
      createdAt: new Date().toISOString()
    })
    showToast('Bạn đã thích bài viết này!', 'success')
  }
}

const handleShare = () => {
  if (navigator.share) {
    navigator.share({
      title: post.value.title,
      text: post.value.content.substring(0, 100) + '...',
      url: window.location.href
    })
  } else {
    navigator.clipboard.writeText(window.location.href)
    showToast('Đã sao chép link bài viết!', 'success')
  }
}

onMounted(() => {
  const id = route.params.id as string
  post.value = postsWithAuthor.value.find(p => p.__backendId === id)

  if (!post.value) {
    showToast('Bài viết không tồn tại!', 'error')
    setTimeout(() => router.push('/home'), 1500)
  }
})

function formatDate(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Vừa xong'
  if (minutes < 60) return `${minutes} phút trước`
  if (hours < 24) return `${hours} giờ trước`
  if (days < 7) return `${days} ngày trước`
  return date.toLocaleDateString('vi-VN', { day: 'numeric', month: 'short', year: 'numeric' })
}

async function handleCommentSubmit() {
  if (!commentForm.value.content.trim()) return

  if (!currentUser) {
    showToast('Bạn cần đăng nhập để bình luận!', 'warning')
    return
  }

  isLoading.value = true
  await new Promise(r => setTimeout(r, 800))

  allData.value.push({
    type: 'comment',
    __backendId: Math.random().toString(36).substr(2, 9),
    postId: post.value.__backendId,
    commentContent: commentForm.value.content.trim(),
    commentAuthorId: currentUser.__backendId,
    createdAt: new Date().toISOString()
  })

  showToast('Bình luận đã được gửi!', 'success')
  commentForm.value.content = ''
  isLoading.value = false
}
</script>

<style scoped>
.hover-lift { transition: all 0.2s; }
.hover-lift:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important; }
.rounded-4 { border-radius: 1rem !important; }
.bg-light { background-color: #f0f2f5 !important; }
.form-control:focus { box-shadow: none !important; }
.resize-none { resize: none; }
</style>