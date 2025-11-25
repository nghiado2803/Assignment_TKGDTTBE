<template>
  <div class="min-vh-100 bg-light">
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-lg-9 col-xl-8">

          <!-- CARD PROFILE SIÊU ĐẸP -->
          <div class="card border-0 shadow-lg overflow-hidden rounded-4">

            <!-- COVER + AVATAR -->
            <div class="position-relative bg-gradient-primary" style="height: 280px;">
              <div class="position-absolute bottom-0 start-50 translate-middle-x mb-4">
                <!-- AVATAR CÓ THỂ CLICK ĐỂ UPLOAD -->
                <label for="avatar-upload" class="d-block" style="cursor: pointer;">
                  <div class="position-relative">
                    <img 
                      :src="previewAvatar || userInfo.avatar || defaultAvatar"
                      class="rounded-circle border border-5 border-white shadow-lg hover-lift"
                      width="168" height="168"
                      style="object-fit: cover; transition: all 0.3s;"
                      alt="Avatar"
                    />
                    <div class="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle p-3 shadow hover-scale">
                      <i class="bi bi-camera-fill fs-4"></i>
                    </div>
                  </div>
                </label>
                <input 
                  id="avatar-upload" 
                  type="file" 
                  accept="image/*" 
                  class="d-none" 
                  @change="handleAvatarChange"
                />
              </div>
            </div>

            <!-- THÔNG TIN CƠ BẢN -->
            <div class="text-center pt-5 pb-4 px-4">
              <h2 class="fw-bold mb-1">{{ userInfo.username || 'Người dùng' }}</h2>
              <p class="text-muted fs-5">{{ userInfo.email || 'Chưa có email' }}</p>
              <p class="text-muted small">
                <i class="bi bi-calendar3 me-1"></i>
                Tham gia ngày {{ formatJoinDate(userInfo.createdAt) }}
              </p>
            </div>

            <div class="card-body p-5 pt-0">

              <!-- FORM CHỈNH SỬA -->
              <h4 class="fw-bold mb-4 d-flex align-items-center gap-2">
                <i class="bi bi-person-gear text-primary"></i>
                Chỉnh sửa thông tin cá nhân
              </h4>

              <form @submit.prevent="handleSubmit" class="bg-white rounded-4 p-4 shadow-sm border">
                <div class="row g-4">
                  <div class="col-md-6">
                    <label class="form-label fw-bold">Tên người dùng</label>
                    <input v-model="form.username" type="text" class="form-control form-control-lg" required />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-bold">Email</label>
                    <input v-model="form.email" type="email" class="form-control form-control-lg" required />
                  </div>
                  <div class="col-12">
                    <label class="form-label fw-bold">Mật khẩu mới <small class="text-muted">(để trống nếu không đổi)</small></label>
                    <input v-model="form.password" type="password" class="form-control" />
                  </div>
                  <div class="col-12">
                    <label class="form-label fw-bold">Link ảnh đại diện <small class="text-muted">(hoặc dùng nút tải ảnh ở trên)</small></label>
                    <input v-model="form.avatar" type="url" class="form-control" placeholder="https://example.com/avatar.jpg" />
                  </div>
                </div>

                <div class="d-grid mt-4">
                  <button type="submit" class="btn btn-primary btn-lg rounded-pill fw-bold" :disabled="isLoading">
                    <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                    {{ isLoading ? 'Đang cập nhật...' : 'Cập nhật thông tin' }}
                  </button>
                </div>
              </form>

              <hr class="my-5">

              <!-- DANH SÁCH BÀI VIẾT -->
              <div class="d-flex align-items-center justify-content-between mb-4">
                <h4 class="fw-bold mb-0">
                  <i class="bi bi-journal-text text-success me-2"></i>
                  Bài viết của tôi
                </h4>
                <span class="badge bg-primary fs-5 px-3 py-2 rounded-pill">{{ userPosts.length }}</span>
              </div>

              <div v-if="userPosts.length === 0" class="text-center py-5">
                <i class="bi bi-file-earmark-x display-4 text-muted opacity-50"></i>
                <p class="mt-3 text-muted fs-5">Bạn chưa có bài viết nào</p>
                <router-link to="/create-post" class="btn btn-outline-primary rounded-pill px-4 mt-3">
                  Viết bài đầu tiên
                </router-link>
              </div>

              <div v-else class="row g-3">
                <div v-for="post in userPosts" :key="post.__backendId" class="col-12">
                  <div class="d-flex align-items-center justify-content-between p-4 bg-white rounded-4 shadow-sm hover-shadow border">
                    <div class="flex-grow-1 cursor-pointer" @click="viewPost(post)">
                      <h6 class="fw-bold text-primary mb-1">{{ post.title }}</h6>
                      <small class="text-muted">
                        <i class="bi bi-clock me-1"></i>{{ formatDate(post.createdAt) }}
                      </small>
                    </div>
                    <div class="d-flex gap-2">
                      <button @click.stop="editPost(post)" class="btn btn-warning btn-sm rounded-pill px-3">
                        <i class="bi bi-pencil"></i> Sửa
                      </button>
                      <button @click.stop="deletePost(post)" class="btn btn-danger btn-sm rounded-pill px-3">
                        <i class="bi bi-trash"></i> Xóa
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
    <p class="text-center text-black mt-4 opacity-75 small">
            © 2025 Blog Của Tôi • Made with Đỗ Văn Nghĩa ❤️
          </p>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, computed, onMounted, type Ref } from 'vue'
