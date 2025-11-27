<template>
  <!-- Full gradient background + hiệu ứng kính mờ -->
  <div class="min-vh-100 position-relative overflow-hidden"
       style="background: #f0f2f5;">

    <!-- Blob trang trí -->
    <div class="position-absolute top-50 start-50 translate-middle blob opacity-20"></div>
    <div class="position-absolute top-10 start-10 blob-sm opacity-15"></div>

    <div class="container py-5 position-relative z-1">


      <!-- Khi chưa có bài viết -->
      <div v-if="posts.length === 0" class="text-center py-5 mt-5">
        <div class="bg-white bg-opacity-10 backdrop-blur-lg rounded-4 p-5 mx-auto shadow-lg" style="max-width: 560px;">
          <i class="bi bi-journal-text text-white" style="font-size: 7rem; opacity: 0.5;"></i>
          <h3 class="text-white mt-4 mb-3 fw-light">Chưa có bài viết nào</h3>
          <p class="text-white opacity-80 fs-5 mb-4">Hãy bắt đầu chia sẻ câu chuyện của bạn!</p>
          <router-link v-if="currentUser" to="/create-post"
                       class="btn btn-light btn-lg px-5 fw-bold rounded-pill shadow-lg hover-lift">
            Viết bài đầu tiên
          </router-link>
        </div>
      </div>

      <!-- Danh sách bài viết -->
      <div v-else class="row g-4 g-xl-5 justify-content-center mt-4">
        <div v-for="post in posts" :key="post.__backendId" class="col-md-6 col-lg-4">
          <article class="card post-card h-100 border-0 shadow-lg rounded-4 overflow-hidden bg-white bg-opacity-95 backdrop-blur transition-all">
            
            <!-- Ảnh bìa -->
            <div class="position-relative overflow-hidden">
              <img :src="post.image || 'https://placehold.co/600x400?text=Blog+Post'"
                   class="card-img-top post-img" alt="Bài viết"
                   style="height: 220px; object-fit: cover;">
              <div class="post-overlay"></div>
            </div>

            <div class="card-body d-flex flex-column p-4">

              <!-- Avatar + Tác giả + Thời gian -->
              <div class="d-flex align-items-center mb-3">
                <img :src="post.avatar || 'https://placehold.co/40x40?text=U'"
                     class="rounded-circle me-3 border border-3 border-white shadow-sm"
                     width="44" height="44" alt="avatar">
                <div class="flex-grow-1">
                  <h6 class="mb-0 fw-bold text-dark">{{ post.authorName }}</h6>
                  <small class="text-muted">{{ formatDate(post.createdAt) }}</small>
                </div>
              </div>

              <!-- Tiêu đề -->
              <h5 class="card-title fw-bold text-dark mb-3 line-clamp-2">
                {{ post.title }}
              </h5>

              <!-- Mô tả ngắn -->
              <p class="text-muted flex-grow-1 line-clamp-3 small">
                {{ stripHtml(post.content || '').substring(0, 130) }}...
              </p>

              <!-- Nút hành động -->
              <div class="mt-auto d-flex gap-2">
                <button @click="viewPost(post)"
                        class="btn btn-primary rounded-pill px-4 fw-semibold flex-grow-1 hover-lift">
                  Đọc thêm
                </button>
                <button v-if="currentUser && currentUser.__backendId === post.authorId"
                        @click="editPost(post)"
                        class="btn btn-outline-secondary rounded-pill">
                  <i class="bi bi-pencil"></i>
                </button>
                <button v-if="currentUser && currentUser.__backendId === post.authorId"
                        @click="deletePost(post)"
                        class="btn btn-outline-danger rounded-pill">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>

    <!-- Footer nhỏ -->
    <p class="text-center text-black mt-4 opacity-75 small">
            © 2025 Blog Của Tôi • Made with Đỗ Văn Nghĩa ❤️
          </p>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, type Ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const allData = inject<Ref<any[]>>('allData')!
const showToast = inject<(msg: string, type?: string) => void>('showToast')!

// ← ĐỔI Ở ĐÂY: LẤY currentUser TRỰC TIẾP TỪ INJECT ĐỂ NÓ REACTIVE
const currentUser = inject<Ref<any>>('currentUser')! // ← Quan trọng nhất!!!

const users = computed(() =>
  (allData.value ?? []).filter((u: any) => u.type === 'user')
)

const posts = computed(() => {
  const postItems = (allData.value ?? []).filter((p: any) => p.type === 'post')
  return postItems
    .map((post: any) => {
      const author = users.value.find((u: any) => u.__backendId === post.authorId)
      return {
        ...post,
        authorName: author?.username || 'Ẩn danh',
        avatar: author?.avatar || 'https://placehold.co/40x40?text=U'
      }
    })
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
})

function viewPost(post: any) {
  router.push(`/post/${post.__backendId}`)
}

function editPost(post: any) {
  router.push(`/edit-post/${post.__backendId}`)
}

function deletePost(post: any) {
  if (confirm('Bạn chắc chắn muốn xóa bài này?')) {
    const idx = allData.value.findIndex((item: any) => item.__backendId === post.__backendId)
    if (idx > -1) {
      allData.value.splice(idx, 1)
      showToast('Đã xóa bài viết!', 'warning')
    }
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('vi-VN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, '')
}
</script>

<style scoped>
.blob {
  width: 600px;
  height: 600px;
  background: rgba(255,255,255,0.2);
  border-radius: 50%;
  filter: blur(120px);
}
.blob-sm { width: 400px; height: 400px; }

.post-card {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.post-card:hover {
  transform: translateY(-16px) scale(1.02);
  box-shadow: 0 30px 60px rgba(0,0,0,0.25) !important;
}

.post-img {
  transition: transform 0.6s ease;
}
.post-card:hover .post-img { transform: scale(1.1); }

.post-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(transparent, rgba(0,0,0,0.6));
  opacity: 0;
  transition: opacity 0.4s;
}
.post-card:hover .post-overlay { opacity: 1; }

.line-clamp-2, .line-clamp-3 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.line-clamp-3 { -webkit-line-clamp: 3; }

.hover-lift {
  transition: all 0.3s ease;
}
.hover-lift:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(102,126,234,0.5) !important;
}

.btn-light {
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(10px);
}
</style>