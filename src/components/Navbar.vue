<template>
  <!-- Toàn bộ template giữ nguyên 100% như mày đang có -->
  <nav class="navbar navbar-expand-lg fixed-top shadow-lg"
       style="background: rgba(255,255,255,0.95); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(0,0,0,0.08);">
    <div class="container">
      <!-- Logo -->
      <router-link to="/home" class="navbar-brand d-flex align-items-center gap-3 fw-bold text-primary">
        <div class="d-inline-flex align-items-center justify-content-center rounded-3 text-white"
             style="width: 48px; height: 48px; background: linear-gradient(135deg, #667eea, #764ba2); font-size: 20px;">
          VN
        </div>
        <span class="d-none d-md-block fs-4">Blog Của Tôi</span>
      </router-link>

      <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <i class="bi bi-list fs-3"></i>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto align-items-center gap-2">
          <!-- Trang chủ -->
          <li class="nav-item">
            <router-link to="/home" class="nav-link px-3 py-2 rounded-3 d-flex align-items-center gap-2 hover-primary"
                         :class="{ 'bg-primary text-white': $route.path === '/home' || $route.path === '/' }">
              <i class="bi bi-house-door-fill fs-5"></i>
              <span class="d-none d-lg-block">Trang chủ</span>
            </router-link>
          </li>

          <li class="nav-item">
            <router-link to="/create-post" class="nav-link px-3 py-2 rounded-3 d-flex align-items-center gap-2 hover-success">
              <i class="bi bi-pencil-square fs-5"></i>
              <span class="d-none d-lg-block">Viết bài</span>
            </router-link>
          </li>

          <li class="nav-item">
            <router-link to="/profile" class="nav-link px-3 py-2 rounded-3 d-flex align-items-center gap-2 hover-info">
              <i class="bi bi-person-circle fs-5"></i>
              <span class="d-none d-lg-block">Hồ sơ</span>
            </router-link>
          </li>

          <!-- Tìm kiếm -->
          <li class="nav-item d-none d-md-block">
  <div class="position-relative">

    <!-- Ô tìm kiếm kiểu Facebook -->
    <div class="position-relative">
      <i class="bi bi-search position-absolute top-50 translate-middle-y text-muted"
         style="left: 14px; font-size: 18px;"></i>

      <input
        v-model="searchQuery"
        @input="debouncedSearch"
        @focus="showResults = true"
        @blur="hideResults"
        type="text"
        class="form-control shadow-sm"
        placeholder="Tìm kiếm bài viết..."
        style="
          width: 320px;
          height: 42px;
          border-radius: 50px;
          padding-left: 42px;
          background-color: #f0f2f5;
          border: none;
        "
      />
    </div>

    <!-- Kết quả -->
    <div v-if="showResults && filteredPosts.length"
         class="position-absolute top-100 start-0 mt-2 w-100 bg-white shadow-lg rounded-3 border overflow-hidden"
         style="max-height: 420px; overflow-y: auto; z-index: 1050;">
      <div v-for="post in filteredPosts.slice(0, 6)" :key="post.__backendId"
           class="p-3 border-bottom d-flex align-items-center gap-3 cursor-pointer hover-bg-light"
           @mousedown.prevent="goToPost(post)">
        <img :src="post.image || 'https://placehold.co/60x60?text=Post'"
             class="rounded" width="50" height="50" style="object-fit: cover;">
        <div class="flex-grow-1">
          <div class="fw-bold text-dark small text-truncate" style="max-width: 280px;">
            {{ post.title }}
          </div>
          <small class="text-muted">{{ post.authorName || 'Ẩn danh' }} • {{ formatDate(post.createdAt) }}</small>
        </div>
      </div>
      <div class="p-3 text-center text-primary fw-bold cursor-pointer hover-bg-light"
           @mousedown.prevent="router.push('/home')">
        Xem tất cả kết quả...
      </div>
    </div>

  </div>