import { useRouter } from 'vue-router'

const defaultAvatar = 'https://placehold.co/150x150?text=AVT'
const previewAvatar = ref<string>('')  // ← THÊM ĐỂ XEM TRƯỚC ẢNH

const allData = inject<Ref<any[]>>('allData')!
const showToast = inject<(msg: string, type?: 'success' | 'error' | 'warning') => void>('showToast')!
const currentUser = inject<Ref<any>>('currentUser')?.value

const router = useRouter()

const userInfo = ref<any>({})
const form = ref({
  username: '',
  email: '',
  password: '',
  avatar: ''
})
const isLoading = ref(false)

// THÊM HÀM XỬ LÝ ẢNH ĐẠI DIỆN
function handleAvatarChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return

  if (file.size > 5 * 1024 * 1024) {
    showToast('Ảnh quá lớn! Tối đa 5MB', 'error')
    return
  }

  const reader = new FileReader()
  reader.onload = () => {
    previewAvatar.value = reader.result as string
    form.value.avatar = reader.result as string
    showToast('Đã chọn ảnh mới! Nhấn Cập nhật để lưu', 'success')
  }
  reader.readAsDataURL(file)
}

const userPosts = computed(() => {
  if (!currentUser?.__backendId) return []
  return allData.value
    .filter((item: any) => item.type === 'post' && item.authorId === currentUser.__backendId)
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
})

onMounted(() => {
  if (!currentUser) {
    showToast('Vui lòng đăng nhập!', 'error')
    router.push('/login')
    return
  }

  userInfo.value = { ...currentUser }
  form.value = {
    username: currentUser.username || '',
    email: currentUser.email || '',
    password: '',
    avatar: currentUser.avatar || ''
  }
  previewAvatar.value = currentUser.avatar || ''
})

function handleSubmit() {
  if (!currentUser) return
  isLoading.value = true

  setTimeout(() => {
    const userIndex = allData.value.findIndex(
      u => u.type === 'user' && u.__backendId === currentUser.__backendId
    )

    if (userIndex !== -1) {
      allData.value[userIndex] = {
        ...allData.value[userIndex],
        username: form.value.username.trim(),
        email: form.value.email.trim(),
        avatar: form.value.avatar || currentUser.avatar,
        ...(form.value.password && { password: form.value.password })
      }

      showToast('Cập nhật thành công!', 'success')
      userInfo.value = { ...allData.value[userIndex] }
      previewAvatar.value = form.value.avatar || defaultAvatar
      form.value.password = ''
    }
    isLoading.value = false
  }, 1000)
}

function viewPost(post: any) { router.push(`/post/${post.__backendId}`) }
function editPost(post: any) { router.push(`/edit-post/${post.__backendId}`) }

function deletePost(post: any) {
  if (!confirm('Xóa bài viết này thật chứ?')) return
  const idx = allData.value.findIndex(item => item.__backendId === post.__backendId)
  if (idx !== -1) {
    allData.value.splice(idx, 1)
    showToast('Đã xóa bài viết!', 'warning')
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

function formatJoinDate(dateString: string | undefined) {
  if (!dateString) return 'Chưa rõ'
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric', month: 'long', day: 'numeric'
  })
}
</script>

<style scoped>
.bg-gradient-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.hover-lift {
  transition: all 0.3s ease;
}
.hover-lift:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.2) !important;
}
.hover-scale {
  transition: transform 0.2s;
}
.hover-scale:hover {
  transform: scale(1.15);
}
.hover-shadow {
  transition: all 0.3s;
}
.hover-shadow:hover {
  background-color: #f8f9fa !important;
  box-shadow: 0 8px 25px rgba(0,0,0,0.1) !important;
}
.cursor-pointer { cursor: pointer; }
</style>