</li>

        </ul>

        <ul class="navbar-nav align-items-center gap-3">
          <!-- Thông báo -->
          <li class="nav-item dropdown">
            <a class="nav-link position-relative p-2 rounded-circle hover-bg-light" href="#" data-bs-toggle="dropdown">
              <i class="bi bi-bell-fill fs-4 text-dark"></i>
              <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger small">1</span>
            </a>
            <ul class="dropdown-menu dropdown-menu-end shadow-lg border-0 p-3" style="width: 340px;">
              <li class="dropdown-header fw-bold">Thông báo</li>
              <li><hr class="dropdown-divider"></li>
              <li class="dropdown-item text-center py-4">
                <i class="bi bi-bell-slash fs-1 text-muted opacity-50"></i>
                <p class="mt-2 mb-0 text-muted">Chưa có thông báo mới</p>
              </li>
            </ul>
          </li>

          <!-- Avatar Dropdown -->
          <li class="nav-item dropdown" v-if="user">
            <a class="nav-link d-flex align-items-center gap-2 p-2 rounded-3 hover-bg-light" href="#" data-bs-toggle="dropdown">
              <img :src="user.avatar || 'https://placehold.co/40x40'"
                   class="rounded-circle border border-2 border-white shadow" width="40" height="40" style="object-fit: cover;">
              <div class="d-none d-xl-block text-start">
                <div class="fw-bold small">{{ user.username }}</div>
                <small class="text-muted">Xem hồ sơ</small>
              </div>
              <i class="bi bi-chevron-down small"></i>
            </a>
            <ul class="dropdown-menu dropdown-menu-end shadow-lg border-0">
              <li><router-link to="/profile" class="dropdown-item d-flex align-items-center gap-3">
                <i class="bi bi-person-circle"></i> Hồ sơ cá nhân
              </router-link></li>
              <li><router-link to="/create-post" class="dropdown-item d-flex align-items-center gap-3">
                <i class="bi bi-pencil-square"></i> Viết bài mới
              </router-link></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item d-flex align-items-center gap-3 text-danger" @click.prevent="logout">
                <i class="bi bi-box-arrow-right"></i> Đăng xuất
              </a></li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <div style="height: 80px;"></div>
</template>

<script setup lang="ts">
import { ref, inject, computed, type ComputedRef, type Ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const allData = inject<Ref<any[]>>('allData')!
const currentUserComputed = inject<ComputedRef<any>>('currentUser')!

const user = computed(() => currentUserComputed.value)

// State tìm kiếm
const searchQuery = ref('')
const showResults = ref(false)
const filteredPosts = ref<any[]>([])

// Lấy danh sách bài viết + tên tác giả
const posts = computed(() => {
  const data = allData.value || []
  return data
    .filter((p: any) => p.type === 'post')
    .map((p: any) => {
      const author = data.find((u: any) => u.type === 'user' && u.__backendId === p.authorId)
      return {
        ...p,
        authorName: author?.username || 'Ẩn danh'
      }
    })
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
})

// Tìm kiếm với debounce
const debouncedSearch = debounce(() => {
  if (!searchQuery.value.trim()) {
    filteredPosts.value = []
    return
  }
  const q = searchQuery.value.toLowerCase()
  filteredPosts.value = posts.value.filter(p =>
    p.title?.toLowerCase().includes(q) ||
    p.content?.toLowerCase().includes(q)
  )
}, 300)

function hideResults() {
  setTimeout(() => showResults.value = false, 200)
}

function goToPost(post: any) {
  router.push(`/post/${post.__backendId}`)
  searchQuery.value = ''
  showResults.value = false
}

function logout() {
  emit('logout')
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' })
}

const emit = defineEmits<{
  logout: []
}>()

// Debounce function
function debounce<T extends (...args: any[]) => any>(fn: T, delay: number) {
  let timeout: any
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), delay)
  }
}
</script>

<style scoped>
.hover-primary:hover { background: #e7f3ff !important; color: #667eea !important; }
.hover-success:hover { background: #d4edda !important; color: #28a745 !important; }
.hover-info:hover { background: #d1ecf1 !important; color: #17a2b8 !important; }
.hover-bg-light:hover { background: #f8f9fa !important; }
.cursor-pointer { cursor: pointer; }
.form-control:focus {
  background-color: #fff !important;
  box-shadow: 0 0 0 3px rgba(24, 119, 242, 0.15) !important;
  outline: none;
}
</style>